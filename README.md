# DeepSeek Harness 插件汇总

[中文](README.md) | [English](README.en.md)

一个用于收集、展示和安全审查 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
（简称 DSH）社区插件的汇总项目。插件列表同时以网页和本 README 两种形式呈现，并每天自动检索
GitHub 上带 `dsh-plugin` 话题的仓库，经过代码安全审查后补充到汇总中。

汇总页面（GitHub Pages）：

[https://writeCasually.github.io/deepseek-harness-plugins/](https://writeCasually.github.io/deepseek-harness-plugins/)

## 项目简介

DeepSeek Harness 以“一切都是插件”为核心设计，社区围绕它产出了大量插件、皮肤、发行版与精选列表。
本项目把这些分散在 GitHub 上的项目汇总到一处，方便开发者按名称、功能与用法快速查找。

主要能力：

- 网页汇总页：支持搜索、按分类与官方标记筛选，展示每个插件的名称、功能简介、用法与项目链接。
- 单一数据源：`docs/plugins.json` 同时驱动网页与 README 插件列表。
- 多语言简介：插件仓库存在 `README.zh*.md` / `README.en*.md` 等简洁文档时，网页会按当前语言展示对应简介，中文优先、英文兜底。
- DSH 适用性判断：先确认插件是否真正能在 DeepSeek Harness 运行，无法确认的不予收录。
- 分层安全与隐私审查：对非官方插件做证据化静态扫描（危险命令 / 代码执行 / 密钥泄露 / 混淆检测）
  与供应链漏洞检查（OSV），可选 LLM 深度复核；审查留痕（commit、证据、覆盖率），详见
  [docs/security-review.md](docs/security-review.md)。
- 官方优先：DeepSeek AI 官方插件排在最前。
- 人工复核入口：自动检索结果以 Pull Request 形式提交，合并后即可发布到汇总页。

## 插件列表

<!-- PLUGINS_START -->

| 插件名称 | 功能简介 | 用法 |
| --- | --- | --- |
| ⚠️ 高风险 [OpenViking](https://github.com/volcengine/OpenViking) | 👋 加入我们的社区（风险：读取凭据类环境变量并发送到网络，可能泄露密钥 [bot/bridge/src/index.ts]；监听键盘输入事件 [web-studio/src/routes/sessions/index.tsx:46]；依赖 @whiskeysockets/baileys@7.0.0-rc.9 存在已知漏洞（GHSA-qvv5-jq5g-4cgg） [<dependencies>]；依赖 ws@8.17.1 存在已知漏洞（GHSA-58qx-3vcg-4xpx, GHSA-96hv-2xvq-fx4p） [<dependencies>]；访问第三方网络地址（如 arxiv.org、blog.openviking.ai、byteplus.com、docs.google.com） [README.md]；读取环境变量（可能包含敏感信息） [examples/pi-coding-agent-extension/index.ts]；访问第三方网络地址（如 example.com） [sdk/typescript/tests/node-consumer/index.ts]） | `dsh plugin --profile web add github:volcengine/OpenViking` |
| ● 中等 [voyager](https://github.com/Nagi-ovo/voyager) | 我们热爱 AI 聊天助手，但有时候总觉得它们少了一点"秩序感"。（风险：访问第三方网络地址；读取环境变量并访问第三方地址，需确认未外发敏感信息；存在 Base64 解码行为） | `dsh plugin --profile web add github:Nagi-ovo/voyager` |
| [dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) | 实验性 DeepSeek Harness agent preset 集合——一个基础模式加两个变体：首轮模型请求锚定在 Minimal 条件上（真实的 Minimal 工具 schema、不注入自动上下文），会话产生持久信号后晋升到 小型 resident 目录，重型 Standard 工具按需解锁。 | `dsh plugin --profile web add github:xiaobright/dsh-anchored-standard` |
| ● 中等 [BitFun](https://github.com/GCWing/BitFun) | 能写代码、能做文档、能操控桌面，并提供小应用、Rust Runtime 和可自部署的多设备互控服务器。（风险：package.json 的 postinstall 脚本会在安装/发布时自动执行 [package.json]；依赖 pnpm@10.32.1 存在已知漏洞（GHSA-3qhv-2rgh-x77r, GHSA-4gxm-v5v7-fqc4, GHSA-54hh-g5mx-jqcp） [<dependencies>]；依赖 simple-git@3.27.0 存在已知漏洞（GHSA-hffm-xvc3-vprc, GHSA-jcxm-m3jx-f287, GHSA-r275-fr43-pm7q） [<dependencies>]；访问第三方网络地址（如 labs.scale.com、market.openbitfun.com、openbitfun.com、pnpm.io） [README.md]） | `dsh plugin --profile web add github:GCWing/BitFun` |
| ● 中等 [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | >一个美观且实用的 Claude Code 风格 TUI 插件：像素鲸鱼顶栏、双流光大字、实时工作状态行、思考流式展开、双击 Esc 时间回溯、蓝白上下文进度条 + TPS 仪表。（风险：package.json 的 prepare 脚本会在安装/发布时自动执行 [package.json]；依赖 @deepseek-ai/cordis 与知名包 ioredis 名称高度相似（编辑距离 2），存在仿冒风险 [package.json]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:250]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:254]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:260]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:266]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:275]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:287]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:290]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:299]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:311]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:326]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:337]；存在疑似混淆内容（长 Base64 块） [pnpm-lock.yaml:345]；依赖 lodash-es@4.17.0 存在已知漏洞（GHSA-29mw-wpgm-hmr9, GHSA-35jh-r3h4-6jhm, GHSA-f23m-r3pf-42rh） [<dependencies>]；依赖 semver@7.0.0 存在已知漏洞（GHSA-c2qf-rxjj-qqgw） [<dependencies>]；访问第三方网络地址（如 star-history.com） [README.md]；读取环境变量（可能包含敏感信息） [src/screens/Chat.tsx]） | `dsh plugin --profile web add github:ccch1mneyyy/dsh-TUI` |
| ● 中等 [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | DeepSeek Harness Web GUI 的鲸鱼娘主题皮肤系列(独立分发仓库)。（风险：依赖 @deepseek-ai/cordis 与知名包 ioredis 名称高度相似（编辑距离 2），存在仿冒风险 [package.json]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/art.ts:6]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/art.ts:8]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/art.ts:12]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/art.ts:15]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/art.ts:22]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/art.ts:25]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/art.ts:28]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/chrome-art.generated.ts:5]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/chrome-art.generated.ts:6]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/chrome-art.generated.ts:7]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/chrome-art.generated.ts:8]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/chrome-art.generated.ts:9]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/workspace-art.generated.ts:5]；存在疑似混淆内容（长 Base64 块） [maid-atelier/src/client/workspace-art.generated.ts:6]；访问第三方网络地址（如 b23.tv、pixiv.net） [README.md]；访问第三方网络地址（如 w3.org） [maid-atelier/src/client/titlebar-brand.ts]；读取环境变量（可能包含敏感信息） [maid-atelier/build/tsdown.client.ts]；访问第三方网络地址（如 pixiv.net） [maid-atelier/NOTICE]） | `dsh plugin --profile web add github:Small-tailqwq/dsh-deep-whale` |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | 前部索引仓库（Radar）：自动扫描发现所有 dsh 插件候选，经测试合格的移入后序精选目录仓库。 | `打开网页查看自动扫描 Radar 与精选目录` |
| ● 中等 [working-activity](https://github.com/ccch1mneyyy/working-activity) | 为 DeepSeek Harness 打造的一条实时 "工作状态行"：模型的实时活动——俏皮思考文案、真正在跑的工具、已耗时、收尾摘要——在 agent 干活时展示出来。（风险：依赖 @deepseek-ai/cordis 与知名包 ioredis 名称高度相似（编辑距离 2），存在仿冒风险 [package.json#1]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:65]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:91]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:107]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:127]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:134]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:150]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:167]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:189]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:205]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:230]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:247]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/package-lock.json:275]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:72]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:78]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:87]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:99]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:102]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:111]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:122]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:136]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:151]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:162]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:170]；存在疑似混淆内容（长 Base64 块） [packages/activity/working-activity/pnpm-lock.yaml:190]；访问第三方网络地址（如 opencollective.com） [packages/activity/working-activity/package-lock.json]） | `dsh plugin --profile web add github:ccch1mneyyy/working-activity` |
| [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | DeepSeek Harness 生态精选：来自 dsh-external/hub 与公开 dsh-plugin 话题的插件、工具与基础设施。 | `打开网页浏览生态精选，或 git clone 到本地阅读` |
| ● 中等 [graph-memory](https://github.com/adoresever/graph-memory) | 为 AI Agent 提供可检索、可追溯、跨会话的长期记忆 一个宿主无关的图记忆内核，原生接入 DeepSeek Harness，并继续兼容 OpenClaw。（风险：访问第三方网络地址；使用动态代码或子进程执行） | `dsh plugin --profile web add github:adoresever/graph-memory` |
| [DSH Vision Toolkit](https://github.com/Anionex/dsh-vision-toolkit) | 把 agent-vision-toolkit 以原生 Profile Bundle 引入 DSH：带意图的图片问答、长截图 OCR、UI 还原、像素校验等视觉工具。 | `dsh plugin add github:Anionex/dsh-vision-toolkit` |
| ● 中等 [dsh-market](https://github.com/dsh-market/dsh-market) | 装在 DeepSeek Harness 里的插件市场。打开设置 → 插件市场 → 逛一逛，点一下，装好。（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络；使用动态代码或子进程执行；存在疑似混淆内容） | `dsh plugin --profile web add github:dsh-market/dsh-market` |
| ● 中等 [mnemon](https://github.com/mnemon-dev/mnemon) | LLM-supervised persistent memory for AI agents — graph-based recall, cross-session knowledge, single binary. Works with Claude Code, OpenClaw, and any CLI agent.（风险：访问第三方网络地址；读取环境变量并访问第三方地址，需确认未外发敏感信息） | `dsh plugin --profile web add github:mnemon-dev/mnemon` |
| ● 中等 [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | 是兄弟就来蹬我！DSH Web UI 广告：2005 年中文站点风格的侧栏广告 / 对话内信息流 / 角落弹窗 + 一个真实热区比视觉小得多的关闭叉。素材全虚构，域名打码。（风险：读取凭据类环境变量并发送到网络，可能泄露密钥；访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:Nagi-ovo/dsh-ads` |
| ● 中等 [superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | The design skill for Claude Code, Cursor and any coding agent. Stop shipping AI-slop UI: turn it into shippable, tasteful frontend. Install: npx skills add superdesigndev/superdesign-skill. Powered by superdesign.dev（风险：访问第三方网络地址；使用动态代码或子进程执行） | `dsh plugin --profile web add github:superdesigndev/superdesign-skill` |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | AgentTeams 多智能体团队插件：一句话驱动团队协作完成目标，并在 Web GUI 右上角实时查看团队活动面板。 | `npx -p @deepseek-ai/dsh dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` |
| ● 中等 [de-anthropocentric-research-engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine) | 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction.（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；存在疑似混淆内容） | `dsh plugin --profile web add github:yogsoth-ai/de-anthropocentric-research-engine` |
| ● 中等 [dsh-vision-router](https://github.com/ysr666/dsh-vision-router) | 大多数 DSH 视觉插件把图片“翻译”成一段文字描述再喂给 DeepSeek——有损、一次性、看不见像素。本插件把原图像素留在视觉模型侧、把推理留在 DeepSeek 侧，并把“看图”变成一次普通的工具调用：（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；使用动态代码或子进程执行；存在疑似混淆内容） | `dsh plugin --profile web add github:ysr666/dsh-vision-router` |
| ● 中等 [dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | DeepSeek Harness (dsh) 从 0 到 1 深度手册：安装/插件开发/性能调优/实测案例/同模型多 Agent 实测对比（中文 + 英文 PDF）（风险：访问第三方网络地址；使用动态代码或子进程执行） | `dsh plugin --profile web add github:Electricitysheep/dsh-handbook` |
| [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) | Codex 风格 @file 提及：在输入框搜索工作区文件，回车附加，发送时把文件内容注入模型。 | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-at-file/archive/refs/heads/main.tar.gz` |
| ● 中等 [opc-nexus](https://github.com/h4dex/opc-nexus) | OPC-Nexus（One Person Company Nexus）是一款本地优先的桌面 AI Agent 管理器。它为单人公司 / 独立开发者提供统一的 AI 数字员工管理平台 —— 从 Agent 创建、任务编排、多引擎接入，到消息渠道集成、工作流自动化和专家团协作，一站式覆盖。（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）） | `dsh plugin --profile web add github:h4dex/opc-nexus` |
| [Oh-DSH](https://github.com/hust-open-atom-club/oh-dsh) | 一站式 DeepSeek Harness 社区发行版：桌面端、Web UI 与 TUI 三种形态统一体验，分层安装。 | `按 README 的桌面/Web/TUI 安装脚本一键安装发行版` |
| ● 中等 [dsh-work](https://github.com/vibeinging/dsh-work) | 一个本地的 AI 工作台 Profile Bundle：在官方 DSH Web Profile 之上扩展，把 Agent 会话、项目文件、数据分析、Web 研究、MCP 与 Office 产物整合进一个 Electron 桌面应用。（风险：读取浏览器 Cookie/存储并发送到网络；访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；读取环境变量（可能包含敏感信息）；使用动态代码或子进程执行；存在 Base64 解码行为；存在疑似混淆内容） | `dsh plugin --profile web add github:vibeinging/dsh-work` |
| ● 中等 [deepseek-harness-desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app) | 本地 AI 桌面工作台：整合 DSH 会话、项目、文件、Web 研究、插件与 Office 产物。（风险：读取浏览器 Cookie/存储并发送到网络；访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；读取环境变量（可能包含敏感信息）；使用动态代码或子进程执行；存在 Base64 解码行为；存在疑似混淆内容） | `dsh plugin --profile web add github:vibeinging/deepseek-harness-desktop-app` |
| [dsh-browser](https://github.com/Lum1104/dsh-browser) | Chrome 侧边栏扩展与桥接插件，让 DSH 直接操作你正在使用的浏览器，无需视觉能力。 | `运行 scripts/install.sh 安装 Chrome MV3 扩展与插件桥接` |
| ● 中等 [dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) | dsh-tianshu-tui — DeepSeek Harness terminal UI +harness workflow。是官方 DeepSeek Harness 上的交互式终端 UI 插件。渲染核心从本仓库自研的harness agent  Tianshu-Tui 演进而来，在官方的基础上增加了TDD、证据门、视觉图像模块等工作流。（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；使用动态代码或子进程执行；存在 Base64 解码行为） | `dsh plugin --profile web add github:huiliyi37/dsh-tianshu-tui` |
| [whale-girl](https://github.com/vlln/whale-girl) | DSH Web GUI 桌面宠物插件（QQ 宠物形态）：右下角悬浮、可拖拽、投喂与玩耍的积累型伙伴。 | `dsh plugin --profile web add "github:vlln/whale-girl#main"` |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | 用 30 秒找到适合你的 DeepSeek Harness 插件：告诉你插件解决什么问题、适合谁、从哪里开始。 | `打开网页按“解决什么问题”快速选择插件` |
| ● 中等 [engramory](https://github.com/tinqiao-oss/engramory) | 一套有主见、零基础设施的、面向小规模 / 本地 / 文件式智能体记忆的协议 —— 一套强约束的策展纪律 + 一个校验器(tools/engramory_doctor.py),以常驻规则形式加载(CLAUDE.md / AGENTS.md / 宿主的规则文件)。它不是数据库、不是框架、也不是按相关性加载的 skill。记忆就是一个文件夹:一堆小小的、人能直接读的 markdown 文件,加一个每次会话都加载的索引。没有数据库、没有向量、没有服务器——就是你能打开、能读、能改、能 diff（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；读取环境变量并访问第三方地址，需确认未外发敏感信息；使用动态代码或子进程执行） | `dsh plugin --profile web add github:tinqiao-oss/engramory` |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | 对话内生成式 UI 插件：模型把交互式 HTML 卡片直接画进会话流，用于模拟器、图表、对比面板与 UI mockup。 | `dsh plugin --profile web add github:Nagi-ovo/dsh-visualize` |
| ● 中等 [notes](https://github.com/zhaoolee/notes) | 开源版锤子便签，复刻锤科美学，一键Docker私有化部署，支持skill调用，支持dsh plugin，支持多租户，一键生成公众号格式，支持导出便签为图片（风险：访问第三方网络地址；读取环境变量并访问第三方地址，需确认未外发敏感信息；使用动态代码或子进程执行；存在 Base64 解码行为；存在疑似混淆内容） | `dsh plugin --profile web add github:zhaoolee/notes` |
| [dsh-genui](https://github.com/omdsh-dev/dsh-genui) | 在助手回复中渲染交互式 UI 组件：布局、图表、表单、测验、mermaid 等，经 dsh-ui fence 内联展示。 | `dsh plugin --profile web add github:omdsh-dev/dsh-genui` |
| ● 中等 [deepseek-harness-studio](https://github.com/fufankeji/deepseek-harness-studio) | DeepSeek Harness 的 macOS & Windows 桌面端：零代码插件商店，一键安装与启用，视觉增强，自动化插件分发与 AI 推荐。（风险：访问第三方网络地址） | `dsh plugin --profile web add github:fufankeji/deepseek-harness-studio` |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | DeepSeek Harness 的 Windows 轻量启动器：开机自启 + 独立小窗口，双击即用。 | `下载 Releases 的 .msi 或便携 ZIP，双击运行` |
| ● 中等 [DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin) | 一套高自由度的玻璃质感主题，套在 DeepSeek Harness 网页端。顶栏、侧边栏、输入框、统计行、轨迹视图都成了磨砂玻璃片；玻璃模糊度、磨砂度、背景（流体或自定义壁纸）都能在设置卡片里自由调节。（风险：访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:WYH66666666/DSH-Transparent-UI-Plugin` |
| ● 中等 [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | 对 DSH 说一句「有没有插件能……」，它就会从全 GitHub 的 dsh-plugin topic 里找出候选，解释差别，等你选好以后再安装和验证。（风险：读取凭据类环境变量并发送到网络，可能泄露密钥） | `dsh plugin --profile web add github:Nagi-ovo/dsh-find-plugins` |
| ● 中等 [dsh-gitbash-preset](https://github.com/liceses/dsh-gitbash-preset) | DSH 自带的极简模式在 Windows 上无法使用，失败有两层原因：（风险：读取环境变量（可能包含敏感信息）；使用动态代码或子进程执行） | `dsh plugin --profile web add github:liceses/dsh-gitbash-preset` |
| [ModSearch](https://github.com/liustack/modsearch) | 给纯文本模型“接上互联网”的 Web 搜索插件：搜索网页或 X，返回结构化 JSON 证据（搜索、抓取、引用）。 | `dsh plugin add @liustack/modsearch（npm）` |
| [dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) | 纯插件实现的跨会话长期记忆与后台自我进化：五轨记忆、git 分支感知、技能自我进化、四轨待办、会话广播与搜索。 | `dsh plugin add github:csyangwen/dsh-memory-evolve` |
| ● 中等 [dsh-context](https://github.com/bowenliang123/dsh-context) | A DeepSeek Harness plugin for  Context insight dashboard — showing what the model's context window is made of and how it evolves.（风险：访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:bowenliang123/dsh-context` |
| ● 中等 [humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) | Скилл для ИИ-агентов: находит и убирает следы машинной генерации из русского текста. 38 паттернов, 39 regex-маркеров с реестром доказательств, слепые парные прогоны, файловый слой снятия C2PA/EXIF/XMP \| Russian AI-writing humanizer skill with file metadata cleaning（风险：访问第三方网络地址；使用动态代码或子进程执行） | `dsh plugin --profile web add github:Vladimir-Human/humanizer-ru` |
| ● 中等 [dshfind](https://github.com/hikariming/dshfind) | DSH (DeepSeek Harness) 原理学习、插件市场与最佳实践 · Learn DSH principles, plugin marketplace & best practices（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；存在疑似混淆内容；存在 Base64 解码行为） | `dsh plugin --profile web add github:hikariming/dshfind` |
| [DSH OpenPencil](https://github.com/ZSeven-W/dsh-openpencil) | OpenPencil 设计预览与编辑插件：在会话中预览、检查并编辑真实 .op 文档。 | `dsh plugin add @zseven-w/dsh-openpencil（npm）` |
| ● 中等 [Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | DSH桌面端，支持主题和背景图等多种个性化配置。Electron desktop shell for DeepSeek Harness web UI（风险：访问第三方网络地址；读取本地凭据文件（如 .ssh/.aws/.npmrc）；读取环境变量（可能包含敏感信息）；存在疑似混淆内容） | `dsh plugin --profile web add github:ChisaAlter/Deepseek-Harness-Desktop` |
| ● 中等 [Awesome-DeepSeek-Harness-Plugins](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins) | 每日维护的 DeepSeek Harness（DSH）公开插件与扩展精选目录，涵盖工具、技能、模型提供商、记忆、自动化、运行时、桌面客户端、浏览器集成与开发者工具。（风险：访问第三方网络地址） | `dsh plugin --profile web add github:Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins` |
| ● 中等 [odai](https://github.com/orziz/odai) | odai 是面向 AI agent 的治理内核驱动的通用任务执行框架。（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；读取环境变量并访问第三方地址，需确认未外发敏感信息） | `dsh plugin --profile web add github:orziz/odai` |
| ● 中等 [awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) | - 目录 - 快速开始 - 启动 Web UI（风险：访问第三方网络地址） | `dsh plugin --profile web add github:libukai/awesome-deepseek-harness` |
| ● 中等 [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | > 面向 DeepSeek Harness（DSH） 的 插件 / Skill / MCP / Patch（Profile）层 / 编排器 / 聚合器 / UI 精选清单 —— DeepSeek 官方 agent 运行框架，核心理念 Model + Harness = Agent。（风险：访问第三方网络地址） | `dsh plugin --profile web add github:Dominic789654/awesome-deepseek-harness` |
| ● 中等 [dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) | > ## 🎉 v0.3.0 重大声明（2026-08-14） > > 从经验补丁到源码契约——注入器完成规范重构。（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；存在疑似混淆内容；使用动态代码或子进程执行） | `dsh plugin --profile web add github:yjh051108/dsh-super-injector` |
| ● 中等 [dsh-noema](https://github.com/ZSeven-W/dsh-noema) | DSH Noema 将 DeepSeek Harness 与 Noema —— 一个面向编码智能体的本地优先、非向量记忆系统 —— 连接起来，让智能体能够跨会话保留持久知识，而不是每次对话都从零开始。（风险：访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:ZSeven-W/dsh-noema` |
| ● 中等 [tokenbank](https://github.com/wink-run/tokenbank) | > 个人AI中枢 · Token 管家 > > 用的明白 · 用的节省 · 用的简单 · 越用越懂你 · 闲置赚钱（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；使用动态代码或子进程执行） | `dsh plugin --profile web add github:wink-run/tokenbank` |
| ● 中等 [sealos-skills](https://github.com/labring/sealos-skills) | 通过 AI 智能体将项目部署到 Sealos Cloud。（风险：访问第三方网络地址） | `dsh plugin --profile web add github:labring/sealos-skills` |
| ● 中等 [Co-Engram](https://github.com/Co-Engram/Co-Engram) | \| 差异化 \| 含义 \| \| ------------------------ \| ------------------------------------------------------------------------------------------------------------------------------------------------ \| \| 稳定 ID + 单文件布局 \| 每条记忆是一个带 YAML frontmatter 的 Markdown 文件。engram 使用（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；读取环境变量（可能包含敏感信息）；使用动态代码或子进程执行） | `dsh plugin --profile web add github:Co-Engram/Co-Engram` |
| ● 中等 [forkprobe](https://github.com/Jayden-X-L/forkprobe) | 别猜哪个 AI Skill 有用，直接并排看结果。（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；读取环境变量并访问第三方地址，需确认未外发敏感信息；存在疑似混淆内容） | `dsh plugin --profile web add github:Jayden-X-L/forkprobe` |
| ● 中等 [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | > 面向 DeepSeek Harness（DSH）的社区精选、厂商中立 Plugin 索引——覆盖开发工具、数据工作流、媒体、运维与日常生活等场景。（风险：访问第三方网络地址） | `dsh plugin --profile web add github:Alex-Yanggg/awesome-DSH-plugin` |
| ● 中等 [gal-view](https://github.com/Ayase34/gal-view) | 把 DSH 会话界面切换成 Galgame（视觉小说）风格的插件。（风险：使用动态代码或子进程执行；存在疑似混淆内容） | `dsh plugin --profile web add github:Ayase34/gal-view` |
| ● 中等 [ru-marketplace-mcp](https://github.com/Vladimir-Human/ru-marketplace-mcp) | Девять российских маркетплейсов и китайский Taobao как MCP-серверы: Wildberries, Ozon, Яндекс Маркет, Детский мир, Авито, Мегамаркет, Lamoda, DNS, Ситилинк. Плюс сравнение цен по всем сразу. Только чтение, ключи не нужны.（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）） | `dsh plugin --profile web add github:Vladimir-Human/ru-marketplace-mcp` |
| [DSH Turn Rewind](https://github.com/Anionex/dsh-turn-rewind) | 对话与代码状态回退插件：基于持久 Change Ledger，回滚对话和工作区状态。 | `dsh plugin add github:Anionex/dsh-turn-rewind` |
| [DSH Workflow](https://github.com/icetomoyo/dsh_workflow) | 把 DSH 的一次性多 Agent 调度升级为可生成、保存、治理、观察、恢复的 Workflow 层。 | `dsh plugin add github:icetomoyo/dsh_workflow` |
| ● 中等 [dsh-webui-market-plugin](https://github.com/Sanqi-normal/dsh-webui-market-plugin) | 在 dsh web GUI 内部的社区插件市场：浏览 awesome-dsh-plugin.com 的插件目录，直接在 设置 → 插件 → 插件市场 里安装 / 卸载插件到 profile。界面风格与 harness 前端一致（跟随系统深浅色主题），支持中英文（按系统语言自动切换）。（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络；读取凭据类环境变量并发送到网络，可能泄露密钥；使用动态代码或子进程执行） | `dsh plugin --profile web add github:Sanqi-normal/dsh-webui-market-plugin` |
| ● 中等 [dsh_workflow](https://github.com/omdsh-dev/dsh_workflow) | DSH 已经有很强的 Harness 基础设施：模型路由、子 Agent provider、工具权限、审批、Session 日志、后台 jobs 与 UI 事件。但仅有这些“执行原语”，团队仍需在每次会话里重新描述如何拆解、并发、验证和汇总。（风险：访问第三方网络地址；使用动态代码或子进程执行） | `dsh plugin --profile web add github:omdsh-dev/dsh_workflow` |
| ● 中等 [hello-dsh](https://github.com/pingfanfan/hello-dsh) | 从零开始，看懂 DeepSeek Harness 的「万物皆可插件」— 零基础插件开发教程（含 22 个中文技能实例）\| Zero-to-plugin tutorial for DeepSeek Harness（风险：访问第三方网络地址） | `dsh plugin --profile web add github:pingfanfan/hello-dsh` |
| ● 中等 [dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) | DSH Web 选中批注插件：选文字→批注→回车随消息发送；气泡隐藏批注块（零闪烁）；回复按 Annotation N 逐条对照（可悬浮芯片）。官方 bundle，零核心改动（风险：访问第三方网络地址；使用动态代码或子进程执行） | `dsh plugin --profile web add github:omdsh-dev/dsh-annotation` |
| ● 中等 [ProMentor](https://github.com/Lyn-77/ProMentor) | ProMentor 是一个 AI Coding Agent Skill。装上它，你的 AI 编程助手立刻化身为导师——扫描项目架构、生成阶梯式 Chapter、带你手写核心逻辑、自动判题、AI Code Review。（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；读取环境变量并访问第三方地址，需确认未外发敏感信息） | `dsh plugin --profile web add github:Lyn-77/ProMentor` |
| ● 中等 [anysearch-dsh](https://github.com/anysearch-team/anysearch-dsh) | AnySearch web search provider and advanced search tools for DeepSeek Harness (DSH)（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；读取凭据类环境变量并发送到网络，可能泄露密钥；存在疑似混淆内容） | `dsh plugin --profile web add github:anysearch-team/anysearch-dsh` |
| ● 中等 [deepseek-harness-desktop](https://github.com/ningbainb/deepseek-harness-desktop) | DeepSeek Harness 的开源 Windows 桌面客户端与 GUI：零配置安装，集成 Codex、插件、技能、SSH、移动端远程访问，并内置 11 款皮肤。（风险：读取本地凭据文件（如 .ssh/.aws/.npmrc）；访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥） | `dsh plugin --profile web add github:ningbainb/deepseek-harness-desktop` |
| ● 中等 [dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin) | 复制给你的 DSH，一键安装：（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；存在疑似混淆内容；使用动态代码或子进程执行） | `dsh plugin --profile web add github:kingOfSoySauce/dsh-liang-skin` |
| ● 中等 [dsh-toy](https://github.com/c3ll256/dsh-toy) | dsh-toy 是一个 DeepSeek Harness 插件，用于将小玩具接入 DSH。（风险：读取凭据类环境变量并发送到网络，可能泄露密钥；访问第三方网络地址；使用动态代码或子进程执行；存在疑似混淆内容） | `dsh plugin --profile web add github:c3ll256/dsh-toy` |
| ● 中等 [dsh-vision](https://github.com/oil-oil/dsh-vision) | \| 当前主模型 \| 图片处理方式 \| 最终回答者 \| \| --- \| --- \| --- \| \| 支持图片 \| 原图直接发送，不压缩、不预先 OCR \| 当前模型 \|（风险：访问第三方网络地址；读取环境变量并访问第三方地址，需确认未外发敏感信息；存在疑似混淆内容） | `dsh plugin --profile web add github:oil-oil/dsh-vision` |
| ● 中等 [dsh-pet](https://github.com/PC2005-cloud/dsh-pet) | > 一只住在 DeepSeek Harness Web 界面里的桌面宠物：待机呼吸、随机动作、屏幕漫游、点击反应、可拖拽。（风险：访问第三方网络地址；使用动态代码或子进程执行） | `dsh plugin --profile web add github:PC2005-cloud/dsh-pet` |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | DeepSeek Harness 会话完成时发送桌面通知，支持按结果类型和关键词规则控制。 | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-notification/archive/refs/heads/main.tar.gz` |
| ● 中等 [dsh-web-plugin-manager](https://github.com/LX2000WASD/dsh-web-plugin-manager) | 在 Web UI 中一键管理 DeepSeek Harness (DSH) 插件：查看、实时启停、安装/卸载、更新检测、健康检查（依赖/冲突/兼容性分析）、环境管理、插件市场，bundle 与非 bundle 插件全覆盖。（风险：访问第三方网络地址；读取本地凭据文件（如 .ssh/.aws/.npmrc）；读取凭据类环境变量并发送到网络，可能泄露密钥；存在疑似混淆内容；使用动态代码或子进程执行） | `dsh plugin --profile web add github:LX2000WASD/dsh-web-plugin-manager` |
| ● 中等 [dsh-dafeiyu](https://github.com/QCYTSN/dsh-dafeiyu) | 住在 Windows 桌面上、由 DeepSeek Harness 真实工作状态驱动的 Agent 伴侣。（风险：访问第三方网络地址；存在疑似混淆内容；使用动态代码或子进程执行） | `dsh plugin --profile web add github:QCYTSN/dsh-dafeiyu` |
| ● 中等 [plugin-registry](https://github.com/vlln/plugin-registry) | DSH 插件生态基建：薄控制台（浏览器面板管理官方 repository 插件，0 patch）+ make-dsh-plugin skill 官方插件开发引导（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；使用动态代码或子进程执行；存在疑似混淆内容） | `dsh plugin --profile web add github:vlln/plugin-registry` |
| ● 中等 [deepseek-harness-desktop](https://github.com/xiincs/deepseek-harness-desktop) | 把 DeepSeek Harness 装进一个真正的桌面应用（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络；读取环境变量并访问第三方地址，需确认未外发敏感信息；存在疑似混淆内容；存在 Base64 解码行为；使用动态代码或子进程执行） | `dsh plugin --profile web add github:xiincs/deepseek-harness-desktop` |
| ● 中等 [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | oh-my-dsh：面向 DSH (DeepSeek Harness) 的插件生态——700+ 插件，只通过扩展接缝注册，不修改 agent-loop 骨架（风险：访问第三方网络地址） | `dsh plugin --profile web add github:LaplaceYoung/oh-my-dsh` |
| ● 中等 [dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store) | 自动分类、收录和验证 GitHub dsh-plugin Topic 项目的静态 DSH 插件市场。（风险：访问第三方网络地址；读取本地凭据文件（如 .ssh/.aws/.npmrc）；读取环境变量（可能包含敏感信息）；存在疑似混淆内容） | `dsh plugin --profile web add github:ZASENJC/dsh-plugins-store` |
| ● 中等 [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) | DeepSeek Harness (DSH) 插件精选集。（风险：读取浏览器 Cookie/存储并发送到网络；访问第三方网络地址） | `dsh plugin --profile web add github:beancookie/awesome-dsh-plugin` |
| ● 中等 [deepseek-design](https://github.com/Devin-AXIS/deepseek-design) | DeepSeek Design 是由 iPolloWork 推出、专为 DeepSeek Harness 构建的原生可视化设计系统。（风险：访问第三方网络地址；存在 Base64 解码行为） | `dsh plugin --profile web add github:Devin-AXIS/deepseek-design` |
| ● 中等 [dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) | 中文首页现在位于 README.md。（风险：访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:HanaAyane/dsh-reasoning-effort` |
| ● 中等 [local-shell-mcp](https://github.com/fwerkor/local-shell-mcp) | Enables LLM to use a cli environment. （风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；读取环境变量并访问第三方地址，需确认未外发敏感信息；使用动态代码或子进程执行） | `dsh plugin --profile web add github:fwerkor/local-shell-mcp` |
| ● 中等 [dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot) | 基于 deepseek-harness (dsh) 的 QQ Bot IM 插件，将 QQ 消息平台作为 dsh agent 的前端协议驱动。（风险：访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:tencent-connect/dsh-qqbot` |
| ● 中等 [mstar-harness](https://github.com/btspoony/mstar-harness) | Harness Workflow Engine · Agent Plugin（风险：访问第三方网络地址；使用动态代码或子进程执行） | `dsh plugin --profile web add github:btspoony/mstar-harness` |
| ● 中等 [dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) | 为 DeepSeek Harness 网页端提供多供应商账户监测与 Token 用量分析。（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；读取环境变量（可能包含敏感信息）；使用动态代码或子进程执行；存在疑似混淆内容） | `dsh plugin --profile web add github:Ychris12138/dsh-usage-stats` |
| ● 中等 [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) | 完整逐页说明见 Sidebar 与对话交互指南。（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；使用动态代码或子进程执行；存在 Base64 解码行为） | `dsh plugin --profile web add github:omdsh-dev/dsh-mnemon` |
| ● 中等 [dsh-undo-plugin](https://github.com/lire1131/dsh-undo-plugin) | DSH 崩溃救援插件：可回滚配置与插件代码改动、保留敏感信息的安全快照、一键 SAFE MODE，并内置离线 CLI/GUI——即使 DSH 无法启动也能用。（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络） | `dsh plugin --profile web add github:lire1131/dsh-undo-plugin` |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | 从 DSH Web GUI 的侧边栏工作区菜单直接在当前目录打开 VS Code。 | `dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode` |
| ● 中等 [dsh-desktop](https://github.com/bruc3van/dsh-desktop) | 让 Agent 安全地常驻在你的桌面上：官方 Web UI 原封不动，长任务不再被终端和浏览器标签页绑架，精选插件先审查、再安装。（风险：读取本地凭据文件（如 .ssh/.aws/.npmrc）；访问第三方网络地址；读取环境变量并访问第三方地址，需确认未外发敏感信息；读取环境变量（可能包含敏感信息）；存在疑似混淆内容；使用动态代码或子进程执行） | `dsh plugin --profile web add github:bruc3van/dsh-desktop` |
| ● 中等 [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) | DeepSeek Harness 会话费用统计插件(界面中英双语)（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；读取环境变量（可能包含敏感信息）；读取环境变量并访问第三方地址，需确认未外发敏感信息；使用动态代码或子进程执行；存在疑似混淆内容） | `dsh plugin --profile web add github:Han-1413141/dsh-cost-meter` |
| ● 中等 [dsh-automation](https://github.com/titanwings/dsh-automation) | DSH 自动化插件：让 Coding 任务按计划在全新 Agent Session 中运行，并由用户或 Agent 创建和管理定时任务。 / Run coding tasks in fresh Agent sessions and manage schedules from DSH Web or an Agent.（风险：访问第三方网络地址；使用动态代码或子进程执行；存在 Base64 解码行为；存在疑似混淆内容） | `dsh plugin --profile web add github:titanwings/dsh-automation` |
| ● 中等 [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) | 把 13 种外部 Agent 聊天历史全保真导入 DeepSeek Harness 为可继续（resume）会话——并可导出 / 同步回 Claude Code。（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；存在疑似混淆内容；使用动态代码或子进程执行） | `dsh plugin --profile web add github:Nwflower/dsh-chat-import` |
| [dsh-kun-like-pet](https://github.com/liyupi/dsh-kun-like-pet) | > DeepSeek Harness（DSH）桌面宠物插件 —— 一只住在 Web 界面右下角的小坤宠。 | `dsh plugin --profile web add github:liyupi/dsh-kun-like-pet` |
| ● 中等 [dsh-skill-viewer](https://github.com/Fishquito7/dsh-skill-viewer) | DSH 插件，可直接在 web 界面快速管理 skill 状态，同时在终端加入快捷的 skill 管理命令。（风险：存在疑似混淆内容；存在 Base64 解码行为；使用动态代码或子进程执行） | `dsh plugin --profile web add github:Fishquito7/dsh-skill-viewer` |
| ● 中等 [dsh-multica-runtime](https://github.com/multica-ai/dsh-multica-runtime) | Support dsh runtime on Multica.（风险：读取环境变量（可能包含敏感信息）；访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:multica-ai/dsh-multica-runtime` |
| ● 中等 [Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | > 汇聚 DeepSeek Harness 生态插件，构建权威、完整、可持续更新的聚合目录。以官方理念“万物皆可插件”（Everything is a Plugin）为指引，服务全球开发者。（风险：访问第三方网络地址；读取本地凭据文件（如 .ssh/.aws/.npmrc）；读取环境变量（可能包含敏感信息）；使用动态代码或子进程执行） | `dsh plugin --profile web add github:like-study1/Oh-My-DSH` |
| ● 中等 [deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin) | DeepSeek Harness 换肤系统：21 套内置皮肤 + 一张图生成整套配色的自定义皮肤。数据源驱动，保对比度推导，构建期校验可读性。（风险：访问第三方网络地址；使用动态代码或子进程执行） | `dsh plugin --profile web add github:HeiGeAi/deepseek-harness-skin` |
| ● 中等 [superpowers-dsh](https://github.com/LayneChai/superpowers-dsh) | 为 DeepSeek Harness (DSH) 打造的 Superpowers 插件包：把 obra/superpowers 的核心技能 （Claude-Code 技能库：TDD、调试、规划、协作模式）移植到 DSH 的 Cordis（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络；读取凭据类环境变量并发送到网络，可能泄露密钥；使用动态代码或子进程执行） | `dsh plugin --profile web add github:LayneChai/superpowers-dsh` |
| ● 中等 [dsh-suite](https://github.com/whyihaveyou/dsh-suite) | 别再翻 dsh-plugin topic 了，这里都是还能跑的插件。dsh-suite 是 DeepSeek Harness（DSH）插件的活目录——每小时自动刷新、每日兼容实测——外加内置插件商店与 create-dsh-plugin 脚手架。（风险：读取本地凭据文件（如 .ssh/.aws/.npmrc）；读取浏览器 Cookie/存储并发送到网络；访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥） | `dsh plugin --profile web add github:whyihaveyou/dsh-suite` |
| ● 中等 [ui-status-label](https://github.com/alingalingling/ui-status-label) | 把你鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子（风险：访问第三方网络地址） | `dsh plugin --profile web add github:alingalingling/ui-status-label` |
| ● 中等 [dsh-plugin](https://github.com/Tabbit-Browser/dsh-plugin) | 这是一个 Tabbit 浏览器为 Deepseek Harness 提供的一个 plugins。你可以在 Deepseek Harness 中安装这个插件，给 Deepseek Harness 提供控制 Tabbit 浏览器的能力。（风险：读取环境变量并访问第三方地址，需确认未外发敏感信息；访问第三方网络地址） | `dsh plugin --profile web add github:Tabbit-Browser/dsh-plugin` |
| ● 中等 [dskin](https://github.com/dancingmemory/dskin) | \| \| \| \| --- \| --- \| \| 🐱 1~4 随机小猫 \| 每次刷新随机出现 1~4 只（大橘 / 小白 / 玄猫 / 花猫），可手动加减 \|（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络；存在疑似混淆内容） | `dsh plugin --profile web add github:dancingmemory/dskin` |
| ● 中等 [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin) | 在会话内搜索发现 DSH 插件：实时检索 GitHub dsh-plugin 话题，按 star 排序。（风险：访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:awesome-dsh-plugin/dsh-find-plugin` |
| ● 中等 [dsh-plugin-hub](https://github.com/Noob-stupid/dsh-plugin-hub) | 给 DeepSeek Harness（DSH）Web 界面加上插件管理面板：一键启用/停用已安装插件， 并直接在 GitHub 上浏览 dsh-plugin 插件项目，一键添加并启用。（风险：访问第三方网络地址） | `dsh plugin --profile web add github:Noob-stupid/dsh-plugin-hub` |
| ● 中等 [dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) | OpenBiliClaw 是本地运行、跨平台、可调教的个性化内容推荐 Agent；本仓库是它的 DeepSeek Harness 客户端插件——DSH 左侧栏一个 OpenBiliClaw 按钮，点开右侧滑出抽屉（推荐/内容库/对话/画像/设置），并注册 22 个 Agent Bridge 工具，让 Agent 读推荐、答探测、闭环学习。（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络；使用动态代码或子进程执行；存在疑似混淆内容） | `dsh plugin --profile web add github:whiteguo233/dsh-openbiliclaw` |
| ● 中等 [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) | DeepSeek Harness 的数据 Agent：面向会话的数据库连接 + 专用 agent 预设，让 AI 写 SQL 并以实时执行反馈迭代。（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络；读取环境变量（可能包含敏感信息）） | `dsh plugin --profile web add github:omdsh-dev/dsh-data-agent` |
| ● 中等 [dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) | DSH Web UI 的常驻像素鲸鱼伙伴插件：会话标题栏（标题行右侧）常驻一只小鲸鱼，随会话快照实时反应——零核心改动。（风险：存在疑似混淆内容） | `dsh plugin --profile web add github:lhh010/dsh-ui-whale` |
| ● 中等 [dsh-vision](https://github.com/william-jin-cmu/dsh-vision) | 给纯文本的 DeepSeek 加上眼睛。Vision for text-only DeepSeek.（风险：访问第三方网络地址） | `dsh plugin --profile web add github:william-jin-cmu/dsh-vision` |
| ● 中等 [deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) | TUI Plugin of DeepSeek Harness 让DeepSeek Harness在终端跑起来（风险：访问第三方网络地址；存在 Base64 解码行为） | `dsh plugin --profile web add github:openma-ai/deepseek-harness-tui` |
| ● 中等 [dsh-notifier](https://github.com/THEWOLFWALKER/dsh-notifier) | > 你的 agent，装进口袋。 —— 通知、审批、遥控，全在你的手机里。（风险：访问第三方网络地址；读取环境变量并访问第三方地址，需确认未外发敏感信息；使用动态代码或子进程执行） | `dsh plugin --profile web add github:THEWOLFWALKER/dsh-notifier` |
| ● 中等 [allinluna](https://github.com/zenx0x/allinluna) | > 别再把整个项目塞进一个 AI 对话里。（风险：访问第三方网络地址） | `dsh plugin --profile web add github:zenx0x/allinluna` |
| ● 中等 [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) | 跨实例消息互通与事件通知插件，用于 DeepSeek Harness (DSH)。（风险：访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:Chinesezjc/dsh-interconnect` |
| ● 中等 [Tydora](https://github.com/zuorn/Tydora) | 极致的书写体验 ，所见即所得，界面 纯净 到只剩文字本身。没有一丝多余的干扰，光标所至，思绪便直接落在屏幕上。我把自己对“ 写作手感 ”的所有执念都写了进去，让工具彻底隐退，只留你与 思想的河流 。（风险：访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:zuorn/Tydora` |
| ● 中等 [dsh-stock-watch](https://github.com/Awu12277/dsh-stock-watch) | 已发布到 npm，一条命令安装到你的 web profile：（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络；读取环境变量并访问第三方地址，需确认未外发敏感信息；使用动态代码或子进程执行） | `dsh plugin --profile web add github:Awu12277/dsh-stock-watch` |
| ● 中等 [dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider) | 非官方 DeepSeek Harness 的 LLM provider 插件，用于 Command Code，移植自 pi-commandcode-provider（MIT 协议）。它注册了一个 commandcode provider，将请求转换为 Command Code 的 Provider API（POST /alpha/generate，由 pi 插件逆向工程，对应 command-code@1.26.0）。（风险：访问第三方网络地址（如 api.commandcode.ai、cdn.simpleicons.org、commandcode.ai、deepseek-harness.github.io）；访问第三方网络地址（如 api.commandcode.ai、commandcode.ai）；访问第三方网络地址（如 api.commandcode.ai）；访问第三方网络地址（如 a.com、api.commandcode.ai、example.com、new.example.com）；访问第三方网络地址（如 api.commandcode.ai、commandcode.ai、deepseek-harness.github.io）；访问第三方网络地址（如 commandcode.ai、keepachangelog.com、semver.org）；package.json 的 prepare 脚本会在安装/发布时自动执行；依赖 @deepseek-ai/cordis 与知名包 ioredis 名称高度相似（编辑距离 2），存在仿冒风险） | `dsh plugin --profile web add github:Mars-Sea/dsh-commandcode-provider` |
| ● 中等 [agent-handoff-skill](https://github.com/WeirdSky924/agent-handoff-skill) | 跨平台 Agent 接力 skill：在 Codex 或 Claude Code 中建立仓库级连续性记忆，让后续 agent 无需依赖历史聊天即可恢复目标、状态、决策、验证、风险与下一步行动。（风险：读取环境变量（可能包含敏感信息）） | `dsh plugin --profile web add github:WeirdSky924/agent-handoff-skill` |
| ● 中等 [dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) | DSH 插件：向模型暴露 MinerU 文档解析工具。MinerU 可将 PDF、图片、DOCX、PPTX、XLSX 等文件转换为结构化的 Markdown / JSON。（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；存在疑似混淆内容；使用动态代码或子进程执行） | `dsh plugin --profile web add github:HuanLinOTO/dsh-plugin-mineru` |
| ● 中等 [dsh-navbar](https://github.com/vlln/dsh-navbar) | DSH 插件：对话节点导航条（右缘节点串快速跳转 user 消息）。官方 bundle 插件，dsh plugin --profile web add 安装（风险：访问第三方网络地址） | `dsh plugin --profile web add github:vlln/dsh-navbar` |
| ● 中等 [deepseek-pet](https://github.com/keleus/deepseek-pet) | DeepSeek Pet 是一个嵌入 DeepSeek Harness 网页的交互式桌宠插件。它会跟随当前任务、 工具调用、上下文占用和活跃会话自动切换 DeepSeek 表情，并通过呼吸、弹跳、倾斜、 视差和淡入动画呈现 Live2D 风格效果。（风险：存在疑似混淆内容；使用动态代码或子进程执行） | `dsh plugin --profile web add github:keleus/deepseek-pet` |
| ● 中等 [dsh-plugin-cc](https://github.com/cpj-dev/dsh-plugin-cc) | 把 DeepSeek Harness 桥接到 Claude Code，用于审查、反馈、委派与会话导入。（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）） | `dsh plugin --profile web add github:cpj-dev/dsh-plugin-cc` |
| ● 中等 [dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) | Steam Workshop 风格的 DSH Web UI 插件浏览器：零服务器、GitHub 驱动搜索、趋势窗口、中文搜索与双语翻译、插件签名过滤，以及智能的一键安装/更新/卸载与已装插件管理。（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络；使用动态代码或子进程执行） | `dsh plugin --profile web add github:yyyyukari/dsh-plugin-workshop` |
| ● 中等 [dsh-model-router](https://github.com/tianji-qingtian/dsh-model-router) | DeepSeek Harness（dsh）的模型路由与成本优化插件。简单问题直接在便宜模型上作答（零前缀、无缓存税），瞬态故障自动降级，并在输入框下方实时显示每个会话的 token / 缓存命中 / 成本统计。（风险：读取环境变量（可能包含敏感信息）；存在疑似混淆内容） | `dsh plugin --profile web add github:tianji-qingtian/dsh-model-router` |
| ● 中等 [dshcode](https://github.com/whitelonng/dshcode) | DeepSeek Harness 的社区桌面伴侣：面向 macOS 和 Windows 的一键 Electron 应用。（风险：访问第三方网络地址） | `dsh plugin --profile web add github:whitelonng/dshcode` |
| ● 中等 [dsh-plugin-template](https://github.com/bugmaker2/dsh-plugin-template) | DeepSeek Harness 插件开发模板。（风险：存在疑似混淆内容） | `dsh plugin --profile web add github:bugmaker2/dsh-plugin-template` |
| ● 中等 [HoloGram](https://github.com/834063245-creator/HoloGram) | HoloGram 把代码库编译成一张统一 IR 依赖图（节点=符号/函数/类/模块，边=调用/继承/读写/时序），并通过 MCP 协议向 AI Agent 暴露 34 个图查询工具。（风险：访问第三方网络地址；读取环境变量并访问第三方地址，需确认未外发敏感信息；读取环境变量（可能包含敏感信息）） | `dsh plugin --profile web add github:834063245-creator/HoloGram` |
| ● 中等 [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) | DeepSeek Harness 的自定义工具插件：用户在设置界面的「Custom Tool」页用 Monaco（VS Code）编辑器 + TypeScript 智能提示编写自己的 JavaScript 工具；模型也可以通过 custom_tool_create / custom_tool_remove / custom_tools_list 自主扩展和修剪同一套工具。所有工具持久化、热注册，并在下一步写入模型提示词。（风险：访问第三方网络地址；使用动态代码或子进程执行；存在 Base64 解码行为；存在疑似混淆内容） | `dsh plugin --profile web add github:omdsh-dev/dsh-custom-tool` |
| ● 中等 [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) | dsh-message-edit（npm · GitHub）为 DeepSeek Harness 补充基于事件溯源的「消息编辑与重生成」能力。插件不改写历史事件，也不修改 DSH 引擎内部；每次编辑、重生成或重试都会从目标回合之前创建一个新会话版本，原会话始终保留并可随时切回。（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；存在疑似混淆内容） | `dsh plugin --profile web add github:Moeblack/dsh-message-edit` |
| ● 中等 [dsh-lark](https://github.com/omdsh-dev/dsh-lark) | Lark/飞书 DeepSeek Harness（DSH）即时通讯机器人通道插件。（风险：访问第三方网络地址；存在疑似混淆内容；使用动态代码或子进程执行） | `dsh plugin --profile web add github:omdsh-dev/dsh-lark` |
| ● 中等 [dsh-xiaoyao-skins](https://github.com/147228/dsh-xiaoyao-skins) | 一套面向真实 DeepSeek Harness Web profile 的社区皮肤合集表现层插件。每套皮肤都是一个可安装、可卸载、可测试的 DSH，不替换会话、模型、工具、沙箱或插件系统；（风险：访问第三方网络地址；存在疑似混淆内容） | `dsh plugin --profile web add github:147228/dsh-xiaoyao-skins` |
| ● 中等 [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) | DSH 插件健康检查工具 —— 扫描插件仓库，诊断清单协议 / patch 格式 / 构建陷阱 / hub 收录状态，输出合规报告与修复建议。只读，不修改、不构建被检查仓库。（风险：访问第三方网络地址；使用动态代码或子进程执行；存在 Base64 解码行为） | `dsh plugin --profile web add github:omdsh-dev/dsh-plugin-check` |
| ● 中等 [DSH-Desktop](https://github.com/JustGenius-s/DSH-Desktop) | 预编译安装包发布在 GitHub Releases。首次启动会自动安装 DSH 运行时（约 1-2 分钟）。（风险：访问第三方网络地址；读取环境变量（可能包含敏感信息）；读取凭据类环境变量并发送到网络，可能泄露密钥；存在疑似混淆内容；使用动态代码或子进程执行） | `dsh plugin --profile web add github:JustGenius-s/DSH-Desktop` |
| ● 中等 [dsh-computer-use](https://github.com/Anionex/dsh-computer-use) | 为 DeepSeek Harness 提供原生 macOS 控制能力，默认不碰你的真实光标，也不因指针动作抢占前台；Bundle 可以在键盘输入前把目标应用带到前台，保证输入可靠。（风险：访问第三方网络地址） | `dsh plugin --profile web add github:Anionex/dsh-computer-use` |
| ● 中等 [dsh-plugin-marketplace](https://github.com/AwesomeHou/dsh-plugin-marketplace) | DeepSeek Harness 插件市场：实时同步 GitHub dsh-plugin 话题（1800+ 仓库）到可搜索、分页的设置页，支持一键安装与 agent 工具（market_search / market_install）。（风险：访问第三方网络地址；读取凭据类环境变量并发送到网络，可能泄露密钥；使用动态代码或子进程执行） | `dsh plugin --profile web add github:AwesomeHou/dsh-plugin-marketplace` |
| ● 中等 [dsh-share](https://github.com/hellodigua/dsh-share) | DSH 对话分享插件：分享单轮或多轮对话，可导出为图片或 Markdown。（风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络；读取环境变量并访问第三方地址，需确认未外发敏感信息；使用动态代码或子进程执行；存在 Base64 解码行为；存在疑似混淆内容） | `dsh plugin --profile web add github:hellodigua/dsh-share` |

共收录 133 个插件，官方插件优先展示；数据来源与更新时间见 [docs/plugins.json](docs/plugins.json)。

<!-- PLUGINS_END -->

## 本地预览

项目是纯静态站点，`docs/` 目录即为页面源码。任意静态服务器即可预览：

```bash
cd docs
python3 -m http.server 8000
```

然后访问 <http://localhost:8000/>。

## 目录结构

```text
deepseek-harness-plugins/
├── .github/workflows/    # GitHub Actions：每日检索 + Pages 部署
├── docs/                 # 汇总页面源码
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── translations/
│   └── plugins.json      # 单一数据源
├── plugins/              # 本项目自研插件源码
├── scripts/              # 检索、安全审查与 README 生成脚本
├── README.md
└── LICENSE
```

## 自动化

### 每日检索与安全审查

[.github/workflows/discover-plugins.yml](.github/workflows/discover-plugins.yml) 每天定时运行
（也可在 GitHub 的 Actions 页面手动触发），完成以下步骤：

1. 通过 GitHub Search API 检索 `topic:dsh-plugin`。
2. 检查仓库是否带 `cordis`、`.dsh-plugin`、`dsh.bundle` 等 DSH 插件标记，确认其适用于 DeepSeek Harness。
3. 下载 README、多语言 README 与源码抽样文件，做安全与隐私静态扫描；发现隐私泄露风险会标记并附说明。
4. 从 `README.zh*.md` / `README.en*.md` 提取简洁简介，写入插件条目的 `description_i18n`；已有条目会按缺失语言一次性补采。
5. 官方插件优先；单次只处理有限数量，剩余仓库留给下一次定时任务继续。
6. 将通过审查的插件写入 `docs/plugins.json`，重新生成 README，并以 Pull Request 形式提交人工合并。

### GitHub Pages 部署

[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) 在推送到 `main` 后，
把 `docs/` 目录发布为 GitHub Pages。首次使用需在仓库 Settings → Pages 中把 Source 设置为
“GitHub Actions”。

## 贡献

欢迎通过 Pull Request 添加插件、修正信息或改进安全审查规则。新增插件请优先更新
`docs/plugins.json`，然后运行：

```bash
node scripts/update-readme.mjs
```

## License

[MIT](LICENSE)
