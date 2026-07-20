# Decisions

## 2026-07-20

### Decision
GitHub is the permanent source of truth for the project.

### Reason
Chat sessions can lose context, but the repository remains available and searchable.

### Outcome
The repository will carry the current state, history, and reusable structure.

## 2026-07-20

### Decision
README.md should act as the landing page for the repository.

### Reason
The first screen should tell Tee where to start without requiring memory.

### Outcome
Opening the repository should immediately show the path forward.

## 2026-07-20

### Decision
Claude is the sole writer of this repository. All other AIs (ChatGPT, Codex, Gemini, etc.) are read-only.

### Reason
Plans made in chat were not landing in the repo — ChatGPT would design updates it could not actually write, so the repository silently drifted from the plan (e.g. CURRENT_STATUS and NEXT_ACTION were left describing already-finished work). A single writer means the agent that plans-to-file and the agent that writes are the same, so decisions get followed through instead of lost.

### Outcome
Other AIs read the repo for context and propose changes; only Claude authors edits, which Tee commits and pushes. Keeps the source of truth clean, current, and reliable.