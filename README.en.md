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
many plugins, skins, distributions, and curated lists around it. This project brings those
GitHub-hosted projects together so developers can quickly find plugins by name, capability, and
usage.

Main capabilities:

- Web index page: search, filter by category and official status, and view each plugin name,
  description, usage, and project link.
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

## Plugin List

<!-- PLUGINS_START -->

| Plugin | Description | Usage |
| --- | --- | --- |
| [OpenViking](https://github.com/volcengine/OpenViking) | 👋 Join our Community | `dsh plugin --profile web add github:volcengine/OpenViking` |
| [voyager](https://github.com/Nagi-ovo/voyager) | We love AI chatbots, but sometimes we wish they had just a bit more structure. | `dsh plugin --profile web add github:Nagi-ovo/voyager` |
| [dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) | Experimental DeepSeek Harness agent presets — one base mode plus two variants — that anchor a session's first model request on the Minimal condition (real Minimal tool schema, no auto-injected context), then promote to a small | `dsh plugin --profile web add github:xiaobright/dsh-anchored-standard` |
| [BitFun](https://github.com/GCWing/BitFun) | Writes code, produces documents, and drives the desktop — with Mini Apps, a Rust runtime, and a self-hostable device-sync server. | `dsh plugin --profile web add github:GCWing/BitFun` |
| [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | dsh-TUI is an interactive terminal front door for DeepSeek Harness. It is mounted as a Cordis plugin and provides a Claude Code-style conversation, tool, session, and fullscreen terminal experience while continuing to use the | `dsh plugin --profile tui add github:ccch1mneyyy/dsh-TUI (one-command npm install)` |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | DSH Web whale-girl skin series (Maid Atelier) - CC BY-NC-SA 4.0. | `dsh plugin --profile web add github:Small-tailqwq/dsh-deep-whale` |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | A front-index repository (Radar): automatically scans and discovers DSH plugin candidates, then moves tested candidates into the downstream curated directory repositories. | `Open the website to view the automatic Radar scan and curated directories` |
| [working-activity](https://github.com/ccch1mneyyy/working-activity) | Lively Working-line extension for pi CLI and DSH | `dsh plugin --profile web add github:ccch1mneyyy/working-activity` |
| [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | A curated DeepSeek Harness ecosystem list: plugins, tools, and infrastructure from dsh-external/hub and public dsh-plugin topics. | `Open the website to browse the ecosystem list, or git clone it to read locally` |
| [graph-memory](https://github.com/adoresever/graph-memory) | Traceable, searchable, cross-session memory for AI agents. | `dsh plugin --profile web add github:adoresever/graph-memory` |
| [DSH Vision Toolkit](https://github.com/Anionex/dsh-vision-toolkit) | Brings agent-vision-toolkit into DSH as a native Profile Bundle: intent-aware image Q&A, long screenshot OCR, UI restoration, pixel verification, and other vision tools. | `dsh plugin add github:Anionex/dsh-vision-toolkit` |
| [dsh-market](https://github.com/dsh-market/dsh-market) | The plugin market inside DeepSeek Harness. Open Settings → Plugin Market → browse, search, one-click install. | `dsh plugin --profile web add github:dsh-market/dsh-market` |
| [mnemon](https://github.com/mnemon-dev/mnemon) | LLM-supervised persistent memory for AI agents — graph-based recall, cross-session knowledge, single binary. Works with Claude Code, OpenClaw, and any CLI agent. | `dsh plugin --profile web add github:mnemon-dev/mnemon` |
| [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | A DSH Web UI ad plugin in the style of a 2005 Chinese site: sidebar ads, in-conversation feed ads, corner pop-ups, and a close button whose real hit area is much smaller than it appears. All materials are fictional and domains are masked. | `dsh plugin --profile web add github:Nagi-ovo/dsh-ads` |
| [superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | Stop shipping AI-slop UI. Coding agents write great code and mediocre interfaces: generic layouts, default shadcn everything, no taste. Superdesign is the skill that gives your agent design judgment, so the UI it ships actually looks considered. | `dsh plugin --profile web add github:superdesigndev/superdesign-skill` |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | AgentTeams multi-agent teamwork plugin: one sentence drives a team to complete a goal, with a live team activity panel in the top-right of the Web GUI. | `npx -p @deepseek-ai/dsh dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` |
| [de-anthropocentric-research-engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine) | The complete research orchestration system for AI-native science. | `dsh plugin --profile web add github:yogsoth-ai/de-anthropocentric-research-engine` |
| [dsh-vision-router](https://github.com/ysr666/dsh-vision-router) | Most DSH vision plugins bridge images to DeepSeek as text descriptions — lossy, one-shot, and blind to pixels. This plugin keeps the original pixels on the vision model's side and DeepSeek on the reasoning side, and makes looking at an image an ordinary tool | `dsh plugin --profile web add github:ysr666/dsh-vision-router` |
| [dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | > From zero to one with DeepSeek Harness — the beginner's encyclopedia for DeepSeek's open-source agent runtime. | `dsh plugin --profile web add github:Electricitysheep/dsh-handbook` |
| [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) | Codex-style @file mentions: search workspace files from the input, press Enter to attach, and inject file contents when sending. | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-at-file/archive/refs/heads/main.tar.gz` |
| [opc-nexus](https://github.com/h4dex/opc-nexus) | 开源的企业版的数字员工工作台, OPC-Nexus（One Person Company Nexus）是一款本地优先的桌面 AI Agent 管理器。它为单人公司 / 独立开发者提供统一的 AI 数字员工管理平台 —— 从 Agent 创建、任务编排、多引擎接入，到消息渠道集成、工作流自动化和专家团协作，一站式覆盖。 （原内部项目AiBoxDash）  | `dsh plugin --profile web add github:h4dex/opc-nexus` |
| [Oh-DSH](https://github.com/hust-open-atom-club/oh-dsh) | An all-in-one DeepSeek Harness community distribution: unified desktop, Web UI, and TUI experiences with layered installation. | `Use the desktop/Web/TUI install scripts in the README to install the distribution` |
| [dsh-work](https://github.com/vibeinging/dsh-work) | A local-first AI workbench for DSH Plugins, combining Agent sessions, project files, data analysis, web research, MCP, and Office artifacts in an Electron desktop app. | `dsh plugin --profile web add github:vibeinging/dsh-work` |
| [deepseek-harness-desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app) | DeepSeek Harness Desktop App: a local AI desktop workspace for DSH Sessions, projects, files, web research, plugins, and Office artifacts. | `dsh plugin --profile web add github:vibeinging/deepseek-harness-desktop-app` |
| [dsh-browser](https://github.com/Lum1104/dsh-browser) | A Chrome sidebar extension and bridge plugin that lets DSH control the browser you are already using without vision capabilities. | `Run scripts/install.sh to install the Chrome MV3 extension and plugin bridge` |
| [dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) | dsh-tianshu-tui (@huiliyi37/dsh-tianshu-tui) is the interactive terminal UI plugin for the official DeepSeek Harness. The render core evolved from Tianshu-Tui (Apache-2.0; file-by-file provenance in SOURCE-MAP.md). The UI is a pure presentation layer: every workflow adds TDD, evidence gates, and visual image modules on top of the official base. | `dsh plugin --profile web add github:huiliyi37/dsh-tianshu-tui` |
| [whale-girl](https://github.com/vlln/whale-girl) | A DSH Web GUI desktop pet plugin in QQ-pet style: a floating, draggable companion in the lower-right corner that you can feed and play with. | `dsh plugin --profile web add "github:vlln/whale-girl#main"` |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | Find the right DeepSeek Harness plugin in 30 seconds: tells you what problem a plugin solves, who it is for, and where to start. | `Open the website and choose plugins by the problem they solve` |
| [engramory](https://github.com/tinqiao-oss/engramory) | An opinionated, zero-infrastructure memory *protocol for small-scale, local, file-based agent memory** — a strict curation discipline plus a validator (tools/engramory_doctor.py), loaded as standing rules (CLAUDE.md / | `dsh plugin --profile web add github:tinqiao-oss/engramory` |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | In-conversation generative UI plugin: the model draws interactive HTML cards directly into the conversation flow for simulators, charts, comparison panels, and UI mockups. | `dsh plugin --profile web add github:Nagi-ovo/dsh-visualize` |
| [notes](https://github.com/zhaoolee/notes) | An open-source hammer-style notes app replicating the aesthetic of Smartisan Notes: one-command Docker private deployment, skill calls, dsh plugin support, multi-tenancy, one-command WeChat article formatting, and image export for notes. | `dsh plugin --profile web add github:zhaoolee/notes` |
| [dsh-genui](https://github.com/omdsh-dev/dsh-genui) | Renders interactive UI components in assistant replies: layouts, charts, forms, quizzes, mermaid, and more, inlined through dsh-ui fences. | `dsh plugin --profile web add github:omdsh-dev/dsh-genui` |
| [deepseek-harness-studio](https://github.com/fufankeji/deepseek-harness-studio) | DeepSeek Harness Desktop for macOS & Windows — zero-code Plugin Store, one-click install and enable, vision enhancement, automatic plugin delivery, and AI recommendations. | `dsh plugin --profile web add github:fufankeji/deepseek-harness-studio` |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | A lightweight Windows launcher for DeepSeek Harness: starts at login, runs in a small standalone window, and opens with a double click. | `Download the .msi or portable ZIP from Releases and double-click to run` |
| [DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin) | A highly customizable glassmorphism theme layered onto the DeepSeek Harness web UI, turning the top bar, sidebar, input box, stats row, and trajectory view into frosted glass panels with adjustable blur, frosting, and background. | `dsh plugin --profile web add github:WYH66666666/DSH-Transparent-UI-Plugin` |
| [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | Ask DSH, "is there a plugin for this?" It searches the GitHub dsh-plugin topic, explains the best matches, waits for your choice, then installs and verifies the selected plugin. | `dsh plugin --profile web add github:Nagi-ovo/dsh-find-plugins` |
| [dsh-gitbash-preset](https://github.com/liceses/dsh-gitbash-preset) | DeepSeek Harness 插件：一键安装「极简模式 (Git Bash)」agent preset —— 把 DSH 自带极简模式中的 bash 调用映射到 Git for Windows 的 bash（MSYS），让 Windows 上的极简模式真正可用。 | `dsh plugin --profile web add github:liceses/dsh-gitbash-preset` |
| [ModSearch](https://github.com/liustack/modsearch) | A web search plugin that connects text-only models to the internet: search the web or X and return structured JSON evidence (search, fetch, cite). | `dsh plugin add @liustack/modsearch (npm)` |
| [dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) | A plugin-only cross-session long-term memory and background self-evolution system: five-track memory, Git branch awareness, skill self-evolution, four-track tasks, session broadcast, and search. | `dsh plugin add github:csyangwen/dsh-memory-evolve` |
| [dsh-context](https://github.com/bowenliang123/dsh-context) | See what your DeepSeek Harness agent's context window is actually made of and how it evolves. | `dsh plugin --profile web add github:bowenliang123/dsh-context` |
| [humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) | Русская версия → README.md | `dsh plugin --profile web add github:Vladimir-Human/humanizer-ru` |
| [dshfind](https://github.com/hikariming/dshfind) | The learning & sharing community for DeepSeek Harness (DSH) | `dsh plugin --profile web add github:hikariming/dshfind` |
| [DSH OpenPencil](https://github.com/ZSeven-W/dsh-openpencil) | OpenPencil design preview and editing plugin: preview, inspect, and edit real .op documents in a session. | `dsh plugin add @zseven-w/dsh-openpencil (npm)` |
| [Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | An Electron desktop shell on top of the official DeepSeek Harness Web UI. | `dsh plugin --profile web add github:ChisaAlter/Deepseek-Harness-Desktop` |
| [Awesome-DeepSeek-Harness-Plugins](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins) | A concise, daily-curated directory of public plugins and extensions for DeepSeek Harness (DSH), the open-source DeepSeek agent harness. Explore tools, skills, model providers, memory, automation, runtimes, desktop clients, browser integrations, and developer tools. | `dsh plugin --profile web add github:Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins` |
| [odai](https://github.com/orziz/odai) | odai is a governance-powered general task-execution framework for AI agents. | `dsh plugin --profile web add github:orziz/odai` |
| [awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) | - Table of Contents - Quick Start - Launch the Web UI | `dsh plugin --profile web add github:libukai/awesome-deepseek-harness` |
| [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | A curated list of plugins, skills, MCP servers, patch/profile layers, orchestrators & UIs for DeepSeek Harness (DSH). Visualization · PPT · Coding · Agents · Loops (auto-research) and more. #dsh | `dsh plugin --profile web add github:Dominic789654/awesome-deepseek-harness` |
| [dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) | > ## 🎉 v0.3.0 重大声明（2026-08-14） > > 从经验补丁到源码契约——注入器完成规范重构。 | `dsh plugin --profile web add github:yjh051108/dsh-super-injector` |
| [dsh-noema](https://github.com/ZSeven-W/dsh-noema) | DSH Noema connects DeepSeek Harness with Noema — a local-first, non-vector memory system for coding agents — so an Agent keeps durable knowledge across sessions instead of starting every conversation from zero. | `dsh plugin --profile web add github:ZSeven-W/dsh-noema` |
| [tokenbank](https://github.com/wink-run/tokenbank) | Token Bank — the local LLM gateway that sits between your AI agents and every provider.  Know where tokens go · Spend less with smart routing to Ollama, Groq, GitHub Models · Earn by sharing idle quota on a community P2P network.  One-click onboarding for Cursor, Claude Code, Codex CLI, Gemini CLI — no agent changes. Full trace, seamless model swap | `dsh plugin --profile web add github:wink-run/tokenbank` |
| [sealos-skills](https://github.com/labring/sealos-skills) | AI agent skills for Sealos — deploy any project, provision databases, object storage & more with one command. Works with Claude Code, Gemini CLI, Codex. | `dsh plugin --profile web add github:labring/sealos-skills` |
| [Co-Engram](https://github.com/Co-Engram/Co-Engram) | \| Differentiator \| What it means \| \| ----------------------------------- \| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | `dsh plugin --profile web add github:Co-Engram/Co-Engram` |
| [forkprobe](https://github.com/Jayden-X-L/forkprobe) | Compare multiple skills on the same task and pick the winner. | `dsh plugin --profile web add github:Jayden-X-L/forkprobe` |
| [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | A meticulously curated list of useful plugins, extensions, tools and development resources built for DSH, covering productivity enhancement, functional expansion, debugging utilities and custom development modules. | `dsh plugin --profile web add github:Alex-Yanggg/awesome-DSH-plugin` |
| [gal-view](https://github.com/Ayase34/gal-view) | A plugin that switches the DSH session interface into a galgame-style view. | `dsh plugin --profile web add github:Ayase34/gal-view` |
| [ru-marketplace-mcp](https://github.com/Vladimir-Human/ru-marketplace-mcp) | MCP-серверы для российских и китайских маркетплейсов. Цены, наличие, рейтинги, отзывы и реквизиты продавцов с Wildberries, Ozon, Яндекс Маркета, Детского мира, Авито, Taobao, Мегамаркета, Lamoda, DNS и Ситилинка. Плюс | `dsh plugin --profile web add github:Vladimir-Human/ru-marketplace-mcp` |
| [DSH Turn Rewind](https://github.com/Anionex/dsh-turn-rewind) | A conversation and code state rollback plugin based on a persistent Change Ledger. | `dsh plugin add github:Anionex/dsh-turn-rewind` |
| [DSH Workflow](https://github.com/icetomoyo/dsh_workflow) | Upgrades DSH's one-off multi-agent scheduling into a Workflow layer that can be generated, saved, governed, observed, and recovered. | `dsh plugin add github:icetomoyo/dsh_workflow` |
| [dsh-webui-market-plugin](https://github.com/Sanqi-normal/dsh-webui-market-plugin) | dsh Web GUI 社区插件市场：浏览 awesome-dsh-plugin.com 插件目录，一键安装/卸载到 profile。Community plugin market for the DeepSeek Harness (dsh) web GUI: browse, install and uninstall plugins into a profile. | `dsh plugin --profile web add github:Sanqi-normal/dsh-webui-market-plugin` |
| [dsh_workflow](https://github.com/omdsh-dev/dsh_workflow) | @dsh-external/workflow turns DeepSeek Harness's one-off multi-agent execution into a reusable, governed, observable, and resumable workflow layer. It independently implements the complete workflow capability model demonstrated by KodaX while integrating with | `dsh plugin --profile web add github:omdsh-dev/dsh_workflow` |
| [hello-dsh](https://github.com/pingfanfan/hello-dsh) | → Full tutorial: Hello DSH | `dsh plugin --profile web add github:pingfanfan/hello-dsh` |
| [dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) | Selection-annotation plugin for DSH Web: select text → annotate → press Enter to send it along with your message; the model replies to each annotation by number. | `dsh plugin --profile web add github:omdsh-dev/dsh-annotation` |
| [ProMentor](https://github.com/Lyn-77/ProMentor) | ProMentor 是一个 AI Coding Agent Skill。装上它，你的 AI 编程助手立刻化身为导师——扫描项目架构、生成阶梯式 Chapter、带你手写核心逻辑、自动判题、AI Code Review。 | `dsh plugin --profile web add github:Lyn-77/ProMentor` |
| [anysearch-dsh](https://github.com/anysearch-team/anysearch-dsh) | AnySearch web search provider and advanced search tools for DeepSeek Harness (DSH) | `dsh plugin --profile web add github:anysearch-team/anysearch-dsh` |
| [deepseek-harness-desktop](https://github.com/ningbainb/deepseek-harness-desktop) | Open-source Windows desktop client and GUI for DeepSeek Harness — zero-setup installer with Codex, plugins, skills, SSH, mobile remote access, and 11 skins. | `dsh plugin --profile web add github:ningbainb/deepseek-harness-desktop` |
| [dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin) | DeepSeek Harness 滑动变阻器皮肤 | `dsh plugin --profile web add github:kingOfSoySauce/dsh-liang-skin` |
| [dsh-toy](https://github.com/c3ll256/dsh-toy) | dsh-toy is a DeepSeek Harness plugin for connecting small toys to DSH. | `dsh plugin --profile web add github:c3ll256/dsh-toy` |
| [dsh-vision](https://github.com/oil-oil/dsh-vision) | \| Main model \| Image path \| Final answer \| \| --- \| --- \| --- \| \| Supports images \| Original images are sent directly, without preprocessing or OCR \| Current model \| | `dsh plugin --profile web add github:oil-oil/dsh-vision` |
| [dsh-pet](https://github.com/PC2005-cloud/dsh-pet) | DSH 桌面宠物：一行命令安装现成宠物（28 个透明动画，即装即用），或内置素材链从 AI 视频自造专属宠物 \| One-line install desktop pet for DeepSeek Harness + DIY asset pipeline | `dsh plugin --profile web add github:PC2005-cloud/dsh-pet` |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | Sends a desktop notification when a DeepSeek Harness session completes, with rules for result type and keywords. | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-notification/archive/refs/heads/main.tar.gz` |
| [dsh-web-plugin-manager](https://github.com/LX2000WASD/dsh-web-plugin-manager) | One-click plugin management for DeepSeek Harness in the Web UI: view, live enable/stop, install/uninstall, update detection, health checks (dependency/conflict/compatibility analysis), environment management, and a plugin marketplace. | `dsh plugin --profile web add github:LX2000WASD/dsh-web-plugin-manager` |
| [dsh-dafeiyu](https://github.com/QCYTSN/dsh-dafeiyu) | A desktop companion that lives on Windows and reacts to real DeepSeek Harness activity. | `dsh plugin --profile web add github:QCYTSN/dsh-dafeiyu` |
| [plugin-registry](https://github.com/vlln/plugin-registry) | DSH 插件生态基建：薄控制台（浏览器面板管理官方 repository 插件，0 patch）+ make-dsh-plugin skill 官方插件开发引导 | `dsh plugin --profile web add github:vlln/plugin-registry` |
| [deepseek-harness-desktop](https://github.com/xiincs/deepseek-harness-desktop) | A real desktop app for DeepSeek Harness | `dsh plugin --profile web add github:xiincs/deepseek-harness-desktop` |
| [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | oh-my-dsh：面向 DSH (DeepSeek Harness) 的插件生态——700+ 插件，只通过扩展接缝注册，不修改 agent-loop 骨架 | `dsh plugin --profile web add github:LaplaceYoung/oh-my-dsh` |
| [dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store) | A static DSH plugin marketplace that automatically categorizes, curates, and verifies GitHub dsh-plugin Topic projects. | `dsh plugin --profile web add github:ZASENJC/dsh-plugins-store` |
| [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) | Awesome DeepSeek Harness (DSH) Plugin. | `dsh plugin --profile web add github:beancookie/awesome-dsh-plugin` |
| [deepseek-design](https://github.com/Devin-AXIS/deepseek-design) | DeepSeek Harness 可编辑设计系统：AI 生成、可视化编辑、模板市场与 PPT｜Native Design & PPT Studio for DeepSeek Harness. | `dsh plugin --profile web add github:Devin-AXIS/deepseek-design` |
| [dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) | A Codex-style model and reasoning-effort control, built directly into DeepSeek Harness. | `dsh plugin --profile web add github:HanaAyane/dsh-reasoning-effort` |
| [local-shell-mcp](https://github.com/fwerkor/local-shell-mcp) | A ChatGPT-ready MCP control plane for shell, files, browser automation, file links, and remote machines. | `dsh plugin --profile web add github:fwerkor/local-shell-mcp` |
| [dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot) | A QQ Bot IM plugin for deepseek-harness (dsh), driving the dsh agent loop with the QQ messaging platform as the frontend protocol. | `dsh plugin --profile web add github:tencent-connect/dsh-qqbot` |
| [mstar-harness](https://github.com/btspoony/mstar-harness) | A Skill-driven Harness/Loop Engineering Workflow Agent Plugin | `dsh plugin --profile web add github:btspoony/mstar-harness` |
| [dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) | Token usage heatmap, per-model breakdowns, and DeepSeek account balance for the DeepSeek Harness Web GUI (dsh web). | `dsh plugin --profile web add github:Ychris12138/dsh-usage-stats` |
| [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) | See the Sidebar and conversation UI guide for the complete visual walkthrough. | `dsh plugin --profile web add github:omdsh-dev/dsh-mnemon` |
| [dsh-undo-plugin](https://github.com/lire1131/dsh-undo-plugin) | DSH crash-rescue plugin: undo config & plugin-code changes, secret-safe snapshots, one-click SAFE MODE, plus offline CLI/GUI that work even when DSH cannot boot. | `dsh plugin --profile web add github:lire1131/dsh-undo-plugin` |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | Opens VS Code in the current directory directly from the sidebar workspace menu in the DSH Web GUI. | `dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode` |
| [dsh-desktop](https://github.com/bruc3van/dsh-desktop) | Keep your Agent safely resident on your desktop: the official Web UI untouched, long tasks no longer hostage to a terminal or a browser tab, curated plugins reviewed before install. | `dsh plugin --profile web add github:bruc3van/dsh-desktop` |
| [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) | Session cost tracking plugin for the DeepSeek Harness web GUI (bilingual UI) | `dsh plugin --profile web add github:Han-1413141/dsh-cost-meter` |
| [dsh-automation](https://github.com/titanwings/dsh-automation) | DSH 自动化插件：让 Coding 任务按计划在全新 Agent Session 中运行，并由用户或 Agent 创建和管理定时任务。 / Run coding tasks in fresh Agent sessions and manage schedules from DSH Web or an Agent. | `dsh plugin --profile web add github:titanwings/dsh-automation` |
| [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) | Import 13 external agent conversation histories into DeepSeek Harness as full-fidelity, resumable sessions — and export / sync back to Claude Code. | `dsh plugin --profile web add github:Nwflower/dsh-chat-import` |
| [dsh-kun-like-pet](https://github.com/liyupi/dsh-kun-like-pet) | Kun Like 桌宠 —— DeepSeek Harness 桌面宠物插件：右下角小坤宠随 Agent 工作状态切换 9 种动作，任务完成播放「你干嘛~哎哟」 | `dsh plugin --profile web add github:liyupi/dsh-kun-like-pet` |
| [dsh-skill-viewer](https://github.com/Fishquito7/dsh-skill-viewer) | A DSH plugin for managing skills right from the web UI and terminal. | `dsh plugin --profile web add github:Fishquito7/dsh-skill-viewer` |
| [dsh-multica-runtime](https://github.com/multica-ai/dsh-multica-runtime) | Support dsh runtime on Multica. | `dsh plugin --profile web add github:multica-ai/dsh-multica-runtime` |
| [Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | > Aggregating the DeepSeek Harness plugin ecosystem into an authoritative, comprehensive and continuously updated directory, guided by the official philosophy "Everything is a Plugin." | `dsh plugin --profile web add github:like-study1/Oh-My-DSH` |
| [deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin) | The place you run agents should look the way you like. | `dsh plugin --profile web add github:HeiGeAi/deepseek-harness-skin` |
| [superpowers-dsh](https://github.com/LayneChai/superpowers-dsh) | Superpowers for the DeepSeek Harness: a plugin bundle that ports the core skills of obra/superpowers (the Claude-Code skills library: TDD, debugging, planning, collaboration patterns) | `dsh plugin --profile web add github:LayneChai/superpowers-dsh` |
| [dsh-suite](https://github.com/whyihaveyou/dsh-suite) | Stop scrolling the dsh-plugin topic. Find plugins that still work. dsh-suite is a bilingual, living directory of DeepSeek Harness (DSH) plugins — refreshed hourly, compat-tested daily — with a built-in plugin store and scaffold. | `dsh plugin --profile web add github:whyihaveyou/dsh-suite` |
| [ui-status-label](https://github.com/alingalingling/ui-status-label) | 把你鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子 | `dsh plugin --profile web add github:alingalingling/ui-status-label` |
| [dsh-plugin](https://github.com/Tabbit-Browser/dsh-plugin) | Tabbit Broser plugins for Deepseek Harness | `dsh plugin --profile web add github:Tabbit-Browser/dsh-plugin` |
| [dskin](https://github.com/dancingmemory/dskin) | \| \| \| \| --- \| --- \| \| 🐱 1–4 pixel kittens \| adjustable count, per-cat breed switching, strolling at the bottom edge \| | `dsh plugin --profile web add github:dancingmemory/dskin` |
| [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin) | Find DSH plugins inside the agent — live GitHub dsh-plugin topic search, star-ranked. | `dsh plugin --profile web add github:awesome-dsh-plugin/dsh-find-plugin` |
| [dsh-plugin-hub](https://github.com/Noob-stupid/dsh-plugin-hub) | DeepSeek Harness (DSH) 插件管理面板：一键启用/停用插件 + GitHub dsh-plugin 插件市场，带插件详情与一键安装 \| Plugin manager & marketplace for DeepSeek Harness | `dsh plugin --profile web add github:Noob-stupid/dsh-plugin-hub` |
| [dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) | OpenBiliClaw 是本地运行的跨平台个性化内容推荐 Agent，持续理解你的兴趣并主动找内容。本仓库是它的 DeepSeek Harness 插件：DSH 界面常驻第四栏（推荐/内容库/对话/画像/设置），注册 22 个 Agent Bridge 工具，让 Agent 也能读推荐、答探测、闭环学习。 | `dsh plugin --profile web add github:whiteguo233/dsh-openbiliclaw` |
| [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) | Data Agent for DeepSeek Harness: session-scoped database connections with a dedicated agent preset that lets AI write SQL and iterate against live execution feedback. | `dsh plugin --profile web add github:omdsh-dev/dsh-data-agent` |
| [dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) | A resident pixel-whale companion plugin for the DSH Web UI: a small whale lives permanently in the session title bar (right side of the title row) and reacts in real time to the session snapshot — zero core changes. | `dsh plugin --profile web add github:lhh010/dsh-ui-whale` |
| [dsh-vision](https://github.com/william-jin-cmu/dsh-vision) | dsh 插件：给纯文本 DeepSeek 加视觉——view_image 工具桥接任意 OpenAI 兼容 VLM（默认智谱免费档，实测 4 厂商 10 模型） | `dsh plugin --profile web add github:william-jin-cmu/dsh-vision` |
| [deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) | TUI Plugin of DeepSeek Harness 让DeepSeek Harness在终端跑起来 | `dsh plugin --profile web add github:openma-ai/deepseek-harness-tui` |
| [dsh-notifier](https://github.com/THEWOLFWALKER/dsh-notifier) | > Your agent, in your pocket. — 通知、审批、遥控，全在你的手机里。 | `dsh plugin --profile web add github:THEWOLFWALKER/dsh-notifier` |
| [allinluna](https://github.com/zenx0x/allinluna) | > Stop running an entire project inside one AI conversation. | `dsh plugin --profile web add github:zenx0x/allinluna` |
| [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) | Cross-instance message/event handoff plugins for DSH (interconnect service + tools) | `dsh plugin --profile web add github:Chinesezjc/dsh-interconnect` |
| [Tydora](https://github.com/zuorn/Tydora) | The ultimate writing experience : WYSIWYG, with an interface so clean that only the words remain. Not a single unnecessary distraction; wherever the cursor lands, your thoughts land directly on the screen. I poured every ounce of my obsession with " the feel | `dsh plugin --profile web add github:zuorn/Tydora` |
| [dsh-stock-watch](https://github.com/Awu12277/dsh-stock-watch) | A股自选股实时行情盯盘插件 - DeepSeek Harness Web 右上角可折叠弹窗 | `dsh plugin --profile web add github:Awu12277/dsh-stock-watch` |
| [dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider) | Unofficial DeepSeek Harness LLM provider plugin for Command Code, ported from pi-commandcode-provider (MIT). It registers a commandcode provider whose requests are translated to Command Code's Provider API (POST /alpha/generate, reverse-engineered by the pi | `dsh plugin --profile web add github:Mars-Sea/dsh-commandcode-provider` |
| [agent-handoff-skill](https://github.com/WeirdSky924/agent-handoff-skill) | Use this cross-platform skill in Codex or Claude Code to establish repository-local continuity memory so a future agent can recover objective, status, decisions, validation, risks, and next actions without relying on previous chat history. | `dsh plugin --profile web add github:WeirdSky924/agent-handoff-skill` |
| [dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) | 向模型暴露 MinerU 文档解析工具，将 PDF/图片/DOCX/PPTX/XLSX 转为结构化 Markdown/JSON \| Exposes MinerU document-parsing tools to the model, converting PDF/images/DOCX/PPTX/XLSX into structured Markdown/JSON | `dsh plugin --profile web add github:HuanLinOTO/dsh-plugin-mineru` |
| [dsh-navbar](https://github.com/vlln/dsh-navbar) | DSH 插件：对话节点导航条（右缘节点串快速跳转 user 消息）。官方 bundle 插件，dsh plugin --profile web add 安装 | `dsh plugin --profile web add github:vlln/dsh-navbar` |
| [deepseek-pet](https://github.com/keleus/deepseek-pet) | 在你的deepseek-harness上养一只吃白饭的大蓝鲸 | `dsh plugin --profile web add github:keleus/deepseek-pet` |
| [dsh-plugin-cc](https://github.com/cpj-dev/dsh-plugin-cc) | Bridge Deepseek-harness into Claude Code for review, critique, delegation, and session import. | `dsh plugin --profile web add github:cpj-dev/dsh-plugin-cc` |
| [dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) | A Steam Workshop-style plugin browser for DeepSeek Harness (DSH) — zero-server, single-package, living right inside the DSH Web UI sidebar, directly under the "New Session" button. | `dsh plugin --profile web add github:yyyyukari/dsh-plugin-workshop` |
| [dsh-model-router](https://github.com/tianji-qingtian/dsh-model-router) | Model Router & Cost Optimizer for DeepSeek Harness (dsh). Answers simple questions directly on the cheap model (zero prefix, no cache tax), degrades gracefully on transient provider failures, and shows live per-session token / cache-hit / cost figures right | `dsh plugin --profile web add github:tianji-qingtian/dsh-model-router` |
| [dshcode](https://github.com/whitelonng/dshcode) | Community desktop companion for DeepSeek Harness — one-click Electron app for macOS and Windows. | `dsh plugin --profile web add github:whitelonng/dshcode` |
| [dsh-plugin-template](https://github.com/bugmaker2/dsh-plugin-template) | Template for deepseek-harness plugin development. | `dsh plugin --profile web add github:bugmaker2/dsh-plugin-template` |
| [HoloGram](https://github.com/834063245-creator/HoloGram) | 3D code dependency graph generator with built-in LLM agent. Language-agnostic (Python, TypeScript, Rust, Go, Java, C/C++, C#, Ruby, Kotlin, Swift, PHP, Lua). Coupling depth analysis, constraint gating, real-time file watching. Tauri 2 + Three.js + Rust engine.跨语言代码依赖拓扑图生成器 · 14 门语言统一 IR · 3D 全息星图 · 内置 AI Agent 双向联动 · 四级耦合诊断 · 桌面应用 / CLI 双模 | `dsh plugin --profile web add github:834063245-creator/HoloGram` |
| [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) | Custom tools for the DeepSeek Harness: users author their own JavaScript tools in the settings UI with a Monaco (VS Code) editor and TypeScript intellisense, and the model grows and prunes the same toolset itself through custom_tool_create / | `dsh plugin --profile web add github:omdsh-dev/dsh-custom-tool` |
| [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) | DSH 插件：分支式消息编辑、重掷、重试与版本时间线 \| DSH plugin: branch-based message editing, reroll, retry, version timeline | `dsh plugin --profile web add github:Moeblack/dsh-message-edit` |
| [dsh-lark](https://github.com/omdsh-dev/dsh-lark) | Lark/Feishu IM bot channel for DeepSeek Harness. | `dsh plugin --profile web add github:omdsh-dev/dsh-lark` |
| [dsh-xiaoyao-skins](https://github.com/147228/dsh-xiaoyao-skins) | 夕小瑶 × DeepSeek Harness Web 皮肤合集、安装器与社区创作工具链 | `dsh plugin --profile web add github:147228/dsh-xiaoyao-skins` |
| [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) | DSH plugin health-check tool — scans plugin repositories and diagnoses manifest protocol / patch format / build pitfalls / hub inclusion status, outputting compliance reports with fix suggestions. Read-only — it does not modify or build the checked repository. | `dsh plugin --profile web add github:omdsh-dev/dsh-plugin-check` |
| [DSH-Desktop](https://github.com/JustGenius-s/DSH-Desktop) | Prebuilt packages are published on GitHub Releases. First launch installs the DSH runtime (~1-2 min). | `dsh plugin --profile web add github:JustGenius-s/DSH-Desktop` |
| [dsh-computer-use](https://github.com/Anionex/dsh-computer-use) | DSH Computer Use is maintained by anionex. If you would like to follow my future work, follow me on X or GitHub. | `dsh plugin --profile web add github:Anionex/dsh-computer-use` |
| [dsh-plugin-marketplace](https://github.com/AwesomeHou/dsh-plugin-marketplace) | Plugin marketplace for DeepSeek Harness — live-syncs the GitHub dsh-plugin topic (1800+ repos) into a searchable, paginated settings tab with one-click install and agent tools (market_search / market_install). | `dsh plugin --profile web add github:AwesomeHou/dsh-plugin-marketplace` |
| [dsh-share](https://github.com/hellodigua/dsh-share) | Share DSH Q&As or selected conversation groups as PNG or Markdown. | `dsh plugin --profile web add github:hellodigua/dsh-share` |

Includes 133 plugins, official plugins first; see [docs/plugins.json](docs/plugins.json) for source and update time.

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
│   └── plugins.json      # single data source
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
