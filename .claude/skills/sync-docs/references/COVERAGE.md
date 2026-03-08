# Current Coverage State

Last synced: 2026-03-08
Claude Code version: 2.1.71

## Features in manifest.json

| Key | Title (RU) | Status |
|-----|------------|--------|
| `claude-md` | CLAUDE.md | Covered |
| `settings` | Настройки и разрешения | Covered |
| `commands` | Пользовательские слэш-команды | Covered (deprecated) |
| `skills` | Навыки | Covered |
| `mcp` | MCP-серверы | Covered |
| `hooks` | Хуки | Covered (needs update) |
| `agents` | Агенты | Covered |
| `plugins` | Плагины | Covered |
| `marketplaces` | Маркетплейсы | Covered |

## CLI Documentation Pages — Coverage Map

### Fully Covered
- [x] `/en/memory` → `claude-md` feature
- [x] `/en/settings` → `settings` feature
- [x] `/en/skills` → `skills` feature
- [x] `/en/hooks`, `/en/hooks-guide` → `hooks` feature
- [x] `/en/sub-agents` → `agents` feature
- [x] `/en/mcp` → `mcp` feature
- [x] `/en/plugins`, `/en/plugins-reference` → `plugins` feature
- [x] `/en/plugin-marketplaces`, `/en/discover-plugins` → `marketplaces` feature

### Needs Update
- [ ] `/en/hooks` — HTTP hooks (POST to URLs) not covered
- [ ] `/en/hooks` — `InstructionsLoaded` hook event not covered
- [ ] `/en/skills` — `${CLAUDE_SKILL_DIR}` variable not documented
- [ ] `/en/settings` — `.claude/settings.local.json` not mentioned

### Not Covered (CLI-relevant, should add)
- [ ] `.claude/rules/*.md` — conditional rules with frontmatter (**HIGH PRIORITY**)
- [ ] `/en/keybindings` — `~/.claude/keybindings.json` customization
- [ ] `/en/model-config` — model selection and configuration
- [ ] `/en/terminal-config` — terminal optimization
- [ ] `/en/checkpointing` — checkpoint/restore feature
- [ ] `/en/fast-mode` — fast mode toggle
- [ ] `/en/output-styles` — output customization
- [ ] `/en/statusline` — status line customization
- [ ] `/en/sandboxing` — sandbox configuration
- [ ] `/en/interactive-mode` — interactive mode details

### Out of Scope (Platform-specific)
- `/en/vs-code` — VS Code extension
- `/en/jetbrains` — JetBrains plugin
- `/en/desktop`, `/en/desktop-quickstart` — Desktop app
- `/en/chrome` — Chrome extension
- `/en/slack` — Slack integration
- `/en/github-actions`, `/en/gitlab-ci-cd` — CI/CD
- `/en/remote-control` — Remote sessions
- `/en/claude-code-on-the-web` — Web interface
- `/en/scheduled-tasks` — Scheduled tasks
- `/en/agent-teams` — Multi-agent orchestration
- `/en/headless` — Programmatic/SDK usage
- Enterprise pages

## Terminal Commands

### Currently Emulated
- `/help`
- `/init`
- `/doctor`
- `/diff`
- `/compact`
- `/model`
- `/cost`
- `/status`
- `/config`
- `/memory`
- `/loop`

### Should Add
- `/copy` — code block picker (2.1.63)
- `/color` — color settings (2.1.70)
- `/simplify` — code simplification (2.1.63)
- `/batch` — batch operations (2.1.63)
- `/reload-plugins` — reload plugins (2.1.69)
- `/plugin` — plugin management (2.1.63+)

## Configuration Files

### Covered
- [x] `CLAUDE.md` — project memory
- [x] `.claude/settings.json` — project settings
- [x] `.mcp.json` — MCP configuration

### Not Covered
- [ ] `.claude/settings.local.json` — local-only settings (not in git)
- [ ] `.claude/rules/*.md` — conditional rules
- [ ] `~/.claude/keybindings.json` — global keybindings
- [ ] `~/.claude/settings.json` — user-level settings
