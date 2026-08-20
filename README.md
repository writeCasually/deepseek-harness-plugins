# DeepSeek Harness 插件汇总

[中文](README.md) | [English](README.en.md)

一个用于收集、展示和安全审查 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
（简称 DSH）社区插件的汇总项目。插件列表同时以网页和本 README 两种形式呈现，并每天自动检索
GitHub 上带 `dsh-plugin` 话题的仓库，经过代码安全审查后补充到汇总中。

汇总页面（GitHub Pages）：

[https://writeCasually.github.io/deepseek-harness-plugins/](https://writeCasually.github.io/deepseek-harness-plugins/)

## 项目简介

DeepSeek Harness 以“一切都是插件”为核心设计，社区围绕它产出了大量插件、皮肤与发行版。
本项目把这些分散在 GitHub 上的项目汇总到一处，方便开发者按名称、作者与功能快速查找。

主要能力：

- 网页汇总页：支持搜索、按分类与官方标记筛选，展示每个插件的名称、作者、功能简介与项目链接。
- 单一数据源：`docs/plugins.json` 同时驱动网页与 README 插件列表。
- 多语言简介：插件仓库存在 `README.zh*.md` / `README.en*.md` 等简洁文档时，网页会按当前语言展示对应简介，中文优先、英文兜底。
- DSH 适用性判断：先确认插件是否真正能在 DeepSeek Harness 运行，无法确认的不予收录。
- 分层安全与隐私审查：对非官方插件做证据化静态扫描（危险命令 / 代码执行 / 密钥泄露 / 混淆检测）
  与供应链漏洞检查（OSV），可选 LLM 深度复核；审查留痕（commit、证据、覆盖率），详见
  [docs/security-review.md](docs/security-review.md)。
- 官方优先：DeepSeek AI 官方插件排在最前。
- 人工复核入口：自动检索结果以 Pull Request 形式提交，合并后即可发布到汇总页。

## 官方预设插件

DSH 随包分发一组官方内置插件（`@deepseek-ai/*`，位于官方仓库
[packages/](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages) 目录）。它们的“作用”说明
**独立维护**、不参与社区插件的发现与安全审查 workflow：

- 独立数据源：`docs/official-plugins.json`（`plugins` 数组共 210 个内置插件）。
- 随网页独立“官方预设插件”区块展示；发现/审查脚本（`scripts/*`）与 `.github/workflows/*` **只读写
  `docs/plugins.json`，从不改写或审查官方数据文件**。

可部署的官方 profile bundle：

| 包名 | 作用 |
| --- | --- |
| [`@deepseek-ai/dsh-base`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle/base) | 共享 dsh 核心，作为每个 profile 的第一层 patch：在空 profile 根上插入全套基础内置插件。 |
| [`@deepseek-ai/dsh-web-app`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle/web-app) | 浏览器界面 bundle：在 `dsh-base` 上叠加 web patch 层与运行期 glue 插件。 |
| [`@deepseek-ai/dsh-headless`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle/headless) | 一次性 bundle：无 Host/HTTP/浏览器，直接跑核心 Agent/Session。 |

完整清单与每个包的作用见 [docs/official-plugins.json](docs/official-plugins.json)。

## 插件列表

<!-- PLUGINS_START -->

| 插件名称 | 作者 | 功能简介 |
| --- | --- | --- |
| [OpenViking](https://github.com/volcengine/OpenViking) | [@volcengine](https://github.com/volcengine) | Self-evolving Context Database for AI Agents. Unify Agent Memory, Knowledge RAG and Skills. |
| [voyager](https://github.com/Nagi-ovo/voyager) | [@Nagi-ovo](https://github.com/Nagi-ovo) | Enhancement suite for Gemini, AI Studio, Claude & ChatGPT — plus a prompt manager for any web UI, DeepSeek Harness included. / 面向 Gemini、AI Studio、Claude 与 ChatGPT 的增强套件；提示词管理器可用于任意 Web UI，含 DeepSeek Harness。 |
| [archify](https://github.com/tt-a1i/archify) | [@tt-a1i](https://github.com/tt-a1i) | Agent skill for beautiful, verifiable architecture, workflow, sequence, data-flow, and lifecycle diagrams—self-contained HTML with motion and crisp export. |
| [ouroboros](https://github.com/Q00/ouroboros) | [@Q00](https://github.com/Q00) | Agent OS: the agent gets smarter on its own. We just hold the line: the grading command and expected result never make it into the success contract we hand it. Interview-gated, staged evaluation, budgeted evolution loop. MCP server, 13 runtimes: Claude Code, Codex CLI, Gemini CLI, OpenCode, Copilot, Kiro and more. |
| [dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) | [@xiaobright](https://github.com/xiaobright) | Two-phase DeepSeek Harness preset: Minimal-aligned bootstrap, then full Standard tools (Project2 98/99) |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | [@Small-tailqwq](https://github.com/Small-tailqwq) | DSH Web 鲸鱼娘皮肤系列(深海女仆工坊 maid-atelier)——CC BY-NC-SA 4.0 |
| [dsh-market](https://github.com/dsh-market/dsh-market) | [@dsh-market](https://github.com/dsh-market) | The plugin market inside DeepSeek Harness — browse, search, one-click install · DSH 可视化插件市场 |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | [@AdamPlatin123](https://github.com/AdamPlatin123) | 前部索引仓库（Radar）：自动扫描发现所有 dsh 插件候选，经测试合格的移入后序精选目录仓库。 |
| [agentrq](https://github.com/agentrq/agentrq) | [@agentrq](https://github.com/agentrq) | AgentRQ: Human-in-loop realtime conversational task manager for AI Agents. Self-hosted! Control your own agents from wherever you want Mobile, Web, Desktop. Designed to work well with your own Claude subscriptions and any harness. |
| [Aegis](https://github.com/GanyuanRan/Aegis) | [@GanyuanRan](https://github.com/GanyuanRan) | Make AI coding agents architecture-aware: baseline-first, evidence-verified, drift-checked, and safe across long tasks. |
| [awesome-deepseek-harness](https://github.com/Anil-matcha/awesome-deepseek-harness) | [@Anil-matcha](https://github.com/Anil-matcha) | Curated guide to DeepSeek Harness (dsh) and its best community plugins |
| [awesome-dsh-plugin](https://github.com/Anil-matcha/awesome-dsh-plugin) | [@Anil-matcha](https://github.com/Anil-matcha) | A curated list of plugins for DeepSeek Harness (dsh) - DeepSeek Harness plugin ecosystem |
| [tongflow](https://github.com/tong-io/tongflow) | [@tong-io](https://github.com/tong-io) | TongFlow — multimodal workflow studio and engine (canvas + Python plugin engine) and dsh-tongflow, the DeepSeek Harness studio plugin |
| [dsh-vision-router](https://github.com/ysr666/dsh-vision-router) | [@ysr666](https://github.com/ysr666) | Eyes for text-only DeepSeek Harness agents: built-in free vision chain (no key) + pixel-level vision tools (Q&A, grounding, crop, pixel diff, colors, OCR, SVG trace, cutout, screenshots). One-command install, no Python, image turns work like ordinary tool-calling turns. |
| [api-relay-audit](https://github.com/toby-bridges/api-relay-audit) | [@toby-bridges](https://github.com/toby-bridges) | Local security audit for AI API relays and LLM proxies: detects prompt injection, model substitution, tool-call rewriting, SSE anomalies, error leakage, and Web3 wallet risks. |
| [dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) | [@Anionex](https://github.com/Anionex) | 让纯文本模型更好地做视觉任务的DeepSeek Harness插件：带意图的图片问答、长截图 OCR、UI 还原等｜DeepSeek Harness-native integration for agent-vision-toolkit: image Q&A, long-screenshot OCR, UI restoration, grounding, pixel diff, Artifacts, and Web UI. |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | [@NanmiCoder](https://github.com/NanmiCoder) | dsh-agent-teams 让当前 DeepSeek Harness 会话成为队长：创建可续聊的子 Agent、把目标拆成有依赖的任务，并通过直达消息协调成员工作。 |
| [working-activity](https://github.com/ccch1mneyyy/working-activity) | [@ccch1mneyyy](https://github.com/ccch1mneyyy) | Lively Working-line extension for pi CLI and DSH |
| [dsh-work](https://github.com/vibeinging/dsh-work) | [@vibeinging](https://github.com/vibeinging) | Local-first AI workbench for DSH Plugins, combining Agent sessions, project files, data analysis, web research, MCP, and Office artifacts in an Electron desktop app. |
| [deepseek-harness-desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app) | [@vibeinging](https://github.com/vibeinging) | DeepSeek Harness Desktop App: a local AI desktop workspace for DSH Sessions, projects, files, web research, plugins, and Office artifacts. |
| [dsh-context](https://github.com/bowenliang123/dsh-context) | [@bowenliang123](https://github.com/bowenliang123) | A DeepSeek Harness plugin for  Context insight dashboard — showing what the model's context window is made of and how it evolves. |
| [dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | [@Electricitysheep](https://github.com/Electricitysheep) | DeepSeek Harness (dsh) 从 0 到 1 深度手册：安装/插件开发/性能调优/实测案例/同模型多 Agent 实测对比（中文 + 英文 PDF） |
| [graph-memory](https://github.com/adoresever/graph-memory) | [@adoresever](https://github.com/adoresever) | Openclaw记忆插件Knowledge Graph + Memory；Knowledge Graph Context Engine for OpenClaw — extracts structured triples from conversations, compresses context 75%, enables cross-session experience reuse |
| [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | [@Nagi-ovo](https://github.com/Nagi-ovo) | 是兄弟就来蹬我！DSH Web UI 广告：2005 年中文站点风格的侧栏广告 / 对话内信息流 / 角落弹窗 + 一个真实热区比视觉小得多的关闭叉。素材全虚构，域名打码。 |
| [mnemon](https://github.com/mnemon-dev/mnemon) | [@mnemon-dev](https://github.com/mnemon-dev) | LLM-supervised persistent memory for AI agents — graph-based recall, cross-session knowledge, single binary. Works with Claude Code, OpenClaw, and any CLI agent. |
| [memtrace-public](https://github.com/syncable-dev/memtrace-public) | [@syncable-dev](https://github.com/syncable-dev) | Structural memory for AI coding agents. Bi-temporal graph, MCP-native, zero LLM calls. Cursor · Claude Code · Codex · DeepSeek Harness · Hermes · VS Code · Windsurf. |
| [superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | [@superdesigndev](https://github.com/superdesigndev) | The design skill for Claude Code, Cursor and any coding agent. Stop shipping AI-slop UI: turn it into shippable, tasteful frontend. Install: npx skills add superdesigndev/superdesign-skill. Powered by superdesign.dev |
| [deepseek-harness-studio](https://github.com/fufankeji/deepseek-harness-studio) | [@fufankeji](https://github.com/fufankeji) | DeepSeek Harness Desktop for macOS & Windows — zero-code Plugin Store, one-click install and enable, vision enhancement, automatic plugin delivery, and AI recommendations.｜视觉增强 + 插件商店，0 代码一键启用。 |
| [de-anthropocentric-research-engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine) | [@yogsoth-ai](https://github.com/yogsoth-ai) | 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction. |
| [DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin) | [@WYH66666666](https://github.com/WYH66666666) | 是一层高自由度的玻璃质感主题，套在 DeepSeek Harness 网页端。顶栏、侧边栏、输入框、统计行、轨迹视图都成了磨砂玻璃片。玻璃模糊度、磨砂度、背景（流体或自定义壁纸，壁纸还能单独调模糊和磨砂）全都能在设置卡片里自由调节。关掉开关就回到原生界面，不改 DSH 任何一行源码。 |
| [dsh-genui](https://github.com/omdsh-dev/dsh-genui) | [@omdsh-dev](https://github.com/omdsh-dev) | GenUI for DeepSeek Harness: interactive UI components rendered inline in assistant replies via the dsh-ui fence — layout, charts, plots, forms, quizzes, mermaid, 3D scenes, and an action event loop back to the model. Ships the fence-teaching host plugin, the browser renderer (client half), and the genui skill. |
| [oh-dsh](https://github.com/hust-open-atom-club/oh-dsh) | [@hust-open-atom-club](https://github.com/hust-open-atom-club) |  一套 DSH runtime，Desktop、Web 与 TUI 三种开发体验。 |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | [@bruc3van](https://github.com/bruc3van) | 用 30 秒找到适合你的 DeepSeek Harness 插件：告诉你插件解决什么问题、适合谁、从哪里开始。 |
| [Minke](https://github.com/lencx/Minke) | [@lencx](https://github.com/lencx) | 🐳 DeepSeek Harness Desktop |
| [nuphus-mcp](https://github.com/mrpulor-gh/nuphus-mcp) | [@mrpulor-gh](https://github.com/mrpulor-gh) | Desktop automation MCP server — computer use for any AI agent: control screen, windows, mouse/keyboard, and Chrome via Model Context Protocol (stdio) |
| [dsh-pet](https://github.com/PC2005-cloud/dsh-pet) | [@PC2005-cloud](https://github.com/PC2005-cloud) | DSH 桌面宠物：一行命令安装现成宠物（28 个透明动画，即装即用），或内置素材链从 AI 视频自造专属宠物 \| One-line install desktop pet for DeepSeek Harness + DIY asset pipeline |
| [dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) | [@huiliyi37](https://github.com/huiliyi37) | dsh-tianshu-tui — DeepSeek Harness terminal UI +harness workflow。是官方 DeepSeek Harness 上的交互式终端 UI 插件。渲染核心从本仓库自研的harness agent  Tianshu-Tui 演进而来，在官方的基础上增加了TDD、证据门、视觉图像模块等工作流。 |
| [Awesome-DeepSeek-Harness-Plugins](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins) | [@Zhiyuan-Fan](https://github.com/Zhiyuan-Fan) | Curated DeepSeek Harness (DSH) plugins, extensions, tools, skills, clients, runtimes, integrations, and verified references — English and Chinese. |
| [dsh-dafeiyu](https://github.com/QCYTSN/dsh-dafeiyu) | [@QCYTSN](https://github.com/QCYTSN) | Desktop-native BigFish companion for DeepSeek Harness — real Agent status, always on top on Windows. |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | [@Nagi-ovo](https://github.com/Nagi-ovo) | 在 DSH 对话中生成交互式可视化｜Render model-generated interactive cards inside DSH conversations |
| [dsh-plugin-subscriptions](https://github.com/V1ki/dsh-plugin-subscriptions) | [@V1ki](https://github.com/V1ki) | Use ChatGPT (Codex), Claude, and Grok (X Premium) subscriptions as DeepSeek Harness LLM providers — OAuth login in the web UI, no API keys |
| [dshfind](https://github.com/hikariming/dshfind) | [@hikariming](https://github.com/hikariming) | DSH (DeepSeek Harness) 原理学习、插件市场与最佳实践 · Learn DSH principles, plugin marketplace & best practices |
| [open-sea-skin](https://github.com/d-dev0101/open-sea-skin) | [@d-dev0101](https://github.com/d-dev0101) | WebGPU ocean skin for DeepSeek Harness — DSH plugin, Harness-only Chrome/Edge extension, static installer, and native integration. |
| [deepseek-design](https://github.com/Devin-AXIS/deepseek-design) | [@Devin-AXIS](https://github.com/Devin-AXIS) | DeepSeek Harness 可编辑设计系统：AI 生成、可视化编辑、模板市场与 PPT｜Native Design & PPT Studio for DeepSeek Harness. |
| [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | [@Dominic789654](https://github.com/Dominic789654) | A curated list of plugins, skills, MCP servers, patch/profile layers, orchestrators & UIs for DeepSeek Harness (DSH). Visualization · PPT · Coding · Agents · Loops (auto-research) and more. #dsh |
| [engramory](https://github.com/tinqiao-oss/engramory) | [@tinqiao-oss](https://github.com/tinqiao-oss) | A portable memory protocol for AI agents — load it as standing rules; a curation discipline + reference spec + optional cap hook. |
| [awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) | [@libukai](https://github.com/libukai) | DeepSeek Harness 终极指南：快速入门、资源推荐、精选插件与实用工具 ｜The Ultimate Guide to DeepSeek Harness: QuickStart, Resources, Plugins&Toolkit |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | [@Ruler4396](https://github.com/Ruler4396) | DeepSeek Harness 的 Windows 轻量启动器：开机自启 + 独立小窗口，双击即用。 |
| [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | [@Nagi-ovo](https://github.com/Nagi-ovo) | 对 DSH 说一句「有没有插件能……」，它就会从全 GitHub 的 dsh-plugin topic 里找出候选，解释差别，等你选好以后再安装和验证。 |
| [DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget) | [@MeteorNOX](https://github.com/MeteorNOX) | DeepSeek Harness（DSH）一只住在 DSH 界面右下角的小鲸鱼娘，帮你盯着DeepSeek账户余额。QQ弹弹，支持拖拽吸附、左吸附翻转、数字滚动动画，随界面自动启用，建议直接喊来你的dsh安装 |
| [anysearch-dsh](https://github.com/anysearch-team/anysearch-dsh) | [@anysearch-team](https://github.com/anysearch-team) | AnySearch web search provider and advanced search tools for DeepSeek Harness (DSH) |
| [anime-find](https://github.com/cocofhu/anime-find) | [@cocofhu](https://github.com/cocofhu) | DeepSeek Harness 搜番插件：对话内多源搜索番剧，卡片展示 Bangumi 评分与详情，支持复制磁力。 |
| [notes](https://github.com/zhaoolee/notes) | [@zhaoolee](https://github.com/zhaoolee) | 开源版锤子便签，复刻锤科美学，一键Docker私有化部署，支持skill调用，支持dsh plugin，支持多租户，一键生成公众号格式，支持导出便签为图片 |
| [dsh-gitbash-preset](https://github.com/liceses/dsh-gitbash-preset) | [@liceses](https://github.com/liceses) | DeepSeek Harness 插件：一键安装「极简模式 (Git Bash)」agent preset —— 把 DSH 自带极简模式中的 bash 调用映射到 Git for Windows 的 bash（MSYS），让 Windows 上的极简模式真正可用。 |
| [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) | [@omdsh-dev](https://github.com/omdsh-dev) | Cross-agent, local-first persistent memory plugin for DeepSeek Harness (DSH), powered by Mnemon. It shares long-term memory across Mnemon-enabled agents and adds runtime memory, searchable project documents, semantic recall, knowledge graph, and a Sidebar UI. |
| [dsh-pentest](https://github.com/howmp/dsh-pentest) | [@howmp](https://github.com/howmp) | 面向 DeepSeek Harness（dsh）的渗透测试模式  @CloverSecLabs |
| [Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | [@ChisaAlter](https://github.com/ChisaAlter) | DSH桌面端，支持主题和背景图等多种个性化配置。Electron desktop shell for DeepSeek Harness web UI |
| [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) | [@Han-1413141](https://github.com/Han-1413141) | DeepSeek Harness 会话费用统计插件:本会话费用、当日费用、历史记录与官方价格同步 |
| [awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins) | [@imsai-sh](https://github.com/imsai-sh) | DeepSeek Harness plugin store, marketplace and hub — 3,100+ dsh plugins with search, rankings, install commands and a free public API. DeepSeek Harness 插件市场 / 插件商店：自动收集与格式校验，免费搜索 API。deepseek1024.com |
| [dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) | [@yjh051108](https://github.com/yjh051108) | > ## 🎉 v0.3.0 重大声明（2026-08-14） > > 从经验补丁到源码契约——注入器完成规范重构。 |
| [TokenLedger](https://github.com/zh667/TokenLedger) | [@zh667](https://github.com/zh667) | Relay-site attributed token usage for DeepSeek Harness — zero config, no credentials |
| [dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin) | [@kingOfSoySauce](https://github.com/kingOfSoySauce) | DeepSeek Harness 滑动变阻器皮肤 |
| [dsh-noema](https://github.com/ZSeven-W/dsh-noema) | [@ZSeven-W](https://github.com/ZSeven-W) | Noema long-term memory plugin for DSH: durable, inspectable agent memory with recall tools and a settings page. |
| [dsh-agent-team-gui](https://github.com/toolclub/dsh-agent-team-gui) | [@toolclub](https://github.com/toolclub) | Persistent multi-model workflow teams for DeepSeek Harness — dynamic lead planning, bounded DAGs, per-agent model/tools, Run Center and Token insights. |
| [gal-view](https://github.com/Ayase34/gal-view) | [@Ayase34](https://github.com/Ayase34) | 把dsh会话界面切换成galgame游戏界面的插件 |
| [humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) | [@Vladimir-Human](https://github.com/Vladimir-Human) | Скилл для ИИ-агентов: находит и убирает следы машинной генерации из русского текста. 38 паттернов, 39 regex-маркеров с реестром доказательств, слепые парные прогоны, файловый слой снятия C2PA/EXIF/XMP \| Russian AI-writing humanizer skill with file metadata cleaning |
| [dsh-undo-plugin](https://github.com/lire1131/dsh-undo-plugin) | [@lire1131](https://github.com/lire1131) | DSH crash-rescue plugin: undo config & plugin-code changes, secret-safe snapshots, one-click SAFE MODE, plus offline CLI/GUI that work even when DSH won't boot. |
| [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) | [@omdsh-dev](https://github.com/omdsh-dev) | Data Agent for DeepSeek Harness: session-scoped database connections with a dedicated agent preset that lets AI write SQL and iterate against live execution feedback. |
| [dsh-webui-market-plugin](https://github.com/Sanqi-normal/dsh-webui-market-plugin) | [@Sanqi-normal](https://github.com/Sanqi-normal) | dsh Web GUI 社区插件市场：浏览 awesome-dsh-plugin.com 插件目录，一键安装/卸载到 profile。Community plugin market for the DeepSeek Harness (dsh) web GUI: browse, install and uninstall plugins into a profile. |
| [odai](https://github.com/orziz/odai) | [@orziz](https://github.com/orziz) | AI agent 通用任务治理框架：对齐目标与事实，规划和调度能力，守住授权与风险边界，治理任务执行到真实验收与交付。Governance framework for evidence-driven planning, orchestration, and verified delivery. |
| [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) | [@beancookie](https://github.com/beancookie) | Awesome DeepSeek Harness (DSH) Plugin |
| [dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) | [@HanaAyane](https://github.com/HanaAyane) | DSH适用的Codex风格的思考强度滑块，以及大肥鱼跑步滑块。Codex-style model and reasoning-effort slider for DeepSeek Harness |
| [dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) | [@Anionex](https://github.com/Anionex) | deepseek harness对话和代码状态回退插件 \| DSH — rewind conversation and workspace state, powered by a persistent Change Ledger |
| [dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) | [@Ychris12138](https://github.com/Ychris12138) | Token usage heatmap, per-model breakdowns, and DeepSeek account balance for the DeepSeek Harness Web GUI (dsh web). |
| [dsh-plugin](https://github.com/Tabbit-Browser/dsh-plugin) | [@Tabbit-Browser](https://github.com/Tabbit-Browser) | 这是一个 Tabbit 浏览器为 Deepseek Harness 提供的一个 plugins。你可以在 Deepseek Harness 中安装这个插件，给 Deepseek Harness 提供控制 Tabbit 浏览器的能力。 |
| [DSH Workflow](https://github.com/icetomoyo/dsh_workflow) | [@icetomoyo](https://github.com/icetomoyo) | 把 DSH 的一次性多 Agent 调度升级为可生成、保存、治理、观察、恢复的 Workflow 层。 |
| [dsh_workflow](https://github.com/omdsh-dev/dsh_workflow) | [@omdsh-dev](https://github.com/omdsh-dev) | 把Claude Code的UltraCode模式带给DSH，把 DSH 的一次性多 Agent 调度，升级为可生成、可保存、可治理、可观察、可恢复的 Workflow 层 |
| [dsh-image-gen](https://github.com/shanliuling/dsh-image-gen) | [@shanliuling](https://github.com/shanliuling) | Generate images directly in DeepSeek Harness chats |
| [dsh-skill-viewer](https://github.com/Fishquito7/dsh-skill-viewer) | [@Fishquito7](https://github.com/Fishquito7) | DSH Web UI plugin: Skills settings section with hot enable/disable, delete and add（Web界面的skill管理工具） |
| [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) | [@Nwflower](https://github.com/Nwflower) | 从Claude Code、Codex、Reasonix等Agent工具导入迁移历史消息，并在DeepSeek Harness(DSH)中继续对话 |
| [cocode](https://github.com/cocode-agency/cocode) | [@cocode-agency](https://github.com/cocode-agency) | Best ready-to-run DeepSeek Harness distribution: DSH desktop GUI, terminal TUI, and harness integration. |
| [dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) | [@omdsh-dev](https://github.com/omdsh-dev) | DSH Web 选中批注插件：选文字→批注→回车随消息发送；气泡隐藏批注块（零闪烁）；回复按 Annotation N 逐条对照（可悬浮芯片）。官方 bundle，零核心改动 |
| [tokenbank](https://github.com/wink-run/tokenbank) | [@wink-run](https://github.com/wink-run) | Token Bank — the local LLM gateway that sits between your AI agents and every provider.  Know where tokens go · Spend less with smart routing to Ollama, Groq, GitHub Models · Earn by sharing idle quota on a community P2P network.  One-click onboarding for Cursor, Claude Code, Codex CLI, Gemini CLI — no agent changes. Full trace, seamless model swap |
| [hello-dsh](https://github.com/pingfanfan/hello-dsh) | [@pingfanfan](https://github.com/pingfanfan) | 从零开始，看懂 DeepSeek Harness 的「万物皆可插件」— 零基础插件开发教程（含 22 个中文技能实例）\| Zero-to-plugin tutorial for DeepSeek Harness |
| [dsh-im](https://github.com/xmanrui/dsh-im) | [@xmanrui](https://github.com/xmanrui) | 通过扫码或机器人凭据把IM机器人接入DeepSeek Harness（支持飞书、微信、钉钉、企业微信、QQ、Slack、Telegram、Discord和WhatsApp）。 Connect IM bots to DeepSeek Harness via QR code or credentials (9 channels). |
| [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | [@Alex-Yanggg](https://github.com/Alex-Yanggg) | A meticulously curated list of useful plugins, extensions, tools and development resources built for DSH, covering productivity enhancement, functional expansion, debugging utilities and custom development modules. |
| [dsh-vision](https://github.com/oil-oil/dsh-vision) | [@oil-oil](https://github.com/oil-oil) | Near-native image understanding for DeepSeek Harness |
| [sealos-skills](https://github.com/labring/sealos-skills) | [@labring](https://github.com/labring) | AI agent skills for Sealos — deploy any project, provision databases, object storage & more with one command. Works with Claude Code, Gemini CLI, Codex. |
| [dsh-kun-like-pet](https://github.com/liyupi/dsh-kun-like-pet) | [@liyupi](https://github.com/liyupi) | Kun Like 桌宠 —— DeepSeek Harness 桌面宠物插件：右下角小坤宠随 Agent 工作状态切换 9 种动作，任务完成播放「你干嘛~哎哟」 |
| [dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider) | [@Mars-Sea](https://github.com/Mars-Sea) | Unofficial DeepSeek Harness LLM provider plugin for Command Code: live model catalog, reasoning-effort support, Models-page card. Ported from pi-commandcode-provider (MIT). |
| [superpowers-dsh](https://github.com/LayneChai/superpowers-dsh) | [@LayneChai](https://github.com/LayneChai) | Superpowers skills for DeepSeek Harness: TDD, debugging, planning, and collaboration skills adapted from obra/superpowers |
| [forkprobe](https://github.com/Jayden-X-L/forkprobe) | [@Jayden-X-L](https://github.com/Jayden-X-L) | Compare multiple skills on the same task and pick the winner. |
| [dsh-automation](https://github.com/titanwings/dsh-automation) | [@titanwings](https://github.com/titanwings) | DSH 自动化插件：让 Coding 任务按计划在全新 Agent Session 中运行，并由用户或 Agent 创建和管理定时任务。 / Run coding tasks in fresh Agent sessions and manage schedules from DSH Web or an Agent. |
| [Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | [@like-study1](https://github.com/like-study1) | 🐳 DeepSeek Harness 插件聚合社区 — 自动同步 dsh-plugin 生态 · 精选目录 · 每 4 小时自动维护 \| Oh-My-DSH: a community-maintained catalog of DeepSeek Harness plugins, auto-synced from the dsh-plugin topic |
| [dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot) | [@tencent-connect](https://github.com/tencent-connect) | 让 QQ 机器人接入 DeepSeek Harness（dsh）的官方插件 |
| [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin) | [@awesome-dsh-plugin](https://github.com/awesome-dsh-plugin) | Find DSH plugins inside the agent — live GitHub dsh-plugin topic search, star-ranked / 会话内搜索发现 DSH 插件 |
| [dsh-desktop](https://github.com/bruc3van/dsh-desktop) | [@bruc3van](https://github.com/bruc3van) | DeepSeek Harness Desktop 是一款第三方桌面客户端，通过直接加载官方 Web UI，为普通用户提供开箱即用的独立桌面体验：它可以自动复用本机已运行的官方实例，也可以使用安装包内置的 dsh 运行时启动服务，无需用户额外安装 Node.js 或 CLI，并提供智能连接、远程实例连接、托盘常驻、运行时监护和异常恢复等桌面增强。 |
| [ru-marketplace-mcp](https://github.com/Vladimir-Human/ru-marketplace-mcp) | [@Vladimir-Human](https://github.com/Vladimir-Human) | Девять российских маркетплейсов и китайский Taobao как MCP-серверы: Wildberries, Ozon, Яндекс Маркет, Детский мир, Авито, Мегамаркет, Lamoda, DNS, Ситилинк. Плюс сравнение цен по всем сразу. Только чтение, ключи не нужны. |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | [@omdsh-dev](https://github.com/omdsh-dev) | Desktop notifications for DeepSeek Harness turn completions, with per-outcome controls and include/exclude keyword rules. |
| [ProMentor](https://github.com/Lyn-77/ProMentor) | [@Lyn-77](https://github.com/Lyn-77) | ProMentor 是一个 AI Coding Agent Skill。装上它，你的 AI 编程助手立刻化身为导师——扫描项目架构、生成阶梯式 Chapter、带你手写核心逻辑、自动判题、AI Code Review。 |
| [dsh-plugin-hub](https://github.com/Noob-stupid/dsh-plugin-hub) | [@Noob-stupid](https://github.com/Noob-stupid) | DeepSeek Harness (DSH) 插件管理面板：一键启用/停用插件 + GitHub dsh-plugin 插件市场，带插件详情与一键安装 \| Plugin manager & marketplace for DeepSeek Harness |
| [dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store) | [@ZASENJC](https://github.com/ZASENJC) | 自动分类、收录和验证 GitHub dsh-plugin Topic 项目的静态 DSH 插件市场。 A static DSH plugin marketplace that automatically categorizes, curates, and verifies GitHub dsh-plugin Topic projects. |
| [dsh-web-plugin-manager](https://github.com/LX2000WASD/dsh-web-plugin-manager) | [@LX2000WASD](https://github.com/LX2000WASD) | 在 Web UI 中一键管理 DeepSeek Harness (DSH) 插件：查看、实时启停、安装/卸载、更新检测、健康检查（依赖/冲突/兼容性分析）、环境管理、插件市场。bundle 与非 bundle 插件全覆盖 |
| [Tydora](https://github.com/zuorn/Tydora) | [@zuorn](https://github.com/zuorn) | Let Your Ideas Flow — Tydora is a modern desktop Markdown editor combining WYSIWYG editing, bidirectional links, mind maps, and an infinite canvas — empowering deep thinking and effortless expression. |
| [dsh-memento](https://github.com/PerryLink/dsh-memento) | [@PerryLink](https://github.com/PerryLink) | Bounded, layered, approval-gated, auditable cross-session memory for DeepSeek Harness (capability seam: ctx.memory + SQLite provider + memory tool + frozen snapshot injection) |
| [dsh-toy](https://github.com/c3ll256/dsh-toy) | [@c3ll256](https://github.com/c3ll256) | Toy Control Protocol for DSH |
| [plugin-registry](https://github.com/vlln/plugin-registry) | [@vlln](https://github.com/vlln) | DSH 插件生态基建：薄控制台（浏览器面板管理官方 repository 插件，0 patch）+ make-dsh-plugin skill 官方插件开发引导 |
| [dsh-stock-watch](https://github.com/Awu12277/dsh-stock-watch) | [@Awu12277](https://github.com/Awu12277) | A股自选股实时行情盯盘插件 - DeepSeek Harness Web 右上角可折叠弹窗 |
| [SpecFusion](https://github.com/wxkingstar/SpecFusion) | [@wxkingstar](https://github.com/wxkingstar) | 在 DeepSeek Harness / Claude Code / Cursor / Codex / Gemini CLI 里直接搜索 20 个中国开放平台的 65,600+ 篇 API 文档；零配置，支持 Skill 与 DSH 原生插件。 |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | [@omdsh-dev](https://github.com/omdsh-dev) | Open DeepSeek Harness workspace directories in VS Code directly from the web GUI. |
| [dsh-multica-runtime](https://github.com/multica-ai/dsh-multica-runtime) | [@multica-ai](https://github.com/multica-ai) | Support dsh runtime on Multica. |
| [local-shell-mcp](https://github.com/fwerkor/local-shell-mcp) | [@fwerkor](https://github.com/fwerkor) | Enables LLM to use a cli environment.  |
| [mstar-harness](https://github.com/btspoony/mstar-harness) | [@btspoony](https://github.com/btspoony) | A Skill-driven Harness/Loop Engineering Workflow Agent Plugin |
| [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | [@LaplaceYoung](https://github.com/LaplaceYoung) | oh-my-dsh：面向 DSH (DeepSeek Harness) 的插件生态——700+ 插件，只通过扩展接缝注册，不修改 agent-loop 骨架 |
| [dsh-notifier](https://github.com/THEWOLFWALKER/dsh-notifier) | [@THEWOLFWALKER](https://github.com/THEWOLFWALKER) | Unified notification push plugin for DeepSeek Harness (DSH): one minimal notify() API, 8 channel adapters (telegram/dingtalk/feishu/wxpusher/pushplus/serverchan/bark/webhook), dual trigger (auto session events + agent tool). |
| [deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin) | [@HeiGeAi](https://github.com/HeiGeAi) | DeepSeek Harness 换肤系统：21 套内置皮肤 + 一张图生成整套配色的自定义皮肤。数据源驱动，保对比度推导，构建期校验可读性。 |
| [dsh-navbar](https://github.com/vlln/dsh-navbar) | [@vlln](https://github.com/vlln) | DSH 插件：对话节点导航条（右缘节点串快速跳转 user 消息）。官方 bundle 插件，dsh plugin --profile web add 安装 |
| [deepseek-harness-desktop](https://github.com/xiincs/deepseek-harness-desktop) | [@xiincs](https://github.com/xiincs) | DeepSeek Harness 原生桌面版，基于 Tauri 2，内置 Node.js 运行时，一键安装，极速启动，托盘常驻，自动更新。DeepSeek Harness native desktop version: built on Tauri 2 with a bundled Node.js runtime. |
| [dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) | [@whiteguo233](https://github.com/whiteguo233) | OpenBiliClaw 是本地运行的跨平台个性化内容推荐 Agent，持续理解你的兴趣并主动找内容。本仓库是它的 DeepSeek Harness 插件：DSH 界面常驻第四栏（推荐/内容库/对话/画像/设置），注册 22 个 Agent Bridge 工具，让 Agent 也能读推荐、答探测、闭环学习。 |
| [dsh-deepseek-flow](https://github.com/kanghelyu/dsh-deepseek-flow) | [@kanghelyu](https://github.com/kanghelyu) | - Markdown 是唯一事实来源——一份总控 WORKFLOW.md，每个步骤拥有独立的 STEP.md 工作区。 |
| [dsh-suite](https://github.com/whyihaveyou/dsh-suite) | [@whyihaveyou](https://github.com/whyihaveyou) | The living DeepSeek Harness plugin directory — refreshed hourly, compat-tested daily, with an in-app plugin store and scaffolder. DSH 插件活目录：每小时刷新，每日兼容实测，内置插件商店与脚手架。 |
| [deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) | [@openma-ai](https://github.com/openma-ai) | TUI Plugin of DeepSeek Harness 让DeepSeek Harness在终端跑起来 |
| [ui-status-label](https://github.com/alingalingling/ui-status-label) | [@alingalingling](https://github.com/alingalingling) | 把你鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子 |
| [allinluna](https://github.com/zenx0x/allinluna) | [@zenx0x](https://github.com/zenx0x) | Resource-aware multi-agent orchestration for Codex and DeepSeek Harness (All in Flash DSH plugin) |
| [dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) | [@HuanLinOTO](https://github.com/HuanLinOTO) | 向模型暴露 MinerU 文档解析工具，将 PDF/图片/DOCX/PPTX/XLSX 转为结构化 Markdown/JSON \| Exposes MinerU document-parsing tools to the model, converting PDF/images/DOCX/PPTX/XLSX into structured Markdown/JSON |
| [dsh-lark](https://github.com/omdsh-dev/dsh-lark) | [@omdsh-dev](https://github.com/omdsh-dev) | Lark/Feishu IM bot channel for DeepSeek Harness \| 飞书 DeepSeek Harness （DSH）插件 |
| [dsh-vision](https://github.com/william-jin-cmu/dsh-vision) | [@william-jin-cmu](https://github.com/william-jin-cmu) | dsh 插件：给纯文本 DeepSeek 加视觉——view_image 工具桥接任意 OpenAI 兼容 VLM（默认智谱免费档，实测 4 厂商 10 模型） |
| [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) | [@Chinesezjc](https://github.com/Chinesezjc) | Cross-instance message/event handoff plugins for DSH (interconnect service + tools) |
| [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) | [@Moeblack](https://github.com/Moeblack) | DSH 插件：分支式消息编辑、重掷、重试与版本时间线 \| DSH plugin: branch-based message editing, reroll, retry, version timeline |
| [deepseek-pet](https://github.com/keleus/deepseek-pet) | [@keleus](https://github.com/keleus) | 在你的deepseek-harness上养一只吃白饭的大蓝鲸 |
| [dshcode](https://github.com/whitelonng/dshcode) | [@whitelonng](https://github.com/whitelonng) | Community desktop companion for DeepSeek Harness — one-click Electron app for macOS and Windows |
| [opc-nexus](https://github.com/h4dex/opc-nexus) | [@h4dex](https://github.com/h4dex) | 开源的企业版的数字员工工作台, OPC-Nexus（One Person Company Nexus）是一款本地优先的桌面 AI Agent 管理器。它为单人公司 / 独立开发者提供统一的 AI 数字员工管理平台 —— 从 Agent 创建、任务编排、多引擎接入，到消息渠道集成、工作流自动化和专家团协作，一站式覆盖。 （原内部项目AiBoxDash）  |
| [dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) | [@lhh010](https://github.com/lhh010) | 【求⭐】🐋DSH Web UI 全手绘像素鲸鱼伙伴插件：会话标题栏常驻，平时眨眼/偶尔摆尾/动胸鳍，思考运行时持续动起来，回合完成头顶喷水，点击还会冒爱心，不工作时还会偷懒睡觉，零核心改动。 【喜欢的话就点点star⭐吧~】 |
| [dsh-share](https://github.com/hellodigua/dsh-share) | [@hellodigua](https://github.com/hellodigua) | DSH 对话分享插件，分享单轮或多轮对话，可导出为图片或 Markdown。Share DSH Q&As or selected conversation groups as PNG or Markdown. |
| [agent-handoff-skill](https://github.com/WeirdSky924/agent-handoff-skill) | [@WeirdSky924](https://github.com/WeirdSky924) | Use this cross-platform skill in Codex or Claude Code to establish repository-local continuity memory so a future agent can recover objective, status, decisions, validation, risks, and next actions without relying on previous chat history. |
| [dsh-computer-use](https://github.com/Anionex/dsh-computer-use) | [@Anionex](https://github.com/Anionex) | 为 DeepSeek Harness 提供电脑控制插件：新鲜 Accessibility 观测、过期状态拒绝、作用域权限与安全输入（目前支持macos）｜Accessibility-first macOS Computer Use bundle for DSH with fresh observations, stale-state rejection, scoped permissions, and safe input. |
| [dsh-plugin-marketplace](https://github.com/AwesomeHou/dsh-plugin-marketplace) | [@AwesomeHou](https://github.com/AwesomeHou) | Plugin marketplace for DeepSeek Harness — live-syncs the GitHub dsh-plugin topic (1800+ repos) into a searchable, paginated settings tab with one-click install and agent tools (market_search / market_install). |
| [dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) | [@yyyyukari](https://github.com/yyyyukari) | Steam Workshop-style plugin browser for the DeepSeek Harness (DSH) Web UI - zero-server: GitHub-powered search, trending windows, Chinese search & bilingual translation, plugin-signature filtering, and smart one-click install/update/uninstall with an installed-plugins manager. |
| [HoloGram](https://github.com/834063245-creator/HoloGram) | [@834063245-creator](https://github.com/834063245-creator) | 3D code dependency graph generator with built-in LLM agent. Language-agnostic (Python, TypeScript, Rust, Go, Java, C/C++, C#, Ruby, Kotlin, Swift, PHP, Lua). Coupling depth analysis, constraint gating, real-time file watching. Tauri 2 + Three.js + Rust engine.跨语言代码依赖拓扑图生成器 · 14 门语言统一 IR · 3D 全息星图 · 内置 AI Agent 双向联动 · 四级耦合诊断 · 桌面应用 / CLI 双模 |
| [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) | [@omdsh-dev](https://github.com/omdsh-dev) | Create and manage sandboxed JavaScript tools for DeepSeek Harness with a Monaco editor and model-driven tool lifecycle. |
| [dsh-xiaoyao-skins](https://github.com/147228/dsh-xiaoyao-skins) | [@147228](https://github.com/147228) | 夕小瑶 × DeepSeek Harness Web 皮肤合集、安装器与社区创作工具链 |
| [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) | [@omdsh-dev](https://github.com/omdsh-dev) | DSH 插件健康检查工具：扫描插件仓库的清单协议 / patch 格式 / 构建陷阱 / hub 收录状态，零依赖只读，注册 plugin_check 工具 |
| [DSH-Desktop](https://github.com/JustGenius-s/DSH-Desktop) | [@JustGenius-s](https://github.com/JustGenius-s) | DSH-Desktop |
| [dsh-plugin-cc](https://github.com/cpj-dev/dsh-plugin-cc) | [@cpj-dev](https://github.com/cpj-dev) | Bridge Deepseek-harness into Claude Code for review, critique, delegation, and session import. |
| [dsh-plugin-template](https://github.com/bugmaker2/dsh-plugin-template) | [@bugmaker2](https://github.com/bugmaker2) | Template for deepseek-harness plugin development. |
| [Co-Engram](https://github.com/Co-Engram/Co-Engram) | [@Co-Engram](https://github.com/Co-Engram) | Self-evolving team memory |
| [dskin](https://github.com/dancingmemory/dskin) | [@dancingmemory](https://github.com/dancingmemory) | DSKIN · DeepSeek Harness（DSH）卡通像素皮肤插件 / Cartoon pixel skin plugin for DSH Web GUI — 原始界面不动，像素宠物会散步、眨眼、跳跃 / living pixel pets that stroll, blink and hop |
| [dsh-model-router](https://github.com/tianji-qingtian/dsh-model-router) | [@tianji-qingtian](https://github.com/tianji-qingtian) | 模型路由与成本优化器：简单问题 flash 直答、故障自动降级、会话 token/缓存/成本实时面板 \| Model router & cost optimizer for DeepSeek Harness: flash quick-answers for simple questions, failure fallback, live token/cache/cost panel |

共收录 148 个插件，官方插件优先展示；数据来源与更新时间见 [docs/plugins.json](docs/plugins.json)。

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
│   ├── plugins.json            # 社区插件单一数据源（发现/审查驱动）
│   └── official-plugins.json   # 官方预设插件独立数据（不参与社区审查）
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
