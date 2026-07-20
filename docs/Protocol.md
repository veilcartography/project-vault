# Protocol

## Purpose
Define how ChatGPT, Codex, GitHub, and Notion should work together.

## Rules
1. GitHub is the source of truth.
2. Claude is the sole writer of this repository. All other AIs (ChatGPT, Codex, Gemini, etc.) are read-only.
3. Other AIs may read repo files for context and propose changes, but only Claude authors edits, which Tee commits and pushes. Never two agents committing in parallel.
4. ChatGPT handles planning, review, and decisions — advisory only; it proposes, Claude writes.
5. Codex may propose implementation, but changes enter the repo only through Claude.
6. Notion tracks tasks and project visibility.
7. Every work session should end with a handoff.
8. Every important change should be recorded in the manifest or decisions log.
9. Do not duplicate the same information in multiple places unless the duplication is for navigation.
10. Prefer small, clear next actions over large, vague plans.
11. Never commit credentials, secrets, browser exports, plaintext passwords, token dumps, or private account recovery files.
12. Quarantine and remove any file that appears to contain live credentials or authentication data.

## Operating Standard
When uncertain, check the current status, then the next action, then the latest handoff.

## Required Startup Sequence
Before any specialist work begins after an interruption, read these in order:
1. `PROJECT_MANIFEST.md`
2. `CURRENT_STATUS.md`
3. `NEXT_ACTION.md`
4. `docs/Protocol.md`
5. `handoffs/LATEST.md`
6. The handoff file named in `handoffs/LATEST.md`
7. Verify the repository is internally consistent
8. Begin specialist work

If recovery cannot be verified, stop and repair the project state before beginning new work.
