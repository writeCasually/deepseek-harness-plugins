# DeepSeek Harness Plugin Index

[中文](README.md) | English

A project for collecting, presenting, and safely reviewing community plugins for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH). The plugin list is
available both as a website and this README. A daily workflow searches GitHub repositories with
the `dsh-plugin` topic, performs a static security review, and adds qualifying plugins to the
index.

Directory page (GitHub Pages):

```text
https://writeCasually.github.io/deepseek-harness-plugins/
```

## About

DeepSeek Harness is built around the idea that everything is a plugin. The community has produced
many plugins, skins, distributions, and curated lists around it. This project brings those
GitHub-hosted projects together so developers can quickly find plugins by name, capability, and
usage.

Main capabilities:

- Web index page: search, filter by category and official status, and view each plugin name,
  description, usage, and project link.
- Single data source: `docs/plugins.json` drives both the website and the README plugin list.
- DSH compatibility check: plugins are included only when they can be confirmed to run in
  DeepSeek Harness.
- Security and privacy review: non-official plugins are statically scanned for privacy risks and
  annotated with findings.
- Official first: DeepSeek AI official plugins are displayed before community plugins.
- Human review entry point: automated discoveries are submitted as pull requests and are published
  after merge.

## Plugin List

<!-- PLUGINS_START -->

| Plugin | Description | Usage | Project |
| --- | --- | --- | --- |
| ★ Official [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | DeepSeek Harness core runtime: Everything is a Plugin. | `npx @deepseek-ai/dsh starts the core; mount plugins with dsh plugin --profile web add <source>` | [View](https://github.com/deepseek-ai/deepseek-harness) |
| [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) | A collection of plugins and skins for the DSH Web UI: task board, Git graph, right panel, mobile remote, whale-girl pet, live token stats, and skin center. | `dsh plugin --profile web add github:zhu1090093659/dsh-web-ui, then restart Web` | [View](https://github.com/zhu1090093659/dsh-web-ui) |
| [ModLens](https://github.com/liustack/modlens) | The first DeepSeek Harness vision plugin that gives text-only models eyes: paste an image to get structured JSON evidence (OCR, layout, and more). | `dsh plugin add @liustack/modlens (npm); paste an image to let the text-only model see` | [View](https://github.com/liustack/modlens) |
| [sandbase-harness](https://github.com/sandbaseai/sandbase-harness) | Open-source CMA-compatible agent runtime. Run multi-agent systems locally with any model (Ollama/vLLM/Claude/GPT), MCP tools, scenario templates, and a beautiful dashboard. One command start. Built for enterprise teams. (Privacy risk: Accesses third-party network endpoints; Reads browser cookies/storage and sends them over the network) | `dsh plugin --profile web add github:sandbaseai/sandbase-harness` | [View](https://github.com/sandbaseai/sandbase-harness) |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | A front-index repository (Radar): automatically scans and discovers DSH plugin candidates, then moves tested candidates into the downstream curated directory repositories. | `Open the website to view the automatic Radar scan and curated directories` | [View](https://github.com/AdamPlatin123/awesome-dsh-plugins) |
| [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | Claude Code-style full-screen terminal TUI plugin: pixel whale header, live work status line, streamed thinking, double-Esc rollback, context progress bar, and TPS dashboard. | `dsh plugin --profile tui add github:ccch1mneyyy/dsh-TUI (one-command npm install)` | [View](https://github.com/ccch1mneyyy/dsh-TUI) |
| [DSH Better Sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) | A complete sidebar workspace: file management and preview, embedded browser, real terminal, Git panel, background jobs page, and third-party tab registration. | `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar` | [View](https://github.com/omdsh-dev/DSH-better-sidebar) |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | A curated list of plugins for DeepSeek Harness (dsh). (Privacy risk: Accesses third-party network endpoints) | `dsh plugin --profile web add github:awesome-dsh-plugin/awesome-dsh-plugin` | [View](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | DSH Web whale-girl skin series (Maid Atelier) - CC BY-NC-SA 4.0. (Privacy risk: Accesses third-party network endpoints; Reads environment variables that may contain sensitive information) (Security note: Uses dynamic code or subprocess execution; Contains possible obfuscation) | `dsh plugin --profile web add github:Small-tailqwq/dsh-deep-whale` | [View](https://github.com/Small-tailqwq/dsh-deep-whale) |
| [DSH Vision Toolkit](https://github.com/Anionex/dsh-vision-toolkit) | Brings agent-vision-toolkit into DSH as a native Profile Bundle: intent-aware image Q&A, long screenshot OCR, UI restoration, pixel verification, and other vision tools. | `dsh plugin add github:Anionex/dsh-vision-toolkit` | [View](https://github.com/Anionex/dsh-vision-toolkit) |
| [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | A curated DeepSeek Harness ecosystem list: plugins, tools, and infrastructure from dsh-external/hub and public dsh-plugin topics. | `Open the website to browse the ecosystem list, or git clone it to read locally` | [View](https://github.com/0xsline/awesome-deepseek-harness) |
| [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | A DSH Web UI ad plugin in the style of a 2005 Chinese site: sidebar ads, in-conversation feed ads, corner pop-ups, and a close button whose real hit area is much smaller than it appears. All materials are fictional and domains are masked. (Privacy risk: Reads credential-like environment variables and sends them over the network, potentially leaking secrets; Accesses third-party network endpoints) (Security note: Contains possible obfuscation) | `dsh plugin --profile web add github:Nagi-ovo/dsh-ads` | [View](https://github.com/Nagi-ovo/dsh-ads) |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | AgentTeams multi-agent teamwork plugin: one sentence drives a team to complete a goal, with a live team activity panel in the top-right of the Web GUI. | `npx -p @deepseek-ai/dsh dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` | [View](https://github.com/NanmiCoder/dsh-agent-teams) |
| [notes](https://github.com/zhaoolee/notes) | An open-source hammer-style notes app replicating the aesthetic of Smartisan Notes: one-command Docker private deployment, skill calls, dsh plugin support, multi-tenancy, one-command WeChat article formatting, and image export for notes. (Privacy risk: Accesses third-party network endpoints; Reads environment variables and accesses third-party endpoints; confirm that sensitive information is not sent externally) (Security note: Uses dynamic code or subprocess execution; Contains Base64 decoding; Contains possible obfuscation) | `dsh plugin --profile web add github:zhaoolee/notes` | [View](https://github.com/zhaoolee/notes) |
| [Oh-DSH](https://github.com/hust-open-atom-club/oh-dsh) | An all-in-one DeepSeek Harness community distribution: unified desktop, Web UI, and TUI experiences with layered installation. | `Use the desktop/Web/TUI install scripts in the README to install the distribution` | [View](https://github.com/hust-open-atom-club/oh-dsh) |
| [ModSearch](https://github.com/liustack/modsearch) | A web search plugin that connects text-only models to the internet: search the web or X and return structured JSON evidence (search, fetch, cite). | `dsh plugin add @liustack/modsearch (npm)` | [View](https://github.com/liustack/modsearch) |
| [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) | Codex-style @file mentions: search workspace files from the input, press Enter to attach, and inject file contents when sending. | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-at-file/archive/refs/heads/main.tar.gz` | [View](https://github.com/omdsh-dev/dsh-at-file) |
| [whale-girl](https://github.com/vlln/whale-girl) | A DSH Web GUI desktop pet plugin in QQ-pet style: a floating, draggable companion in the lower-right corner that you can feed and play with. | `dsh plugin --profile web add "github:vlln/whale-girl#main"` | [View](https://github.com/vlln/whale-girl) |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | In-conversation generative UI plugin: the model draws interactive HTML cards directly into the conversation flow for simulators, charts, comparison panels, and UI mockups. | `dsh plugin --profile web add github:Nagi-ovo/dsh-visualize` | [View](https://github.com/Nagi-ovo/dsh-visualize) |
| [dsh-browser](https://github.com/Lum1104/dsh-browser) | A Chrome sidebar extension and bridge plugin that lets DSH control the browser you are already using without vision capabilities. | `Run scripts/install.sh to install the Chrome MV3 extension and plugin bridge` | [View](https://github.com/Lum1104/dsh-browser) |
| [DSH OpenPencil](https://github.com/ZSeven-W/dsh-openpencil) | OpenPencil design preview and editing plugin: preview, inspect, and edit real .op documents in a session. | `dsh plugin add @zseven-w/dsh-openpencil (npm)` | [View](https://github.com/ZSeven-W/dsh-openpencil) |
| [DSH Workflow](https://github.com/icetomoyo/dsh_workflow) | Upgrades DSH's one-off multi-agent scheduling into a Workflow layer that can be generated, saved, governed, observed, and recovered. | `dsh plugin add github:icetomoyo/dsh_workflow` | [View](https://github.com/icetomoyo/dsh_workflow) |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | A lightweight Windows launcher for DeepSeek Harness: starts at login, runs in a small standalone window, and opens with a double click. | `Download the .msi or portable ZIP from Releases and double-click to run` | [View](https://github.com/Ruler4396/dsh-launcher) |
| [dsh-genui](https://github.com/omdsh-dev/dsh-genui) | Renders interactive UI components in assistant replies: layouts, charts, forms, quizzes, mermaid, and more, inlined through dsh-ui fences. | `dsh plugin --profile web add github:omdsh-dev/dsh-genui` | [View](https://github.com/omdsh-dev/dsh-genui) |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | Find the right DeepSeek Harness plugin in 30 seconds: tells you what problem a plugin solves, who it is for, and where to start. | `Open the website and choose plugins by the problem they solve` | [View](https://github.com/bruc3van/awesome-dsh-plugin) |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | Opens VS Code in the current directory directly from the sidebar workspace menu in the DSH Web GUI. | `dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode` | [View](https://github.com/omdsh-dev/dsh-open-in-vscode) |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | Sends a desktop notification when a DeepSeek Harness session completes, with rules for result type and keywords. | `dsh plugin --profile web add https://github.com/omdsh-dev/dsh-notification/archive/refs/heads/main.tar.gz` | [View](https://github.com/omdsh-dev/dsh-notification) |
| [DSH Turn Rewind](https://github.com/Anionex/dsh-turn-rewind) | A conversation and code state rollback plugin based on a persistent Change Ledger. | `dsh plugin add github:Anionex/dsh-turn-rewind` | [View](https://github.com/Anionex/dsh-turn-rewind) |
| [dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) | A plugin-only cross-session long-term memory and background self-evolution system: five-track memory, Git branch awareness, skill self-evolution, four-track tasks, session broadcast, and search. | `dsh plugin add github:csyangwen/dsh-memory-evolve` | [View](https://github.com/csyangwen/dsh-memory-evolve) |

Includes 29 plugins, official plugins first; see [docs/plugins.json](docs/plugins.json) for source and update time.

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
3. Download README files and sampled source files, then perform a static security and privacy
   review; privacy risks are annotated when found.
4. Keep official plugins first and process a limited number of repositories per run so the rest
   are handled by the next scheduled run.
5. Write approved plugins to `docs/plugins.json`, regenerate the README plugin lists, and submit
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
