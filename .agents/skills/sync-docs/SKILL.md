---
name: sync-docs
description: Check for Codex documentation updates and identify gaps in project content. Use when updating the educational site to match latest Codex CLI features.
trigger: sync docs, check updates, sync documentation, update content
---

# Sync Documentation Skill

This skill checks the official Codex documentation for updates and compares it against the current `manifest.json` content to identify gaps.

## Workflow

1. **Fetch upstream sources** using WebFetch:
   - `https://code.Codex.com/docs/llms.txt` — full documentation index
   - `https://code.Codex.com/docs/en/changelog` — recent changes

2. **Read current state**:
   - Read `site/data/manifest.json` to get covered features
   - Extract feature keys: `Codex-md`, `settings`, `commands`, `skills`, `mcp`, `hooks`, `agents`, `plugins`, `marketplaces`

3. **Compare and identify gaps**:

   **CLI-relevant documentation pages** (in scope):
   - `/en/memory` — AGENTS.md and auto memory
   - `/en/settings` — settings.json configuration
   - `/en/skills` — skills system
   - `/en/hooks` — hooks system
   - `/en/hooks-guide` — hooks guide
   - `/en/sub-agents` — custom subagents
   - `/en/mcp` — MCP configuration
   - `/en/plugins` — plugin creation
   - `/en/plugins-reference` — plugin reference
   - `/en/plugin-marketplaces` — marketplace creation
   - `/en/discover-plugins` — finding plugins
   - `/en/permissions` — permission configuration
   - `/en/cli-reference` — CLI commands and flags
   - `/en/interactive-mode` — interactive mode
   - `/en/keybindings` — keyboard shortcuts
   - `/en/model-config` — model configuration
   - `/en/terminal-config` — terminal setup
   - `/en/checkpointing` — checkpointing feature
   - `/en/fast-mode` — fast mode
   - `/en/output-styles` — output customization
   - `/en/statusline` — status line customization
   - `/en/sandboxing` — sandboxing

   **Out of scope** (IDE/platform-specific):
   - `/en/vs-code`, `/en/jetbrains` — IDE extensions
   - `/en/desktop`, `/en/desktop-quickstart` — Desktop app
   - `/en/chrome` — Chrome extension
   - `/en/slack` — Slack integration
   - `/en/github-actions`, `/en/gitlab-ci-cd` — CI/CD
   - `/en/remote-control` — Remote sessions
   - `/en/Codex-on-the-web` — Web interface
   - `/en/scheduled-tasks` — Scheduled tasks (Desktop/Web only)
   - `/en/agent-teams` — Agent teams orchestration
   - `/en/headless` — Headless/programmatic usage
   - Enterprise pages (`/en/amazon-bedrock`, `/en/google-vertex-ai`, etc.)

4. **Generate report**:
   - List new CLI-relevant pages not yet covered
   - Extract key changes from changelog
   - Suggest specific additions to `manifest.json`

## Output Format

```markdown
## Sync Report — [date]

### Changelog Highlights
- [recent changes relevant to CLI]

### Coverage Status
| Feature | Documented | Covered | Gap |
|---------|------------|---------|-----|
| ...     | ...        | ...     | ... |

### Recommended Updates
1. [specific suggestion with page reference]
2. ...

### New Features to Add
- [feature]: [description] — see [doc page]
```

## Important Notes

- This project is **Russian-language** — all content in `manifest.json` uses Russian
- Focus on `.Codex/` directory structure and configuration
- Terminal slash commands are emulated in `terminal.js`
- Do NOT add features that require Desktop/Web/IDE-specific functionality
