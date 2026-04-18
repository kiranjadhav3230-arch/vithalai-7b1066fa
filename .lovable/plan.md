
User wants full restyle of all post-login feature screens (except Code Library which stays as-is) to match the landing page glass/orange aesthetic. I'll plan this as a focused, file-by-file overhaul touching only visual layers (containers, headers, cards, buttons) — never logic, state, or data flow.

## Scope

Restyle these post-login screens with landing-page aesthetic (aurora bg, glass-card, gradient-text-orange, glow-pulse, vithal logo):

1. **Shell** — `gemini-chat-interface.tsx` (sidebar + top bar)
2. **Welcome** — `welcome-section.tsx` (empty-chat hero)
3. **Chat** — `enhanced-chat-interface.tsx` (message bubbles, input bar)
4. **Code Generator** — `code-generator-section.tsx` + `code-generator-chat.tsx` + `code-generator-result.tsx`
5. **Study Rooms** — `study-rooms.tsx` + `study-room-interface.tsx`
6. **Haq Jaano** — `haq-jaano-integrated.tsx` + `HaqJaanoHome.tsx` (header gradient, category cards)
7. **Crop Analyzer** — `crop-health-analyzer.tsx`
8. **Fullstack Builder** — `fullstack-app-builder.tsx`

**EXCLUDED (stays exactly as-is):**
- Code Library (`code-snippet-library.tsx` + `src/components/code-library/*`) — VS Code aesthetic preserved
- All business logic, hooks, edge functions, encryption, data fetching

## Design tokens applied (already in index.css)

- `aurora-bg` → page backgrounds
- `glass-card` → all card containers
- `glass-surface` → sidebar, top bar, input bars
- `gradient-text-orange` → headings
- `glow-pulse` → primary CTAs and active states
- `grid-noise` → subtle background overlay
- Vithal logo → screen headers where an icon currently sits

## Per-screen changes (visual only)

| Screen | Change |
|---|---|
| Shell | Sidebar → `glass-surface` + orange accent on active item; top bar → glass with logo + `gradient-text-orange` title |
| Welcome | Hero logo with `glow-pulse` ring; suggestion cards → `glass-card` with hover lift |
| Chat | User bubbles orange gradient; AI bubbles `glass-card`; input → `glass-surface` rounded pill |
| Code Generator | Prompt panel + result panel → `glass-card`; language chips → glass pills with orange active |
| Study Rooms | Room cards → `glass-card` with member-count badge; chat panel matches Chat styling |
| Haq Jaano | Header → aurora + gradient title; CategoryCard → `glass-card` with orange icon glow |
| Crop Analyzer | Upload zone → dashed orange border on glass; result cards → `glass-card` |
| Fullstack Builder | Template cards → `glass-card`; preview frame → glass-bordered |

## Safety guardrails

- Touch only JSX className strings and minor wrapper markup
- Never modify: imports of hooks, useEffect/useState logic, event handlers, API calls, encryption, props/types
- Keep all existing IDs, data-attrs, aria labels
- Test after each screen by viewing live preview

## Execution order (one screen per step)

1. Shell + Welcome (foundation)
2. Chat
3. Code Generator
4. Study Rooms
5. Haq Jaano
6. Crop Analyzer
7. Fullstack Builder

After each step the user can verify; if any screen breaks visually we revert just that file.

## Technical notes

- ~10 files modified, no new files, no new dependencies
- All changes are className swaps + small JSX wrapping (e.g. adding `<div className="aurora-bg min-h-screen">` around root)
- Code Library files explicitly skipped — verified list: `code-snippet-library.tsx`, `code-library/ActivityBar.tsx`, `code-library/CodeEditorPane.tsx`, `code-library/EditorTabs.tsx`, `code-library/ExplorerSidebar.tsx`, `code-library/SearchPanel.tsx`, `code-library/SettingsPanel.tsx`, `code-library/StatusBar.tsx`, `code-library/TagsPanel.tsx`, `code-library/TerminalPanel.tsx`, `code-library/WebsiteProjectsPanel.tsx`
