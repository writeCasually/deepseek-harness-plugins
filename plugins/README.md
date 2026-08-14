# 插件目录

本目录用于存放本项目自研的 DeepSeek Harness 插件源码。

每个插件应遵循以下约定：

```text
plugins/<插件名>/
├── src/            # 插件源码
├── README.md       # 插件介绍、功能、安装与用法
└── package.json    # 可选：插件清单与依赖
```

## 如何贡献插件

1. 在 `plugins/` 下新建一个以插件名命名的目录。
2. 编写插件源码与 `README.md`。
3. 在根目录 [README.md](../README.md) 的插件列表中补充一行，或等待每日检索工作流自动收录。
4. 提交 Pull Request。

关于 DeepSeek Harness 插件开发约定，请参考官方仓库
[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)。
