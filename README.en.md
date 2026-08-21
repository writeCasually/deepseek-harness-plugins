# DeepSeek Harness Plugin Index

[中文](README.md) | English

A project for collecting, presenting, and safely reviewing community plugins for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH). The plugin list is
available both as a website and this README. A daily workflow searches GitHub repositories with
the `dsh-plugin` topic, performs a static security review, and adds qualifying plugins to the
index.

Directory page (GitHub Pages):

[https://writeCasually.github.io/deepseek-harness-plugins/](https://writeCasually.github.io/deepseek-harness-plugins/)

## About

DeepSeek Harness is built around the idea that everything is a plugin. The community has produced
many plugins, skins, and distributions around it. This project brings those
GitHub-hosted projects together so developers can quickly find plugins by name, author, and
capability.

Main capabilities:

- Web index page: search, filter by category and official status, and view each plugin name,
  author, description, and project link.
- Single data source: `docs/plugins.json` drives both the website and the README plugin list.
- Multilingual descriptions: when a plugin repository has concise `README.zh*.md` /
  `README.en*.md` files, the website displays the matching description with Chinese preferred and
  English as fallback.
- DSH compatibility check: plugins are included only when they can be confirmed to run in
  DeepSeek Harness.
- Layered security and privacy review: non-official plugins get evidence-based static scanning
  (dangerous commands / code execution / leaked secrets / obfuscation) plus supply-chain checks
  (OSV), with optional LLM deep review; reviews are traceable (commit, evidence, coverage).
  See [docs/security-review.md](docs/security-review.md).
- Official first: DeepSeek AI official plugins are displayed before community plugins.
- Human review entry point: automated discoveries are submitted as pull requests and are published
  after merge.

## Official preset plugins

DSH ships a set of official built-in plugins (`@deepseek-ai/*`, under the official
[packages/](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages) directory). Their
descriptions are **maintained independently** and are **not** part of the community discovery or
security-review workflow:

- Independent data source: `docs/official-plugins.json` (`plugins` array holds 210 built-in plugins).
- Rendered in a separate "Official preset plugins" block on the website. The discovery/review
  scripts (`scripts/*`) and `.github/workflows/*` only read/write `docs/plugins.json` and never
  rewrite or review the official data file.

Deployable official profile bundles:

| Package | Description |
| --- | --- |
| [`@deepseek-ai/dsh-base`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle/base) | Shared dsh core as a profile bundle: every profile's first patch layer inserting the full base plugin set. |
| [`@deepseek-ai/dsh-web-app`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle/web-app) | The browser-surface bundle: the web patch layer over `dsh-base` plus runtime glue plugins. |
| [`@deepseek-ai/dsh-headless`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle/headless) | One-shot bundle: direct core Agent/Session runner with no Host, HTTP, or browser layer. |

Full list with per-package descriptions is in [docs/official-plugins.json](docs/official-plugins.json).

## Plugin List

<!-- PLUGINS_START -->

| Plugin | Author | Description |
| --- | --- | --- |
| [reactive-resume](https://github.com/amruthpillai/reactive-resume) | [@amruthpillai](https://github.com/amruthpillai) | A one-of-a-kind resume builder that keeps your privacy in mind. Completely secure, customizable, portable, open-source and free forever. Try it out today! |
| [voyager](https://github.com/Nagi-ovo/voyager) | [@Nagi-ovo](https://github.com/Nagi-ovo) | Enhancement suite for Gemini, AI Studio, Claude & ChatGPT — plus a prompt manager for any web UI, DeepSeek Harness included. / 面向 Gemini、AI Studio、Claude 与 ChatGPT 的增强套件；提示词管理器可用于任意 Web UI，含 DeepSeek Harness。 |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | [@awesome-dsh-plugin](https://github.com/awesome-dsh-plugin) | A curated list of plugins for DeepSeek Harness (dsh) · DeepSeek Harness 插件精选列表 |
| [ouroboros](https://github.com/Q00/ouroboros) | [@Q00](https://github.com/Q00) | Agent OS: the agent gets smarter on its own. We just hold the line: the grading command and expected result never make it into the success contract we hand it. Interview-gated, staged evaluation, budgeted evolution loop. MCP server, 13 runtimes: Claude Code, Codex CLI, Gemini CLI, OpenCode, Copilot, Kiro and more. |
| [dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) | [@xiaobright](https://github.com/xiaobright) | Two-phase DeepSeek Harness preset: Minimal-aligned bootstrap, then full Standard tools (Project2 98/99) |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | [@Small-tailqwq](https://github.com/Small-tailqwq) | Whale Girl skin series for DeepSeek Harness. 适用于 DeepSeek Harness 的，鲸鱼娘系列皮肤。 |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | [@AdamPlatin123](https://github.com/AdamPlatin123) | 前部索引仓库（Radar）：自动扫描发现所有 dsh 插件候选，经测试合格的移入后序精选目录仓库。 |
| [Aegis](https://github.com/GanyuanRan/Aegis) | [@GanyuanRan](https://github.com/GanyuanRan) | Make AI coding agents architecture-aware: baseline-first, evidence-verified, drift-checked, and safe across long tasks. |
| [agentrq](https://github.com/agentrq/agentrq) | [@agentrq](https://github.com/agentrq) | AgentRQ: Human-in-loop realtime conversational task manager for AI Agents. Self-hosted! Control your own agents from wherever you want Mobile, Web, Desktop. Designed to work well with your own Claude subscriptions and any harness. |
| [api-relay-audit](https://github.com/toby-bridges/api-relay-audit) | [@toby-bridges](https://github.com/toby-bridges) | Local security audit for AI API relays and LLM proxies: detects prompt injection, model substitution, tool-call rewriting, SSE anomalies, error leakage, and Web3 wallet risks. |
| [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | [@0xsline](https://github.com/0xsline) | DeepSeek Harness (DSH) ecosystem: curated plugins, tools, and infrastructure from dsh-external/hub and the public dsh-plugin topic. |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | [@NanmiCoder](https://github.com/NanmiCoder) | dsh-agent-teams turns the current DeepSeek Harness session into a captain that can assemble durable sub-agents, split a goal into dependency-aware tasks, and coordinate work through direct messages. |
| [working-activity](https://github.com/ccch1mneyyy/working-activity) | [@ccch1mneyyy](https://github.com/ccch1mneyyy) | Lively Working-line extension for pi CLI and DSH |
| [dsh-context](https://github.com/bowenliang123/dsh-context) | [@bowenliang123](https://github.com/bowenliang123) | Best DeepSeek Harness plugin for context insight and management, with context dashboard / browser and context command, for context statistics, composition, breakdown, evolution details, understanding how the context is made of, and how it evolves. 一站式 DeepSeek Harness 上下文可视化插件，Context 面板及浏览器与 Context 命令，透视上下文组成、演进、压缩、剪枝等事件与动作。 |
| [sandbase-harness](https://github.com/sandbaseai/sandbase-harness) | [@sandbaseai](https://github.com/sandbaseai) | Local-first AI agent runtime with sandboxed sessions, MCP tools, memory, credentials, audit/replay, and a built-in console. Run OpenAI, Anthropic, MiniMax, DeepSeek V4, and OpenAI-compatible models on your infrastructure. |
| [dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | [@Electricitysheep](https://github.com/Electricitysheep) | DeepSeek Harness (dsh) 从 0 到 1 深度手册：安装/插件开发/性能调优/实测案例/同模型多 Agent 实测对比（中文 + 英文 PDF） |
| [graph-memory](https://github.com/adoresever/graph-memory) | [@adoresever](https://github.com/adoresever) | Deepseek Harness、Openclaw知识图谱记忆插件。2026年4月受邀发布在清华大学讨论会。Knowledge Graph + Memory；Knowledge Graph Context Engine for OpenClaw — extracts structured triples from conversations, compresses context 75%, enables cross-session experience reuse |
| [memtrace-public](https://github.com/syncable-dev/memtrace-public) | [@syncable-dev](https://github.com/syncable-dev) | Structural memory for AI coding agents. Bi-temporal graph, MCP-native, zero LLM calls. Cursor · Claude Code · Codex · DeepSeek Harness · Hermes · VS Code · Windsurf. |
| [superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | [@superdesigndev](https://github.com/superdesigndev) | The design skill for Claude Code, Cursor and any coding agent. Stop shipping AI-slop UI: turn it into shippable, tasteful frontend. Install: npx skills add superdesigndev/superdesign-skill. Powered by superdesign.dev |
| [AI-Novel-Writer](https://github.com/EthanYoQ/AI-Novel-Writer) | [@EthanYoQ](https://github.com/EthanYoQ) | 本地优先 AI 小说创作工作台，提供 Windows/macOS 桌面版与 DeepSeek Harness 插件开发预览，支持角色、大纲、章节蓝图、审稿修稿和本地模型。 |
| [anolisa](https://github.com/alibaba/anolisa) | [@alibaba](https://github.com/alibaba) | ANOLISA (Agentic Nexus Operating Layer & Interface System Architecture) \| Agentic OS with runtime, security, observability, and Tokenless response compression for lower token usage and cost. |
| [dsh-browser](https://github.com/Lum1104/dsh-browser) | [@Lum1104](https://github.com/Lum1104) | dsh plugin: Chrome sidebar extension that lets DeepSeek Harness operate your browser directly, no vision capabilities required. 一款 Chrome 侧边栏扩展程序，可让 DeepSeek Harness 直接操控您的浏览器，无需视觉能力。 |
| [DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin) | [@WYH66666666](https://github.com/WYH66666666) | 是一层高自由度的玻璃质感主题，套在 DeepSeek Harness 网页端。顶栏、侧边栏、输入框、统计行、轨迹视图都成了磨砂玻璃片。玻璃模糊度、磨砂度、背景（流体或自定义壁纸，壁纸还能单独调模糊和磨砂）全都能在设置卡片里自由调节。关掉开关就回到原生界面，不改 DSH 任何一行源码。 |
| [harmony-next.skills](https://github.com/linhay/harmony-next.skills) | [@linhay](https://github.com/linhay) | 🚀 Expert guidance for HarmonyOS NEXT (API 12+) development. Covers IDE operations, performance tuning, architecture (HAP/HAR/HSP), and automation testing. |
| [dsh-im](https://github.com/xmanrui/dsh-im) | [@xmanrui](https://github.com/xmanrui) | 通过扫码或机器人凭据把IM机器人接入DeepSeek Harness（支持飞书、微信、钉钉、企业微信、QQ、Slack、Telegram、Discord和WhatsApp）。 Connect IM bots to DeepSeek Harness via QR code or credentials (9 channels). |
| [dsh-pet](https://github.com/PC2005-cloud/dsh-pet) | [@PC2005-cloud](https://github.com/PC2005-cloud) | DSH 桌面宠物：一行命令安装现成宠物（28 个透明动画，即装即用），或内置素材链从 AI 视频自造专属宠物 \| One-line install desktop pet for DeepSeek Harness + DIY asset pipeline |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | [@bruc3van](https://github.com/bruc3van) | 用 30 秒找到适合你的 DeepSeek Harness 插件：告诉你插件解决什么问题、适合谁、从哪里开始。 |
| [oh-dsh](https://github.com/hust-open-atom-club/oh-dsh) | [@hust-open-atom-club](https://github.com/hust-open-atom-club) |  一套 DSH runtime，Desktop、Web 与 TUI 三种开发体验。 |
| [DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget) | [@MeteorNOX](https://github.com/MeteorNOX) | DeepSeek Harness（DSH）一只住在 DSH 界面右下角的小鲸鱼娘，帮你盯着DeepSeek账户余额。QQ弹弹，支持拖拽吸附、左吸附翻转、数字滚动动画，随界面自动启用，建议直接喊来你的dsh安装 |
| [Awesome-DeepSeek-Harness-Plugins](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins) | [@Zhiyuan-Fan](https://github.com/Zhiyuan-Fan) | Curated DeepSeek Harness (DSH) plugins, extensions, tools, skills, clients, runtimes, integrations, and verified references — English and Chinese. |
| [nuphus-mcp](https://github.com/mrpulor-gh/nuphus-mcp) | [@mrpulor-gh](https://github.com/mrpulor-gh) | Desktop automation MCP server — computer use for any AI agent: control screen, windows, mouse/keyboard, and Chrome via Model Context Protocol (stdio) |
| [deepseek-design](https://github.com/Devin-AXIS/deepseek-design) | [@Devin-AXIS](https://github.com/Devin-AXIS) | DeepSeek Harness 可编辑设计系统：AI 生成、可视化编辑、模板市场与 PPT｜Native Design & PPT Studio for DeepSeek Harness. |
| [Polaris](https://github.com/ZJU-REAL/Polaris) | [@ZJU-REAL](https://github.com/ZJU-REAL) | Toward Autonomous Scientific Discovery |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | [@Nagi-ovo](https://github.com/Nagi-ovo) | 在 DSH 对话中生成交互式可视化｜Render model-generated interactive cards inside DSH conversations |
| [dshfind](https://github.com/hikariming/dshfind) | [@hikariming](https://github.com/hikariming) | DSH (DeepSeek Harness) 原理学习、插件市场与最佳实践 · Learn DSH principles, plugin marketplace & best practices |
| [open-sea-skin](https://github.com/d-dev0101/open-sea-skin) | [@d-dev0101](https://github.com/d-dev0101) | WebGPU ocean skin for DeepSeek Harness — DSH plugin, Harness-only Chrome/Edge extension, static installer, and native integration. |
| [awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) | [@libukai](https://github.com/libukai) | DeepSeek Harness 终极指南：快速入门、资源推荐、精选插件与实用工具 ｜The Ultimate Guide to DeepSeek Harness: QuickStart, Resources, Plugins&Toolkit |
| [anysearch-dsh](https://github.com/anysearch-team/anysearch-dsh) | [@anysearch-team](https://github.com/anysearch-team) | AnySearch web search provider and advanced search tools for DeepSeek Harness (DSH) |
| [engramory](https://github.com/tinqiao-oss/engramory) | [@tinqiao-oss](https://github.com/tinqiao-oss) | A portable memory protocol for AI agents — load it as standing rules; a curation discipline + reference spec + optional cap hook. |
| [dsh-pentest](https://github.com/howmp/dsh-pentest) | [@howmp](https://github.com/howmp) | 面向 DeepSeek Harness（dsh）的渗透测试模式  @CloverSecLabs |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | [@Ruler4396](https://github.com/Ruler4396) | DeepSeek Harness 的 Windows 轻量启动器：开机自启 + 独立小窗口，双击即用。 |
| [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | [@Nagi-ovo](https://github.com/Nagi-ovo) | Ask DSH, "is there a plugin for this?" It searches the GitHub dsh-plugin topic, explains the best matches, waits for your choice, then installs and verifies the selected plugin. |
| [deepseek-harness-desktop](https://github.com/ningbainb/deepseek-harness-desktop) | [@ningbainb](https://github.com/ningbainb) | Open-source Windows desktop client and GUI for DeepSeek Harness — zero-setup installer with Codex, plugins, skills, SSH, mobile remote access, and 11 skins. |
| [anime-find](https://github.com/cocofhu/anime-find) | [@cocofhu](https://github.com/cocofhu) | DeepSeek Harness 搜番插件：对话内多源搜索番剧，卡片展示 Bangumi 评分与详情，支持复制磁力。 |
| [pi2dsh](https://github.com/weijiafu14/pi2dsh) | [@weijiafu14](https://github.com/weijiafu14) | Bridge the Pi and DeepSeek Harness ecosystems: one Pi Host ABI runs unmodified Pi extensions as native DSH plugins. 打通 Pi 与 DSH 生态。 |
| [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) | [@omdsh-dev](https://github.com/omdsh-dev) | Three-tier memory control plane for DeepSeek Harness: persistent runtime context, searchable project documents, pluggable long-term memory, smart routing, supervised agent workflows, WebUI, and headless tools. |
| [dsh-gitbash-preset](https://github.com/liceses/dsh-gitbash-preset) | [@liceses](https://github.com/liceses) | DeepSeek Harness 插件：一键安装「极简模式 (Git Bash)」agent preset —— 把 DSH 自带极简模式中的 bash 调用映射到 Git for Windows 的 bash（MSYS），让 Windows 上的极简模式真正可用。 |
| [dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) | [@ZSeven-W](https://github.com/ZSeven-W) | The DeepSeek Harness plugin for OpenPencil — preview, inspect, and edit real .op documents inside a conversation. |
| [dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) | [@yjh051108](https://github.com/yjh051108) | > ## 🎉 v0.3.0 重大声明（2026-08-14） > > 从经验补丁到源码契约——注入器完成规范重构。 |
| [cetus](https://github.com/drewnekota/cetus) | [@drewnekota](https://github.com/drewnekota) | One macOS app for Claude Code, Codex, and every agent runtime you use — scheduled runs, global hotkey launcher, per-run git worktrees, one review board. |
| [dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin) | [@kingOfSoySauce](https://github.com/kingOfSoySauce) | DeepSeek Harness 滑动变阻器皮肤 |
| [dsh-noema](https://github.com/ZSeven-W/dsh-noema) | [@ZSeven-W](https://github.com/ZSeven-W) | Noema long-term memory plugin for DSH: durable, inspectable agent memory with recall tools and a settings page. |
| [TokenLedger](https://github.com/zh667/TokenLedger) | [@zh667](https://github.com/zh667) | Relay-site attributed token usage for DeepSeek Harness — zero config, no credentials |
| [gal-view](https://github.com/Ayase34/gal-view) | [@Ayase34](https://github.com/Ayase34) | 把dsh会话界面切换成galgame游戏界面的插件 |
| [dsh-agent-team-gui](https://github.com/toolclub/dsh-agent-team-gui) | [@toolclub](https://github.com/toolclub) | Persistent multi-model workflow teams for DeepSeek Harness — dynamic lead planning, bounded DAGs, per-agent model/tools, Run Center and Token insights. |
| [humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) | [@Vladimir-Human](https://github.com/Vladimir-Human) | Скилл для ИИ-агентов: находит и убирает следы машинной генерации из русского текста. 38 паттернов, 39 regex-маркеров с реестром доказательств, слепые парные прогоны, файловый слой снятия C2PA/EXIF/XMP \| Russian AI-writing humanizer skill with file metadata cleaning |
| [dsh-image-gen](https://github.com/shanliuling/dsh-image-gen) | [@shanliuling](https://github.com/shanliuling) | Generate images directly in DeepSeek Harness chats |
| [dshcode](https://github.com/whitelonng/dshcode) | [@whitelonng](https://github.com/whitelonng) | Community desktop companion for DeepSeek Harness — one-click Electron app for macOS and Windows |
| [dsh-undo-plugin](https://github.com/lire1131/dsh-undo-plugin) | [@lire1131](https://github.com/lire1131) | DSH crash-rescue plugin: undo config & plugin-code changes, secret-safe snapshots, one-click SAFE MODE, plus offline CLI/GUI that work even when DSH won't boot. |
| [argo](https://github.com/taxueseek/argo) | [@taxueseek](https://github.com/taxueseek) | 专门为 agent 打造的 agent 搜索工具，具备多语言搜索能力，覆盖中文/英文/学术/代码/购物/金融/新闻/百科。 |
| [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) | [@omdsh-dev](https://github.com/omdsh-dev) | Connect DSH to your database for conversational data analysis and actionable business insights. |
| [dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) | [@Ychris12138](https://github.com/Ychris12138) | Provider balances, subscription quotas, and token-usage analytics for the DeepSeek Harness Web GUI (dsh web). |
| [dsh-mobile-apk](https://github.com/kelai141/dsh-mobile-apk) | [@kelai141](https://github.com/kelai141) | dsh 安卓壳 APK——WebView UI + 内嵌 Termux 运行时快照（解压即跑）、SAF 目录桥、保活服务、看门狗、运行时在线更新。 |
| [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) | [@beancookie](https://github.com/beancookie) | Awesome DeepSeek Harness (DSH) Plugin |
| [dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) | [@HanaAyane](https://github.com/HanaAyane) | DSH适用的Codex风格的思考强度滑块，以及大肥鱼跑步滑块。Codex-style model and reasoning-effort slider for DeepSeek Harness |
| [dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) | [@Anionex](https://github.com/Anionex) | deepseek harness对话和代码状态回退插件 \| DSH — rewind conversation and workspace state, powered by a persistent Change Ledger |
| [dsh-plugin](https://github.com/Tabbit-Browser/dsh-plugin) | [@Tabbit-Browser](https://github.com/Tabbit-Browser) | 这是一个 Tabbit 浏览器为 Deepseek Harness 提供的一个 plugins。你可以在 Deepseek Harness 中安装这个插件，给 Deepseek Harness 提供控制 Tabbit 浏览器的能力。 |
| [dsh-skill-mcp-panel](https://github.com/Fishquito7/dsh-skill-mcp-panel) | [@Fishquito7](https://github.com/Fishquito7) | DSH Web UI plugin: skill and MCP management（Web界面的skill/MCP管理工具） |
| [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) | [@Nwflower](https://github.com/Nwflower) | Import 14+ external agent chat histories (Claude Code, Codex, ChatGPT, Cursor, Gemini, Reasonix, opencode, ZCode, Grok Build, OpenClaw, Pi, Hermes, Kimi CLI, DSH) into DeepSeek Harness as resumable sessions — full-fidelity, reverse export/sync, bundle backup. \| 从 Claude Code、Codex、Reasonix 等 Agent 工具导入历史消息到 DeepSeek Harness 并继续对话。 |
| [dsh-vision](https://github.com/oil-oil/dsh-vision) | [@oil-oil](https://github.com/oil-oil) | Near-native image understanding for DeepSeek Harness |
| [dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider) | [@Mars-Sea](https://github.com/Mars-Sea) | Unofficial DeepSeek Harness LLM provider plugin for Command Code: live model catalog, reasoning-effort support, Models-page card. Ported from pi-commandcode-provider (MIT). |
| [tokenbank](https://github.com/wink-run/tokenbank) | [@wink-run](https://github.com/wink-run) | Token Bank — the local LLM gateway that sits between your AI agents and every provider.  Know where tokens go · Spend less with smart routing to Ollama, Groq, GitHub Models · Earn by sharing idle quota on a community P2P network.  One-click onboarding for Cursor, Claude Code, Codex CLI, Gemini CLI — no agent changes. Full trace, seamless model swap |
| [hello-dsh](https://github.com/pingfanfan/hello-dsh) | [@pingfanfan](https://github.com/pingfanfan) | 从零开始，看懂 DeepSeek Harness 的「万物皆可插件」— 零基础插件开发教程（含 22 个中文技能实例）\| Zero-to-plugin tutorial for DeepSeek Harness |
| [dsh-kun-like-pet](https://github.com/liyupi/dsh-kun-like-pet) | [@liyupi](https://github.com/liyupi) | Kun Like 桌宠 —— DeepSeek Harness 桌面宠物插件：右下角小坤宠随 Agent 工作状态切换 9 种动作，任务完成播放「你干嘛~哎哟」 |
| [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | [@Alex-Yanggg](https://github.com/Alex-Yanggg) | A meticulously curated list of useful plugins, extensions, tools and development resources built for DSH, covering productivity enhancement, functional expansion, debugging utilities and custom development modules. |
| [dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot) | [@tencent-connect](https://github.com/tencent-connect) | 让 QQ Bot 接入 DeepSeek Harness（dsh）的官方插件 |
| [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin) | [@awesome-dsh-plugin](https://github.com/awesome-dsh-plugin) | Find DSH plugins inside the agent — live GitHub dsh-plugin topic search, star-ranked / 会话内搜索发现 DSH 插件 |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | [@omdsh-dev](https://github.com/omdsh-dev) | Desktop notifications for DeepSeek Harness turn completions, with per-outcome controls and include/exclude keyword rules. |
| [forkprobe](https://github.com/Jayden-X-L/forkprobe) | [@Jayden-X-L](https://github.com/Jayden-X-L) | Compare multiple skills on the same task and pick the winner. |
| [dsh-automation](https://github.com/titanwings/dsh-automation) | [@titanwings](https://github.com/titanwings) | DSH 自动化插件：让 Coding 任务按计划在全新 Agent Session 中运行，并由用户或 Agent 创建和管理定时任务。 / Run coding tasks in fresh Agent sessions and manage schedules from DSH Web or an Agent. |
| [Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | [@like-study1](https://github.com/like-study1) | 🐳 DeepSeek Harness 插件聚合社区 — 自动同步 dsh-plugin 生态 · 精选目录 · 每 4 小时自动维护 \| Oh-My-DSH: a community-maintained catalog of DeepSeek Harness plugins, auto-synced from the dsh-plugin topic |
| [ru-marketplace-mcp](https://github.com/Vladimir-Human/ru-marketplace-mcp) | [@Vladimir-Human](https://github.com/Vladimir-Human) | Девять российских маркетплейсов и китайский Taobao как MCP-серверы: Wildberries, Ozon, Яндекс Маркет, Детский мир, Авито, Мегамаркет, Lamoda, DNS, Ситилинк. Плюс сравнение цен по всем сразу. Только чтение, ключи не нужны. |
| [dsh-web-plugin-manager](https://github.com/LX2000WASD/dsh-web-plugin-manager) | [@LX2000WASD](https://github.com/LX2000WASD) | 在 Web UI 中一键管理 DeepSeek Harness (DSH) 插件：查看、实时启停、安装/卸载、更新检测、健康检查（依赖/冲突/兼容性分析）、环境管理、插件市场。bundle 与非 bundle 插件全覆盖 |
| [dsh-toy](https://github.com/c3ll256/dsh-toy) | [@c3ll256](https://github.com/c3ll256) | Toy Control Protocol for DSH |
| [plugin-registry](https://github.com/vlln/plugin-registry) | [@vlln](https://github.com/vlln) | DSH 插件生态基建：薄控制台（浏览器面板管理官方 repository 插件，0 patch）+ make-dsh-plugin skill 官方插件开发引导 |
| [dsh-notifier](https://github.com/THEWOLFWALKER/dsh-notifier) | [@THEWOLFWALKER](https://github.com/THEWOLFWALKER) | Unified notification push plugin for DeepSeek Harness (DSH): one minimal notify() API, 8 channel adapters (telegram/dingtalk/feishu/wxpusher/pushplus/serverchan/bark/webhook), dual trigger (auto session events + agent tool). |
| [SpecFusion](https://github.com/wxkingstar/SpecFusion) | [@wxkingstar](https://github.com/wxkingstar) | 在 DeepSeek Harness / Claude Code / Cursor / Codex / Gemini CLI 里直接搜索 20 个中国开放平台的 65,600+ 篇 API 文档；零配置，支持 Skill 与 DSH 原生插件。 |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | [@omdsh-dev](https://github.com/omdsh-dev) | Open DeepSeek Harness workspace directories in VS Code directly from the web GUI. |
| [dsh-navbar](https://github.com/vlln/dsh-navbar) | [@vlln](https://github.com/vlln) | DSH 插件：对话节点导航条（右缘节点串快速跳转 user 消息）。官方 bundle 插件，dsh plugin --profile web add 安装 |
| [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | [@LaplaceYoung](https://github.com/LaplaceYoung) | oh-my-dsh：面向 DSH (DeepSeek Harness) 的插件生态——700+ 插件，只通过扩展接缝注册，不修改 agent-loop 骨架 |
| [deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin) | [@HeiGeAi](https://github.com/HeiGeAi) | DeepSeek Harness 换肤系统：21 套内置皮肤 + 一张图生成整套配色的自定义皮肤。数据源驱动，保对比度推导，构建期校验可读性。 |
| [dsh-deepseek-flow](https://github.com/kanghelyu/dsh-deepseek-flow) | [@kanghelyu](https://github.com/kanghelyu) | - Markdown as the source of truth — one master WORKFLOW.md, plus one STEP.md workspace for each step. |
| [deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) | [@openma-ai](https://github.com/openma-ai) | TUI Plugin of DeepSeek Harness 让DeepSeek Harness在终端跑起来 |
| [dsh-suite](https://github.com/whyihaveyou/dsh-suite) | [@whyihaveyou](https://github.com/whyihaveyou) | The living DeepSeek Harness plugin directory — refreshed hourly, compat-tested daily, with an in-app plugin store and scaffolder. DSH 插件活目录：每小时刷新，每日兼容实测，内置插件商店与脚手架。 |
| [allinluna](https://github.com/zenx0x/allinluna) | [@zenx0x](https://github.com/zenx0x) | Resource-aware multi-agent orchestration for Codex and DeepSeek Harness (All in Flash DSH plugin) |
| [ui-status-label](https://github.com/alingalingling/ui-status-label) | [@alingalingling](https://github.com/alingalingling) | 把你鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子 |
| [dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) | [@HuanLinOTO](https://github.com/HuanLinOTO) | 向模型暴露 MinerU 文档解析工具，将 PDF/图片/DOCX/PPTX/XLSX 转为结构化 Markdown/JSON \| Exposes MinerU document-parsing tools to the model, converting PDF/images/DOCX/PPTX/XLSX into structured Markdown/JSON |
| [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) | [@Moeblack](https://github.com/Moeblack) | DSH 插件：分支式消息编辑、重掷、重试与版本时间线 \| DSH plugin: branch-based message editing, reroll, retry, version timeline |
| [deepseek-pet](https://github.com/keleus/deepseek-pet) | [@keleus](https://github.com/keleus) | 在你的deepseek-harness上养一只吃白饭的大蓝鲸 |
| [dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) | [@lhh010](https://github.com/lhh010) | 【求⭐】🐋DSH Web UI 全手绘像素鲸鱼伙伴插件：会话标题栏常驻，平时眨眼/偶尔摆尾/动胸鳍，思考运行时持续动起来，回合完成头顶喷水，点击还会冒爱心，不工作时还会偷懒睡觉，零核心改动。 【喜欢的话就点点star⭐吧~】 |
| [agent-handoff-skill](https://github.com/WeirdSky924/agent-handoff-skill) | [@WeirdSky924](https://github.com/WeirdSky924) | Use this cross-platform skill in Codex or Claude Code to establish repository-local continuity memory so a future agent can recover objective, status, decisions, validation, risks, and next actions without relying on previous chat history. |
| [dsh-computer-use](https://github.com/Anionex/dsh-computer-use) | [@Anionex](https://github.com/Anionex) | 为 DeepSeek Harness 提供电脑控制插件：新鲜 Accessibility 观测、过期状态拒绝、作用域权限与安全输入（目前支持macos）｜Accessibility-first macOS Computer Use bundle for DSH with fresh observations, stale-state rejection, scoped permissions, and safe input. |
| [dsh-plugin-marketplace](https://github.com/AwesomeHou/dsh-plugin-marketplace) | [@AwesomeHou](https://github.com/AwesomeHou) | Plugin marketplace for DeepSeek Harness — live-syncs the GitHub dsh-plugin topic (1800+ repos) into a searchable, paginated settings tab with one-click install and agent tools (market_search / market_install). |
| [dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) | [@yyyyukari](https://github.com/yyyyukari) | Steam Workshop-style plugin browser for the DeepSeek Harness (DSH) Web UI - zero-server: GitHub-powered search, trending windows, Chinese search & bilingual translation, plugin-signature filtering, and smart one-click install/update/uninstall with an installed-plugins manager. |
| [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) | [@omdsh-dev](https://github.com/omdsh-dev) | DSH 插件健康检查工具：扫描插件仓库的清单协议 / patch 格式 / 构建陷阱 / hub 收录状态，零依赖只读，注册 plugin_check 工具 |
| [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) | [@omdsh-dev](https://github.com/omdsh-dev) | Create and manage sandboxed JavaScript tools for DeepSeek Harness with a Monaco editor and model-driven tool lifecycle. |
| [dsh-xiaoyao-skins](https://github.com/147228/dsh-xiaoyao-skins) | [@147228](https://github.com/147228) | 夕小瑶 × DeepSeek Harness Web 皮肤合集、安装器与社区创作工具链 |
| [dsh-plugin-template](https://github.com/bugmaker2/dsh-plugin-template) | [@bugmaker2](https://github.com/bugmaker2) | Template for deepseek-harness plugin development. |
| [dsh-model-router](https://github.com/tianji-qingtian/dsh-model-router) | [@tianji-qingtian](https://github.com/tianji-qingtian) | 模型路由与成本优化器：简单问题 flash 直答、故障自动降级、会话 token/缓存/成本实时面板 \| Model router & cost optimizer for DeepSeek Harness: flash quick-answers for simple questions, failure fallback, live token/cache/cost panel |

Includes 109 plugins, official plugins first; see [docs/plugins.json](docs/plugins.json) for source and update time.

<!-- PLUGINS_END -->

## Local Preview

The project is a static site, and the `docs/` directory is the page source. Any static server can
preview it:

```bash
cd docs
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Repository Layout

```text
deepseek-harness-plugins/
├── .github/workflows/    # GitHub Actions: daily discovery + Pages deployment
├── docs/                 # directory page source
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── translations/
│   ├── plugins.json            # community plugin single data source (discovery/review driven)
│   └── official-plugins.json   # official preset plugin data (independent, not community-reviewed)
├── plugins/              # plugin source code maintained in this repository
├── scripts/              # discovery, security review, and README generation scripts
├── README.md
├── README.en.md
└── LICENSE
```

## Automation

### Daily Discovery and Security Review

[.github/workflows/discover-plugins.yml](.github/workflows/discover-plugins.yml) runs on a
schedule (or can be triggered manually from the GitHub Actions page) and performs the following
steps:

1. Search GitHub for `topic:dsh-plugin`.
2. Check repositories for DSH plugin markers such as `cordis`, `.dsh-plugin`, and `dsh.bundle`
   to confirm compatibility with DeepSeek Harness.
3. Download README files, multilingual README files, and sampled source files, then perform a
   static security and privacy review; privacy risks are annotated when found.
4. Extract concise descriptions from `README.zh*.md` / `README.en*.md` into each plugin's
   `description_i18n` field; existing entries are backfilled once for any missing languages.
5. Keep official plugins first and process a limited number of repositories per run so the rest
   are handled by the next scheduled run.
6. Write approved plugins to `docs/plugins.json`, regenerate the README plugin lists, and submit
   the result as a pull request for human merge.

### GitHub Pages Deployment

[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) publishes the `docs/`
directory to GitHub Pages after changes are pushed to `main`. On first use, set the Pages source
to "GitHub Actions" under repository Settings -> Pages.

## Contributing

Pull requests are welcome for adding plugins, correcting information, or improving the security
review rules. To add a plugin, update `docs/plugins.json` first, then run:

```bash
node scripts/update-readme.mjs
```

When adding or changing translated plugin content, update
[docs/translations/en.json](docs/translations/en.json).

## License

[MIT](LICENSE)
