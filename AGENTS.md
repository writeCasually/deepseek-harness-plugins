# AGENTS

## GitHub CLI 与网络状态判断

- 判断 `gh` 登录状态、token 是否有效、远端分支或 PR 状态时，必须用带网络权限的方式执行（Codex 中通常为 `sandbox_permissions: "require_escalated"`）。
- 不要在默认沙箱内运行 `gh auth status` 后，仅凭失败结果判断 token 已失效；沙箱网络拦截可能让 GitHub CLI 误报 `Failed to log in` 或 `token is invalid`。
- 创建 PR、查看远端状态等需要访问 GitHub API 的命令，同样应在网络权限下执行，避免重复误判。

## 插件发现 / 安全审查工作流（discover-plugins）约定

- **官方仓库（`deepseek-ai/*`）始终不参与任何发现/安全审查/刷新**：随 DSH 分发的官方预设插件在
  `docs/official-plugins.json` 独立维护，社区 workflow 不得写入、覆盖或审查它们。手动 `curated`
  精选条目同样不参与自动审查。
- **`FORCE_REREVIEW=1`（“全部审查”）的语义**：用户只会在更新安全审查策略后触发它，目的是重审全部
  已收录插件，并对**曾被判 blocked 而移出列表的仓库重新审查**（防止旧策略误伤导致永久失去复查机会）。
  因此该模式下候选池 = 搜索发现 + 全部已收录 + review-log 中曾 blocked 的仓库，且不受 `LIMIT` 截断。
- 全覆盖重审一次处理大量仓库，需主动节流防 GitHub API 限流（`REREVIEW_DELAY_MS`，默认 800ms），不追求速度。
