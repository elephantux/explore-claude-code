# Content Standardization Plan — Finalized Decisions

## Goal

Rewrite all manifest.json content from "fake project demo data" to **educational material that teaches each Claude Code concept**. Standardize structure across all 8 feature areas.

---

## Core Design Principles

1. **Teach, don't demo** — Content explains the concept and how to use it. Never fakes being a real project file. No demo data unless it directly serves a teaching purpose.
2. **TL;DR → Depth** — Every overview opens with an immediately actionable summary (skim this, start using it now), then goes deep for those who want it.
3. **Scaffolding over specifics** — Example files show the GENERAL shape with annotated fields (like `name: "my-skill"`, `description: "What this skill does..."`), not narrow real-world implementations.
4. **Core mechanics in-file, link out for advanced** — Don't overload. Point to official docs for edge cases.
5. **Inline links where relevant** + collected resources in `_resources/` directories (to be iterated on later).

---

## Standardized Content Templates

### Template A: Overview File
**Used by:** CLAUDE.md, COMMANDS.md, SKILLS.md, RULES.md, AGENTS.md, MEMORY.md

Structure:
```
# Feature Name

{One-liner: what is this and why it matters}

## Quick Start
{2-4 actionable steps — "read this and start using it now"}

## How It Works
{Core mechanics, scannable — numbered steps or bullets}

## [Feature-specific depth sections]
{Tables, config options, key parameters}
{Inline links to official docs where relevant}

## Tips
{Practical advice, gotchas, best practices — short bullets}
```

### Template B: Self-Describing Scaffolding File
**Used by:** my-command.md, my-agent.md, my-rule.md, SKILL.md (my-skill), settings.json, .mcp.json

- Realistic file structure with GENERIC/illustrative values
- Every field/section annotated explaining what it does
- Shows the general shape — not a specific implementation
- Like SKILL.md's current approach: `name: "my-skill"`, `description: "What this skill does and when to use it..."`

### Template C: Supporting Context Files
**Used by:** helper.sh, REFERENCE.md, template.md (skill anatomy subdirs)

- Teaching content about what this directory type is for
- What goes here, how Claude uses it, best practices
- Brief — secondary to overview + scaffolding

### Template D: _resources/ Directory (TO BE ITERATED ON LATER)
**Concept:** A visually distinct node in each feature directory with a different badge/color. Contains links to official docs, community collections, and copy-pastable starters. Signals "meta, not part of the project structure."

---

## Finalized Tree Structure

Every feature directory follows the same pattern:
```
feature-dir/
  FEATURE.md          ← overview explainer (Template A)
  my-feature/         ← scaffolding directory showing the general shape
    scaffold file(s)  ← annotated boilerplate (Template B/C)
```

Full tree:
```
CLAUDE.md                          ← Template A (teach about CLAUDE.md, tips/tricks)
.claude/
  settings.json                    ← Template B (annotated scaffolding)
  commands/
    COMMANDS.md                    ← Template A (overview of commands)
    my-command/                    ← NEW scaffolding dir
      my-command.md                ← Template B (self-describing scaffold command)
  skills/
    SKILLS.md                      ← Template A (refine existing)
    my-skill/                      ← EXISTING (gold standard structure)
      SKILL.md                     ← Template B (refine existing)
      scripts/helper.sh            ← Template C (refine existing)
      references/REFERENCE.md      ← Template C (refine existing)
      assets/template.md           ← Template C (refine existing)
  agents/
    AGENTS.md                      ← Template A (overview of subagents)
    my-agent/                      ← NEW scaffolding dir (replaces code-reviewer.md)
      my-agent.md                  ← Template B (self-describing scaffold agent)
  rules/
    RULES.md                       ← Template A (overview of rules)
    my-rule/                       ← NEW scaffolding dir (replaces typescript.md)
      my-rule.md                   ← Template B (self-describing scaffold rule)
  MEMORY.md                        ← Template A (teach about auto memory)
.mcp.json                          ← Template B (annotated scaffolding)
src/
  index.ts                         ← UNCHANGED (demo context stays)
```

### What gets removed from current manifest:
- `review-pr.md` and `write-tests.md` (replaced by `my-command/my-command.md`)
- `code-reviewer.md` (replaced by `my-agent/my-agent.md`)
- `typescript.md` (replaced by `my-rule/my-rule.md`)

---

## Implementation Approach

- **One feature area at a time** — user provides resources per topic, I write content, user reviews
- **All changes go in `site/data/manifest.json`** — single source of truth
- **Badge CSS may need updates** for `_resources/` nodes (later)
- **Content sources:** mix of official Anthropic docs + user's summaries

### Priority order:
1. CLAUDE.md (first thing users see, highest impact)
2. Skills (refine — already closest to target)
3. Commands (restructure + rewrite)
4. Settings
5. Agents (restructure + rewrite)
6. Rules (restructure + rewrite)
7. Memory
8. MCP
9. _resources/ directories (iterate on concept later)

### Verification checklist (after each feature):
- [ ] Content renders correctly in the site (markdown, frontmatter, code blocks)
- [ ] Follows the correct template (A/B/C)
- [ ] TL;DR opener is scannable and actionable
- [ ] Scaffolding uses generic values, not specific implementations
- [ ] Inline links to official docs where relevant
- [ ] Tree structure is correct (overview + my-feature/ scaffolding dir)
- [ ] Progress tracker still works

---

## Key Reference: What "Good" Looks Like

The **skills** directory is the gold standard for structure. The `my-skill/SKILL.md` file is the gold standard for scaffolding content — it uses `name: "my-skill"`, `description: "What this skill does and when to use it..."` with every field annotated. All other feature areas should match this structural pattern and teaching style.
