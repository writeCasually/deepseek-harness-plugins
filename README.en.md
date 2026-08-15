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
- Security and privacy review: non-official plugins are statically scanned for privacy risks and
  annotated with findings.
- Official first: DeepSeek AI official plugins are displayed before community plugins.
- Human review entry point: automated discoveries are submitted as pull requests and are published
  after merge.

## Plugin List

<!-- PLUGINS_START -->

| Plugin | Description | Usage |
| --- | --- | --- |
| ★ Official [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | DeepSeek Harness core runtime: Everything is a Plugin. | `npx @deepseek-ai/dsh starts the core; mount plugins with dsh plugin --profile web add <source>` |
| [archify](https://github.com/tt-a1i/archify) | Agent skill for beautiful, verifiable architecture, workflow, sequence, data-flow, and lifecycle diagrams—self-contained HTML with motion and crisp export. (Privacy risk: 访问第三方网络地址; 读取环境变量（可能包含敏感信息）) (Security note: 存在 Base64 解码行为; 使用动态代码或子进程执行) | `dsh plugin --profile web add github:tt-a1i/archify` |
| [deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) | Desktop Bring the official DeepSeek Harness local Web UI to a native desktop application. The app starts and manages the local Harness service, integrates the system tray and desktop window, and requires no Node.js installation or command-line setup. (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:anywhere-labs/deepseek-harness-desktop` |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | A curated list of plugins for DeepSeek Harness (dsh). (Privacy risk: Accesses third-party network endpoints) | `dsh plugin --profile web add github:awesome-dsh-plugin/awesome-dsh-plugin` |
| [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) | A collection of plugins and skins for the DSH Web UI: task board, Git graph, right panel, mobile remote, whale-girl pet, live token stats, and skin center. | `dsh plugin --profile web add github:zhu1090093659/dsh-web-ui, then restart Web` |
| [dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) | 中文说明 | `dsh plugin --profile web add github:xiaobright/dsh-anchored-standard` |
| [ModLens](https://github.com/liustack/modlens) | The first DeepSeek Harness vision plugin that gives text-only models eyes: paste an image to get structured JSON evidence (OCR, layout, and more). | `dsh plugin add @liustack/modlens (npm); paste an image to let the text-only model see` |
| [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | Claude Code-style full-screen terminal TUI plugin: pixel whale header, live work status line, streamed thinking, double-Esc rollback, context progress bar, and TPS dashboard. | `dsh plugin --profile tui add github:ccch1mneyyy/dsh-TUI (one-command npm install)` |
| [DSH Better Sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) | A complete sidebar workspace: file management and preview, embedded browser, real terminal, Git panel, background jobs page, and third-party tab registration. | `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar` |
| [Aegis](https://github.com/GanyuanRan/Aegis) | English is now the default GitHub README: (Privacy risk: 访问第三方网络地址; 读取环境变量（可能包含敏感信息）) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:GanyuanRan/Aegis` |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | A front-index repository (Radar): automatically scans and discovers DSH plugin candidates, then moves tested candidates into the downstream curated directory repositories. | `Open the website to view the automatic Radar scan and curated directories` |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | DSH Web whale-girl skin series (Maid Atelier) - CC BY-NC-SA 4.0. (Privacy risk: Accesses third-party network endpoints; Reads environment variables that may contain sensitive information) (Security note: Uses dynamic code or subprocess execution; Contains possible obfuscation) | `dsh plugin --profile web add github:Small-tailqwq/dsh-deep-whale` |
| [sandbase-harness](https://github.com/sandbaseai/sandbase-harness) | Open-source CMA-compatible agent runtime. Run multi-agent systems locally with any model (Ollama/vLLM/Claude/GPT), MCP tools, scenario templates, and a beautiful dashboard. One command start. Built for enterprise teams. (Privacy risk: Accesses third-party network endpoints; Reads browser cookies/storage and sends them over the network) | `dsh plugin --profile web add github:sandbaseai/sandbase-harness` |
| [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | A curated DeepSeek Harness ecosystem list: plugins, tools, and infrastructure from dsh-external/hub and public dsh-plugin topics. | `Open the website to browse the ecosystem list, or git clone it to read locally` |
| [mnemon](https://github.com/mnemon-dev/mnemon) | LLM-supervised persistent memory for AI agents — graph-based recall, cross-session knowledge, single binary. Works with Claude Code, OpenClaw, and any CLI agent. (Privacy risk: 访问第三方网络地址; 读取环境变量并访问第三方地址，需确认未外发敏感信息) | `dsh plugin --profile web add github:mnemon-dev/mnemon` |
| [DSH Vision Toolkit](https://github.com/Anionex/dsh-vision-toolkit) | Brings agent-vision-toolkit into DSH as a native Profile Bundle: intent-aware image Q&A, long screenshot OCR, UI restoration, pixel verification, and other vision tools. | `dsh plugin add github:Anionex/dsh-vision-toolkit` |
| [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | A DSH Web UI ad plugin in the style of a 2005 Chinese site: sidebar ads, in-conversation feed ads, corner pop-ups, and a close button whose real hit area is much smaller than it appears. All materials are fictional and domains are masked. (Privacy risk: Reads credential-like environment variables and sends them over the network, potentially leaking secrets; Accesses third-party network endpoints) (Security note: Contains possible obfuscation) | `dsh plugin --profile web add github:Nagi-ovo/dsh-ads` |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | AgentTeams multi-agent teamwork plugin: one sentence drives a team to complete a goal, with a live team activity panel in the top-right of the Web GUI. | `npx -p @deepseek-ai/dsh dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` |
| [dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | > From zero to one with DeepSeek Harness — the beginner's encyclopedia for DeepSeek's open-source agent runtime. (Privacy risk: 访问第三方网络地址) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:Electricitysheep/dsh-handbook` |
| [dsh-market](https://github.com/dsh-market/dsh-market) | English \| 中文 (Privacy risk: 访问第三方网络地址; 读取浏览器 Cookie/存储并发送到网络) (Security note: 使用动态代码或子进程执行; 存在疑似混淆内容) | `dsh plugin --profile web add github:dsh-market/dsh-market` |
| [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) | Codex-style @file mentions: search workspace files from the input, press Enter to attach, and inject file contents when sending. | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-at-file/archive/refs/heads/main.tar.gz` |
| [Oh-DSH](https://github.com/hust-open-atom-club/oh-dsh) | An all-in-one DeepSeek Harness community distribution: unified desktop, Web UI, and TUI experiences with layered installation. | `Use the desktop/Web/TUI install scripts in the README to install the distribution` |
| [whale-girl](https://github.com/vlln/whale-girl) | A DSH Web GUI desktop pet plugin in QQ-pet style: a floating, draggable companion in the lower-right corner that you can feed and play with. | `dsh plugin --profile web add "github:vlln/whale-girl#main"` |
| [dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) | 中文 \| English (Privacy risk: 访问第三方网络地址; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 使用动态代码或子进程执行; 存在 Base64 解码行为) | `dsh plugin --profile web add github:huiliyi37/dsh-tianshu-tui` |
| [dsh-browser](https://github.com/Lum1104/dsh-browser) | A Chrome sidebar extension and bridge plugin that lets DSH control the browser you are already using without vision capabilities. | `Run scripts/install.sh to install the Chrome MV3 extension and plugin bridge` |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | Find the right DeepSeek Harness plugin in 30 seconds: tells you what problem a plugin solves, who it is for, and where to start. | `Open the website and choose plugins by the problem they solve` |
| [notes](https://github.com/zhaoolee/notes) | An open-source hammer-style notes app replicating the aesthetic of Smartisan Notes: one-command Docker private deployment, skill calls, dsh plugin support, multi-tenancy, one-command WeChat article formatting, and image export for notes. (Privacy risk: Accesses third-party network endpoints; Reads environment variables and accesses third-party endpoints; confirm that sensitive information is not sent externally) (Security note: Uses dynamic code or subprocess execution; Contains Base64 decoding; Contains possible obfuscation) | `dsh plugin --profile web add github:zhaoolee/notes` |
| [dsh-vision-router](https://github.com/ysr666/dsh-vision-router) | Most DSH vision plugins bridge images to DeepSeek as text descriptions — lossy, one-shot, and blind to pixels. This plugin keeps the original pixels on the vision model's side and DeepSeek on the reasoning side, and makes looking at an image an ordinary tool (Privacy risk: 访问第三方网络地址; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 使用动态代码或子进程执行; 存在疑似混淆内容) | `dsh plugin --profile web add github:ysr666/dsh-vision-router` |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | In-conversation generative UI plugin: the model draws interactive HTML cards directly into the conversation flow for simulators, charts, comparison panels, and UI mockups. | `dsh plugin --profile web add github:Nagi-ovo/dsh-visualize` |
| [dsh-work](https://github.com/vibeinging/dsh-work) | 中文 \| English (Privacy risk: 读取浏览器 Cookie/存储并发送到网络; 访问第三方网络地址; 读取凭据类环境变量并发送到网络，可能泄露密钥; 读取环境变量（可能包含敏感信息）) (Security note: 使用动态代码或子进程执行; 存在 Base64 解码行为; 存在疑似混淆内容) | `dsh plugin --profile web add github:vibeinging/dsh-work` |
| [dsh-genui](https://github.com/omdsh-dev/dsh-genui) | Renders interactive UI components in assistant replies: layouts, charts, forms, quizzes, mermaid, and more, inlined through dsh-ui fences. | `dsh plugin --profile web add github:omdsh-dev/dsh-genui` |
| [ModSearch](https://github.com/liustack/modsearch) | A web search plugin that connects text-only models to the internet: search the web or X and return structured JSON evidence (search, fetch, cite). | `dsh plugin add @liustack/modsearch (npm)` |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | A lightweight Windows launcher for DeepSeek Harness: starts at login, runs in a small standalone window, and opens with a double click. | `Download the .msi or portable ZIP from Releases and double-click to run` |
| [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | English \| 简体中文 (Privacy risk: 读取凭据类环境变量并发送到网络，可能泄露密钥) | `dsh plugin --profile web add github:Nagi-ovo/dsh-find-plugins` |
| [dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) | A plugin-only cross-session long-term memory and background self-evolution system: five-track memory, Git branch awareness, skill self-evolution, four-track tasks, session broadcast, and search. | `dsh plugin add github:csyangwen/dsh-memory-evolve` |
| [Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | 中文 · English (Privacy risk: 访问第三方网络地址; 读取本地凭据文件（如 .ssh/.aws/.npmrc）; 读取环境变量（可能包含敏感信息）) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:ChisaAlter/Deepseek-Harness-Desktop` |
| [odai](https://github.com/orziz/odai) | odai is a governance-powered general task-execution framework for AI agents. (Privacy risk: 访问第三方网络地址; 读取环境变量（可能包含敏感信息）; 读取环境变量并访问第三方地址，需确认未外发敏感信息) | `dsh plugin --profile web add github:orziz/odai` |
| [dshfind](https://github.com/hikariming/dshfind) | The learning & sharing community for DeepSeek Harness (DSH) (Privacy risk: 访问第三方网络地址; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 存在疑似混淆内容; 存在 Base64 解码行为) | `dsh plugin --profile web add github:hikariming/dshfind` |
| [DSH OpenPencil](https://github.com/ZSeven-W/dsh-openpencil) | OpenPencil design preview and editing plugin: preview, inspect, and edit real .op documents in a session. | `dsh plugin add @zseven-w/dsh-openpencil (npm)` |
| [tokenbank](https://github.com/wink-run/tokenbank) | Token Bank — the local LLM gateway that sits between your AI agents and every provider.  Know where tokens go · Spend less with smart routing to Ollama, Groq, GitHub Models · Earn by sharing idle quota on a community P2P network.  One-click onboarding for Cursor, Claude Code, Codex CLI, Gemini CLI — no agent changes. Full trace, seamless model swap (Privacy risk: 访问第三方网络地址; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:wink-run/tokenbank` |
| [sealos-skills](https://github.com/labring/sealos-skills) | AI agent skills for Sealos — deploy any project, provision databases, object storage & more with one command. Works with Claude Code, Gemini CLI, Codex. (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:labring/sealos-skills` |
| [awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) | - Table of Contents - Quick Start - Launch the Web UI (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:libukai/awesome-deepseek-harness` |
| [forkprobe](https://github.com/Jayden-X-L/forkprobe) | Compare multiple skills on the same task and pick the winner. (Privacy risk: 访问第三方网络地址; 读取环境变量（可能包含敏感信息）; 读取环境变量并访问第三方地址，需确认未外发敏感信息) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:Jayden-X-L/forkprobe` |
| [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | A meticulously curated list of useful plugins, extensions, tools and development resources built for DSH, covering productivity enhancement, functional expansion, debugging utilities and custom development modules. (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:Alex-Yanggg/awesome-DSH-plugin` |
| [DSH Workflow](https://github.com/icetomoyo/dsh_workflow) | Upgrades DSH's one-off multi-agent scheduling into a Workflow layer that can be generated, saved, governed, observed, and recovered. | `dsh plugin add github:icetomoyo/dsh_workflow` |
| [ProMentor](https://github.com/Lyn-77/ProMentor) | ProMentor 是一个 AI Coding Agent Skill。装上它，你的 AI 编程助手立刻化身为导师——扫描项目架构、生成阶梯式 Chapter、带你手写核心逻辑、自动判题、AI Code Review。 (Privacy risk: 访问第三方网络地址; 读取环境变量（可能包含敏感信息）; 读取环境变量并访问第三方地址，需确认未外发敏感信息) | `dsh plugin --profile web add github:Lyn-77/ProMentor` |
| [DSH Turn Rewind](https://github.com/Anionex/dsh-turn-rewind) | A conversation and code state rollback plugin based on a persistent Change Ledger. | `dsh plugin add github:Anionex/dsh-turn-rewind` |
| [dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) | English · 简体中文 (Privacy risk: 访问第三方网络地址) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:omdsh-dev/dsh-annotation` |
| [dsh-webui-market-plugin](https://github.com/Sanqi-normal/dsh-webui-market-plugin) | dsh Web GUI 社区插件市场：浏览 awesome-dsh-plugin.com 插件目录，一键安装/卸载到 profile。Community plugin market for the DeepSeek Harness (dsh) web GUI: browse, install and uninstall plugins into a profile. (Privacy risk: 访问第三方网络地址; 读取浏览器 Cookie/存储并发送到网络; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:Sanqi-normal/dsh-webui-market-plugin` |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | Sends a desktop notification when a DeepSeek Harness session completes, with rules for result type and keywords. | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-notification/archive/refs/heads/main.tar.gz` |
| [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | A curated list of plugins, skills, MCP servers, patch/profile layers, orchestrators & UIs for DeepSeek Harness (DSH). Visualization · PPT · Coding · Agents · Loops (auto-research) and more. #dsh (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:Dominic789654/awesome-deepseek-harness` |
| [gal-view](https://github.com/Ayase34/gal-view) | 中文 \| English (Security note: 使用动态代码或子进程执行; 存在疑似混淆内容) | `dsh plugin --profile web add github:Ayase34/gal-view` |
| [hello-dsh](https://github.com/pingfanfan/hello-dsh) | → Full tutorial: Hello DSH (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:pingfanfan/hello-dsh` |
| [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | oh-my-dsh：面向 DSH (DeepSeek Harness) 的插件生态——700+ 插件，只通过扩展接缝注册，不修改 agent-loop 骨架 (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:LaplaceYoung/oh-my-dsh` |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | Opens VS Code in the current directory directly from the sidebar workspace menu in the DSH Web GUI. | `dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode` |
| [mstar-harness](https://github.com/btspoony/mstar-harness) | A Skill-driven Harness/Loop Engineering Workflow Agent Plugin (Privacy risk: 访问第三方网络地址) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:btspoony/mstar-harness` |
| [dsh-toy](https://github.com/c3ll256/dsh-toy) | English \| 简体中文 (Privacy risk: 读取凭据类环境变量并发送到网络，可能泄露密钥; 访问第三方网络地址) (Security note: 使用动态代码或子进程执行; 存在疑似混淆内容) | `dsh plugin --profile web add github:c3ll256/dsh-toy` |
| [plugin-registry](https://github.com/vlln/plugin-registry) | DSH 插件生态基建：薄控制台（浏览器面板管理官方 repository 插件，0 patch）+ make-dsh-plugin skill 官方插件开发引导 (Privacy risk: 访问第三方网络地址; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 使用动态代码或子进程执行; 存在疑似混淆内容) | `dsh plugin --profile web add github:vlln/plugin-registry` |
| [dsh-context](https://github.com/bowenliang123/dsh-context) | See what your DeepSeek Harness agent's context window is actually made of and how it evolves. (Privacy risk: 访问第三方网络地址) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:bowenliang123/dsh-context` |
| [dsh-automation](https://github.com/titanwings/dsh-automation) | DSH 自动化插件：让 Coding 任务按计划在全新 Agent Session 中运行，并由用户或 Agent 创建和管理定时任务。 / Run coding tasks in fresh Agent sessions and manage schedules from DSH Web or an Agent. (Privacy risk: 访问第三方网络地址) (Security note: 使用动态代码或子进程执行; 存在 Base64 解码行为; 存在疑似混淆内容) | `dsh plugin --profile web add github:titanwings/dsh-automation` |
| [dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store) | 自动分类、收录和验证 GitHub dsh-plugin Topic 项目的静态 DSH 插件市场。 A static DSH plugin marketplace that automatically categorizes, curates, and verifies GitHub dsh-plugin Topic projects. (Privacy risk: 访问第三方网络地址; 读取本地凭据文件（如 .ssh/.aws/.npmrc）; 读取环境变量（可能包含敏感信息）) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:ZASENJC/dsh-plugins-store` |
| [dsh-multica-runtime](https://github.com/multica-ai/dsh-multica-runtime) | Support dsh runtime on Multica. (Privacy risk: 读取环境变量（可能包含敏感信息）; 访问第三方网络地址) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:multica-ai/dsh-multica-runtime` |
| [dsh-vision](https://github.com/oil-oil/dsh-vision) | \| Main model \| Image path \| Final answer \| \| --- \| --- \| --- \| \| Supports images \| Original images are sent directly, without preprocessing or OCR \| Current model \| (Privacy risk: 访问第三方网络地址; 读取环境变量并访问第三方地址，需确认未外发敏感信息) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:oil-oil/dsh-vision` |
| [dsh-skill-viewer](https://github.com/Fishquito7/dsh-skill-viewer) | (English\|简体中文) (Security note: 存在疑似混淆内容; 存在 Base64 解码行为; 使用动态代码或子进程执行) | `dsh plugin --profile web add github:Fishquito7/dsh-skill-viewer` |
| [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) | Import 13 external agent conversation histories into DeepSeek Harness as full-fidelity, resumable sessions — and export / sync back to Claude Code. (Privacy risk: 访问第三方网络地址; 读取环境变量（可能包含敏感信息）) (Security note: 存在疑似混淆内容; 使用动态代码或子进程执行) | `dsh plugin --profile web add github:Nwflower/dsh-chat-import` |
| [deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin) | The place you run agents should look the way you like. (Privacy risk: 访问第三方网络地址) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:HeiGeAi/deepseek-harness-skin` |
| [ui-status-label](https://github.com/alingalingling/ui-status-label) | 把你鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子 (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:alingalingling/ui-status-label` |
| [Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | > Aggregating the DeepSeek Harness plugin ecosystem into an authoritative, comprehensive and continuously updated directory, guided by the official philosophy "Everything is a Plugin." (Privacy risk: 访问第三方网络地址; 读取本地凭据文件（如 .ssh/.aws/.npmrc）; 读取环境变量（可能包含敏感信息）) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:like-study1/Oh-My-DSH` |
| [superpowers-dsh](https://github.com/LayneChai/superpowers-dsh) | Superpowers for the DeepSeek Harness: a plugin bundle that ports the core skills of obra/superpowers (the Claude-Code skills library: TDD, debugging, planning, collaboration patterns) (Privacy risk: 访问第三方网络地址; 读取浏览器 Cookie/存储并发送到网络; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:LayneChai/superpowers-dsh` |
| [dsh-desktop](https://github.com/bruc3van/dsh-desktop) | 中文 \| English (Privacy risk: 读取本地凭据文件（如 .ssh/.aws/.npmrc）; 访问第三方网络地址; 读取环境变量并访问第三方地址，需确认未外发敏感信息; 读取环境变量（可能包含敏感信息）) (Security note: 存在疑似混淆内容; 使用动态代码或子进程执行) | `dsh plugin --profile web add github:bruc3van/dsh-desktop` |
| [dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) | 简体中文 \| English (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:lhh010/dsh-ui-whale` |
| [allinluna](https://github.com/zenx0x/allinluna) | 简体中文 (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:zenx0x/allinluna` |
| [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) | Cross-instance message/event handoff plugins for DSH (interconnect service + tools) (Privacy risk: 访问第三方网络地址) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:Chinesezjc/dsh-interconnect` |
| [dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) | OpenBiliClaw 是本地运行的跨平台个性化内容推荐 Agent，持续理解你的兴趣并主动找内容。本仓库是它的 DeepSeek Harness 插件：DSH 界面常驻第四栏（推荐/内容库/对话/画像/设置），注册 22 个 Agent Bridge 工具，让 Agent 也能读推荐、答探测、闭环学习。 (Privacy risk: 访问第三方网络地址; 读取浏览器 Cookie/存储并发送到网络) (Security note: 使用动态代码或子进程执行; 存在疑似混淆内容) | `dsh plugin --profile web add github:whiteguo233/dsh-openbiliclaw` |
| [agent-handoff-skill](https://github.com/WeirdSky924/agent-handoff-skill) | 中文 \| English (Privacy risk: 读取环境变量（可能包含敏感信息）) | `dsh plugin --profile web add github:WeirdSky924/agent-handoff-skill` |
| [dsh-vision](https://github.com/william-jin-cmu/dsh-vision) | dsh 插件：给纯文本 DeepSeek 加视觉——view_image 工具桥接任意 OpenAI 兼容 VLM（默认智谱免费档，实测 4 厂商 10 模型） (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:william-jin-cmu/dsh-vision` |
| [HoloGram](https://github.com/834063245-creator/HoloGram) | 3D code dependency graph generator with built-in LLM agent. Language-agnostic (Python, TypeScript, Rust, Go, Java, C/C++, C#, Ruby, Kotlin, Swift, PHP, Lua). Coupling depth analysis, constraint gating, real-time file watching. Tauri 2 + Three.js + Rust engine.跨语言代码依赖拓扑图生成器 · 14 门语言统一 IR · 3D 全息星图 · 内置 AI Agent 双向联动 · 四级耦合诊断 · 桌面应用 / CLI 双模 (Privacy risk: 访问第三方网络地址; 读取环境变量并访问第三方地址，需确认未外发敏感信息; 读取环境变量（可能包含敏感信息）) | `dsh plugin --profile web add github:834063245-creator/HoloGram` |
| [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) | Custom tools for the DeepSeek Harness: users author their own JavaScript tools in the settings UI with a Monaco (VS Code) editor and TypeScript intellisense, and the model grows and prunes the same toolset itself through custom_tool_create / (Privacy risk: 访问第三方网络地址) (Security note: 使用动态代码或子进程执行; 存在 Base64 解码行为; 存在疑似混淆内容) | `dsh plugin --profile web add github:omdsh-dev/dsh-custom-tool` |

Includes 78 plugins, official plugins first; see [docs/plugins.json](docs/plugins.json) for source and update time.

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
