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
| [OpenViking](https://github.com/volcengine/OpenViking) | [@volcengine](https://github.com/volcengine) | 👋 加入我们的社区 |
| [voyager](https://github.com/Nagi-ovo/voyager) | [@Nagi-ovo](https://github.com/Nagi-ovo) | 我们热爱 AI 聊天助手，但有时候总觉得它们少了一点"秩序感"。 |
| [archify](https://github.com/tt-a1i/archify) | [@tt-a1i](https://github.com/tt-a1i) | 在对话里，把代码仓库或系统描述变成漂亮、可靠、可交互的系统地图。 |
| [ouroboros](https://github.com/Q00/ouroboros) | [@Q00](https://github.com/Q00) | 和任何操作系统一样，Ouroboros 分成三层：一层稳定的、提供原语的 OS 层，一层承载领域工作流的应用层，还有一个人真正坐在前面的 shell。三个仓库，一个技术栈： |
| [dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) | [@xiaobright](https://github.com/xiaobright) | 实验性 DeepSeek Harness agent preset 集合——一个基础模式、两个实时锚定变体和一个预制 会话模式：把模型轨迹锚定在 Minimal 条件上（真实的 Minimal 工具 schema、不注入自动 上下文），会话产生持久信号后晋升到小型 resident 目录，重型 Standard 工具按需解锁。 |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | [@Small-tailqwq](https://github.com/Small-tailqwq) | DeepSeek Harness Web GUI 的鲸鱼娘主题皮肤系列(独立分发仓库)。 |
| [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | [@AdamPlatin123](https://github.com/AdamPlatin123) | 前部索引仓库（Radar）：自动扫描发现所有 dsh 插件候选，经测试合格的移入后序精选目录仓库。 |
| [agentrq](https://github.com/agentrq/agentrq) | [@agentrq](https://github.com/agentrq) | > 本文是面向中文开发者的导读，帮助快速理解 AgentRQ 的定位、架构和本地运行方式。 |
| [dsh-market](https://github.com/dsh-market/dsh-market) | [@dsh-market](https://github.com/dsh-market) | 装在 DeepSeek Harness 里的插件市场。打开设置 → 插件市场 → 逛一逛，点一下，装好。 |
| [Aegis](https://github.com/GanyuanRan/Aegis) | [@GanyuanRan](https://github.com/GanyuanRan) | Aegis Method Pack 让 AI 编程 agent 变得可信：少返工、更安全、说“完成”前先给证据。 |
| [awesome-deepseek-harness](https://github.com/Anil-matcha/awesome-deepseek-harness) | [@Anil-matcha](https://github.com/Anil-matcha) | Curated guide to DeepSeek Harness (dsh) and its best community plugins |
| [awesome-dsh-plugin](https://github.com/Anil-matcha/awesome-dsh-plugin) | [@Anil-matcha](https://github.com/Anil-matcha) | A curated list of plugins for DeepSeek Harness (dsh) - DeepSeek Harness plugin ecosystem |
| [dsh-vision-router](https://github.com/ysr666/dsh-vision-router) | [@ysr666](https://github.com/ysr666) | 大多数 DSH 视觉插件把图片“翻译”成一段文字描述再喂给 DeepSeek——有损、一次性、看不见像素。本插件把原图像素留在视觉模型侧、把推理留在 DeepSeek 侧，并把“看图”变成一次普通的工具调用： |
| [dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) | [@Anionex](https://github.com/Anionex) | 更强大的视觉工具箱——给 DeepSeek Harness 里的纯文本模型装上眼睛：图片问答、长图 OCR、前端 UI 还原、GUI 视觉任务，一套视觉工具箱和一个 Skill。 |
| [working-activity](https://github.com/ccch1mneyyy/working-activity) | [@ccch1mneyyy](https://github.com/ccch1mneyyy) | 为 DeepSeek Harness 打造的一条实时 "工作状态行"：模型的实时活动——俏皮思考文案、真正在跑的工具、已耗时、收尾摘要——在 agent 干活时展示出来。 |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | [@NanmiCoder](https://github.com/NanmiCoder) | dsh-agent-teams 让当前 DeepSeek Harness 会话成为队长：创建可续聊的子 Agent、把目标拆成有依赖的任务，并通过直达消息协调成员工作。 |
| [graph-memory](https://github.com/adoresever/graph-memory) | [@adoresever](https://github.com/adoresever) | 为 AI Agent 提供可检索、可追溯、跨会话的长期记忆 一个宿主无关的图记忆内核，原生接入 DeepSeek Harness，并继续兼容 OpenClaw。 |
| [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | [@Nagi-ovo](https://github.com/Nagi-ovo) | 是兄弟就来蹬我！DSH Web UI 广告：2005 年中文站点风格的侧栏广告 / 对话内信息流 / 角落弹窗 + 一个真实热区比视觉小得多的关闭叉。素材全虚构，域名打码。 |
| [dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | [@Electricitysheep](https://github.com/Electricitysheep) | DeepSeek Harness (dsh) 从 0 到 1 深度手册：安装/插件开发/性能调优/实测案例/同模型多 Agent 实测对比（中文 + 英文 PDF） |
| [dsh-work](https://github.com/vibeinging/dsh-work) | [@vibeinging](https://github.com/vibeinging) | 一个本地的 AI 工作台 Profile Bundle：在官方 DSH Web Profile 之上扩展，把 Agent 会话、项目文件、数据分析、Web 研究、MCP 与 Office 产物整合进一个 Electron 桌面应用。 |
| [deepseek-harness-desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app) | [@vibeinging](https://github.com/vibeinging) | 本地 AI 桌面工作台：整合 DSH 会话、项目、文件、Web 研究、插件与 Office 产物。 |
| [mnemon](https://github.com/mnemon-dev/mnemon) | [@mnemon-dev](https://github.com/mnemon-dev) | LLM-supervised persistent memory for AI agents — graph-based recall, cross-session knowledge, single binary. Works with Claude Code, OpenClaw, and any CLI agent. |
| [memtrace-public](https://github.com/syncable-dev/memtrace-public) | [@syncable-dev](https://github.com/syncable-dev) | Structural memory for AI coding agents. Bi-temporal graph, MCP-native, zero LLM calls. Cursor · Claude Code · Codex · DeepSeek Harness · Hermes · VS Code · Windsurf. |
| [superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | [@superdesigndev](https://github.com/superdesigndev) | The design skill for Claude Code, Cursor and any coding agent. Stop shipping AI-slop UI: turn it into shippable, tasteful frontend. Install: npx skills add superdesigndev/superdesign-skill. Powered by superdesign.dev |
| [dsh-context](https://github.com/bowenliang123/dsh-context) | [@bowenliang123](https://github.com/bowenliang123) | A DeepSeek Harness plugin for  Context insight dashboard — showing what the model's context window is made of and how it evolves. |
| [de-anthropocentric-research-engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine) | [@yogsoth-ai](https://github.com/yogsoth-ai) | 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction. |
| [deepseek-harness-studio](https://github.com/fufankeji/deepseek-harness-studio) | [@fufankeji](https://github.com/fufankeji) | DeepSeek Harness 的 macOS & Windows 桌面端：零代码插件商店，一键安装与启用，视觉增强，自动化插件分发与 AI 推荐。 |
| [DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin) | [@WYH66666666](https://github.com/WYH66666666) | 一套高自由度的玻璃质感主题，套在 DeepSeek Harness 网页端。顶栏、侧边栏、输入框、统计行、轨迹视图都成了磨砂玻璃片；玻璃模糊度、磨砂度、背景（流体或自定义壁纸）都能在设置卡片里自由调节。 |
| [oh-dsh](https://github.com/hust-open-atom-club/oh-dsh) | [@hust-open-atom-club](https://github.com/hust-open-atom-club) | 这里存放一类设计文档。Agent Note 记录影响本代码库的决策或提案：代码和文档无法承载的为什么以及放弃了什么。本文件规定 Agent Note 存放在哪里、何时需要写一份，以及文件内格式。 |
| [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | [@bruc3van](https://github.com/bruc3van) | 用 30 秒找到适合你的 DeepSeek Harness 插件：告诉你插件解决什么问题、适合谁、从哪里开始。 |
| [dsh-genui](https://github.com/omdsh-dev/dsh-genui) | [@omdsh-dev](https://github.com/omdsh-dev) | > 让模型的回答长出界面——文字还在，可交互的 UI 已经能用。 |
| [dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) | [@huiliyi37](https://github.com/huiliyi37) | dsh-tianshu-tui — DeepSeek Harness terminal UI +harness workflow。是官方 DeepSeek Harness 上的交互式终端 UI 插件。渲染核心从本仓库自研的harness agent  Tianshu-Tui 演进而来，在官方的基础上增加了TDD、证据门、视觉图像模块等工作流。 |
| [Minke](https://github.com/lencx/Minke) | [@lencx](https://github.com/lencx) | - 一个完整的智能体工作台 — Minke 将 DeepSeek Harness 从对话窗口扩展成完整的工作空间。文件、终端、网页工具和插件发现能力可以放在彼此独立的右侧与底部工作区中，让理解项目、修改内容和验证结果所需的工具始终与当前对话相邻。 |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | [@Nagi-ovo](https://github.com/Nagi-ovo) | 让 DSH 不只回答一段文字。模型调用 visualize 后，Web UI 会在对话里直接出现一张可交互卡片，用来做模拟器、图表、对比面板或 UI mockup。 |
| [Awesome-DeepSeek-Harness-Plugins](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins) | [@Zhiyuan-Fan](https://github.com/Zhiyuan-Fan) | 每日维护的 DeepSeek Harness（DSH）公开插件与扩展精选目录，涵盖工具、技能、模型提供商、记忆、自动化、运行时、桌面客户端、浏览器集成与开发者工具。 |
| [dshfind](https://github.com/hikariming/dshfind) | [@hikariming](https://github.com/hikariming) | DSH (DeepSeek Harness) 原理学习、插件市场与最佳实践 · Learn DSH principles, plugin marketplace & best practices |
| [engramory](https://github.com/tinqiao-oss/engramory) | [@tinqiao-oss](https://github.com/tinqiao-oss) | 一套有主见、零基础设施的、面向小规模 / 本地 / 文件式智能体记忆的协议 —— 一套强约束的策展纪律 + 一个校验器(tools/engramory_doctor.py),以常驻规则形式加载(CLAUDE.md / AGENTS.md / 宿主的规则文件)。它不是数据库、不是框架、也不是按相关性加载的 skill。记忆就是一个文件夹:一堆小小的、人能直接读的 markdown 文件,加一个每次会话都加载的索引。没有数据库、没有向量、没有服务器——就是你能打开、能读、能改、能 diff |
| [dsh-dafeiyu](https://github.com/QCYTSN/dsh-dafeiyu) | [@QCYTSN](https://github.com/QCYTSN) | 住在 Windows 桌面上、由 DeepSeek Harness 真实工作状态驱动的 Agent 伴侣。 |
| [dsh-pet](https://github.com/PC2005-cloud/dsh-pet) | [@PC2005-cloud](https://github.com/PC2005-cloud) | > 一只住在 DeepSeek Harness Web 界面里的桌面宠物：待机呼吸、随机动作、屏幕漫游、点击反应、可拖拽。 |
| [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | [@Dominic789654](https://github.com/Dominic789654) | > 面向 DeepSeek Harness（DSH） 的 插件 / Skill / MCP / Patch（Profile）层 / 编排器 / 聚合器 / UI 精选清单 —— DeepSeek 官方 agent 运行框架，核心理念 Model + Harness = Agent。 |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | [@Ruler4396](https://github.com/Ruler4396) | DeepSeek Harness 的 Windows 轻量启动器：开机自启 + 独立小窗口，双击即用。 |
| [notes](https://github.com/zhaoolee/notes) | [@zhaoolee](https://github.com/zhaoolee) | 开源版锤子便签，复刻锤科美学，一键Docker私有化部署，支持skill调用，支持dsh plugin，支持多租户，一键生成公众号格式，支持导出便签为图片 |
| [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | [@Nagi-ovo](https://github.com/Nagi-ovo) | 对 DSH 说一句「有没有插件能……」，它就会从全 GitHub 的 dsh-plugin topic 里找出候选，解释差别，等你选好以后再安装和验证。 |
| [anime-find](https://github.com/cocofhu/anime-find) | [@cocofhu](https://github.com/cocofhu) | DeepSeek Harness 搜番插件。在对话中搜索番剧，以可点击卡片展示结果，并在详情面板中查看字幕组、磁力链接和种子文件。 |
| [awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) | [@libukai](https://github.com/libukai) | - 目录 - 快速开始 - 启动 Web UI |
| [deepseek-design](https://github.com/Devin-AXIS/deepseek-design) | [@Devin-AXIS](https://github.com/Devin-AXIS) | DeepSeek Design 是由 iPolloWork 推出、专为 DeepSeek Harness 构建的原生可视化设计系统。 |
| [dsh-gitbash-preset](https://github.com/liceses/dsh-gitbash-preset) | [@liceses](https://github.com/liceses) | DSH 自带的极简模式在 Windows 上无法使用，失败有两层原因： |
| [Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | [@ChisaAlter](https://github.com/ChisaAlter) | DSH桌面端，支持主题和背景图等多种个性化配置。Electron desktop shell for DeepSeek Harness web UI |
| [dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) | [@yjh051108](https://github.com/yjh051108) | > ## 🎉 v0.3.0 重大声明（2026-08-14） > > 从经验补丁到源码契约——注入器完成规范重构。 |
| [anysearch-dsh](https://github.com/anysearch-team/anysearch-dsh) | [@anysearch-team](https://github.com/anysearch-team) | AnySearch web search provider and advanced search tools for DeepSeek Harness (DSH) |
| [dsh-noema](https://github.com/ZSeven-W/dsh-noema) | [@ZSeven-W](https://github.com/ZSeven-W) | DSH Noema 将 DeepSeek Harness 与 Noema —— 一个面向编码智能体的本地优先、非向量记忆系统 —— 连接起来，让智能体能够跨会话保留持久知识，而不是每次对话都从零开始。 |
| [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) | [@omdsh-dev](https://github.com/omdsh-dev) | 完整逐页说明见 Sidebar 与对话交互指南。 |
| [humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) | [@Vladimir-Human](https://github.com/Vladimir-Human) | Скилл для ИИ-агентов: находит и убирает следы машинной генерации из русского текста. 38 паттернов, 39 regex-маркеров с реестром доказательств, слепые парные прогоны, файловый слой снятия C2PA/EXIF/XMP \| Russian AI-writing humanizer skill with file metadata cleaning |
| [gal-view](https://github.com/Ayase34/gal-view) | [@Ayase34](https://github.com/Ayase34) | 把 DSH 会话界面切换成 Galgame（视觉小说）风格的插件。 |
| [dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin) | [@kingOfSoySauce](https://github.com/kingOfSoySauce) | 复制给你的 DSH，一键安装： |
| [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) | [@Han-1413141](https://github.com/Han-1413141) | DeepSeek Harness 会话费用统计插件(界面中英双语) |
| [odai](https://github.com/orziz/odai) | [@orziz](https://github.com/orziz) | odai 是面向 AI agent 的治理内核驱动的通用任务执行框架。 |
| [dsh-webui-market-plugin](https://github.com/Sanqi-normal/dsh-webui-market-plugin) | [@Sanqi-normal](https://github.com/Sanqi-normal) | 在 dsh web GUI 内部的社区插件市场：浏览 awesome-dsh-plugin.com 的插件目录，直接在 设置 → 插件 → 插件市场 里安装 / 卸载插件到 profile。界面风格与 harness 前端一致（跟随系统深浅色主题），支持中英文（按系统语言自动切换）。 |
| [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) | [@beancookie](https://github.com/beancookie) | DeepSeek Harness (DSH) 插件精选集。 |
| [awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins) | [@imsai-sh](https://github.com/imsai-sh) | dsh1024 是 DeepSeek Harness 的 DSH 1024Store 包。一个 npm 包提供两个入口： |
| [dsh-plugin](https://github.com/Tabbit-Browser/dsh-plugin) | [@Tabbit-Browser](https://github.com/Tabbit-Browser) | 这是一个 Tabbit 浏览器为 Deepseek Harness 提供的一个 plugins。你可以在 Deepseek Harness 中安装这个插件，给 Deepseek Harness 提供控制 Tabbit 浏览器的能力。 |
| [dsh-undo-plugin](https://github.com/lire1131/dsh-undo-plugin) | [@lire1131](https://github.com/lire1131) | DSH 崩溃救援插件：可回滚配置与插件代码改动、保留敏感信息的安全快照、一键 SAFE MODE，并内置离线 CLI/GUI——即使 DSH 无法启动也能用。 |
| [dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) | [@Anionex](https://github.com/Anionex) | 为 DeepSeek Harness 提供 Turn 级项目文件恢复，并可选择从恢复后的这一轮继续新对话。 |
| [dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) | [@HanaAyane](https://github.com/HanaAyane) | 中文首页现在位于 README.md。 |
| [DSH Workflow](https://github.com/icetomoyo/dsh_workflow) | [@icetomoyo](https://github.com/icetomoyo) | 把 DSH 的一次性多 Agent 调度升级为可生成、保存、治理、观察、恢复的 Workflow 层。 |
| [dsh_workflow](https://github.com/omdsh-dev/dsh_workflow) | [@omdsh-dev](https://github.com/omdsh-dev) | DSH 已经有很强的 Harness 基础设施：模型路由、子 Agent provider、工具权限、审批、Session 日志、后台 jobs 与 UI 事件。但仅有这些“执行原语”，团队仍需在每次会话里重新描述如何拆解、并发、验证和汇总。 |
| [tokenbank](https://github.com/wink-run/tokenbank) | [@wink-run](https://github.com/wink-run) | > 个人AI中枢 · Token 管家 > > 用的明白 · 用的节省 · 用的简单 · 越用越懂你 · 闲置赚钱 |
| [dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) | [@omdsh-dev](https://github.com/omdsh-dev) | DSH Web 选中批注插件：选文字→批注→回车随消息发送；气泡隐藏批注块（零闪烁）；回复按 Annotation N 逐条对照（可悬浮芯片）。官方 bundle，零核心改动 |
| [hello-dsh](https://github.com/pingfanfan/hello-dsh) | [@pingfanfan](https://github.com/pingfanfan) | 从零开始，看懂 DeepSeek Harness 的「万物皆可插件」— 零基础插件开发教程（含 22 个中文技能实例）\| Zero-to-plugin tutorial for DeepSeek Harness |
| [dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) | [@Ychris12138](https://github.com/Ychris12138) | 为 DeepSeek Harness 网页端提供多供应商账户监测与 Token 用量分析。 |
| [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | [@Alex-Yanggg](https://github.com/Alex-Yanggg) | > 面向 DeepSeek Harness（DSH）的社区精选、厂商中立 Plugin 索引——覆盖开发工具、数据工作流、媒体、运维与日常生活等场景。 |
| [sealos-skills](https://github.com/labring/sealos-skills) | [@labring](https://github.com/labring) | 通过 AI 智能体将项目部署到 Sealos Cloud。 |
| [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) | [@Nwflower](https://github.com/Nwflower) | 把 13 种外部 Agent 聊天历史全保真导入 DeepSeek Harness 为可继续（resume）会话——并可导出 / 同步回 Claude Code。 |
| [dsh-vision](https://github.com/oil-oil/dsh-vision) | [@oil-oil](https://github.com/oil-oil) | \| 当前主模型 \| 图片处理方式 \| 最终回答者 \| \| --- \| --- \| --- \| \| 支持图片 \| 原图直接发送，不压缩、不预先 OCR \| 当前模型 \| |
| [forkprobe](https://github.com/Jayden-X-L/forkprobe) | [@Jayden-X-L](https://github.com/Jayden-X-L) | 别猜哪个 AI Skill 有用，直接并排看结果。 |
| [dsh-skill-viewer](https://github.com/Fishquito7/dsh-skill-viewer) | [@Fishquito7](https://github.com/Fishquito7) | DSH 插件，可直接在 web 界面快速管理 skill 状态，同时在终端加入快捷的 skill 管理命令。 |
| [dsh-kun-like-pet](https://github.com/liyupi/dsh-kun-like-pet) | [@liyupi](https://github.com/liyupi) | > DeepSeek Harness（DSH）桌面宠物插件 —— 一只住在 Web 界面右下角的小坤宠。 |
| [ru-marketplace-mcp](https://github.com/Vladimir-Human/ru-marketplace-mcp) | [@Vladimir-Human](https://github.com/Vladimir-Human) | Девять российских маркетплейсов и китайский Taobao как MCP-серверы: Wildberries, Ozon, Яндекс Маркет, Детский мир, Авито, Мегамаркет, Lamoda, DNS, Ситилинк. Плюс сравнение цен по всем сразу. Только чтение, ключи не нужны. |
| [ProMentor](https://github.com/Lyn-77/ProMentor) | [@Lyn-77](https://github.com/Lyn-77) | ProMentor 是一个 AI Coding Agent Skill。装上它，你的 AI 编程助手立刻化身为导师——扫描项目架构、生成阶梯式 Chapter、带你手写核心逻辑、自动判题、AI Code Review。 |
| [Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | [@like-study1](https://github.com/like-study1) | > 汇聚 DeepSeek Harness 生态插件，构建权威、完整、可持续更新的聚合目录。以官方理念“万物皆可插件”（Everything is a Plugin）为指引，服务全球开发者。 |
| [dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot) | [@tencent-connect](https://github.com/tencent-connect) | 基于 deepseek-harness (dsh) 的 QQ Bot IM 插件，将 QQ 消息平台作为 dsh agent 的前端协议驱动。 |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification) | [@omdsh-dev](https://github.com/omdsh-dev) | DeepSeek Harness Web GUI 的桌面通知插件。当会话结束一轮任务时，浏览器通过系统 Notification API 弹出通知，让你切到别的标签页也能知道 DSH 已经完成。按结束状态开关 + 关键词包含/排除规则，精确控制哪些完成要提醒。 |
| [dsh-desktop](https://github.com/bruc3van/dsh-desktop) | [@bruc3van](https://github.com/bruc3van) | 让 Agent 安全地常驻在你的桌面上：官方 Web UI 原封不动，长任务不再被终端和浏览器标签页绑架，精选插件先审查、再安装。 |
| [dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider) | [@Mars-Sea](https://github.com/Mars-Sea) | 非官方 DeepSeek Harness 的 LLM provider 插件，用于 Command Code，移植自 pi-commandcode-provider（MIT 协议）。它注册了一个 commandcode provider，将请求转换为 Command Code 的 Provider API（POST /alpha/generate，由 pi 插件逆向工程，对应 command-code@1.26.0）。 |
| [dsh-web-plugin-manager](https://github.com/LX2000WASD/dsh-web-plugin-manager) | [@LX2000WASD](https://github.com/LX2000WASD) | 在 Web UI 中一键管理 DeepSeek Harness (DSH) 插件：查看、实时启停、安装/卸载、更新检测、健康检查（依赖/冲突/兼容性分析）、环境管理、插件市场，bundle 与非 bundle 插件全覆盖。 |
| [dsh-memento](https://github.com/PerryLink/dsh-memento) | [@PerryLink](https://github.com/PerryLink) | 给 DeepSeek Harness 补上有界、分层、带审批门、可审计的跨会话记忆。 |
| [dsh-automation](https://github.com/titanwings/dsh-automation) | [@titanwings](https://github.com/titanwings) | DSH 自动化插件：让 Coding 任务按计划在全新 Agent Session 中运行，并由用户或 Agent 创建和管理定时任务。 / Run coding tasks in fresh Agent sessions and manage schedules from DSH Web or an Agent. |
| [superpowers-dsh](https://github.com/LayneChai/superpowers-dsh) | [@LayneChai](https://github.com/LayneChai) | 为 DeepSeek Harness (DSH) 打造的 Superpowers 插件包：把 obra/superpowers 的核心技能 （Claude-Code 技能库：TDD、调试、规划、协作模式）移植到 DSH 的 Cordis |
| [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin) | [@awesome-dsh-plugin](https://github.com/awesome-dsh-plugin) | 在会话内搜索发现 DSH 插件：实时检索 GitHub dsh-plugin 话题，按 star 排序。 |
| [dsh-toy](https://github.com/c3ll256/dsh-toy) | [@c3ll256](https://github.com/c3ll256) | dsh-toy 是一个 DeepSeek Harness 插件，用于将小玩具接入 DSH。 |
| [dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store) | [@ZASENJC](https://github.com/ZASENJC) | 自动分类、收录和验证 GitHub dsh-plugin Topic 项目的静态 DSH 插件市场。 |
| [plugin-registry](https://github.com/vlln/plugin-registry) | [@vlln](https://github.com/vlln) | DSH 插件生态基建：薄控制台（浏览器面板管理官方 repository 插件，0 patch）+ make-dsh-plugin skill 官方插件开发引导 |
| [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) | [@omdsh-dev](https://github.com/omdsh-dev) | DeepSeek Harness 的数据 Agent：面向会话的数据库连接 + 专用 agent 预设，让 AI 写 SQL 并以实时执行反馈迭代。 |
| [dsh-plugin-hub](https://github.com/Noob-stupid/dsh-plugin-hub) | [@Noob-stupid](https://github.com/Noob-stupid) | 给 DeepSeek Harness（DSH）Web 界面加上插件管理面板：一键启用/停用已安装插件， 并直接在 GitHub 上浏览 dsh-plugin 插件项目，一键添加并启用。 |
| [dsh-im](https://github.com/xmanrui/dsh-im) | [@xmanrui](https://github.com/xmanrui) | 让聊天机器人轻松接入 DeepSeek Harness Connect IM bots to DeepSeek Harness with ease |
| [SpecFusion](https://github.com/wxkingstar/SpecFusion) | [@wxkingstar](https://github.com/wxkingstar) | 🌐 官网：specfusion.kingstar.xin |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | [@omdsh-dev](https://github.com/omdsh-dev) | 在 DeepSeek Harness Web 界面中直接打开工作区目录到 VS Code：侧边栏每个真实 Workspace 行的 … 菜单里新增一行 在 VSCode 中打开。 |
| [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | [@LaplaceYoung](https://github.com/LaplaceYoung) | oh-my-dsh：面向 DSH (DeepSeek Harness) 的插件生态——700+ 插件，只通过扩展接缝注册，不修改 agent-loop 骨架 |
| [local-shell-mcp](https://github.com/fwerkor/local-shell-mcp) | [@fwerkor](https://github.com/fwerkor) | Enables LLM to use a cli environment.  |
| [mstar-harness](https://github.com/btspoony/mstar-harness) | [@btspoony](https://github.com/btspoony) | Harness Workflow Engine · Agent Plugin |
| [dsh-stock-watch](https://github.com/Awu12277/dsh-stock-watch) | [@Awu12277](https://github.com/Awu12277) | 已发布到 npm，一条命令安装到你的 web profile： |
| [dsh-multica-runtime](https://github.com/multica-ai/dsh-multica-runtime) | [@multica-ai](https://github.com/multica-ai) | Support dsh runtime on Multica. |
| [deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin) | [@HeiGeAi](https://github.com/HeiGeAi) | DeepSeek Harness 换肤系统：21 套内置皮肤 + 一张图生成整套配色的自定义皮肤。数据源驱动，保对比度推导，构建期校验可读性。 |
| [dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) | [@whiteguo233](https://github.com/whiteguo233) | OpenBiliClaw 是本地运行、跨平台、可调教的个性化内容推荐 Agent；本仓库是它的 DeepSeek Harness 客户端插件——DSH 左侧栏一个 OpenBiliClaw 按钮，点开右侧滑出抽屉（推荐/内容库/对话/画像/设置），并注册 22 个 Agent Bridge 工具，让 Agent 读推荐、答探测、闭环学习。 |
| [deepseek-harness-desktop](https://github.com/xiincs/deepseek-harness-desktop) | [@xiincs](https://github.com/xiincs) | 把 DeepSeek Harness 装进一个真正的桌面应用 |
| [dsh-suite](https://github.com/whyihaveyou/dsh-suite) | [@whyihaveyou](https://github.com/whyihaveyou) | 别再翻 dsh-plugin topic 了，这里都是还能跑的插件。dsh-suite 是 DeepSeek Harness（DSH）插件的活目录——每小时自动刷新、每日兼容实测——外加内置插件商店与 create-dsh-plugin 脚手架。 |
| [dsh-notifier](https://github.com/THEWOLFWALKER/dsh-notifier) | [@THEWOLFWALKER](https://github.com/THEWOLFWALKER) | > 你的 agent，装进口袋。 —— 通知、审批、遥控，全在你的手机里。 |
| [dsh-deepseek-flow](https://github.com/kanghelyu/dsh-deepseek-flow) | [@kanghelyu](https://github.com/kanghelyu) | - Markdown 是唯一事实来源——一份总控 WORKFLOW.md，每个步骤拥有独立的 STEP.md 工作区。 |
| [deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) | [@openma-ai](https://github.com/openma-ai) | TUI Plugin of DeepSeek Harness 让DeepSeek Harness在终端跑起来 |
| [dsh-navbar](https://github.com/vlln/dsh-navbar) | [@vlln](https://github.com/vlln) | DSH 插件：对话节点导航条（右缘节点串快速跳转 user 消息）。官方 bundle 插件，dsh plugin --profile web add 安装 |
| [Tydora](https://github.com/zuorn/Tydora) | [@zuorn](https://github.com/zuorn) | 极致的书写体验 ，所见即所得，界面 纯净 到只剩文字本身。没有一丝多余的干扰，光标所至，思绪便直接落在屏幕上。我把自己对“ 写作手感 ”的所有执念都写了进去，让工具彻底隐退，只留你与 思想的河流 。 |
| [ui-status-label](https://github.com/alingalingling/ui-status-label) | [@alingalingling](https://github.com/alingalingling) | 把你鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子 |
| [dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) | [@HuanLinOTO](https://github.com/HuanLinOTO) | DSH 插件：向模型暴露 MinerU 文档解析工具。MinerU 可将 PDF、图片、DOCX、PPTX、XLSX 等文件转换为结构化的 Markdown / JSON。 |
| [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) | [@Chinesezjc](https://github.com/Chinesezjc) | 跨实例消息互通与事件通知插件，用于 DeepSeek Harness (DSH)。 |
| [dsh-vision](https://github.com/william-jin-cmu/dsh-vision) | [@william-jin-cmu](https://github.com/william-jin-cmu) | 给纯文本的 DeepSeek 加上眼睛。Vision for text-only DeepSeek. |
| [deepseek-pet](https://github.com/keleus/deepseek-pet) | [@keleus](https://github.com/keleus) | DeepSeek Pet 是一个嵌入 DeepSeek Harness 网页的交互式桌宠插件。它会跟随当前任务、 工具调用、上下文占用和活跃会话自动切换 DeepSeek 表情，并通过呼吸、弹跳、倾斜、 视差和淡入动画呈现 Live2D 风格效果。 |
| [allinluna](https://github.com/zenx0x/allinluna) | [@zenx0x](https://github.com/zenx0x) | > 别再把整个项目塞进一个 AI 对话里。 |
| [dsh-lark](https://github.com/omdsh-dev/dsh-lark) | [@omdsh-dev](https://github.com/omdsh-dev) | Lark/飞书 DeepSeek Harness（DSH）即时通讯机器人通道插件。 |
| [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) | [@Moeblack](https://github.com/Moeblack) | dsh-message-edit（npm · GitHub）为 DeepSeek Harness 补充基于事件溯源的「消息编辑与重生成」能力。插件不改写历史事件，也不修改 DSH 引擎内部；每次编辑、重生成或重试都会从目标回合之前创建一个新会话版本，原会话始终保留并可随时切回。 |
| [dshcode](https://github.com/whitelonng/dshcode) | [@whitelonng](https://github.com/whitelonng) | DeepSeek Harness 的社区桌面伴侣：面向 macOS 和 Windows 的一键 Electron 应用。 |
| [dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) | [@lhh010](https://github.com/lhh010) | DSH Web UI 的常驻像素鲸鱼伙伴插件：会话标题栏（标题行右侧）常驻一只小鲸鱼，随会话快照实时反应——零核心改动。 |
| [opc-nexus](https://github.com/h4dex/opc-nexus) | [@h4dex](https://github.com/h4dex) | OPC-Nexus（One Person Company Nexus）是一款本地优先的桌面 AI Agent 管理器。它为单人公司 / 独立开发者提供统一的 AI 数字员工管理平台 —— 从 Agent 创建、任务编排、多引擎接入，到消息渠道集成、工作流自动化和专家团协作，一站式覆盖。 |
| [dsh-plugin-marketplace](https://github.com/AwesomeHou/dsh-plugin-marketplace) | [@AwesomeHou](https://github.com/AwesomeHou) | DeepSeek Harness 插件市场：实时同步 GitHub dsh-plugin 话题（1800+ 仓库）到可搜索、分页的设置页，支持一键安装与 agent 工具（market_search / market_install）。 |
| [agent-handoff-skill](https://github.com/WeirdSky924/agent-handoff-skill) | [@WeirdSky924](https://github.com/WeirdSky924) | 跨平台 Agent 接力 skill：在 Codex 或 Claude Code 中建立仓库级连续性记忆，让后续 agent 无需依赖历史聊天即可恢复目标、状态、决策、验证、风险与下一步行动。 |
| [dsh-share](https://github.com/hellodigua/dsh-share) | [@hellodigua](https://github.com/hellodigua) | DSH 对话分享插件：分享单轮或多轮对话，可导出为图片或 Markdown。 |
| [dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) | [@yyyyukari](https://github.com/yyyyukari) | Steam Workshop 风格的 DSH Web UI 插件浏览器：零服务器、GitHub 驱动搜索、趋势窗口、中文搜索与双语翻译、插件签名过滤，以及智能的一键安装/更新/卸载与已装插件管理。 |
| [HoloGram](https://github.com/834063245-creator/HoloGram) | [@834063245-creator](https://github.com/834063245-creator) | HoloGram 把代码库编译成一张统一 IR 依赖图（节点=符号/函数/类/模块，边=调用/继承/读写/时序），并通过 MCP 协议向 AI Agent 暴露 34 个图查询工具。 |
| [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) | [@omdsh-dev](https://github.com/omdsh-dev) | DeepSeek Harness 的自定义工具插件：用户在设置界面的「Custom Tool」页用 Monaco（VS Code）编辑器 + TypeScript 智能提示编写自己的 JavaScript 工具；模型也可以通过 custom_tool_create / custom_tool_remove / custom_tools_list 自主扩展和修剪同一套工具。所有工具持久化、热注册，并在下一步写入模型提示词。 |
| [dsh-xiaoyao-skins](https://github.com/147228/dsh-xiaoyao-skins) | [@147228](https://github.com/147228) | 一套面向真实 DeepSeek Harness Web profile 的社区皮肤合集表现层插件。每套皮肤都是一个可安装、可卸载、可测试的 DSH，不替换会话、模型、工具、沙箱或插件系统； |
| [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) | [@omdsh-dev](https://github.com/omdsh-dev) | DSH 插件健康检查工具 —— 扫描插件仓库，诊断清单协议 / patch 格式 / 构建陷阱 / hub 收录状态，输出合规报告与修复建议。只读，不修改、不构建被检查仓库。 |
| [dsh-computer-use](https://github.com/Anionex/dsh-computer-use) | [@Anionex](https://github.com/Anionex) | 为 DeepSeek Harness 提供原生 macOS 控制能力，默认不碰你的真实光标，也不因指针动作抢占前台；Bundle 可以在键盘输入前把目标应用带到前台，保证输入可靠。 |
| [DSH-Desktop](https://github.com/JustGenius-s/DSH-Desktop) | [@JustGenius-s](https://github.com/JustGenius-s) | 预编译安装包发布在 GitHub Releases。首次启动会自动安装 DSH 运行时（约 1-2 分钟）。 |
| [Co-Engram](https://github.com/Co-Engram/Co-Engram) | [@Co-Engram](https://github.com/Co-Engram) | \| 差异化 \| 含义 \| \| ------------------------ \| ------------------------------------------------------------------------------------------------------------------------------------------------ \| \| 稳定 ID + 单文件布局 \| 每条记忆是一个带 YAML frontmatter 的 Markdown 文件。engram 使用 |
| [dskin](https://github.com/dancingmemory/dskin) | [@dancingmemory](https://github.com/dancingmemory) | \| \| \| \| --- \| --- \| \| 🐱 1~4 随机小猫 \| 每次刷新随机出现 1~4 只（大橘 / 小白 / 玄猫 / 花猫），可手动加减 \| |
| [dsh-model-router](https://github.com/tianji-qingtian/dsh-model-router) | [@tianji-qingtian](https://github.com/tianji-qingtian) | DeepSeek Harness（dsh）的模型路由与成本优化插件。简单问题直接在便宜模型上作答（零前缀、无缓存税），瞬态故障自动降级，并在输入框下方实时显示每个会话的 token / 缓存命中 / 成本统计。 |
| [dsh-plugin-template](https://github.com/bugmaker2/dsh-plugin-template) | [@bugmaker2](https://github.com/bugmaker2) | DeepSeek Harness 插件开发模板。 |
| [dsh-plugin-cc](https://github.com/cpj-dev/dsh-plugin-cc) | [@cpj-dev](https://github.com/cpj-dev) | 把 DeepSeek Harness 桥接到 Claude Code，用于审查、反馈、委派与会话导入。 |

共收录 137 个插件，官方插件优先展示；数据来源与更新时间见 [docs/plugins.json](docs/plugins.json)。

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
