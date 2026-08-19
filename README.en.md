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
| [OpenViking](https://github.com/volcengine/OpenViking) | [@volcengine](https://github.com/volcengine) | 👋 Join our Community |
| [voyager](https://github.com/Nagi-ovo/voyager) | [@Nagi-ovo](https://github.com/Nagi-ovo) | We love AI chatbots, but sometimes we wish they had just a bit more structure. |
| [archify](https://github.com/tt-a1i/archify) | [@tt-a1i](https://github.com/tt-a1i) | Turn a codebase or system description into a polished, interactive system map — directly in chat. |
| [ouroboros](https://github.com/Q00/ouroboros) | [@Q00](https://github.com/Q00) | Like any OS, Ouroboros is split into a stable OS layer of primitives, an application layer of domain workflows, and a shell that humans actually sit in front of. Three repos, one stack: |
| [dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) | [@xiaobright](https://github.com/xiaobright) | Experimental DeepSeek Harness agent presets — a base mode, two live-anchor variants, and one seeded prefab mode — that anchor a session's model trajectory on the Minimal condition |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | [@Small-tailqwq](https://github.com/Small-tailqwq) | DSH Web whale-girl skin series (Maid Atelier) - CC BY-NC-SA 4.0. |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | [@AdamPlatin123](https://github.com/AdamPlatin123) | A front-index repository (Radar): automatically scans and discovers DSH plugin candidates, then moves tested candidates into the downstream curated directory repositories. |
| [dsh-market](https://github.com/dsh-market/dsh-market) | [@dsh-market](https://github.com/dsh-market) | The plugin market inside DeepSeek Harness. Open Settings → Plugin Market → browse, search, one-click install. |
| [agentrq](https://github.com/agentrq/agentrq) | [@agentrq](https://github.com/agentrq) | AgentRQ is a modern, high-performance platform designed for seamless collaboration between human operators and AI agents. It leverages the Model Context Protocol (MCP) to allow AI models (like Claude) to interact directly with your workspace's task management |
| [Aegis](https://github.com/GanyuanRan/Aegis) | [@GanyuanRan](https://github.com/GanyuanRan) | English is now the default GitHub README: |
| [awesome-deepseek-harness](https://github.com/Anil-matcha/awesome-deepseek-harness) | [@Anil-matcha](https://github.com/Anil-matcha) | > A curated guide to DeepSeek Harness (dsh) — DeepSeek's open-source, everything-is-a-plugin coding agent — and the best community plugins built on it. |
| [awesome-dsh-plugin](https://github.com/Anil-matcha/awesome-dsh-plugin) | [@Anil-matcha](https://github.com/Anil-matcha) | > A curated guide to DeepSeek Harness (dsh) — DeepSeek's open-source, everything-is-a-plugin coding agent — and the best community plugins built on it. |
| [tongflow](https://github.com/tong-io/tongflow) | [@tong-io](https://github.com/tong-io) | \| Workflow \| Result \| \| :--: \| :--: \| \| Basic — Type text (Add), generate images (Transform), then blend them into one (Compose). \| \| |
| [dsh-vision-router](https://github.com/ysr666/dsh-vision-router) | [@ysr666](https://github.com/ysr666) | Most DSH vision plugins bridge images to DeepSeek as text descriptions — lossy, one-shot, and blind to pixels. This plugin keeps the original pixels on the vision model's side and DeepSeek on the reasoning side, and makes looking at an image an ordinary tool |
| [api-relay-audit](https://github.com/toby-bridges/api-relay-audit) | [@toby-bridges](https://github.com/toby-bridges) | Local security audit for AI API relays and LLM proxies. |
| [dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) | [@Anionex](https://github.com/Anionex) | A more powerful vision toolkit—give text-only models in DeepSeek Harness eyes: image Q&A, long-screenshot OCR, UI restoration, and GUI visual tasks in one toolkit and Skill. |
| [working-activity](https://github.com/ccch1mneyyy/working-activity) | [@ccch1mneyyy](https://github.com/ccch1mneyyy) | Lively Working-line extension for pi CLI and DSH |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | [@NanmiCoder](https://github.com/NanmiCoder) | dsh-agent-teams turns the current DeepSeek Harness session into a captain that can assemble durable sub-agents, split a goal into dependency-aware tasks, and coordinate work through direct messages. |
| [graph-memory](https://github.com/adoresever/graph-memory) | [@adoresever](https://github.com/adoresever) | Traceable, searchable, cross-session memory for AI agents. |
| [dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | [@Electricitysheep](https://github.com/Electricitysheep) | > From zero to one with DeepSeek Harness — the beginner's encyclopedia for DeepSeek's open-source agent runtime. |
| [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | [@Nagi-ovo](https://github.com/Nagi-ovo) | A DSH Web UI ad plugin in the style of a 2005 Chinese site: sidebar ads, in-conversation feed ads, corner pop-ups, and a close button whose real hit area is much smaller than it appears. All materials are fictional and domains are masked. |
| [dsh-work](https://github.com/vibeinging/dsh-work) | [@vibeinging](https://github.com/vibeinging) | A local-first AI workbench for DSH Plugins, combining Agent sessions, project files, data analysis, web research, MCP, and Office artifacts in an Electron desktop app. |
| [deepseek-harness-desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app) | [@vibeinging](https://github.com/vibeinging) | DeepSeek Harness Desktop App: a local AI desktop workspace for DSH Sessions, projects, files, web research, plugins, and Office artifacts. |
| [mnemon](https://github.com/mnemon-dev/mnemon) | [@mnemon-dev](https://github.com/mnemon-dev) | LLM-supervised persistent memory for AI agents — graph-based recall, cross-session knowledge, single binary. Works with Claude Code, OpenClaw, and any CLI agent. |
| [dsh-context](https://github.com/bowenliang123/dsh-context) | [@bowenliang123](https://github.com/bowenliang123) | See what your DeepSeek Harness agent's context window is actually made of and how it evolves. |
| [memtrace-public](https://github.com/syncable-dev/memtrace-public) | [@syncable-dev](https://github.com/syncable-dev) | Memtrace runs as a DeepSeek Harness plugin. Install Harness first (npm install -g @deepseek-ai/dsh — that is the dsh command), then add Memtrace: |
| [superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | [@superdesigndev](https://github.com/superdesigndev) | Stop shipping AI-slop UI. Coding agents write great code and mediocre interfaces: generic layouts, default shadcn everything, no taste. Superdesign is the skill that gives your agent design judgment, so the UI it ships actually looks considered. |
| [de-anthropocentric-research-engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine) | [@yogsoth-ai](https://github.com/yogsoth-ai) | The complete research orchestration system for AI-native science. |
| [deepseek-harness-studio](https://github.com/fufankeji/deepseek-harness-studio) | [@fufankeji](https://github.com/fufankeji) | DeepSeek Harness Desktop for macOS & Windows — zero-code Plugin Store, one-click install and enable, vision enhancement, automatic plugin delivery, and AI recommendations. |
| [DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin) | [@WYH66666666](https://github.com/WYH66666666) | A highly customizable glassmorphism theme layered onto the DeepSeek Harness web UI, turning the top bar, sidebar, input box, stats row, and trajectory view into frosted glass panels with adjustable blur, frosting, and background. |
| [oh-dsh](https://github.com/hust-open-atom-club/oh-dsh) | [@hust-open-atom-club](https://github.com/hust-open-atom-club) | 🖥️ Three interaction surfaces Use the same ohdsh command to start Desktop, Web, or TUI. All surfaces share sessions, credentials, skins, and plugin caches while keeping separate Profiles. |
| [dsh-genui](https://github.com/omdsh-dev/dsh-genui) | [@omdsh-dev](https://github.com/omdsh-dev) | > Give the model's answers a face — the text is still there, and an interactive UI is already live. |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | [@bruc3van](https://github.com/bruc3van) | Find the right DeepSeek Harness plugin in 30 seconds: tells you what problem a plugin solves, who it is for, and where to start. |
| [Minke](https://github.com/lencx/Minke) | [@lencx](https://github.com/lencx) | - A complete workspace for agentic work — Minke turns DeepSeek Harness into more than a conversation window. Files, terminals, web tools, and plugin discovery live in independent right and bottom workspaces, keeping the tools for understanding, changing, and |
| [nuphus-mcp](https://github.com/mrpulor-gh/nuphus-mcp) | [@mrpulor-gh](https://github.com/mrpulor-gh) | Desktop automation MCP server — computer use for any AI agent. See the screen, control windows/mouse/keyboard, and drive Chrome over the Model Context Protocol (stdio). Desktop & browser automation need no API key; OCR runs locally; vision plugs into your own |
| [dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) | [@huiliyi37](https://github.com/huiliyi37) | dsh-tianshu-tui (@huiliyi37/dsh-tianshu-tui) is the interactive terminal UI plugin for the official DeepSeek Harness. The render core evolved from Tianshu-Tui (Apache-2.0; file-by-file provenance in SOURCE-MAP.md). The UI is a pure presentation layer: every workflow adds TDD, evidence gates, and visual image modules on top of the official base. |
| [dsh-pet](https://github.com/PC2005-cloud/dsh-pet) | [@PC2005-cloud](https://github.com/PC2005-cloud) | DSH 桌面宠物：一行命令安装现成宠物（28 个透明动画，即装即用），或内置素材链从 AI 视频自造专属宠物 \| One-line install desktop pet for DeepSeek Harness + DIY asset pipeline |
| [Awesome-DeepSeek-Harness-Plugins](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins) | [@Zhiyuan-Fan](https://github.com/Zhiyuan-Fan) | A concise, daily-curated directory of public plugins and extensions for DeepSeek Harness (DSH), the open-source DeepSeek agent harness. Explore tools, skills, model providers, memory, automation, runtimes, desktop clients, browser integrations, and developer tools. |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | [@Nagi-ovo](https://github.com/Nagi-ovo) | DSH does not have to answer with text alone. When the model calls visualize, the Web UI renders an interactive card inside the conversation for simulators, charts, comparison panels, and UI mockups. |
| [open-sea-skin](https://github.com/d-dev0101/open-sea-skin) | [@d-dev0101](https://github.com/d-dev0101) | A self-contained WebGPU ocean skin for DeepSeek Harness. It keeps the original five-wave Gerstner/TSL look, adds a translucent Harness theme, and is available as a one-line DSH plugin, Harness-only Chrome/Edge extension, one-command static |
| [dshfind](https://github.com/hikariming/dshfind) | [@hikariming](https://github.com/hikariming) | The learning & sharing community for DeepSeek Harness (DSH) |
| [dsh-dafeiyu](https://github.com/QCYTSN/dsh-dafeiyu) | [@QCYTSN](https://github.com/QCYTSN) | A desktop companion that lives on Windows and reacts to real DeepSeek Harness activity. |
| [engramory](https://github.com/tinqiao-oss/engramory) | [@tinqiao-oss](https://github.com/tinqiao-oss) | An opinionated, zero-infrastructure memory *protocol for small-scale, local, file-based agent memory** — a strict curation discipline plus a validator (tools/engramory_doctor.py), loaded as standing rules (CLAUDE.md / |
| [dsh-plugin-subscriptions](https://github.com/V1ki/dsh-plugin-subscriptions) | [@V1ki](https://github.com/V1ki) | Use your ChatGPT (Codex), Claude, and Grok (X Premium) subscriptions as LLM providers in DeepSeek Harness — no API keys. Login happens in the dsh web UI (Settings → Subscriptions); tokens live at ~/.dsh/plugins/subscriptions/auth.json (mode 0600) and refresh |
| [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | [@Dominic789654](https://github.com/Dominic789654) | A curated list of plugins, skills, MCP servers, patch/profile layers, orchestrators & UIs for DeepSeek Harness (DSH). Visualization · PPT · Coding · Agents · Loops (auto-research) and more. #dsh |
| [deepseek-design](https://github.com/Devin-AXIS/deepseek-design) | [@Devin-AXIS](https://github.com/Devin-AXIS) | DeepSeek Harness 可编辑设计系统：AI 生成、可视化编辑、模板市场与 PPT｜Native Design & PPT Studio for DeepSeek Harness. |
| [awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) | [@libukai](https://github.com/libukai) | - Table of Contents - Quick Start - Launch the Web UI |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | [@Ruler4396](https://github.com/Ruler4396) | A lightweight Windows launcher for DeepSeek Harness: starts at login, runs in a small standalone window, and opens with a double click. |
| [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | [@Nagi-ovo](https://github.com/Nagi-ovo) | Ask DSH, "is there a plugin for this?" It searches the GitHub dsh-plugin topic, explains the best matches, waits for your choice, then installs and verifies the selected plugin. |
| [anime-find](https://github.com/cocofhu/anime-find) | [@cocofhu](https://github.com/cocofhu) | DeepSeek Harness 搜番插件：对话内多源搜索番剧，卡片展示 Bangumi 评分与详情，支持复制磁力。 |
| [notes](https://github.com/zhaoolee/notes) | [@zhaoolee](https://github.com/zhaoolee) | An open-source hammer-style notes app replicating the aesthetic of Smartisan Notes: one-command Docker private deployment, skill calls, dsh plugin support, multi-tenancy, one-command WeChat article formatting, and image export for notes. |
| [anysearch-dsh](https://github.com/anysearch-team/anysearch-dsh) | [@anysearch-team](https://github.com/anysearch-team) | AnySearch web search provider and advanced search tools for DeepSeek Harness (DSH) |
| [dsh-gitbash-preset](https://github.com/liceses/dsh-gitbash-preset) | [@liceses](https://github.com/liceses) | DeepSeek Harness 插件：一键安装「极简模式 (Git Bash)」agent preset —— 把 DSH 自带极简模式中的 bash 调用映射到 Git for Windows 的 bash（MSYS），让 Windows 上的极简模式真正可用。 |
| [dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) | [@yjh051108](https://github.com/yjh051108) | > ## 🎉 v0.3.0 重大声明（2026-08-14） > > 从经验补丁到源码契约——注入器完成规范重构。 |
| [Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | [@ChisaAlter](https://github.com/ChisaAlter) | An Electron desktop shell on top of the official DeepSeek Harness Web UI. |
| [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) | [@omdsh-dev](https://github.com/omdsh-dev) | See the Sidebar and conversation UI guide for the complete visual walkthrough. |
| [dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin) | [@kingOfSoySauce](https://github.com/kingOfSoySauce) | DeepSeek Harness 滑动变阻器皮肤 |
| [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) | [@Han-1413141](https://github.com/Han-1413141) | Session cost tracking plugin for the DeepSeek Harness web GUI (bilingual UI) |
| [awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins) | [@imsai-sh](https://github.com/imsai-sh) | DeepSeek Harness plugin store, marketplace and hub — 3,100+ dsh plugins with search, rankings, install commands and a free public API. DeepSeek Harness 插件市场 / 插件商店：自动收集与格式校验，免费搜索 API。deepseek1024.com |
| [dsh-noema](https://github.com/ZSeven-W/dsh-noema) | [@ZSeven-W](https://github.com/ZSeven-W) | DSH Noema connects DeepSeek Harness with Noema — a local-first, non-vector memory system for coding agents — so an Agent keeps durable knowledge across sessions instead of starting every conversation from zero. |
| [TokenLedger](https://github.com/zh667/TokenLedger) | [@zh667](https://github.com/zh667) | Relay-site attributed token usage for DeepSeek Harness — zero config, no credentials |
| [dsh-agent-team-gui](https://github.com/toolclub/dsh-agent-team-gui) | [@toolclub](https://github.com/toolclub) | Persistent, reusable multi-model Agent teams for DeepSeek Harness. |
| [humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) | [@Vladimir-Human](https://github.com/Vladimir-Human) | Русская версия → README.md |
| [gal-view](https://github.com/Ayase34/gal-view) | [@Ayase34](https://github.com/Ayase34) | A plugin that switches the DSH session interface into a galgame-style view. |
| [dsh-undo-plugin](https://github.com/lire1131/dsh-undo-plugin) | [@lire1131](https://github.com/lire1131) | DSH crash-rescue plugin: undo config & plugin-code changes, secret-safe snapshots, one-click SAFE MODE, plus offline CLI/GUI that work even when DSH cannot boot. |
| [odai](https://github.com/orziz/odai) | [@orziz](https://github.com/orziz) | odai is a governance-powered general task-execution framework for AI agents. |
| [dsh-pentest](https://github.com/howmp/dsh-pentest) | [@howmp](https://github.com/howmp) | 面向 DeepSeek Harness（dsh）的渗透测试模式  @CloverSecLabs |
| [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) | [@beancookie](https://github.com/beancookie) | Awesome DeepSeek Harness (DSH) Plugin. |
| [dsh-webui-market-plugin](https://github.com/Sanqi-normal/dsh-webui-market-plugin) | [@Sanqi-normal](https://github.com/Sanqi-normal) | dsh Web GUI 社区插件市场：浏览 awesome-dsh-plugin.com 插件目录，一键安装/卸载到 profile。Community plugin market for the DeepSeek Harness (dsh) web GUI: browse, install and uninstall plugins into a profile. |
| [dsh-plugin](https://github.com/Tabbit-Browser/dsh-plugin) | [@Tabbit-Browser](https://github.com/Tabbit-Browser) | Tabbit Broser plugins for Deepseek Harness |
| [dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) | [@HanaAyane](https://github.com/HanaAyane) | A Codex-style model and reasoning-effort control, built directly into DeepSeek Harness. |
| [dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) | [@Anionex](https://github.com/Anionex) | DSH Turn Rewind is maintained by anionex. If you would like to follow my future work, follow me on X or GitHub. |
| [DSH Workflow](https://github.com/icetomoyo/dsh_workflow) | [@icetomoyo](https://github.com/icetomoyo) | Upgrades DSH's one-off multi-agent scheduling into a Workflow layer that can be generated, saved, governed, observed, and recovered. |
| [dsh_workflow](https://github.com/omdsh-dev/dsh_workflow) | [@omdsh-dev](https://github.com/omdsh-dev) | @dsh-external/workflow turns DeepSeek Harness's one-off multi-agent execution into a reusable, governed, observable, and resumable workflow layer. It independently implements the complete workflow capability model demonstrated by KodaX while integrating with |
| [dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) | [@Ychris12138](https://github.com/Ychris12138) | Token usage heatmap, per-model breakdowns, and DeepSeek account balance for the DeepSeek Harness Web GUI (dsh web). |
| [dsh-skill-viewer](https://github.com/Fishquito7/dsh-skill-viewer) | [@Fishquito7](https://github.com/Fishquito7) | A DSH plugin for managing skills right from the web UI and terminal. |
| [cocode](https://github.com/cocode-agency/cocode) | [@cocode-agency](https://github.com/cocode-agency) | A ready-to-run DeepSeek Harness distribution. |
| [tokenbank](https://github.com/wink-run/tokenbank) | [@wink-run](https://github.com/wink-run) | Token Bank — the local LLM gateway that sits between your AI agents and every provider.  Know where tokens go · Spend less with smart routing to Ollama, Groq, GitHub Models · Earn by sharing idle quota on a community P2P network.  One-click onboarding for Cursor, Claude Code, Codex CLI, Gemini CLI — no agent changes. Full trace, seamless model swap |
| [dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) | [@omdsh-dev](https://github.com/omdsh-dev) | Selection-annotation plugin for DSH Web: select text → annotate → press Enter to send it along with your message; the model replies to each annotation by number. |
| [hello-dsh](https://github.com/pingfanfan/hello-dsh) | [@pingfanfan](https://github.com/pingfanfan) | → Full tutorial: Hello DSH |
| [dsh-image-gen](https://github.com/shanliuling/dsh-image-gen) | [@shanliuling](https://github.com/shanliuling) | Generate images directly in DeepSeek Harness chats |
| [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) | [@Nwflower](https://github.com/Nwflower) | Import 13 external agent conversation histories into DeepSeek Harness as full-fidelity, resumable sessions — and export / sync back to Claude Code. |
| [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | [@Alex-Yanggg](https://github.com/Alex-Yanggg) | A meticulously curated list of useful plugins, extensions, tools and development resources built for DSH, covering productivity enhancement, functional expansion, debugging utilities and custom development modules. |
| [sealos-skills](https://github.com/labring/sealos-skills) | [@labring](https://github.com/labring) | AI agent skills for Sealos — deploy any project, provision databases, object storage & more with one command. Works with Claude Code, Gemini CLI, Codex. |
| [dsh-kun-like-pet](https://github.com/liyupi/dsh-kun-like-pet) | [@liyupi](https://github.com/liyupi) | Kun Like 桌宠 —— DeepSeek Harness 桌面宠物插件：右下角小坤宠随 Agent 工作状态切换 9 种动作，任务完成播放「你干嘛~哎哟」 |
| [dsh-im](https://github.com/xmanrui/dsh-im) | [@xmanrui](https://github.com/xmanrui) | 通过扫码或机器人凭据把IM机器人接入DeepSeek Harness（支持飞书、微信、钉钉、企业微信、QQ、Slack、Telegram、Discord和WhatsApp）。 Connect IM bots to DeepSeek Harness via QR code or credentials (9 channels). |
| [dsh-vision](https://github.com/oil-oil/dsh-vision) | [@oil-oil](https://github.com/oil-oil) | \| Main model \| Image path \| Final answer \| \| --- \| --- \| --- \| \| Supports images \| Original images are sent directly, without preprocessing or OCR \| Current model \| |
| [dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider) | [@Mars-Sea](https://github.com/Mars-Sea) | Unofficial DeepSeek Harness LLM provider plugin for Command Code, ported from pi-commandcode-provider (MIT). It registers a commandcode provider whose requests are translated to Command Code's Provider API (POST /alpha/generate, reverse-engineered by the pi |
| [forkprobe](https://github.com/Jayden-X-L/forkprobe) | [@Jayden-X-L](https://github.com/Jayden-X-L) | Compare multiple skills on the same task and pick the winner. |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | [@omdsh-dev](https://github.com/omdsh-dev) | Desktop notifications for the DeepSeek Harness web GUI. When a session finishes a turn, the browser shows a system notification (via the Notification API), so you can switch tabs and still know when DSH is done. Per-outcome toggles and include/exclude keyword |
| [Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | [@like-study1](https://github.com/like-study1) | > Aggregating the DeepSeek Harness plugin ecosystem into an authoritative, comprehensive and continuously updated directory, guided by the official philosophy "Everything is a Plugin." |
| [dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot) | [@tencent-connect](https://github.com/tencent-connect) | A QQ Bot IM plugin for deepseek-harness (dsh), driving the dsh agent loop with the QQ messaging platform as the frontend protocol. |
| [ru-marketplace-mcp](https://github.com/Vladimir-Human/ru-marketplace-mcp) | [@Vladimir-Human](https://github.com/Vladimir-Human) | MCP-серверы для российских и китайских маркетплейсов. Цены, наличие, рейтинги, отзывы и реквизиты продавцов с Wildberries, Ozon, Яндекс Маркета, Детского мира, Авито, Taobao, Мегамаркета, Lamoda, DNS и Ситилинка. Плюс |
| [dsh-automation](https://github.com/titanwings/dsh-automation) | [@titanwings](https://github.com/titanwings) | DSH 自动化插件：让 Coding 任务按计划在全新 Agent Session 中运行，并由用户或 Agent 创建和管理定时任务。 / Run coding tasks in fresh Agent sessions and manage schedules from DSH Web or an Agent. |
| [ProMentor](https://github.com/Lyn-77/ProMentor) | [@Lyn-77](https://github.com/Lyn-77) | ProMentor 是一个 AI Coding Agent Skill。装上它，你的 AI 编程助手立刻化身为导师——扫描项目架构、生成阶梯式 Chapter、带你手写核心逻辑、自动判题、AI Code Review。 |
| [dsh-desktop](https://github.com/bruc3van/dsh-desktop) | [@bruc3van](https://github.com/bruc3van) | Keep your Agent safely resident on your desktop: the official Web UI untouched, long tasks no longer hostage to a terminal or a browser tab, curated plugins reviewed before install. |
| [superpowers-dsh](https://github.com/LayneChai/superpowers-dsh) | [@LayneChai](https://github.com/LayneChai) | Superpowers for the DeepSeek Harness: a plugin bundle that ports the core skills of obra/superpowers (the Claude-Code skills library: TDD, debugging, planning, collaboration patterns) |
| [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin) | [@awesome-dsh-plugin](https://github.com/awesome-dsh-plugin) | Find DSH plugins inside the agent — live GitHub dsh-plugin topic search, star-ranked. |
| [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) | [@omdsh-dev](https://github.com/omdsh-dev) | Data Agent for DeepSeek Harness: session-scoped database connections with a dedicated agent preset that lets AI write SQL and iterate against live execution feedback. |
| [dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store) | [@ZASENJC](https://github.com/ZASENJC) | A static DSH plugin marketplace that automatically categorizes, curates, and verifies GitHub dsh-plugin Topic projects. |
| [dsh-web-plugin-manager](https://github.com/LX2000WASD/dsh-web-plugin-manager) | [@LX2000WASD](https://github.com/LX2000WASD) | One-click plugin management for DeepSeek Harness in the Web UI: view, live enable/stop, install/uninstall, update detection, health checks (dependency/conflict/compatibility analysis), environment management, and a plugin marketplace. |
| [dsh-plugin-hub](https://github.com/Noob-stupid/dsh-plugin-hub) | [@Noob-stupid](https://github.com/Noob-stupid) | DeepSeek Harness (DSH) 插件管理面板：一键启用/停用插件 + GitHub dsh-plugin 插件市场，带插件详情与一键安装 \| Plugin manager & marketplace for DeepSeek Harness |
| [dsh-memento](https://github.com/PerryLink/dsh-memento) | [@PerryLink](https://github.com/PerryLink) | Bounded, layered, approval-gated, auditable cross-session memory for DeepSeek Harness. |
| [plugin-registry](https://github.com/vlln/plugin-registry) | [@vlln](https://github.com/vlln) | DSH 插件生态基建：薄控制台（浏览器面板管理官方 repository 插件，0 patch）+ make-dsh-plugin skill 官方插件开发引导 |
| [dsh-toy](https://github.com/c3ll256/dsh-toy) | [@c3ll256](https://github.com/c3ll256) | dsh-toy is a DeepSeek Harness plugin for connecting small toys to DSH. |
| [dsh-stock-watch](https://github.com/Awu12277/dsh-stock-watch) | [@Awu12277](https://github.com/Awu12277) | A股自选股实时行情盯盘插件 - DeepSeek Harness Web 右上角可折叠弹窗 |
| [dsh-multica-runtime](https://github.com/multica-ai/dsh-multica-runtime) | [@multica-ai](https://github.com/multica-ai) | Support dsh runtime on Multica. |
| [SpecFusion](https://github.com/wxkingstar/SpecFusion) | [@wxkingstar](https://github.com/wxkingstar) | 在 DeepSeek Harness / Claude Code / Cursor / Codex / Gemini CLI 里直接搜索 20 个中国开放平台的 65,600+ 篇 API 文档；零配置，支持 Skill 与 DSH 原生插件。 |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | [@omdsh-dev](https://github.com/omdsh-dev) | Open a workspace directory in VS Code straight from the DeepSeek Harness web GUI: every real Workspace row in the sidebar gains an Open in VSCode row inside its … overflow menu. |
| [Tydora](https://github.com/zuorn/Tydora) | [@zuorn](https://github.com/zuorn) | The ultimate writing experience : WYSIWYG, with an interface so clean that only the words remain. Not a single unnecessary distraction; wherever the cursor lands, your thoughts land directly on the screen. I poured every ounce of my obsession with " the feel |
| [local-shell-mcp](https://github.com/fwerkor/local-shell-mcp) | [@fwerkor](https://github.com/fwerkor) | A ChatGPT-ready MCP control plane for shell, files, browser automation, file links, and remote machines. |
| [mstar-harness](https://github.com/btspoony/mstar-harness) | [@btspoony](https://github.com/btspoony) | A Skill-driven Harness/Loop Engineering Workflow Agent Plugin |
| [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | [@LaplaceYoung](https://github.com/LaplaceYoung) | oh-my-dsh：面向 DSH (DeepSeek Harness) 的插件生态——700+ 插件，只通过扩展接缝注册，不修改 agent-loop 骨架 |
| [deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin) | [@HeiGeAi](https://github.com/HeiGeAi) | The place you run agents should look the way you like. |
| [deepseek-harness-desktop](https://github.com/xiincs/deepseek-harness-desktop) | [@xiincs](https://github.com/xiincs) | A real desktop app for DeepSeek Harness |
| [dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) | [@whiteguo233](https://github.com/whiteguo233) | OpenBiliClaw 是本地运行的跨平台个性化内容推荐 Agent，持续理解你的兴趣并主动找内容。本仓库是它的 DeepSeek Harness 插件：DSH 界面常驻第四栏（推荐/内容库/对话/画像/设置），注册 22 个 Agent Bridge 工具，让 Agent 也能读推荐、答探测、闭环学习。 |
| [dsh-navbar](https://github.com/vlln/dsh-navbar) | [@vlln](https://github.com/vlln) | DSH 插件：对话节点导航条（右缘节点串快速跳转 user 消息）。官方 bundle 插件，dsh plugin --profile web add 安装 |
| [dsh-notifier](https://github.com/THEWOLFWALKER/dsh-notifier) | [@THEWOLFWALKER](https://github.com/THEWOLFWALKER) | > Your agent, in your pocket. — 通知、审批、遥控，全在你的手机里。 |
| [dsh-deepseek-flow](https://github.com/kanghelyu/dsh-deepseek-flow) | [@kanghelyu](https://github.com/kanghelyu) | - Markdown as the source of truth — one master WORKFLOW.md, plus one STEP.md workspace for each step. |
| [dsh-suite](https://github.com/whyihaveyou/dsh-suite) | [@whyihaveyou](https://github.com/whyihaveyou) | Stop scrolling the dsh-plugin topic. Find plugins that still work. dsh-suite is a bilingual, living directory of DeepSeek Harness (DSH) plugins — refreshed hourly, compat-tested daily — with a built-in plugin store and scaffold. |
| [deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) | [@openma-ai](https://github.com/openma-ai) | TUI Plugin of DeepSeek Harness 让DeepSeek Harness在终端跑起来 |
| [ui-status-label](https://github.com/alingalingling/ui-status-label) | [@alingalingling](https://github.com/alingalingling) | 把你鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子 |
| [dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) | [@HuanLinOTO](https://github.com/HuanLinOTO) | 向模型暴露 MinerU 文档解析工具，将 PDF/图片/DOCX/PPTX/XLSX 转为结构化 Markdown/JSON \| Exposes MinerU document-parsing tools to the model, converting PDF/images/DOCX/PPTX/XLSX into structured Markdown/JSON |
| [dsh-lark](https://github.com/omdsh-dev/dsh-lark) | [@omdsh-dev](https://github.com/omdsh-dev) | Lark/Feishu IM bot channel for DeepSeek Harness. |
| [dsh-vision](https://github.com/william-jin-cmu/dsh-vision) | [@william-jin-cmu](https://github.com/william-jin-cmu) | dsh 插件：给纯文本 DeepSeek 加视觉——view_image 工具桥接任意 OpenAI 兼容 VLM（默认智谱免费档，实测 4 厂商 10 模型） |
| [allinluna](https://github.com/zenx0x/allinluna) | [@zenx0x](https://github.com/zenx0x) | > Stop running an entire project inside one AI conversation. |
| [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) | [@Chinesezjc](https://github.com/Chinesezjc) | Cross-instance message/event handoff plugins for DSH (interconnect service + tools) |
| [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) | [@Moeblack](https://github.com/Moeblack) | DSH 插件：分支式消息编辑、重掷、重试与版本时间线 \| DSH plugin: branch-based message editing, reroll, retry, version timeline |
| [deepseek-pet](https://github.com/keleus/deepseek-pet) | [@keleus](https://github.com/keleus) | 在你的deepseek-harness上养一只吃白饭的大蓝鲸 |
| [opc-nexus](https://github.com/h4dex/opc-nexus) | [@h4dex](https://github.com/h4dex) | 开源的企业版的数字员工工作台, OPC-Nexus（One Person Company Nexus）是一款本地优先的桌面 AI Agent 管理器。它为单人公司 / 独立开发者提供统一的 AI 数字员工管理平台 —— 从 Agent 创建、任务编排、多引擎接入，到消息渠道集成、工作流自动化和专家团协作，一站式覆盖。 （原内部项目AiBoxDash）  |
| [dshcode](https://github.com/whitelonng/dshcode) | [@whitelonng](https://github.com/whitelonng) | Community desktop companion for DeepSeek Harness — one-click Electron app for macOS and Windows. |
| [dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) | [@lhh010](https://github.com/lhh010) | A resident pixel-whale companion plugin for the DSH Web UI: a small whale lives permanently in the session title bar (right side of the title row) and reacts in real time to the session snapshot — zero core changes. |
| [dsh-share](https://github.com/hellodigua/dsh-share) | [@hellodigua](https://github.com/hellodigua) | Share DSH Q&As or selected conversation groups as PNG or Markdown. |
| [dsh-plugin-marketplace](https://github.com/AwesomeHou/dsh-plugin-marketplace) | [@AwesomeHou](https://github.com/AwesomeHou) | Plugin marketplace for DeepSeek Harness — live-syncs the GitHub dsh-plugin topic (1800+ repos) into a searchable, paginated settings tab with one-click install and agent tools (market_search / market_install). |
| [agent-handoff-skill](https://github.com/WeirdSky924/agent-handoff-skill) | [@WeirdSky924](https://github.com/WeirdSky924) | Use this cross-platform skill in Codex or Claude Code to establish repository-local continuity memory so a future agent can recover objective, status, decisions, validation, risks, and next actions without relying on previous chat history. |
| [dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) | [@yyyyukari](https://github.com/yyyyukari) | A Steam Workshop-style plugin browser for DeepSeek Harness (DSH) — zero-server, single-package, living right inside the DSH Web UI sidebar, directly under the "New Session" button. |
| [HoloGram](https://github.com/834063245-creator/HoloGram) | [@834063245-creator](https://github.com/834063245-creator) | 3D code dependency graph generator with built-in LLM agent. Language-agnostic (Python, TypeScript, Rust, Go, Java, C/C++, C#, Ruby, Kotlin, Swift, PHP, Lua). Coupling depth analysis, constraint gating, real-time file watching. Tauri 2 + Three.js + Rust engine.跨语言代码依赖拓扑图生成器 · 14 门语言统一 IR · 3D 全息星图 · 内置 AI Agent 双向联动 · 四级耦合诊断 · 桌面应用 / CLI 双模 |
| [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) | [@omdsh-dev](https://github.com/omdsh-dev) | Custom tools for the DeepSeek Harness: users author their own JavaScript tools in the settings UI with a Monaco (VS Code) editor and TypeScript intellisense, and the model grows and prunes the same toolset itself through custom_tool_create / |
| [dsh-xiaoyao-skins](https://github.com/147228/dsh-xiaoyao-skins) | [@147228](https://github.com/147228) | 夕小瑶 × DeepSeek Harness Web 皮肤合集、安装器与社区创作工具链 |
| [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) | [@omdsh-dev](https://github.com/omdsh-dev) | DSH plugin health-check tool — scans plugin repositories and diagnoses manifest protocol / patch format / build pitfalls / hub inclusion status, outputting compliance reports with fix suggestions. Read-only — it does not modify or build the checked repository. |
| [dsh-computer-use](https://github.com/Anionex/dsh-computer-use) | [@Anionex](https://github.com/Anionex) | DSH Computer Use is maintained by anionex. If you would like to follow my future work, follow me on X or GitHub. |
| [DSH-Desktop](https://github.com/JustGenius-s/DSH-Desktop) | [@JustGenius-s](https://github.com/JustGenius-s) | Prebuilt packages are published on GitHub Releases. First launch installs the DSH runtime (~1-2 min). |
| [dsh-plugin-cc](https://github.com/cpj-dev/dsh-plugin-cc) | [@cpj-dev](https://github.com/cpj-dev) | Bridge Deepseek-harness into Claude Code for review, critique, delegation, and session import. |
| [Co-Engram](https://github.com/Co-Engram/Co-Engram) | [@Co-Engram](https://github.com/Co-Engram) | \| Differentiator \| What it means \| \| ----------------------------------- \| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [dskin](https://github.com/dancingmemory/dskin) | [@dancingmemory](https://github.com/dancingmemory) | \| \| \| \| --- \| --- \| \| 🐱 1–4 pixel kittens \| adjustable count, per-cat breed switching, strolling at the bottom edge \| |
| [dsh-plugin-template](https://github.com/bugmaker2/dsh-plugin-template) | [@bugmaker2](https://github.com/bugmaker2) | Template for deepseek-harness plugin development. |
| [dsh-model-router](https://github.com/tianji-qingtian/dsh-model-router) | [@tianji-qingtian](https://github.com/tianji-qingtian) | Model Router & Cost Optimizer for DeepSeek Harness (dsh). Answers simple questions directly on the cheap model (zero prefix, no cache tax), degrades gracefully on transient provider failures, and shows live per-session token / cache-hit / cost figures right |

Includes 147 plugins, official plugins first; see [docs/plugins.json](docs/plugins.json) for source and update time.

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
