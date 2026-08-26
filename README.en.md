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
| [OpenViking](https://github.com/volcengine/OpenViking) | [@volcengine](https://github.com/volcengine) | Self-evolving Context Database for AI Agents. Unify Agent Memory, Knowledge RAG and Skills. |
| [WeKnora](https://github.com/Tencent/WeKnora) | [@Tencent](https://github.com/Tencent) | Open-source LLM knowledge platform: turn raw documents into a queryable RAG, an autonomous reasoning agent, and a self-maintaining Wiki. |
| [deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) | [@anywhere-labs](https://github.com/anywhere-labs) | 为 DeepSeek Harness (DSH) 插件生态打造的现代化桌面端解决方案。万物皆「插件」，桌面本身也是「插件」。 |
| [dsh-desktop](https://github.com/anywhere-labs/dsh-desktop) | [@anywhere-labs](https://github.com/anywhere-labs) | 为 DeepSeek Harness (DSH) 插件生态打造的现代化桌面端解决方案。万物皆「插件」，桌面本身也是「插件」。 |
| [voyager](https://github.com/Nagi-ovo/voyager) | [@Nagi-ovo](https://github.com/Nagi-ovo) | Enhancement suite for Gemini, AI Studio, Claude & ChatGPT — plus a prompt manager for any web UI, DeepSeek Harness included. / 面向 Gemini、AI Studio、Claude 与 ChatGPT 的增强套件；提示词管理器可用于任意 Web UI，含 DeepSeek Harness。 |
| [archify](https://github.com/tt-a1i/archify) | [@tt-a1i](https://github.com/tt-a1i) | Agent skill for beautiful, verifiable architecture, workflow, sequence, data-flow, and lifecycle diagrams—self-contained HTML with motion and crisp export. |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | [@awesome-dsh-plugin](https://github.com/awesome-dsh-plugin) | A curated list of plugins for DeepSeek Harness (dsh) · DeepSeek Harness 插件精选列表 |
| [EverOS](https://github.com/EverMind-AI/EverOS) | [@EverMind-AI](https://github.com/EverMind-AI) | One portable memory layer for every AI agent: local-first, Markdown-native, user-owned, and self-evolving across apps, tools, and workflows. |
| [MemOS](https://github.com/MemTensor/MemOS) | [@MemTensor](https://github.com/MemTensor) | Self-evolving memory OS for LLM & AI Agents: ultra-persistent memory, hybrid-retrieval, and cross-task skill reuse, with 35.24% token savings and DeepSeek Harness support. |
| [dsh-routing-suite](https://github.com/yjh051108/dsh-routing-suite) | [@yjh051108](https://github.com/yjh051108) | dsh-routing-suite — injector + router-standard kit: install the runtime injector first, then the task-aware reasoning-mode router preset (measured P1-P23). |
| [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) | [@zhu1090093659](https://github.com/zhu1090093659) | Plugin and skin collection for DeepSeek Harness (DSH) Web UI - task board, git graph, right-side panel, remote mobile UI, pet, live token stats, and skin center. |
| [dsh-web](https://github.com/zhu1090093659/dsh-web) | [@zhu1090093659](https://github.com/zhu1090093659) | DeepSeek Harness（DSH）Web 插件聚合生态包 · 一切皆插件，创意工坊分发 |
| [ouroboros](https://github.com/Q00/ouroboros) | [@Q00](https://github.com/Q00) | Agent OS: the agent gets smarter on its own. We just hold the line: the grading command and expected result never make it into the success contract we hand it. Interview-gated, staged evaluation, budgeted evolution loop. MCP server, 13 runtimes: Claude Code, Codex CLI, Gemini CLI, OpenCode, Copilot, Kiro and more. |
| [petdex](https://github.com/crafter-station/petdex) | [@crafter-station](https://github.com/crafter-station) | A public gallery of animated pets for Codex, Claude Code, DeepSeek Harness, Hermes, OpenCode, Gemini CLI, and more. |
| [dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) | [@xiaobright](https://github.com/xiaobright) | Two-phase DeepSeek Harness preset: Minimal-aligned bootstrap, then full Standard tools (Project2 98/99) |
| [mirage](https://github.com/strukto-ai/mirage) | [@strukto-ai](https://github.com/strukto-ai) | The World's First Unified Virtual Filesystem For AI Agents |
| [ReMe](https://github.com/agentscope-ai/ReMe) | [@agentscope-ai](https://github.com/agentscope-ai) | ReMe: Memory Management Kit for Agents - Remember Me, Refine Me. |
| [DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) | [@omdsh-dev](https://github.com/omdsh-dev) | 开放的侧边栏底座，支持三方拓展注册新侧边栏页面。内置文件渲染编辑/终端/侧边对话/Git/子代理页面 ｜ Open sidebar foundation, supports third-party extensions to register new sidebar pages. Built-in file rendering/editing, terminal, side chat, Git, and sub-agent pages. |
| [dashi-taskboard](https://github.com/chuspeeism/dashi-taskboard) | [@chuspeeism](https://github.com/chuspeeism) | A local-first issue board that runs in a browser and can be embedded in Codex through the standalone CDP launcher or its injection script. The same HTTP API powers the React UI and the taskctl CLI used by the bundled Codex Skill. |
| [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | [@ccch1mneyyy](https://github.com/ccch1mneyyy) | DSH 官方公众号收录的 TUI 补位插件：Claude Code 风，鲸鱼顶栏/实时状态/流式思考/双击 Esc 回滚/上下文进度+TPS。npm 一键装。  DSH official WeChat featured TUI plugin — Claude Code style: whale bar, live status, streaming thoughts, double-Esc rollback, context bar + TPS. npm one-click. |
| [BitFun](https://github.com/GCWing/BitFun) | [@GCWing](https://github.com/GCWing) | BitFun combines a high-performance agent runtime written in Rust with a polished desktop application. It pairs the depth of a Code Agent with open, general-purpose capabilities for work beyond software development. |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | [@Small-tailqwq](https://github.com/Small-tailqwq) | Whale Girl skin series for DeepSeek Harness. 适用于 DeepSeek Harness 的，鲸鱼娘系列皮肤。 |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | [@AdamPlatin123](https://github.com/AdamPlatin123) | 前部索引仓库（Radar）：自动扫描发现所有 dsh 插件候选，经测试合格的移入后序精选目录仓库。 |
| [BrowserSkill](https://github.com/Tencent/BrowserSkill) | [@Tencent](https://github.com/Tencent) | Let AI agents use your real, logged-in browser without interrupting your work. CLI + extension for browser automation across any shell-capable AI agent. |
| [mem9](https://github.com/mem9-ai/mem9) | [@mem9-ai](https://github.com/mem9-ai) | Unlimited memory for OpenClaw |
| [Aegis](https://github.com/GanyuanRan/Aegis) | [@GanyuanRan](https://github.com/GanyuanRan) | Make AI coding agents architecture-aware: baseline-first, evidence-verified, drift-checked, and safe across long tasks. |
| [agentrq](https://github.com/agentrq/agentrq) | [@agentrq](https://github.com/agentrq) | AgentRQ: Human-in-loop realtime conversational task manager for AI Agents. Self-hosted! Control your own agents from wherever you want Mobile, Web, Desktop. Designed to work well with your own Claude subscriptions and any harness. |
| [dsh-context](https://github.com/bowenliang123/dsh-context) | [@bowenliang123](https://github.com/bowenliang123) | The best DeepSeek Harness plugin for context insight and management, with context dashboard / browser and context command, for context statistics, composition, breakdown, evolution details, understanding how the context is made of, and how it evolves. 一站式 DeepSeek Harness 上下文可视化插件，Context 面板及浏览器与 Context 命令，透视上下文组成、演进、压缩、剪枝等事件与动作。 |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | [@NanmiCoder](https://github.com/NanmiCoder) | dsh-agent-teams turns the current DeepSeek Harness session into a captain that can assemble durable sub-agents, split a goal into dependency-aware tasks, and coordinate work through direct messages. |
| [DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget) | [@MeteorNOX](https://github.com/MeteorNOX) | DeepSeek Harness（DSH）一只住在 DSH 界面右下角的小鲸鱼娘，帮你盯着DeepSeek账户余额。QQ弹弹，支持拖拽吸附、左吸附翻转、数字滚动动画，随界面自动启用，建议直接喊来你的dsh安装 |
| [awesome-dsh-plugin](https://github.com/Anil-matcha/awesome-dsh-plugin) | [@Anil-matcha](https://github.com/Anil-matcha) | A curated list of plugins for DeepSeek Harness (dsh) - DeepSeek Harness plugin ecosystem |
| [dsh-vision-router](https://github.com/ysr666/dsh-vision-router) | [@ysr666](https://github.com/ysr666) | Eyes for text-only DeepSeek Harness agents: built-in free vision chain (no key) + pixel-level vision tools (Q&A, grounding, crop, pixel diff, colors, OCR, SVG trace, cutout, screenshots). One-command install, no Python, image turns work like ordinary tool-calling turns. |
| [MindMemOS](https://github.com/mindscale-noah/MindMemOS) | [@mindscale-noah](https://github.com/mindscale-noah) | - 2026-08-18: We released the DeepSeek Harness Plugin, letting DeepSeek Harness (dsh) agents automatically recall and write MindMemOS memories. |
| [tongflow](https://github.com/tong-io/tongflow) | [@tong-io](https://github.com/tong-io) | TongFlow — Multimodal GenAI Studio |
| [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | [@0xsline](https://github.com/0xsline) | DeepSeek Harness (DSH) ecosystem: curated plugins, tools, and infrastructure from dsh-external/hub and the public dsh-plugin topic. |
| [dsh-im](https://github.com/xmanrui/dsh-im) | [@xmanrui](https://github.com/xmanrui) | 通过扫码或机器人凭据把IM机器人接入DeepSeek Harness（支持飞书、微信、钉钉、企业微信、QQ、Slack、Telegram、Discord和WhatsApp）。 Connect IM bots to DeepSeek Harness via QR code or credentials (9 channels). |
| [dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) | [@Anionex](https://github.com/Anionex) | \[dsh]为纯文本模型设计更强大的视觉工具箱：安装免费使用、粘贴图片直接识别、多张图片问答、截图到前端UI 还原等｜DeepSeek Harness-native integration for agent-vision-toolkit: image Q&A, long-screenshot OCR, UI restoration, grounding, pixel diff, Artifacts, and Web UI. |
| [api-relay-audit](https://github.com/toby-bridges/api-relay-audit) | [@toby-bridges](https://github.com/toby-bridges) | Local security audit for AI API relays and LLM proxies: detects prompt injection, model substitution, tool-call rewriting, SSE anomalies, error leakage, and Web3 wallet risks. |
| [dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | [@Electricitysheep](https://github.com/Electricitysheep) | DeepSeek Harness (dsh) 从 0 到 1 深度手册：安装/插件开发/性能调优/实测案例/同模型多 Agent 实测对比（中文 + 英文 PDF） |
| [working-activity](https://github.com/ccch1mneyyy/working-activity) | [@ccch1mneyyy](https://github.com/ccch1mneyyy) | Lively Working-line extension for pi CLI and DSH |
| [sandbase-harness](https://github.com/sandbaseai/sandbase-harness) | [@sandbaseai](https://github.com/sandbaseai) | Local-first AI agent runtime with sandboxed sessions, MCP tools, memory, credentials, audit/replay, and a built-in console. Run OpenAI, Anthropic, MiniMax, DeepSeek V4, and OpenAI-compatible models on your infrastructure. |
| [deepseek-harness-desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app) | [@vibeinging](https://github.com/vibeinging) | DeepSeek Harness Desktop App: a local AI desktop workspace for DSH Sessions, projects, files, web research, plugins, and Office artifacts. |
| [dsh-desktop](https://github.com/vibeinging/dsh-desktop) | [@vibeinging](https://github.com/vibeinging) | DeepSeek Harness Desktop App: a local AI desktop workspace for DSH Sessions, projects, files, web research, plugins, and Office artifacts. |
| [treg](https://github.com/superdesigndev/treg) | [@superdesigndev](https://github.com/superdesigndev) | OpenRouter for agent tools. Join community here: https://discord.gg/6mQYYfFMAn |
| [Agentkey](https://github.com/chainbase-labs/Agentkey) | [@chainbase-labs](https://github.com/chainbase-labs) | Connect your AI agent to the world — Web search, Social media, Crypto & On-chain data. One plugin, zero extra config. |
| [graph-memory](https://github.com/adoresever/graph-memory) | [@adoresever](https://github.com/adoresever) | Deepseek Harness、Openclaw知识图谱记忆插件。2026年4月受邀发布在清华大学讨论会。Knowledge Graph + Memory；Knowledge Graph Context Engine for OpenClaw — extracts structured triples from conversations, compresses context 75%, enables cross-session experience reuse |
| [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | [@Nagi-ovo](https://github.com/Nagi-ovo) | 把 DSH 变成 2005 年门户网站｜Parody ads, fake games, and popups for the DSH Web UI |
| [Minke](https://github.com/lencx/Minke) | [@lencx](https://github.com/lencx) | 🐳 DeepSeek Harness Desktop |
| [deepseek-harness-studio](https://github.com/fufankeji/deepseek-harness-studio) | [@fufankeji](https://github.com/fufankeji) | DeepSeek Harness 零代码桌面端｜一键启动，支持 Windows 与 macOS；内置插件发现、热点插件推送、一键安装与管理、AI 智能推荐和视觉增强。 |
| [deepseek-design](https://github.com/Devin-AXIS/deepseek-design) | [@Devin-AXIS](https://github.com/Devin-AXIS) | DeepSeek Harness 可编辑设计系统：AI 生成、可视化编辑、模板市场与 PPT｜Native Design & PPT Studio for DeepSeek Harness. |
| [hol-guard](https://github.com/hashgraph-online/hol-guard) | [@hashgraph-online](https://github.com/hashgraph-online) | Open-source antivirus for AI agents: block risky tools, secret access, prompt injection, malicious packages, MCP servers, plugins, and skills at runtime. |
| [k8e](https://github.com/xiaods/k8e) | [@xiaods](https://github.com/xiaods) | k8e.sh - OpenSource Agentic AI Sandbox Matrix  |
| [dsh-at-file](https://github.com/FSMargoo/dsh-at-file) | [@FSMargoo](https://github.com/FSMargoo) | Codex-style @file mentions for DeepSeek Harness: search workspace files in the composer and attach their path to prompts. |
| [memtrace-public](https://github.com/syncable-dev/memtrace-public) | [@syncable-dev](https://github.com/syncable-dev) | Structural memory for AI coding agents. Bi-temporal graph, MCP-native, zero LLM calls. Cursor · Claude Code · Codex · DeepSeek Harness · Hermes · VS Code · Windsurf. |
| [dsh-browser](https://github.com/Lum1104/dsh-browser) | [@Lum1104](https://github.com/Lum1104) | dsh plugin: Chrome sidebar extension that lets DeepSeek Harness operate your browser directly, no vision capabilities required. 一款 Chrome 侧边栏扩展程序，可让 DeepSeek Harness 直接操控您的浏览器，无需视觉能力。 |
| [AI-Novel-Writer](https://github.com/EthanYoQ/AI-Novel-Writer) | [@EthanYoQ](https://github.com/EthanYoQ) | 本地优先 AI 小说创作工作台，提供 Windows/macOS 桌面版与 DeepSeek Harness 插件开发预览，支持角色、大纲、章节蓝图、审稿修稿和本地模型。 |
| [superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | [@superdesigndev](https://github.com/superdesigndev) | The design skill for Claude Code, Cursor and any coding agent. Stop shipping AI-slop UI: turn it into shippable, tasteful frontend. Install: npx skills add superdesigndev/superdesign-skill. Powered by superdesign.dev |
| [MisakaNet](https://github.com/Ikalus1988/MisakaNet) | [@Ikalus1988](https://github.com/Ikalus1988) | 📚 A zero-dependency, git-backed micro-lesson library for AI Agents to asynchronously share and search verified debugging experience. Python stdlib only. \| https://misakanet.org |
| [dsh-pet](https://github.com/PC2005-cloud/dsh-pet) | [@PC2005-cloud](https://github.com/PC2005-cloud) | DSH 桌面宠物：一行命令装好即用的透明动画小桌宠，支持多开、大小位置随心配置；还内置 DIY 素材链，能用 AI 视频自造专属宠物 |
| [dsh-infinite-gen-2](https://github.com/Minglink/dsh-infinite-gen-2) | [@Minglink](https://github.com/Minglink) | DeepSeek 专用破甲插件「无限二代」dsh-infinite-gen-2 — armor-breaking plugin for DeepSeek稳定化破甲提示词，求 Star 收藏 ⭐ |
| [anolisa](https://github.com/alibaba/anolisa) | [@alibaba](https://github.com/alibaba) | ANOLISA (Agentic Nexus Operating Layer & Interface System Architecture) \| Agentic OS with runtime, security, observability, and Tokenless response compression for lower token usage and cost. |
| [DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin) | [@WYH66666666](https://github.com/WYH66666666) | 是一层高自由度的玻璃质感主题，套在 DeepSeek Harness 网页端。顶栏、侧边栏、输入框、统计行、轨迹视图都成了磨砂玻璃片。玻璃模糊度、磨砂度、背景（流体或自定义壁纸，壁纸还能单独调模糊和磨砂）全都能在设置卡片里自由调节。关掉开关就回到原生界面，不改 DSH 任何一行源码。 |
| [de-anthropocentric-research-engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine) | [@yogsoth-ai](https://github.com/yogsoth-ai) | 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction. |
| [dshcode](https://github.com/whitelonng/dshcode) | [@whitelonng](https://github.com/whitelonng) | Community desktop companion for DeepSeek Harness — one-click Electron app for macOS and Windows |
| [flowix](https://github.com/text2future/flowix) | [@text2future](https://github.com/text2future) | Notes for you, Memory for your agents. / 内置 Deepseek harness Agent / 适用 办公 & 写作 & Coding |
| [harmony-next.skills](https://github.com/linhay/harmony-next.skills) | [@linhay](https://github.com/linhay) | 🚀 Expert guidance for HarmonyOS NEXT (API 12+) development. Covers IDE operations, performance tuning, architecture (HAP/HAR/HSP), and automation testing. |
| [DeepSec](https://github.com/Unclecheng-li/DeepSec) | [@Unclecheng-li](https://github.com/Unclecheng-li) | DeepSec — AI Security Offense & Defense Platform. Shield audits AI-generated code for hallucinated packages, missing safeguards & AI pattern errors in real time. Spear automates authorized penetration testing with 40+ skill packs, from recon to PoC.  |
| [Awesome-DeepSeek-Harness-Plugins](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins) | [@Zhiyuan-Fan](https://github.com/Zhiyuan-Fan) | Curated DeepSeek Harness (DSH) plugins, extensions, tools, skills, clients, runtimes, integrations, and verified references — English and Chinese. |
| [whale-girl](https://github.com/vlln/whale-girl) | [@vlln](https://github.com/vlln) | DSH Web GUI 桌面宠物插件（QQ 宠物形态）：右下角悬浮、可拖拽/投喂/玩耍的积累型伙伴。 |
| [oh-dsh](https://github.com/hust-open-atom-club/oh-dsh) | [@hust-open-atom-club](https://github.com/hust-open-atom-club) |  一套 DSH runtime，Desktop、Web 与 TUI 三种开发体验。 |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | [@bruc3van](https://github.com/bruc3van) | 用 30 秒找到适合你的 DeepSeek Harness 插件：告诉你插件解决什么问题、适合谁、从哪里开始。 |
| [anysearch-dsh](https://github.com/anysearch-team/anysearch-dsh) | [@anysearch-team](https://github.com/anysearch-team) | AnySearch web search provider and advanced search tools for DeepSeek Harness (DSH) |
| [dsh-pentest](https://github.com/howmp/dsh-pentest) | [@howmp](https://github.com/howmp) | 面向 DeepSeek Harness（dsh）的渗透测试模式  @CloverSecLabs |
| [pilot-harness](https://github.com/op7418/pilot-harness) | [@op7418](https://github.com/op7418) | Pilot Harness — a CodePilot-inspired desktop client and plugin suite for DeepSeek Harness on macOS, Windows, and Linux. |
| [Perfect-Web-Clone](https://github.com/ericshang98/Perfect-Web-Clone) | [@ericshang98](https://github.com/ericshang98) | Pixel-perfect clones of any webpage. Paste a URL, get a measured Vite + React replica. |
| [nuphus-mcp](https://github.com/mrpulor-gh/nuphus-mcp) | [@mrpulor-gh](https://github.com/mrpulor-gh) | Desktop automation MCP server — computer use for any AI agent: control screen, windows, mouse/keyboard, and Chrome via Model Context Protocol (stdio) |
| [dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) | [@csyangwen](https://github.com/csyangwen) | 为 DeepSeek Harness 带来「跨会话长期记忆 + 后台自我进化」能力的纯插件实现：五轨记忆 · git 分支感知 · 回合内自我审查 · 技能自我进化与技能管理器 · 四轨待办 · COI 调度 · 会话广播 · 会话搜索 · 提示词管理器 · 临时信息便签——零核心修改、零运行时依赖，随装随用、卸载即净。 |
| [dsh-mobile-apk](https://github.com/kelai141/dsh-mobile-apk) | [@kelai141](https://github.com/kelai141) | dsh 安卓壳 APK——WebView UI + 内嵌 Termux 运行时快照（解压即跑）、SAF 目录桥、保活服务、看门狗、运行时在线更新。 |
| [dsh-synapse](https://github.com/liangmianya/dsh-synapse) | [@liangmianya](https://github.com/liangmianya) | A visual, non-linear conversation workspace plugin for DeepSeek Harness ; A canvas-based session explorer and branching workspace for DeepSeek Harness. |
| [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) | [@omdsh-dev](https://github.com/omdsh-dev) | Three-tier memory control plane for DeepSeek Harness: persistent runtime context, searchable project documents, pluggable long-term memory, smart routing, supervised agent workflows, WebUI, and headless tools. |
| [dshfind](https://github.com/hikariming/dshfind) | [@hikariming](https://github.com/hikariming) | DSH (DeepSeek Harness) 原理学习、插件市场与最佳实践 · Learn DSH principles, plugin marketplace & best practices |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | [@Nagi-ovo](https://github.com/Nagi-ovo) | 在 DSH 对话中生成交互式可视化｜Render model-generated interactive cards inside DSH conversations |
| [awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) | [@libukai](https://github.com/libukai) | DeepSeek Harness 终极指南：快速入门、资源推荐、精选插件与实用工具 ｜The Ultimate Guide to DeepSeek Harness: QuickStart, Resources, Plugins&Toolkit |
| [Polaris](https://github.com/ZJU-REAL/Polaris) | [@ZJU-REAL](https://github.com/ZJU-REAL) | Toward Autonomous Scientific Discovery |
| [dsh-image-gen](https://github.com/shanliuling/dsh-image-gen) | [@shanliuling](https://github.com/shanliuling) | Generate images directly in DeepSeek Harness chats |
| [SkillCorpus](https://github.com/EverMind-AI/SkillCorpus) | [@EverMind-AI](https://github.com/EverMind-AI) | Open-source infrastructure that turns scattered SKILL.md files into curated, retrieval-ready agent-skill corpora—with retrieval and evaluation tooling included. |
| [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | [@Dominic789654](https://github.com/Dominic789654) | A curated list of plugins, skills, MCP servers, patch/profile layers, orchestrators & UIs for DeepSeek Harness (DSH). Visualization · PPT · Coding · Agents · Loops (auto-research) and more. #dsh |
| [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) | [@Han-1413141](https://github.com/Han-1413141) | DeepSeek Harness session cost meter plugin: session/daily cost, budget, history, OpenCode Go quota, official & custom-provider balance, Codex-like token heatmap, peak/off-peak pricing with pre-switch popup & system-notification alerts, official price sync, 90+ model pricing catalog, Coding Plan quota queries (7 vendors), bilingual zh/en UI |
| [open-sea-skin](https://github.com/d-dev0101/open-sea-skin) | [@d-dev0101](https://github.com/d-dev0101) | WebGPU ocean skin for DeepSeek Harness — DSH plugin, Harness-only Chrome/Edge extension, static installer, and native integration. |
| [awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins) | [@imsai-sh](https://github.com/imsai-sh) | DeepSeek Harness plugin store, marketplace and hub — 3,100+ dsh plugins with search, rankings, install commands and a free public API. DeepSeek Harness 插件市场 / 插件商店：自动收集与格式校验，免费搜索 API。deepseek1024.com |
| [oh-story-dsh](https://github.com/worldwonderer/oh-story-dsh) | [@worldwonderer](https://github.com/worldwonderer) | A DSH plugin for novel writing and short-drama production, powered by Oh Story and Drama Skills. |
| [oh-story-dsh](https://github.com/zenstory-ai/oh-story-dsh) | [@zenstory-ai](https://github.com/zenstory-ai) | A DSH plugin for novel writing and short-drama production, powered by Oh Story and Drama Skills. |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | [@Ruler4396](https://github.com/Ruler4396) | DeepSeek Harness 的 Windows 轻量启动器：开机自启 + 独立小窗口，双击即用。 |
| [engramory](https://github.com/tinqiao-oss/engramory) | [@tinqiao-oss](https://github.com/tinqiao-oss) | A portable memory protocol for AI agents — load it as standing rules; a curation discipline + reference spec + optional cap hook. |
| [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) | [@omdsh-dev](https://github.com/omdsh-dev) | Connect DSH to your database for conversational data analysis and actionable business insights. |
| [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | [@Nagi-ovo](https://github.com/Nagi-ovo) | Ask DSH, "is there a plugin for this?" It searches the GitHub dsh-plugin topic, explains the best matches, waits for your choice, then installs and verifies the selected plugin. |
| [pi2dsh](https://github.com/weijiafu14/pi2dsh) | [@weijiafu14](https://github.com/weijiafu14) | Bridge the Pi and DeepSeek Harness ecosystems: one Pi Host ABI runs unmodified Pi extensions as native DSH plugins. 打通 Pi 与 DSH 生态。 |
| [anime-find](https://github.com/cocofhu/anime-find) | [@cocofhu](https://github.com/cocofhu) | DeepSeek Harness 搜番插件：对话内多源搜索番剧，卡片展示 Bangumi 评分与详情，支持复制磁力。 |
| [TokenLedger](https://github.com/zh667/TokenLedger) | [@zh667](https://github.com/zh667) | Relay-site attributed token usage for DeepSeek Harness — zero config, no credentials |
| [cocode](https://github.com/cocode-agency/cocode) | [@cocode-agency](https://github.com/cocode-agency) | Best ready-to-run DeepSeek Harness distribution: DSH desktop GUI, terminal TUI, and harness integration. |
| [notes](https://github.com/zhaoolee/notes) | [@zhaoolee](https://github.com/zhaoolee) | 开源版锤子便签，复刻锤科美学，一键Docker私有化部署，支持skill调用，支持dsh plugin，支持多租户，一键生成公众号格式，支持导出便签为图片 |
| [dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) | [@ZSeven-W](https://github.com/ZSeven-W) | The DeepSeek Harness plugin for OpenPencil — preview, inspect, and edit real .op documents inside a conversation. |
| [dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) | [@yjh051108](https://github.com/yjh051108) | > ## 🎉 v0.3.0 重大声明（2026-08-14） > > 从经验补丁到源码契约——注入器完成规范重构。 |
| [dsh-mobile](https://github.com/saya-ch/dsh-mobile) | [@saya-ch](https://github.com/saya-ch) | DeepSeek Harness 移动端适配与安全局域网访问插件，支持 Android App 和手机浏览器。 |
| [dsh-oil-creator](https://github.com/oil-oil/dsh-oil-creator) | [@oil-oil](https://github.com/oil-oil) | AI-assisted local creator workbench for DeepSeek Harness |
| [dsh-remote-web-gateway](https://github.com/summer1238/dsh-remote-web-gateway) | [@summer1238](https://github.com/summer1238) | 手机平板远程 DeepSeek Harness：扫码即可继续使用电脑上的 DSH，无需远程桌面 / SSH / 公网 IP，支持一次性配对、Github授权加密登录，独立设备授权与随时撤销，实现远程连接很简单，但安全才是我们所想要的。 |
| [dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin) | [@kingOfSoySauce](https://github.com/kingOfSoySauce) | DeepSeek Harness 滑动变阻器皮肤 |
| [DSH-taskboard](https://github.com/shengsheng90/DSH-taskboard) | [@shengsheng90](https://github.com/shengsheng90) | Native local Taskboard plugin for DeepSeek Harness. SQLite-backed projects, Agent claim/review, and a native Web UI — no iframe, no second chat runtime. |
| [dsh-univer-office](https://github.com/dream-num/dsh-univer-office) | [@dream-num](https://github.com/dream-num) | Preview, create, edit office spreadsheets, docs & slides inside DeepSeek Harness. Power by Univer. |
| [Invoice-Downloader](https://github.com/EthanYoQ/Invoice-Downloader) | [@EthanYoQ](https://github.com/EthanYoQ) | InvoiceFlowAI：Windows 与 macOS 发票助手，自动下载邮箱电子发票、OCR 识别、分类归档并生成 Excel 报销汇总；可安装为 DeepSeek Harness 插件。 |
| [dsh-gitbash-preset](https://github.com/liceses/dsh-gitbash-preset) | [@liceses](https://github.com/liceses) | DeepSeek Harness 插件：一键安装「极简模式 (Git Bash)」agent preset —— 把 DSH 自带极简模式中的 bash 调用映射到 Git for Windows 的 bash（MSYS），让 Windows 上的极简模式真正可用。 |
| [cetus](https://github.com/drewnekota/cetus) | [@drewnekota](https://github.com/drewnekota) | One macOS app for Claude Code, Codex, and every agent runtime you use — scheduled runs, global hotkey launcher, per-run git worktrees, one review board. |
| [dsh-plugin-bridge](https://github.com/Totoro-qaq/dsh-plugin-bridge) | [@Totoro-qaq](https://github.com/Totoro-qaq) | DeepSeek Harness plugin for previewable cross-preset session migration. Fixed-schema handoffs preserve state, source-model intent, and unresolved images; the original session stays untouched. |
| [dsh-agent-team-gui](https://github.com/toolclub/dsh-agent-team-gui) | [@toolclub](https://github.com/toolclub) | Persistent multi-model workflow teams for DeepSeek Harness — dynamic lead planning, bounded DAGs, per-agent model/tools, Run Center and Token insights. |
| [dsh-undo-plugin](https://github.com/lire1131/dsh-undo-plugin) | [@lire1131](https://github.com/lire1131) | DSH crash-rescue plugin: undo config & plugin-code changes, secret-safe snapshots, one-click SAFE MODE, plus offline CLI/GUI that work even when DSH won't boot. |
| [dsh-undo-savepoint](https://github.com/lire1131/dsh-undo-savepoint) | [@lire1131](https://github.com/lire1131) | DSH crash-rescue plugin: undo config & plugin-code changes, secret-safe snapshots, one-click SAFE MODE, plus offline CLI/GUI that work even when DSH won't boot. |
| [gal-view](https://github.com/Ayase34/gal-view) | [@Ayase34](https://github.com/Ayase34) | 把dsh会话界面切换成galgame游戏界面的插件 |
| [dsh-noema](https://github.com/ZSeven-W/dsh-noema) | [@ZSeven-W](https://github.com/ZSeven-W) | Noema long-term memory plugin for DSH: durable, inspectable agent memory with recall tools and a settings page. |
| [dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) | [@Ychris12138](https://github.com/Ychris12138) | Provider balances, subscription quotas, and token-usage analytics for the DeepSeek Harness Web GUI (dsh web). |
| [dsh-damage-pulse](https://github.com/wssfk12138/dsh-damage-pulse) | [@wssfk12138](https://github.com/wssfk12138) | DeepSeek Harness token balance monitor with game-style damage pulse animations |
| [dsh-android](https://github.com/ZSeven-W/dsh-android) | [@ZSeven-W](https://github.com/ZSeven-W) | DeepSeek Harness plugin for Android — build, run, and interact with a live emulator or USB device stream inside a conversation, driven entirely through adb. |
| [humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) | [@Vladimir-Human](https://github.com/Vladimir-Human) | Скилл для ИИ-агентов: находит и убирает следы машинной генерации из русского текста. 38 паттернов, 39 regex-маркеров с реестром доказательств, слепые парные прогоны, файловый слой снятия C2PA/EXIF/XMP. Пакет на PyPI и онлайн-демо \| Russian AI-writing humanizer skill, PyPI: humanizer-ru, live demo |
| [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) | [@beancookie](https://github.com/beancookie) | Awesome DeepSeek Harness (DSH) Plugin |
| [dsh-dream-skin](https://github.com/RevolutionLA/dsh-dream-skin) | [@RevolutionLA](https://github.com/RevolutionLA) | DeepSeek Harness 换肤 / 壁纸 / 主题包插件 (dsh-plugin) — 8 套 Mirage 主题、每用户强调色、壁纸2.0、主题包导入导出/分享链接、收藏与随机，纯原生 token 系统实现。 |
| [dsh-evolve-modes](https://github.com/GraySilver/dsh-evolve-modes) | [@GraySilver](https://github.com/GraySilver) | 让 Agent 的工作方式可组合、可审查、可持续改进，最终实现 Agent Self Evoling。 DeepSeek Harness Web plugin with composable task controls and isolated, human-reviewed self-evolution. |
| [dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) | [@HanaAyane](https://github.com/HanaAyane) | DSH适用的Codex风格的思考强度滑块，以及大肥鱼跑步滑块。Codex-style model and reasoning-effort slider for DeepSeek Harness |
| [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) | [@Nwflower](https://github.com/Nwflower) | Import 14+ external agent chat histories (Claude Code, Codex, ChatGPT, Cursor, Gemini, Reasonix, opencode, ZCode, Grok Build, OpenClaw, Pi, Hermes, Kimi CLI, DSH) into DeepSeek Harness as resumable sessions — full-fidelity, reverse export/sync, bundle backup. \| 从 Claude Code、Codex、Reasonix 等 Agent 工具导入历史消息到 DeepSeek Harness 并继续对话。 |
| [argo](https://github.com/taxueseek/argo) | [@taxueseek](https://github.com/taxueseek) | 专门为 agent 打造的 agent 搜索工具，具备多语言搜索能力，覆盖中文/英文/学术/代码/购物/金融/新闻/百科。 |
| [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) | [@PerryLink](https://github.com/PerryLink) | Second-model AI auto-review for DeepSeek Harness approval requests: a read-only reviewer subagent returns structured allow/deny verdicts with reasons, fail-closed by default, fully auditable from the session log (approval/asked -> autoReview/verdict -> approval/decided). |
| [ark-cli](https://github.com/volcengine/ark-cli) | [@volcengine](https://github.com/volcengine) | The fastest way to put Volcengine Ark in your terminal and your AI agent — go from prompt to generated   media, multimodal answer, or deployed endpoint in a single command, no API glue code. |
| [dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider) | [@Mars-Sea](https://github.com/Mars-Sea) | Unofficial DeepSeek Harness LLM provider plugin for Command Code: live model catalog, reasoning-effort support, Models-page card. Ported from pi-commandcode-provider (MIT). |
| [dsh_workflow](https://github.com/omdsh-dev/dsh_workflow) | [@omdsh-dev](https://github.com/omdsh-dev) | 把Claude Code的UltraCode模式带给DSH，把 DSH 的一次性多 Agent 调度，升级为可生成、可保存、可治理、可观察、可恢复的 Workflow 层 |
| [deepseek-harness-genui](https://github.com/pengyue-polaron/deepseek-harness-genui) | [@pengyue-polaron](https://github.com/pengyue-polaron) | Task-specific React apps for DeepSeek Harness with state carried into the next Agent turn |
| [dsh-skill-mcp-panel](https://github.com/Fishquito7/dsh-skill-mcp-panel) | [@Fishquito7](https://github.com/Fishquito7) | DSH Web UI plugin: skill and MCP management（Web界面的skill/MCP管理工具） |
| [dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) | [@Anionex](https://github.com/Anionex) | deepseek harness对话和代码状态回退插件 \| DSH — rewind conversation and workspace state, powered by a persistent Change Ledger |
| [odai](https://github.com/orziz/odai) | [@orziz](https://github.com/orziz) | AI agent 通用任务治理框架：对齐目标与事实，规划和调度能力，守住授权与风险边界，治理任务执行到真实验收与交付。Governance framework for evidence-driven planning, orchestration, and verified delivery. |
| [dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) | [@omdsh-dev](https://github.com/omdsh-dev) | DSH Web 选中批注插件：选文字→批注→回车随消息发送；气泡隐藏批注块（零闪烁）；回复按 Annotation N 逐条对照（可悬浮芯片）。官方 bundle，零核心改动 |
| [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin) | [@awesome-dsh-plugin](https://github.com/awesome-dsh-plugin) | Find DSH plugins inside the agent — live GitHub dsh-plugin topic search, star-ranked / 会话内搜索发现 DSH 插件 |
| [dsh-plugin](https://github.com/Tabbit-Browser/dsh-plugin) | [@Tabbit-Browser](https://github.com/Tabbit-Browser) | A plugin for DeepSeek Harness (DSH) that gives the agent control over your Tabbit Browser: real pages, real login state, and real interactions, driven through tabbit-cli — the task-isolated Playwright CLI owned by the browser itself. Use it for web |
| [dsh-tabbit](https://github.com/Tabbit-Browser/dsh-tabbit) | [@Tabbit-Browser](https://github.com/Tabbit-Browser) | A plugin for DeepSeek Harness (DSH) that gives the agent control over your Tabbit Browser: real pages, real login state, and real interactions, driven through tabbit-cli — the task-isolated Playwright CLI owned by the browser itself. Use it for web |
| [dsh-vision](https://github.com/oil-oil/dsh-vision) | [@oil-oil](https://github.com/oil-oil) | Near-native image understanding for DeepSeek Harness |
| [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | [@Alex-Yanggg](https://github.com/Alex-Yanggg) | A meticulously curated list of useful plugins, extensions, tools and development resources built for DSH, covering productivity enhancement, functional expansion, debugging utilities and custom development modules. |
| [hello-dsh](https://github.com/pingfanfan/hello-dsh) | [@pingfanfan](https://github.com/pingfanfan) | 从零开始，看懂 DeepSeek Harness 的「万物皆可插件」— 零基础插件开发教程（含 22 个中文技能实例）\| Zero-to-plugin tutorial for DeepSeek Harness |
| [dsh-kun-like-pet](https://github.com/liyupi/dsh-kun-like-pet) | [@liyupi](https://github.com/liyupi) | Kun Like 桌宠 —— DeepSeek Harness 桌面宠物插件：右下角小坤宠随 Agent 工作状态切换 9 种动作，任务完成播放「你干嘛~哎哟」 |
| [tokenbank](https://github.com/wink-run/tokenbank) | [@wink-run](https://github.com/wink-run) | Token Bank — the local LLM gateway that sits between your AI agents and every provider.  Know where tokens go · Spend less with smart routing to Ollama, Groq, GitHub Models · Earn by sharing idle quota on a community P2P network.  One-click onboarding for Cursor, Claude Code, Codex CLI, Gemini CLI — no agent changes. Full trace, seamless model swap |
| [dsh-automation](https://github.com/titanwings/dsh-automation) | [@titanwings](https://github.com/titanwings) | DSH 自动化插件：让 Coding 任务按计划在全新 Agent Session 中运行，并由用户或 Agent 创建和管理定时任务。 / Run coding tasks in fresh Agent sessions and manage schedules from DSH Web or an Agent. |
| [sealos-skills](https://github.com/labring/sealos-skills) | [@labring](https://github.com/labring) | AI agent skills for Sealos — deploy any project, provision databases, object storage & more with one command. Works with Claude Code, Gemini CLI, Codex. |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | [@omdsh-dev](https://github.com/omdsh-dev) | Desktop notifications for DeepSeek Harness turn completions, with per-outcome controls and include/exclude keyword rules. |
| [dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot) | [@tencent-connect](https://github.com/tencent-connect) | 让 QQ Bot 接入 DeepSeek Harness（dsh）的官方插件 |
| [ru-marketplace-mcp](https://github.com/Vladimir-Human/ru-marketplace-mcp) | [@Vladimir-Human](https://github.com/Vladimir-Human) | Девять российских маркетплейсов и китайский Taobao как MCP-серверы: Wildberries, Ozon, Яндекс Маркет, Детский мир, Авито, Мегамаркет, Lamoda, DNS, Ситилинк. Плюс сравнение цен по всем сразу. Только чтение, ключи не нужны. |
| [Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | [@like-study1](https://github.com/like-study1) | 🐳 DeepSeek Harness 插件聚合社区 — 自动同步 dsh-plugin 生态 · 精选目录 · 每 4 小时自动维护 \| Oh-My-DSH: a community-maintained catalog of DeepSeek Harness plugins, auto-synced from the dsh-plugin topic |
| [dsh-notifier](https://github.com/THEWOLFWALKER/dsh-notifier) | [@THEWOLFWALKER](https://github.com/THEWOLFWALKER) | Unified notification push plugin for DeepSeek Harness (DSH): one minimal notify() API, 8 channel adapters (telegram/dingtalk/feishu/wxpusher/pushplus/serverchan/bark/webhook), dual trigger (auto session events + agent tool). |
| [forkprobe](https://github.com/Jayden-X-L/forkprobe) | [@Jayden-X-L](https://github.com/Jayden-X-L) | Compare multiple skills on the same task and pick the winner. |
| [dsh-web-plugin-manager](https://github.com/LX2000WASD/dsh-web-plugin-manager) | [@LX2000WASD](https://github.com/LX2000WASD) | 在 Web UI 中一键管理 DeepSeek Harness (DSH) 插件：查看、实时启停、安装/卸载、更新检测、健康检查（依赖/冲突/兼容性分析）、环境管理、插件市场。bundle 与非 bundle 插件全覆盖 |
| [dsh-toy](https://github.com/c3ll256/dsh-toy) | [@c3ll256](https://github.com/c3ll256) | Toy Control Protocol for DSH |
| [deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) | [@openma-ai](https://github.com/openma-ai) | TUI Plugin of DeepSeek Harness 让DeepSeek Harness在终端跑起来 |
| [dsh-navbar](https://github.com/vlln/dsh-navbar) | [@vlln](https://github.com/vlln) | DSH 插件：对话节点导航条（右缘节点串快速跳转 user 消息）。官方 bundle 插件，dsh plugin --profile web add 安装 |
| [plugin-registry](https://github.com/vlln/plugin-registry) | [@vlln](https://github.com/vlln) | DSH 插件生态基建：薄控制台（浏览器面板管理官方 repository 插件，0 patch）+ make-dsh-plugin skill 官方插件开发引导 |
| [SpecFusion](https://github.com/wxkingstar/SpecFusion) | [@wxkingstar](https://github.com/wxkingstar) | 在 DeepSeek Harness / Claude Code / Cursor / Codex / Gemini CLI 里直接搜索 20 个中国开放平台的 65,600+ 篇 API 文档；零配置，支持 Skill 与 DSH 原生插件。 |
| [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | [@LaplaceYoung](https://github.com/LaplaceYoung) | oh-my-dsh：面向 DSH (DeepSeek Harness) 的插件生态——700+ 插件，只通过扩展接缝注册，不修改 agent-loop 骨架 |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | [@omdsh-dev](https://github.com/omdsh-dev) | Open DeepSeek Harness workspace directories in VS Code directly from the web GUI. |
| [dsh-deepseek-flow](https://github.com/kanghelyu/dsh-deepseek-flow) | [@kanghelyu](https://github.com/kanghelyu) | - Markdown as the source of truth — one master WORKFLOW.md, plus one STEP.md workspace for each step. |
| [deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin) | [@HeiGeAi](https://github.com/HeiGeAi) | DeepSeek Harness 换肤系统：21 套内置皮肤 + 一张图生成整套配色的自定义皮肤。数据源驱动，保对比度推导，构建期校验可读性。 |
| [dsh-suite](https://github.com/whyihaveyou/dsh-suite) | [@whyihaveyou](https://github.com/whyihaveyou) | The living DeepSeek Harness plugin directory — refreshed hourly, compat-tested daily, with an in-app plugin store and scaffolder. DSH 插件活目录：每小时刷新，每日兼容实测，内置插件商店与脚手架。 |
| [allinluna](https://github.com/zenx0x/allinluna) | [@zenx0x](https://github.com/zenx0x) | Resource-aware multi-agent orchestration for Codex and DeepSeek Harness (All in Flash DSH plugin) |
| [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) | [@Moeblack](https://github.com/Moeblack) | DSH 插件：分支式消息编辑、重掷、重试与版本时间线 \| DSH plugin: branch-based message editing, reroll, retry, version timeline |
| [dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) | [@HuanLinOTO](https://github.com/HuanLinOTO) | 向模型暴露 MinerU 文档解析工具，将 PDF/图片/DOCX/PPTX/XLSX 转为结构化 Markdown/JSON \| Exposes MinerU document-parsing tools to the model, converting PDF/images/DOCX/PPTX/XLSX into structured Markdown/JSON |
| [deepseek-pet](https://github.com/keleus/deepseek-pet) | [@keleus](https://github.com/keleus) | 在你的deepseek-harness上养一只吃白饭的大蓝鲸 |
| [ui-status-label](https://github.com/alingalingling/ui-status-label) | [@alingalingling](https://github.com/alingalingling) | 把你鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子 |
| [dsh-plugin-template](https://github.com/bugmaker2/dsh-plugin-template) | [@bugmaker2](https://github.com/bugmaker2) | Template for deepseek-harness plugin development. |
| [dsh-computer-use](https://github.com/Anionex/dsh-computer-use) | [@Anionex](https://github.com/Anionex) | 为 DeepSeek Harness 提供电脑控制插件：新鲜 Accessibility 观测、过期状态拒绝、作用域权限与安全输入（目前支持macos）｜Accessibility-first macOS Computer Use bundle for DSH with fresh observations, stale-state rejection, scoped permissions, and safe input. |
| [dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) | [@lhh010](https://github.com/lhh010) | 【求⭐】🐋DSH Web UI 全手绘像素鲸鱼伙伴插件：会话标题栏常驻，平时眨眼/偶尔摆尾/动胸鳍，思考运行时持续动起来，回合完成头顶喷水，点击还会冒爱心，不工作时还会偷懒睡觉，零核心改动。 【喜欢的话就点点star⭐吧~】 |
| [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) | [@omdsh-dev](https://github.com/omdsh-dev) | DSH 插件健康检查工具：扫描插件仓库的清单协议 / patch 格式 / 构建陷阱 / hub 收录状态，零依赖只读，注册 plugin_check 工具 |
| [agent-handoff-skill](https://github.com/WeirdSky924/agent-handoff-skill) | [@WeirdSky924](https://github.com/WeirdSky924) | Use this cross-platform skill in Codex or Claude Code to establish repository-local continuity memory so a future agent can recover objective, status, decisions, validation, risks, and next actions without relying on previous chat history. |
| [dsh-plugin-marketplace](https://github.com/AwesomeHou/dsh-plugin-marketplace) | [@AwesomeHou](https://github.com/AwesomeHou) | Plugin marketplace for DeepSeek Harness — live-syncs the GitHub dsh-plugin topic (1800+ repos) into a searchable, paginated settings tab with one-click install and agent tools (market_search / market_install). |
| [dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) | [@yyyyukari](https://github.com/yyyyukari) | Steam Workshop-style plugin browser for the DeepSeek Harness (DSH) Web UI - zero-server: GitHub-powered search, trending windows, Chinese search & bilingual translation, plugin-signature filtering, and smart one-click install/update/uninstall with an installed-plugins manager. |
| [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) | [@omdsh-dev](https://github.com/omdsh-dev) | Create and manage sandboxed JavaScript tools for DeepSeek Harness with a Monaco editor and model-driven tool lifecycle. |
| [dsh-xiaoyao-skins](https://github.com/147228/dsh-xiaoyao-skins) | [@147228](https://github.com/147228) | 夕小瑶 × DeepSeek Harness Web 皮肤合集、安装器与社区创作工具链 |
| [dsh-model-router](https://github.com/tianji-qingtian/dsh-model-router) | [@tianji-qingtian](https://github.com/tianji-qingtian) | 模型路由与成本优化器：简单问题 flash 直答、故障自动降级、会话 token/缓存/成本实时面板 \| Model router & cost optimizer for DeepSeek Harness: flash quick-answers for simple questions, failure fallback, live token/cache/cost panel |

Includes 180 plugins, official plugins first; see [docs/plugins.json](docs/plugins.json) for source and update time.

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
