# Plugins Directory

[中文](README.md) | English

This directory contains DeepSeek Harness plugin source code maintained by this repository.

Each plugin should follow these conventions:

```text
plugins/<plugin-name>/
├── src/            # plugin source code
├── README.md       # introduction, features, installation, and usage
└── package.json    # optional: plugin manifest and dependencies
```

## Contributing a Plugin

1. Create a directory named after the plugin under `plugins/`.
2. Write the plugin source code and `README.md`.
3. Add a row to the plugin list in [../README.md](../README.md), or wait for the daily discovery
   workflow to include it automatically.
4. Submit a pull request.

For DeepSeek Harness plugin development conventions, see the official repository
[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness).
