# DeepSeek Harness 插件汇总

[中文](README.md) | [English](README.en.md)

一个用于收集、展示和安全审查 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
（简称 DSH）社区插件的汇总项目。插件列表同时以网页和本 README 两种形式呈现，并每天自动检索
GitHub 上带 `dsh-plugin` 话题的仓库，经过代码安全审查后补充到汇总中。

汇总页面（GitHub Pages）：

```text
https://writeCasually.github.io/deepseek-harness-plugins/
```

## 项目简介

DeepSeek Harness 以“一切都是插件”为核心设计，社区围绕它产出了大量插件、皮肤、发行版与精选列表。
本项目把这些分散在 GitHub 上的项目汇总到一处，方便开发者按名称、功能与用法快速查找。

主要能力：

- 网页汇总页：支持搜索、按分类与官方标记筛选，展示每个插件的名称、功能简介、用法与项目链接。
- 单一数据源：`docs/plugins.json` 同时驱动网页与 README 插件列表。
- DSH 适用性判断：先确认插件是否真正能在 DeepSeek Harness 运行，无法确认的不予收录。
- 安全与隐私审查：对非官方插件做静态扫描，检测隐私泄露风险并标记说明。
- 官方优先：DeepSeek AI 官方插件排在最前。
- 人工复核入口：自动检索结果以 Pull Request 形式提交，合并后即可发布到汇总页。

## 插件列表

<!-- PLUGINS_START -->

| 插件名称 | 功能简介 | 用法 | 项目链接 |
| --- | --- | --- | --- |
| ★ 官方 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | DeepSeek Harness 核心运行时：Everything is a Plugin。 | `npx @deepseek-ai/dsh 启动核心；插件经 dsh plugin --profile web add <源> 挂载` | [查看](https://github.com/deepseek-ai/deepseek-harness) |
| [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) | DSH Web UI 的插件与皮肤集合：任务看板、Git 图谱、右侧面板、移动端远程、鲸鱼娘宠物、实时令牌统计与皮肤中心。 | `dsh plugin --profile web add github:zhu1090093659/dsh-web-ui 后重启 Web` | [查看](https://github.com/zhu1090093659/dsh-web-ui) |
| [ModLens](https://github.com/liustack/modlens) | 首个 DeepSeek Harness 视觉插件，给纯文本模型“装上眼睛”：直接粘贴图片即可得到结构化 JSON 证据（OCR、布局等）。 | `dsh plugin add @liustack/modlens（npm）；粘贴图片即可让纯文本模型“看见”` | [查看](https://github.com/liustack/modlens) |
| [sandbase-harness](https://github.com/sandbaseai/sandbase-harness) | Open-source CMA-compatible agent runtime. Run multi-agent systems locally with any model (Ollama/vLLM/Claude/GPT), MCP tools, scenario templates, and a beautiful dashboard. One command start. Built for enterprise teams.（隐私风险：访问第三方网络地址；读取浏览器 Cookie/存储并发送到网络） | `dsh plugin --profile web add github:sandbaseai/sandbase-harness` | [查看](https://github.com/sandbaseai/sandbase-harness) |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | 前部索引仓库（Radar）：自动扫描发现所有 dsh 插件候选，经测试合格的移入后序精选目录仓库。 | `打开网页查看自动扫描 Radar 与精选目录` | [查看](https://github.com/AdamPlatin123/awesome-dsh-plugins) |
| [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | Claude Code 风格全屏终端 TUI 插件：像素鲸鱼顶栏、实时工作状态行、思考流式展开、双击 Esc 回滚、上下文进度条与 TPS 仪表。 | `dsh plugin --profile tui add github:ccch1mneyyy/dsh-TUI（npm 一键安装）` | [查看](https://github.com/ccch1mneyyy/dsh-TUI) |
| [DSH Better Sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) | 侧边栏完整工作台：文件管理与预览、内嵌浏览器、真实终端、Git 面板、后台任务页，并支持第三方注册新 Tab。 | `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar` | [查看](https://github.com/omdsh-dev/DSH-better-sidebar) |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | A curated list of plugins for DeepSeek Harness (dsh) · DeepSeek Harness 插件精选列表（隐私风险：访问第三方网络地址） | `dsh plugin --profile web add github:awesome-dsh-plugin/awesome-dsh-plugin` | [查看](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | DSH Web 鲸鱼娘皮肤系列(深海女仆工坊 maid-atelier)——CC BY-NC-SA 4.0（隐私风险：访问第三方网络地址；读取环境变量（可能包含敏感信息））（安全提示：使用动态代码或子进程执行；存在疑似混淆内容） | `dsh plugin --profile web add github:Small-tailqwq/dsh-deep-whale` | [查看](https://github.com/Small-tailqwq/dsh-deep-whale) |
| [DSH Vision Toolkit](https://github.com/Anionex/dsh-vision-toolkit) | 把 agent-vision-toolkit 以原生 Profile Bundle 引入 DSH：带意图的图片问答、长截图 OCR、UI 还原、像素校验等视觉工具。 | `dsh plugin add github:Anionex/dsh-vision-toolkit` | [查看](https://github.com/Anionex/dsh-vision-toolkit) |
| [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | DeepSeek Harness 生态精选：来自 dsh-external/hub 与公开 dsh-plugin 话题的插件、工具与基础设施。 | `打开网页浏览生态精选，或 git clone 到本地阅读` | [查看](https://github.com/0xsline/awesome-deepseek-harness) |
| [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | 是兄弟就来蹬我！DSH Web UI 广告：2005 年中文站点风格的侧栏广告 / 对话内信息流 / 角落弹窗 + 一个真实热区比视觉小得多的关闭叉。素材全虚构，域名打码。（隐私风险：读取凭据类环境变量并发送到网络，可能泄露密钥；访问第三方网络地址）（安全提示：存在疑似混淆内容） | `dsh plugin --profile web add github:Nagi-ovo/dsh-ads` | [查看](https://github.com/Nagi-ovo/dsh-ads) |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | AgentTeams 多智能体团队插件：一句话驱动团队协作完成目标，并在 Web GUI 右上角实时查看团队活动面板。 | `npx -p @deepseek-ai/dsh dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` | [查看](https://github.com/NanmiCoder/dsh-agent-teams) |
| [notes](https://github.com/zhaoolee/notes) | 开源版锤子便签，复刻锤科美学，一键Docker私有化部署，支持skill调用，支持dsh plugin，支持多租户，一键生成公众号格式，支持导出便签为图片（隐私风险：访问第三方网络地址；读取环境变量并访问第三方地址，需确认未外发敏感信息）（安全提示：使用动态代码或子进程执行；存在 Base64 解码行为；存在疑似混淆内容） | `dsh plugin --profile web add github:zhaoolee/notes` | [查看](https://github.com/zhaoolee/notes) |
| [Oh-DSH](https://github.com/hust-open-atom-club/oh-dsh) | 一站式 DeepSeek Harness 社区发行版：桌面端、Web UI 与 TUI 三种形态统一体验，分层安装。 | `按 README 的桌面/Web/TUI 安装脚本一键安装发行版` | [查看](https://github.com/hust-open-atom-club/oh-dsh) |
| [ModSearch](https://github.com/liustack/modsearch) | 给纯文本模型“接上互联网”的 Web 搜索插件：搜索网页或 X，返回结构化 JSON 证据（搜索、抓取、引用）。 | `dsh plugin add @liustack/modsearch（npm）` | [查看](https://github.com/liustack/modsearch) |
| [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) | Codex 风格 @file 提及：在输入框搜索工作区文件，回车附加，发送时把文件内容注入模型。 | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-at-file/archive/refs/heads/main.tar.gz` | [查看](https://github.com/omdsh-dev/dsh-at-file) |
| [whale-girl](https://github.com/vlln/whale-girl) | DSH Web GUI 桌面宠物插件（QQ 宠物形态）：右下角悬浮、可拖拽、投喂与玩耍的积累型伙伴。 | `dsh plugin --profile web add "github:vlln/whale-girl#main"` | [查看](https://github.com/vlln/whale-girl) |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | 对话内生成式 UI 插件：模型把交互式 HTML 卡片直接画进会话流，用于模拟器、图表、对比面板与 UI mockup。 | `dsh plugin --profile web add github:Nagi-ovo/dsh-visualize` | [查看](https://github.com/Nagi-ovo/dsh-visualize) |
| [dsh-browser](https://github.com/Lum1104/dsh-browser) | Chrome 侧边栏扩展与桥接插件，让 DSH 直接操作你正在使用的浏览器，无需视觉能力。 | `运行 scripts/install.sh 安装 Chrome MV3 扩展与插件桥接` | [查看](https://github.com/Lum1104/dsh-browser) |
| [DSH OpenPencil](https://github.com/ZSeven-W/dsh-openpencil) | OpenPencil 设计预览与编辑插件：在会话中预览、检查并编辑真实 .op 文档。 | `dsh plugin add @zseven-w/dsh-openpencil（npm）` | [查看](https://github.com/ZSeven-W/dsh-openpencil) |
| [DSH Workflow](https://github.com/icetomoyo/dsh_workflow) | 把 DSH 的一次性多 Agent 调度升级为可生成、保存、治理、观察、恢复的 Workflow 层。 | `dsh plugin add github:icetomoyo/dsh_workflow` | [查看](https://github.com/icetomoyo/dsh_workflow) |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | DeepSeek Harness 的 Windows 轻量启动器：开机自启 + 独立小窗口，双击即用。 | `下载 Releases 的 .msi 或便携 ZIP，双击运行` | [查看](https://github.com/Ruler4396/dsh-launcher) |
| [dsh-genui](https://github.com/omdsh-dev/dsh-genui) | 在助手回复中渲染交互式 UI 组件：布局、图表、表单、测验、mermaid 等，经 dsh-ui fence 内联展示。 | `dsh plugin --profile web add github:omdsh-dev/dsh-genui` | [查看](https://github.com/omdsh-dev/dsh-genui) |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | 用 30 秒找到适合你的 DeepSeek Harness 插件：告诉你插件解决什么问题、适合谁、从哪里开始。 | `打开网页按“解决什么问题”快速选择插件` | [查看](https://github.com/bruc3van/awesome-dsh-plugin) |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | 从 DSH Web GUI 的侧边栏工作区菜单直接在当前目录打开 VS Code。 | `dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode` | [查看](https://github.com/omdsh-dev/dsh-open-in-vscode) |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | DeepSeek Harness 会话完成时发送桌面通知，支持按结果类型和关键词规则控制。 | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-notification/archive/refs/heads/main.tar.gz` | [查看](https://github.com/omdsh-dev/dsh-notification) |
| [DSH Turn Rewind](https://github.com/Anionex/dsh-turn-rewind) | 对话与代码状态回退插件：基于持久 Change Ledger，回滚对话和工作区状态。 | `dsh plugin add github:Anionex/dsh-turn-rewind` | [查看](https://github.com/Anionex/dsh-turn-rewind) |
| [dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) | 纯插件实现的跨会话长期记忆与后台自我进化：五轨记忆、git 分支感知、技能自我进化、四轨待办、会话广播与搜索。 | `dsh plugin add github:csyangwen/dsh-memory-evolve` | [查看](https://github.com/csyangwen/dsh-memory-evolve) |

共收录 29 个插件，官方插件优先展示；数据来源与更新时间见 [docs/plugins.json](docs/plugins.json)。

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
3. 下载 README 与源码抽样文件，做安全与隐私静态扫描；发现隐私泄露风险会标记并附说明。
4. 官方插件优先；单次只处理有限数量，剩余仓库留给下一次定时任务继续。
5. 将通过审查的插件写入 `docs/plugins.json`，重新生成 README，并以 Pull Request 形式提交人工合并。

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
