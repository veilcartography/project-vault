# System 14 — AI-Assisted Project Container & Manager Workflow

**Status:** Live (built and deployed 9 July 2026)
**Type:** File-system convention + AI workflow + scheduled automation — no code, no platform lock-in
**Lives in:** `_Projects\` (OneDrive-synced master vault)

---

## What this system is

A self-maintaining project management layer that any AI assistant (Claude, Gemini, Manus, Comet) or human can pick up cold. Each project is a container that carries its own current truth; a single master list carries priorities; a weekly automated audit keeps the whole vault honest.

## Why it exists (the failure it fixes)

By July 2026 the vault had four competing command-centre pages, 26 duplicate HTML files in 4 groups, and point-in-time status notes that went stale silently — `newest-html-candidates-status.md` still said the Gnostic Oracle was "not on GitHub" days after it was live. Snapshot files rot because nothing forces them to update. This system replaces snapshots with append-only history and automated hygiene.

## The four components

### 1. The container convention
One folder per project under `_Projects\`. Everything belonging to a project — content, assets, campaign briefs, logs — lives inside its container. Loose files at the root are treated as strays (exceptions: `TASKS.md`, `PORTFOLIO_BUILD_CHECKLIST.md`).

### 2. TASKS.md — the master list (what's next)
One file at the vault root. Sections: Active / Waiting On / Someday / Done. Holds only forward-looking tasks across all projects, each dated. No history, no notes — it points into the logs, never duplicates them.

### 3. LOG.md — per-project history (what happened)
Every project container holds a `LOG.md`:
- **Append-only** — old entries are never edited
- **Newest entry on top** — the top of the log is always the current truth
- One dated entry per interaction (AI session or manual work): what was done, decisions made, files touched, next steps, open questions
- Any AI session reads the top entry to be fully current in seconds, and appends its own entry before finishing

### 4. weekly-projects-audit — the automated auditor
Scheduled task, Mondays 08:00, strictly read-only. Flags: stray root files, suspected duplicates, stale snapshot-style files (>30 days), containers missing LOG.md or with logs silent >14 days (stalled project signal), and TASKS.md entries contradicted by newer log entries. Writes a dated report to `_cleanup_reports\weekly-audit-YYYY-MM-DD.md` and summarizes the top three issues. Never moves or deletes — recommendations only.

## Operating rules

1. Master list = priorities. Logs = history. Neither does the other's job.
2. Never edit a log entry; append a correction instead.
3. No new snapshot/status files — that information belongs at the top of a LOG.md.
4. Clean-first publishing rule still applies (strip personal data before anything goes public — same rule as the GitHub hub).
5. Every AI working session ends by appending to the relevant LOG.md.

## Build record

**2026-07-09 — Claude (Cowork), with Tee**
- Designed the split (master list vs per-project logs) after the stale-notes failure surfaced during the Gnosis/GitHub check
- Scaffolded `LOG.md` into all 9 project containers; Gnosis log seeded with full session history
- Appended 4 new Active + 1 Someday task to `TASKS.md` (dated format adopted)
- Created and scheduled `weekly-projects-audit` (Mon 08:00, read-only, reports to `_cleanup_reports`)
- Catalogued this system as entry 14 in Vault Aligned Projects

## Future extensions

- Wire audit findings into the TEE Mission Control Gantt board
- Feed LOG.md entries into Pieces as curated memory (auto-capture → curated layer)
- Uptime monitoring for published apps (parked in TASKS.md Someday)
- **Productization candidate:** this is a sellable system in the same family as the AI Email Triage Command System — "the project vault that keeps itself honest." Template + guide + audit prompt pack would fit the Strategic Product Suite at the £17–29 tier.
