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
| [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) | A collection of plugins and skins for the DSH Web UI: task board, Git graph, right panel, mobile remote, whale-girl pet, live token stats, and skin center. | `dsh plugin --profile web add github:zhu1090093659/dsh-web-ui, then restart Web` |
| [ModLens](https://github.com/liustack/modlens) | The first DeepSeek Harness vision plugin that gives text-only models eyes: paste an image to get structured JSON evidence (OCR, layout, and more). | `dsh plugin add @liustack/modlens (npm); paste an image to let the text-only model see` |
| [deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) | 基于官方 DeepSeek Harness 打造的 Electron 桌面端，深度适配 macOS 和 Windows，提供最佳的，开箱即用的体验。 (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:anywhere-labs/deepseek-harness-desktop` |
| [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | Claude Code-style full-screen terminal TUI plugin: pixel whale header, live work status line, streamed thinking, double-Esc rollback, context progress bar, and TPS dashboard. | `dsh plugin --profile tui add github:ccch1mneyyy/dsh-TUI (one-command npm install)` |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | A curated list of plugins for DeepSeek Harness (dsh). (Privacy risk: Accesses third-party network endpoints) | `dsh plugin --profile web add github:awesome-dsh-plugin/awesome-dsh-plugin` |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | A front-index repository (Radar): automatically scans and discovers DSH plugin candidates, then moves tested candidates into the downstream curated directory repositories. | `Open the website to view the automatic Radar scan and curated directories` |
| [DSH Better Sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) | A complete sidebar workspace: file management and preview, embedded browser, real terminal, Git panel, background jobs page, and third-party tab registration. | `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar` |
| [sandbase-harness](https://github.com/sandbaseai/sandbase-harness) | Open-source CMA-compatible agent runtime. Run multi-agent systems locally with any model (Ollama/vLLM/Claude/GPT), MCP tools, scenario templates, and a beautiful dashboard. One command start. Built for enterprise teams. (Privacy risk: Accesses third-party network endpoints; Reads browser cookies/storage and sends them over the network) | `dsh plugin --profile web add github:sandbaseai/sandbase-harness` |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | DSH Web whale-girl skin series (Maid Atelier) - CC BY-NC-SA 4.0. (Privacy risk: Accesses third-party network endpoints; Reads environment variables that may contain sensitive information) (Security note: Uses dynamic code or subprocess execution; Contains possible obfuscation) | `dsh plugin --profile web add github:Small-tailqwq/dsh-deep-whale` |
| [mnemon](https://github.com/mnemon-dev/mnemon) | LLM-supervised persistent memory for AI agents — graph-based recall, cross-session knowledge, single binary. Works with Claude Code, OpenClaw, and any CLI agent. (Privacy risk: 访问第三方网络地址; 读取环境变量并访问第三方地址，需确认未外发敏感信息) | `dsh plugin --profile web add github:mnemon-dev/mnemon` |
| [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | A curated DeepSeek Harness ecosystem list: plugins, tools, and infrastructure from dsh-external/hub and public dsh-plugin topics. | `Open the website to browse the ecosystem list, or git clone it to read locally` |
| [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | A DSH Web UI ad plugin in the style of a 2005 Chinese site: sidebar ads, in-conversation feed ads, corner pop-ups, and a close button whose real hit area is much smaller than it appears. All materials are fictional and domains are masked. (Privacy risk: Reads credential-like environment variables and sends them over the network, potentially leaking secrets; Accesses third-party network endpoints) (Security note: Contains possible obfuscation) | `dsh plugin --profile web add github:Nagi-ovo/dsh-ads` |
| [DSH Vision Toolkit](https://github.com/Anionex/dsh-vision-toolkit) | Brings agent-vision-toolkit into DSH as a native Profile Bundle: intent-aware image Q&A, long screenshot OCR, UI restoration, pixel verification, and other vision tools. | `dsh plugin add github:Anionex/dsh-vision-toolkit` |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | AgentTeams multi-agent teamwork plugin: one sentence drives a team to complete a goal, with a live team activity panel in the top-right of the Web GUI. | `npx -p @deepseek-ai/dsh dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` |
| [dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | DeepSeek Harness (dsh) 从 0 到 1 深度手册：安装/插件开发/性能调优/实测案例/同模型多 Agent 实测对比（中文 + 英文 PDF） (Privacy risk: 访问第三方网络地址) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:Electricitysheep/dsh-handbook` |
| [Oh-DSH](https://github.com/hust-open-atom-club/oh-dsh) | An all-in-one DeepSeek Harness community distribution: unified desktop, Web UI, and TUI experiences with layered installation. | `Use the desktop/Web/TUI install scripts in the README to install the distribution` |
| [notes](https://github.com/zhaoolee/notes) | An open-source hammer-style notes app replicating the aesthetic of Smartisan Notes: one-command Docker private deployment, skill calls, dsh plugin support, multi-tenancy, one-command WeChat article formatting, and image export for notes. (Privacy risk: Accesses third-party network endpoints; Reads environment variables and accesses third-party endpoints; confirm that sensitive information is not sent externally) (Security note: Uses dynamic code or subprocess execution; Contains Base64 decoding; Contains possible obfuscation) | `dsh plugin --profile web add github:zhaoolee/notes` |
| [dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) | dsh-tianshu-tui — DeepSeek Harness terminal UI +harness workflow。是官方 DeepSeek Harness 上的交互式终端 UI 插件。渲染核心从本仓库自研的harness agent  Tianshu-Tui 演进而来，在官方的基础上增加了TDD、证据门、视觉图像模块等工作流。 (Privacy risk: 访问第三方网络地址; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 使用动态代码或子进程执行; 存在 Base64 解码行为) | `dsh plugin --profile web add github:huiliyi37/dsh-tianshu-tui` |
| [whale-girl](https://github.com/vlln/whale-girl) | A DSH Web GUI desktop pet plugin in QQ-pet style: a floating, draggable companion in the lower-right corner that you can feed and play with. | `dsh plugin --profile web add "github:vlln/whale-girl#main"` |
| [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) | Codex-style @file mentions: search workspace files from the input, press Enter to attach, and inject file contents when sending. | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-at-file/archive/refs/heads/main.tar.gz` |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | Find the right DeepSeek Harness plugin in 30 seconds: tells you what problem a plugin solves, who it is for, and where to start. | `Open the website and choose plugins by the problem they solve` |
| [ModSearch](https://github.com/liustack/modsearch) | A web search plugin that connects text-only models to the internet: search the web or X and return structured JSON evidence (search, fetch, cite). | `dsh plugin add @liustack/modsearch (npm)` |
| [dsh-browser](https://github.com/Lum1104/dsh-browser) | A Chrome sidebar extension and bridge plugin that lets DSH control the browser you are already using without vision capabilities. | `Run scripts/install.sh to install the Chrome MV3 extension and plugin bridge` |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | In-conversation generative UI plugin: the model draws interactive HTML cards directly into the conversation flow for simulators, charts, comparison panels, and UI mockups. | `dsh plugin --profile web add github:Nagi-ovo/dsh-visualize` |
| [dsh-genui](https://github.com/omdsh-dev/dsh-genui) | Renders interactive UI components in assistant replies: layouts, charts, forms, quizzes, mermaid, and more, inlined through dsh-ui fences. | `dsh plugin --profile web add github:omdsh-dev/dsh-genui` |
| [tokenbank](https://github.com/wink-run/tokenbank) | Token Bank — the local LLM gateway that sits between your AI agents and every provider.  Know where tokens go · Spend less with smart routing to Ollama, Groq, GitHub Models · Earn by sharing idle quota on a community P2P network.  One-click onboarding for Cursor, Claude Code, Codex CLI, Gemini CLI — no agent changes. Full trace, seamless model swap (Privacy risk: 访问第三方网络地址; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:wink-run/tokenbank` |
| [sealos-skills](https://github.com/labring/sealos-skills) | AI agent skills for Sealos — deploy any project, provision databases, object storage & more with one command. Works with Claude Code, Gemini CLI, Codex. (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:labring/sealos-skills` |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | A lightweight Windows launcher for DeepSeek Harness: starts at login, runs in a small standalone window, and opens with a double click. | `Download the .msi or portable ZIP from Releases and double-click to run` |
| [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) |  (Privacy risk: 读取凭据类环境变量并发送到网络，可能泄露密钥) | `dsh plugin --profile web add github:Nagi-ovo/dsh-find-plugins` |
| [forkprobe](https://github.com/Jayden-X-L/forkprobe) | Compare multiple skills on the same task and pick the winner. (Privacy risk: 访问第三方网络地址; 读取环境变量（可能包含敏感信息）; 读取环境变量并访问第三方地址，需确认未外发敏感信息) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:Jayden-X-L/forkprobe` |
| [DSH OpenPencil](https://github.com/ZSeven-W/dsh-openpencil) | OpenPencil design preview and editing plugin: preview, inspect, and edit real .op documents in a session. | `dsh plugin add @zseven-w/dsh-openpencil (npm)` |
| [dshfind](https://github.com/hikariming/dshfind) | DSH (DeepSeek Harness) 原理学习、插件市场与最佳实践 · Learn DSH principles, plugin marketplace & best practices (Privacy risk: 访问第三方网络地址; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 存在疑似混淆内容; 存在 Base64 解码行为) | `dsh plugin --profile web add github:hikariming/dshfind` |
| [DSH Workflow](https://github.com/icetomoyo/dsh_workflow) | Upgrades DSH's one-off multi-agent scheduling into a Workflow layer that can be generated, saved, governed, observed, and recovered. | `dsh plugin add github:icetomoyo/dsh_workflow` |
| [Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | DSH桌面端，支持主题和背景图等多种个性化配置。Electron desktop shell for DeepSeek Harness web UI (Privacy risk: 访问第三方网络地址; 读取本地凭据文件（如 .ssh/.aws/.npmrc）; 读取环境变量（可能包含敏感信息）) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:ChisaAlter/Deepseek-Harness-Desktop` |
| [ProMentor](https://github.com/Lyn-77/ProMentor) | ProMentor 是一个 AI Coding Agent Skill。装上它，你的 AI 编程助手立刻化身为导师——扫描项目架构、生成阶梯式 Chapter、带你手写核心逻辑、自动判题、AI Code Review。 (Privacy risk: 访问第三方网络地址; 读取环境变量（可能包含敏感信息）; 读取环境变量并访问第三方地址，需确认未外发敏感信息) | `dsh plugin --profile web add github:Lyn-77/ProMentor` |
| [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | A meticulously curated list of useful plugins, extensions, tools and development resources built for DSH, covering productivity enhancement, functional expansion, debugging utilities and custom development modules. (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:Alex-Yanggg/awesome-DSH-plugin` |
| [dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) | A plugin-only cross-session long-term memory and background self-evolution system: five-track memory, Git branch awareness, skill self-evolution, four-track tasks, session broadcast, and search. | `dsh plugin add github:csyangwen/dsh-memory-evolve` |
| [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | oh-my-dsh：面向 DSH (DeepSeek Harness) 的插件生态——700+ 插件，只通过扩展接缝注册，不修改 agent-loop 骨架 (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:LaplaceYoung/oh-my-dsh` |
| [mstar-harness](https://github.com/btspoony/mstar-harness) | A Skill-driven Harness/Loop Engineering Workflow Agent Plugin (Privacy risk: 访问第三方网络地址) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:btspoony/mstar-harness` |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | Opens VS Code in the current directory directly from the sidebar workspace menu in the DSH Web GUI. | `dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode` |
| [dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) | DSH Web 选中批注插件：选文字→批注→回车随消息发送；气泡隐藏批注块（零闪烁）；回复按 Annotation N 逐条对照（可悬浮芯片）。官方 bundle，零核心改动 (Privacy risk: 访问第三方网络地址) (Security note: 使用动态代码或子进程执行) | `dsh plugin --profile web add github:omdsh-dev/dsh-annotation` |
| [hello-dsh](https://github.com/pingfanfan/hello-dsh) | 从零开始，看懂 DeepSeek Harness 的「万物皆可插件」— 零基础插件开发教程（含 22 个中文技能实例）\| Zero-to-plugin tutorial for DeepSeek Harness (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:pingfanfan/hello-dsh` |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | Sends a desktop notification when a DeepSeek Harness session completes, with rules for result type and keywords. | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-notification/archive/refs/heads/main.tar.gz` |
| [DSH Turn Rewind](https://github.com/Anionex/dsh-turn-rewind) | A conversation and code state rollback plugin based on a persistent Change Ledger. | `dsh plugin add github:Anionex/dsh-turn-rewind` |
| [plugin-registry](https://github.com/vlln/plugin-registry) | DSH 插件生态基建：薄控制台（浏览器面板管理官方 repository 插件，0 patch）+ make-dsh-plugin skill 官方插件开发引导 (Privacy risk: 访问第三方网络地址; 读取凭据类环境变量并发送到网络，可能泄露密钥) (Security note: 使用动态代码或子进程执行; 存在疑似混淆内容) | `dsh plugin --profile web add github:vlln/plugin-registry` |
| [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | A curated list of plugins, skills, MCP servers, patch/profile layers, orchestrators & UIs for DeepSeek Harness (DSH). Visualization · PPT · Coding · Agents · Loops (auto-research) and more. #dsh (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:Dominic789654/awesome-deepseek-harness` |
| [ui-status-label](https://github.com/alingalingling/ui-status-label) | 把你鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子 (Privacy risk: 访问第三方网络地址) | `dsh plugin --profile web add github:alingalingling/ui-status-label` |
| [dsh-multica-runtime](https://github.com/multica-ai/dsh-multica-runtime) | Support dsh runtime on Multica. (Privacy risk: 读取环境变量（可能包含敏感信息）; 访问第三方网络地址) (Security note: 存在疑似混淆内容) | `dsh plugin --profile web add github:multica-ai/dsh-multica-runtime` |

Includes 50 plugins, official plugins first; see [docs/plugins.json](docs/plugins.json) for source and update time.

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
   `description_i18n` field.
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
