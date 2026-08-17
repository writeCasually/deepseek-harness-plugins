# 插件安全审查策略（Discover Workflow）

本文档说明 `.github/workflows/discover-plugins.yml` 每日任务中
[`scripts/discover-plugins.mjs`](../scripts/discover-plugins.mjs) 与
[`scripts/security-review.mjs`](../scripts/security-review.mjs) 的安全审查设计：
从「正则布尔扫描」升级为「分层、证据化、可追溯」的静态审查管线。

## 目标

GitHub 上带 `dsh-plugin` 话题的仓库可以来自任何人。自动收录前需要回答的问题是：

1. 它是不是真的 DSH 插件（兼容性判定，见 discover-plugins.mjs）；
2. 它的代码有没有明显的恶意/危险行为（本策略的主体；
3. 它的供应链依赖有没有已知漏洞；
4. 审查结论是否可追溯到具体文件与行，能否在下一轮以较低成本复查。

## 分层架构

| 层 | 能力 | 输出 | 实现 |
| --- | --- | --- | --- |
| T1 | 确定性危险行为规则 | critical/warning finding，含文件/行/片段 | `scanSecurity()`：远程执行（curl\|sh、PowerShell -enc、Invoke-Expression）、crash 级 shell 执行（child_process exec/spawn shell、shell=True）、解码后执行（Base64→eval）、远程动态 import、破坏性命令（rm -rf 根/主目录）、fork bomb、挖矿特征、外发端点（webhook.site/discord webhook/telegram bot/ngrok…）、WebSocket 外联（白名单外）、键盘/屏幕采集 |
| T1b | 仓库文件清单零成本信号 | warning finding | `scanPaths()`：git tree 路径级检查（不消耗 content API）——双重扩展名伪装文件（`logo.png.exe` 等），单一扩展名的安装器/脚本不命中 |
| T2 | 硬编码密钥扫描 | critical finding | `scanSecrets()`：AWS AKIA、GitHub token、私钥块、`sk-*` AI 密钥、Slack token；带占位符上下文（example/your_key/xxx）降噪 |
| T3 | 混淆度量 | warning finding | `scanObfuscation()`：长 Base64 块、八进制/十六进制/Unicode 转义串、`String.fromCharCode` |
| T4 | 包生命周期与供应链 | warning/critical | `analyzePackageManifest()`：`preinstall/install/postinstall/…` 脚本中的远程执行/破坏性命令/动态执行；依赖名仿冒（typosquat，与知名包编辑距离 ≤2）；`analyzeDependencies()`：OSV API 批量查询直接依赖的已知漏洞（失败容忍） |
| T5 | 同文件隐私关联 | critical/warning | `privacyFindings()`：凭据类环境变量 + 网络发送 → critical；浏览器 Cookie/存储 + 网络发送 → critical；本地凭据文件读取 → critical；仅读环境变量 / 访问第三方地址 → warning（附主机名） |
| T6 | 可选 LLM 深度复核 | critical/warning 追加 | `llmReview()`：配置 `LLM_API_KEY` 后，把确定性结论 + 代码样本交给模型做第二轮语义审查；**只升不降**，失败即跳过 |
| T7 | 信任信号（信息性） | 仅入日志 | `trustNotesFor()`：仓库创建不足 30 天、未声明许可证（不参与裁决） |
| T8 | 审查留痕与增量复查 | 日志/条目字段 | 每次记录 `reviewed_commit`、扫描文件数/总文件数、delta 模式标记；`FORCE_REREVIEW=1` 时通过 GitHub compare API 只重扫变更文件 |

> **内容扫描范围（重要）**：`scanSecurity()` / `scanSecrets()` / `scanObfuscation()` / `privacyFindings()` 只针对「agent 会运行的可执行代码文件」。DSH 插件是 Node.js 项目，经 `import()` 实际运行的只有 JS/TS 生态：`.js`/`.mjs`/`.cjs`（及编译前的源码 `.ts`/`.tsx`/`.jsx`），以及 `Dockerfile`/`Makefile` 与 `install`/`prepare` 等 Node 安装脚本。README（`.md`）、配置文件（`.json/.yml/.yaml/.toml/.ini`）、文档、锁文件，以及非 Node 脚本（`.py/.sh/.bash/.zsh/.ps1`）**均不会** 进入内容扫描，风险定位（`risk_evidence` 的 `file` 字段）因此不会指向这些文件。`package.json` 的依赖与生命周期脚本由 `analyzePackageManifest()` 单独分析（其风险位置记为 `package.json`，属可运行安装脚本范围）。

## 判定与裁决：两级模型

> DSH 插件是在 agent 运行时上下文里被加载的第三方代码，权限比普通软件更大。因此本平台采用「分级呈现」而非一刀切：
> 先把「确定恶意」与「灰区高风险」区分开——前者仍拦截不收录，后者**收录但醒目标注风险，把「是否使用」的决定权交还给使用者**。

**确定恶意（`isDefiniteMalice()` 命中即 `blocked`，不收录）：**
`remote-exec` / `encoded-command` / `invoke-expression` / `decode-exec` / `remote-code-import` / `remote-code-fetch-eval` / `shell-exec` / `spawn-shell` / `shell-flag` / `destructive` / `fork-bomb` / `crypto-mining` / `exfil-endpoint` / `websocket-exfil` / `lifecycle-*-remote-exec` / `lifecycle-*-destructive`。隐私层面：直接读取本地凭据文件（.ssh/.aws/.npmrc）、窃取浏览器 Cookie/存储。

**灰区高风险（critical 但非确定恶意 → 收录，`risk_level=high`）：**
读取凭据类环境变量并外发、动态执行（`eval-exec`/`os-exec`）、外呼非白名单、屏幕采集、硬编码密钥等。此类收录但醒目标注，供使用者自行判断。

**判定顺序：**
- 任一**确定恶意** critical → `blocked`：立即移出公开列表，不写入 `plugins.json`；其证据记入 `review-log`。
- 其他 **critical（灰区高风险）** → `flagged` 收录，条目 `risk_level=high` + `risk_notes` + `risk_evidence`（含「请自行审计」提示）。
- 任一 **warning** → `flagged` 收录，`risk_level=moderate`。
- 全部干净 → `approved`，`risk_level=low`。
- `composeVerdict()` / `classifyRiskLevel()` 统一汇总；workflow 的 `worst_verdict` 门禁消费裁决结果。

> **风险位置（`risk_evidence`）**：`docs/plugins.json` 每条插件的 `risk_evidence` 为结构化数组 `[{explanation, file, line?}]`，记录每个风险点的代码位置，前端/README 据此内联「文件:行号」并链到 GitHub 相应行列，便于使用者快速定位审计。位置降级规则：有真实行号（line>0）记 `文件:行`；否则只记文件路径；连文件也拿不到的（如 OSV 依赖漏洞）只保留说明文本。高风险（`risk_level=high`）插件会一并纳入 warning 级的位置。（`risk_notes` 为含定位的易读文本，`risk_evidence` 为结构化数据。）

> **行为变更说明**：
> - **schema v3 → v4**：此前所有 critical（含灰区）一律 `blocked` 不收录；现仅「确定恶意」阻断，「灰区高风险」改用 `risk_level=high` + `risk_notes` 收录展示，并新增 `risk_evidence` 记录风险代码位置（`docs/plugins.json` 新增 `risk_level`/`risk_notes`/`risk_evidence` 字段）。
> - `blocked`（确定恶意）仍不阻止本批其它安全数据的自动合并：被阻断插件已移出公开列表，不会通过合并进入 `plugins.json`，人工复核在 review-log 层完成。

## 审查留痕

每次审查在 `data/review-log.json` 的 decision 中记录：

- `evidence`：规则 id / 严重级 / 文件 / 行号 / 命中片段（前 40 条）；
- `reviewed_commit`：本次审查对应的 HEAD commit，条目同样写入 `docs/plugins.json`；
- `scanned_files` / `total_files`：覆盖率信息；
- `review_mode`：`full`（全量采样）或 `delta`（增量复查）；
- `trust_notes`、`osv`、`llm_review`：信任信号与外部检查状态。

`data/run-summary.json` 额外汇总 `blocked_reasons` 与扫描统计，供 workflow PR 描述参考。

## 本地运行与配置

```bash
# 单元测试（无需网络）
node scripts/security-review.test.mjs

# 干跑：只审前 3 个新仓库，不落盘
DRY_RUN=1 LIMIT=3 node scripts/discover-plugins.mjs

# 强制对已审仓库做增量复查（只拉取变更文件）
FORCE_REREVIEW=1 LIMIT=5 node scripts/discover-plugins.mjs

# 调大代码文件采样预算（默认 28）
SCAN_FILE_BUDGET=40 node scripts/discover-plugins.mjs

# 关闭 OSV 供应链检查
OSV_CHECK=0 node scripts/discover-plugins.mjs

# 启用 LLM 深度复核（OpenAI 兼容 chat/completions）
LLM_API_KEY=sk-... LLM_MODEL=deepseek-chat node scripts/discover-plugins.mjs
```

| 环境变量 | 默认 | 说明 |
| --- | --- | --- |
| `SCAN_FILE_BUDGET` | `28` | 每个仓库最多拉取审查的代码文件数（控制 API 用量） |
| `OSV_CHECK` | `1` | 是否查询 OSV 已知漏洞 |
| `LLM_API_KEY` / `LLM_API_URL` / `LLM_MODEL` | 空 / DeepSeek / `deepseek-chat` | 可选 LLM 复核 |
| `FORCE_REREVIEW` | 空 | 对已审仓库重新审查（delta 优先） |
| `DRY_RUN` | 空 | 不写盘、只打印 |
| `LIMIT` / `MAX_REPOS` | `40` | 本轮最多处理的新仓库数 |

## 已知局限与后续方向

静态审查无法完全替代行为验证，以下为可继续「变智能」的路线（按性价比排序）：

1. **真实沙箱执行**：在隔离容器（Firecracker / gVisor / bubblewrap）中真实运行 `npm install` 与
   生命周期脚本，捕获 DNS/网络外联、文件写权限等动态信号（动态分析是静态规则的天然互补）。
   注意：JS 进程内沙箱（vm2、happy-dom 等）屡次被证明可逃逸（如
   [CVE-2025-61927](https://www.endorlabs.com/learn/happier-doms-the-perils-of-running-untrusted-javascript-code-outside-of-a-web-browser)、
   [vm2 逃逸](https://thehackernews.com/2026/01/critical-vm2-nodejs-flaw-allows-sandbox.html)），
   必须用操作系统级隔离，而不是脚本解释器沙箱。
2. **语义恶意软件检测**：把确定性规则对齐 [GENIE：Guarding the npm Ecosystem with Semantic
   Malware Detection](https://www.plai.ifi.lmu.de/publications/secdev24-genie.pdf)（IEEE SecDev
   2024）与 [Semgrep Supply Chain](https://docs.semgrep.dev/semgrep-supply-chain/overview) 的思路，
   在 AST/语义层识别「假装正常但运行时窃密」的代码，而不是停留在字符串匹配。
3. **深度供应链**：解析锁文件（pnpm-lock.yaml 等）做全量依赖图 +
   [OSV-Scanner](https://google.github.io/osv-scanner/usage/scan-source) 源码/锁文件扫描，
   目前只查直接依赖的精确版本。
4. **密钥扫描工程化**：接入 [gitleaks](https://github.com/gitleaks/gitleaks)（SARIF 输出、GitHub
   Action 直接集成）作全仓库基线，替代目前的轻量正则近似。
5. **发布物核验**：对比 dist 产物与源码（Sourcemap 还原 / 最小化产物差异分析），识别
   「源码干净但发布包投毒」的供应链攻击形态。
6. **漏洞闭环**：对被标记依赖的版本变化做 diff 复查，自动解除已修复的告警。

## 威胁态势与调研依据（2025–2026）

本策略的信号选择有 2025–2026 年真实攻击事件的支撑：

- **安装脚本是主要投毒点**：npm 官方已通过
  [RFC #868](https://github.com/npm/rfcs/pull/868) 把安装脚本改为 opt-in，npm v12 默认不再执行
  依赖安装脚本。近期攻击均利用安装期执行：
  [Masta 供应链事件（postinstall 载荷，Sapphire Sleet）](https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/)、
  [Red Hat npm 命名空间 Miasma 凭据窃取](https://www.microsoft.com/en-us/security/blog/2026/06/02/preinstall-persistence-inside-red-hat-npm-miasma-credential-stealing-campaign/)、
  [Vidar 窃密木马化 npm 包](https://securitylabs.datadoghq.com/articles/mut-4831-trojanized-npm-packages-vidar/)、
  [Unit42 npm 威胁态势综述](https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/)
  （`@bitwarden/cli` 仿冒包、ChainDrop 蠕虫感染 400+ 包）。→ 对应本策略的
  `lifecycle-*` 规则与 `remote-exec`/`exfil-endpoint`/`secret-*`。
- **仿冒包名（typosquat）是活跃手法**：
  [微软披露仿冒 npm 包窃取云/CI-CD 密钥的战役](https://www.microsoft.com/en-us/security/blog/2026/05/28/typosquatted-npm-packages-used-steal-cloud-ci-cd-secrets/)
  ；学术基准见 ICSE 2022 [Practical Automated Detection of Malicious npm Packages](https://dl.acm.org/doi/10.1145/3510003.3510104)
  （论文的检测特征：名称编辑距离、混淆度量、安装脚本、动态执行——与本策略的 T1/T3/T4 对应）。
  → 对应本策略的 `typosquat` 编辑距离启发式。
- **恶意包数量持续暴涨**：[Sonatype 2026 供应链报告](https://www.sonatype.com/state-of-the-software-supply-chain/2026/open-source-malware)
  披露 2025 年新增 45.4 万+ 恶意包；
  [ReversingLabs 2026 报告](https://www.globenewswire.com/news-release/2026/01/27/3226752/0/en/ReversingLabs-2026-Software-Supply-Chain-Security-Report-Identifies-73-Increase-in-Malicious-Open-Source-Packages.html)
  显示恶意开源包同比 +73%。→ 自动每日审查的投入是必要的。
- **LLM 用于代码安全审查已被验证可行但非万能**：
  [LLM for advanced static code analysis（Journal of Systems and Software 2025）](https://www.sciencedirect.com/science/article/pii/S0950584926002028)、
  [SecureQwen（Computers & Security 2025）](https://www.sciencedirect.com/journal/computers-and-security)
  等证明 LLM 能补全规则引擎盲区（如语义相似攻击、上下文敏感决策）；
  实践社区建议「确定性 SAST 保底 + LLM 诠释/复核」的组合。
  → 对应本策略的 T6（LLM 只升不降的复核层）。

## 参考工具与数据源

- [OSV API](https://google.github.io/osv.dev/) / [OSV-Scanner](https://google.github.io/osv-scanner/)：
  开源漏洞数据库与锁文件扫描
- [Semgrep Supply Chain](https://docs.semgrep.dev/semgrep-supply-chain/overview)：依赖恶意性检测
- [GitHub CodeQL](https://codeql.github.com/)：数据流/污点分析
- [gitleaks](https://github.com/gitleaks/gitleaks)：密钥泄露扫描
- [Socket.dev](https://socket.dev/)：npm 供应链风险评分与恶意包监控
- [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit) 与
  [npm 安全事件](https://www.microsoft.com/en-us/security/blog/)：npm 官方漏洞审计与威胁情报
- [GENIE（IEEE SecDev 2024）](https://www.plai.ifi.lmu.de/publications/secdev24-genie.pdf)：
  npm 生态语义恶意软件检测
- [bandit](https://github.com/PyCQA/bandit) / [shellcheck](https://www.shellcheck.net/)：
  Python / Shell 静态安全审查