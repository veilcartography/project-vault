# Master Migration Plan

Single execution checklist for moving files into `project-vault`.
**Every file below is real — verified by scanning the actual folders on disk (no inferred names).**

Authored by Claude (sole repo writer). Source of truth for the migration.

## Status legend
- ⭐ **Canonical** — primary copy → move into the repo
- 📚 **Shared** — used across projects → `apps/shared/`
- 📦 **Archive** — historical but worth keeping → `apps/archive/`
- 🔄 **Review-Duplicate** — compare against the canonical copy, then delete the loser
- 🗑️ **Local-only / Exclude** — media, credentials, junk → never enters the repo
- ✅ **Moved** — already in the repo (batch 1)

## Destination structure (inside `project-vault`)
```
apps/knowledge/                     persona, AI context, project-clarity core   (batch 1 here)
apps/prompts/                       skills + prompt libraries
apps/archive/                       old reports, exports, how-tos
apps/shared/                        assets/templates used by multiple projects
apps/projects/ai-operating-system/  system plan, agents, mission control, FileFlow, gantt, hub
apps/projects/ai-onboarding/        onboarding map, guide, intake apps
apps/projects/veil-cartography/     series, content canvas, media strategy
apps/projects/products/             AI Email Assistant, Gumroad, business plans
apps/projects/dreamy-geek/          reseller ops manual, workflow, Facebook content
apps/projects/gnostic-course/       course product: Module 1–8, workbooks, TTS scripts
apps/projects/pisatahua/            retreat safety, dieta/meal guides, marketing, blueprint
apps/projects/business-ideas/       business plans, PESTLE/SWOT, social enterprise
apps/system-data/                   JSON project exports (immutable backups)
```
Media (`.mp4`, `.m4a`), credential files, and duplicate PDFs of editable docs stay in OneDrive — not the repo.

---

## Scope of this plan
Fully verified and mapped below: **02 AI Tools · 04 AI Onboarding · 09 Veil Cartography · 13 Portfolio Packaging · Reseller/Dreamy Geek · Gnosis Course · Pisatahua/Bolivia · Business Ideas.**
Already done: **batch 1** (Portfolio & Persona + Project Clarity core).
Still pending: Veil Cartography Blog + Website, the un-zipped Vault subfolders (01, 05, 10, 11), and loose PDF/TXT overflow in the `_Projects` root.

---

## MIG-001 · 02_AI Tools – Personal AI OS → `apps/projects/ai-operating-system/`
Source: `_Projects\Vault Aligned Projects\02_AI Tools - Personal AI OS\`

**⭐ Move — AI Operating System**
- COMPLETE SYSTEM PLAN.docx
- PROJECT STRUCTURE.docx
- _Systems_Overview__Notion_Agents__Databases.pdf
- notion agents.docx  *(notion agents.pdf = 🔄 pdf duplicate)*
- Notion AI agent email agent system.docx
- Digital Sidekick Agent.pptx
- Notion_Template_Business_Strategy__.docx  *(the ...Build-2026-05-23.pdf = 🔄 pdf duplicate)*
- entity-import-template.csv  *(entity-import-template.xlsx = 🔄 same data)*
- 🤖 MEMORY ENTRY — AI Tools  Personal AI OS.md

**⭐ Move — FileFlow + Mission Control / Gantt (→ ai-operating-system/)**
- fileflow.html  *(fileflow_standalone.html = 🔄 variant)*
- fileflow user guide.pdf
- tee-gantt-board-guide.md.docx  *(tee-gantt-board-guide.pdf = 🔄 pdf duplicate)*
- TEE_—_Mission_Control_Complete_User_Guide.pdf  *(the two other TEE_Mission_Control_* PDFs = 🔄 older variants)*
- PROJECT_HUB_USER_GUIDE.md

**⭐ Move → `apps/knowledge/`**
- TEE_AI_Context_Document.docx
- Instagram_MCP_Connector_Capabilities_Brief.docx

**⭐ Move → `apps/prompts/`**
- SKILL.md
- idea-to-product.skill
- project-clarity-memory-vault.skill
- Codex Prompt Library.docx

**⭐ Move → `apps/projects/ai-onboarding/`**
- AIOnboardingDiscoveryMap.docx
- To share your custom AI Onboarding.txt

**🔄 Review-Duplicate — already moved to `apps/knowledge` in batch 1; compare then delete these**
- Conflict_&_Clarity_Report_Master_Project_Ledger.docx + both `Conflict___..._Ledger*.pdf`
- LIST OF PROJECTS AND ANYTHING.docx
- Master Project Inventory.docx
- Tee Hq Summary.docx
- PROJECT_FILES.md
- business_project_document_summary.md
- project-clarity-vault.html *(also already in repo root)*
- Project Clarity  Memory Vault.docx · Project Clarity User Guide.docx · project data notion.docx · tasks projects.docx *(compare against Project Clarity Vault copies, keep one)*

**📦 Archive → `apps/archive/`**
- show how to use Viva Goals.docx · HOW DO I USE THESE OPTIONS.pdf · persnal assistant pal.pdf · synthass ref.pdf · digital tools1.pdf · Project Summary and File Editing Help.pdf · ai_tools_organisedCSV1.csv.xlsx · memory_aid_16_5_2026.csv.xlsx · KEEP_LOCAL_MANIFEST.md · README.md

**🗑️ Local-only — do not move**
- Tracie Walker - Admin Console.mp4 · Project Clarity — Memory Vault.mp4

---

## MIG-003 · 04_AI Onboarding Map → `apps/projects/ai-onboarding/`
Source: `_Projects\Vault Aligned Projects\04_AI Onboarding Map\`

**⭐ Move**
- Ai Onboarding Guide.docx
- AI Onboarding Map OVERVIEW.md
- ai-onboarding-map.html
- baseline_intake_workspace.tsx
- upgraded_react_workspace.tsx
- AI ONBOARDING MAP INTAKE BLUEPRINT PLAYBOOK GEMINI.pdf
- PLAYBOOK TO PRESCRIPTION.pdf
- AI-Onboarding-Map-Office-Agent-06-02-2026_07_07_PM.pdf
- 🗺️ MEMORY ENTRY — AI Onboarding Map.md

**🗑️ Local-only — do not move**
- Interactive Digital Intake Application - Google Gemini.mp4 · Your AI Onboarding Discovery Map.mp4 · 9-Baseline-Intake-Fill-Once-Notion-*.png (screenshot)

---

## MIG-004 · 09_Veil Cartography (Full Portfolio Detail) → `apps/projects/veil-cartography/`
Source: `_Projects\Vault Aligned Projects\09_Veil Cartography (Full Portfolio Detail)\`

**⭐ Move**
- master_content_canvas.docx  *(master_content_canvas.pdf = 🔄 pdf duplicate)*
- Series Overview.docx  *(Seriess_Overview_gnosis.docx = 🔄 near-duplicate — compare)*
- media strategy.pdf
- veilcartography-platform-bios.pdf

**🔄 Review**
- new project.pdf *(generic name — open to confirm before filing)*

---

## MIG-005 · 13_Portfolio Packaging & Monetisation → `apps/projects/products/`
Source: `_Projects\Vault Aligned Projects\13_Portfolio Packaging & Monetisation Strategy\`

**⭐ Move — AI Email Assistant product**
- AI_Email_Assistant_Product_Guide.md  *(AI_Email_Assistant_Product_Guide.pdf = 🔄 pdf duplicate)*
- AI_Email_Assistant_Prompt_Pack.md  *(AI_Email_Assistant_Prompt_Pack.pdf = 🔄 pdf duplicate)*
- AI Email Command Center.pdf

**⭐ Move — Gumroad / storefront**
- Gumroad_Listing_Copy.pdf
- The email template pack please.pdf
- quick start guide.pdf
- gumroaad  terms.pdf

**🔄 Review — Business plan versions (keep newest, archive rest)**
- BUSINESS1.pdf · BUSINESS 2.pdf · BUSINESS 5.pdf · BUSINESS 6.pdf · BUSINESS7.pdf *(sequential drafts — compare, keep latest → products/, others → archive)*

---

## MIG-002 · Reseller Operations (Dreamy Geek) → `apps/projects/dreamy-geek/`
Source: `_Projects\Reseller Operations\`  *(~95 files — many are product photos)*

**⭐ Move — reseller docs**
- reseller_operations_manual.pdf
- Reseller_Command_Center_-_Operational_Workflow_Guide 2026-03-28.docx  *(RESELLER_WORKFLOW_GUIDE.md.docx = same content → 🔄)*
- 🚀_Master_Inventory_Update_Guide___Reseller_HQ_.do.docx
- 30-Day_Facebook_Content_Calendar_@dreamydealsleeds.docx
- Facebook_Account_Analysis_@dreamydealsleeds_(Tracie_Walker).pdf
- SWOT analysis.doc · listing examples 6-3.docx
- want to create help with reseller tasks 3.docx  *(versions blank/1/2 = 🔄 older drafts)*
- reseller-operations-audit-recovered-20260702-141500.docx
- 🛒 MEMORY ENTRY — Dreamy Geek  Reseller Operations1.txt · 🧠 Veil Cartography Master Sourcing.txt · LOG.md · PROJECT VAULT TEXT.txt

**⭐ Move → `apps/prompts/`:** SKILL.md · Codex_Prompt_Libraryf.docx
**⭐ Move → `apps/system-data/`:** 03_Dreamy_Geek___Reseller_Operations.json · 10_Dreamy_Deals_Leeds_UK_(Full_Portfolio_De.json

**🔄 Review-Duplicate — inventory spreadsheets (keep ONE current master, archive the rest)**
new master.xlsx · Full_Master_Inventory_Export.xlsx · Final_Inventory_Template.xlsx · dreamy-deals-reseller-inventory-recovered-*.xlsx · DreamyDealsLeedsUK_Multi-Platform_*.xlsx (×2) · listings_tracker_FIXED.xlsx · auction_deal_tracker.xlsx + (1) · Inventory_Sync_Report.xlsx · diligence_tracker_tasks.xlsx · ai_digital_tools_tracker.xlsx · LPS ALBUMS.xlsx · the 4 `lots titles retail...` CSVs · RETAIL LINKS (1).csv · traciew2025-collection csv

**⚖️ Supreme Auctions (your live MCOL claim) → Tee's existing LOCKED/secure folder — do NOT put in the repo (live litigation material)**
my response to supreme.pdf · MCOL-Money-Claim-Online-*.pdf · A Battle from the Hospital Bed*.docx · A Leap of Faith*.docx · Outlook email from james atk.pdf · PAID Copy.pdf · REPLY Copy.pdf · SALE_17806_IB883034.pdf · stock parent 1 (1)review(lots).pdf · Supreme_Auctions_Timeline_v2.html

**🗑️ Local-only — do not move:** all `.webp/.png/.jpg` product images (~45) · Vinted…mp4 · LotsWon_*.pdf · vinted.pdf · invoice_final.xlsx · daily dump.url · reseller.one · reseller_hq_workflow.png

---

## MIG-009 · Gnosis Course Material → `apps/projects/gnostic-course/` + `veil-cartography/`
Source: `_Projects\Gnosis Course Material\`  *(213 files — bucketed; best done in the automated sandbox pass)*

**⭐ Course product → `apps/projects/gnostic-course/`**
- `COURSE MODULES\`: Module_01 Gumroad listing → Module_08 PDFs, the Module_01–08 TTS text files, VeilCartography_CourseCatalogue.pdf, Veil_Cartography_—_Master_Gumroad_Setup_Document.pdf
- Workbooks/practices: [Copy]Gnostic_Practice_Workbook_(Blank_Templates).docx · Blueprint for the Gnostic Practice Workbook.docx · The Three-Breath Purification Protocol.docx · Beginner Practice Guide for Gnostic Sophia Cosmology.pdf · training manual.docx  *(Mark-up / practical variants = 🔄)*

**⭐ Content strategy & scripts → `apps/projects/veil-cartography/`**
Word Magic set · Esoteric Content Strategy / Pillars / Clusters docs · CORE CONTENT STRATEGY.docx · The Gnostic Eye_ YouTube Launch Kit.docx · Series Overview / Seriess_Overview_noesis.docx · transcripts · Design Philosophy.docx · Master_Directives_and_Channel_Brief.pdf · 3 vc agent briefs.pdf

**🗑️ Local-only / Exclude:** all `.mp4` (~15) · `.mp3` audio · `.webp` · GnosticGospelsOracle-release.aab/.apk (app builds) · third-party PDFs (Gospel of Thomas Lambdin.pdf, gnostic training manual.pdf) · Gmail hosting-account-details.pdf (credential) · junk (qqqqqq.pdf, mp4.mp4, New project.mp4)
**🔄 Review:** many near-duplicate strategy docs + module drafts — dedupe in the pass.

---

## MIG-012 · Pisatahua / Bolivia → `apps/projects/pisatahua/`
Sources: `_Projects\Pisatahua Ayahuasca Content\` + `\Pisatahua Blueprint and Journey Docs\`
**⚠️ These two folders heavily overlap — ~10 files exist in both. Take one copy of each into `apps/projects/pisatahua/` (either source is fine).**

**⭐ Move — strategy/blueprint**
PISATAHUA  EXECUTIVE STRATEGY SUMMARY.docx · Pisatahua_2026_Jungle_Blueprint.pdf · Pisatahua_Safety_Ecosystem.pdf · Pisatahua_Comprehensive_Marketing_Plan_2026.docx · Pisatahua_Branding_Analysis.pdf · ✅ Action Plan for Sustainable Bolivia.docx · Pisatahua_Formatted_OnePager.docx · Pisatahua_Hybrid_With_CutPoint.docx · LOG.md

**⭐ Move — safety/prep content (keep the `_v2` SEO versions)**
Ayahuasca-Safety-in-Bolivia_…SEO_v2.docx · Ayahuasca-Preparation-and-Dieta_…SEO_v2.docx · Safety-at-Pisatahua_Web-Page.docx · Pisatahua Meals & Preparation Guide…docx · Riberalta–Aquicuana Starter Recipes.docx · Retreat Prep Timeline Checklist.docx · prep checklist.pdf

**⭐ Move → `apps/system-data/`:** 12_Sustainable_Bolivia___Pisatahua.json
**🔄 Review:** the non-`v2` and cross-folder copies (~10 duplicates) — keep one each.
**🗑️ Exclude:** Dieta-Ayahuasca-Comida-11.jpg · Gmail - Re_ Quick Social Media Review…pdf · pisitahua.one · pieces_copilot export pdf

---

## MIG-011 · Business Ideas & Social Enterprise → `apps/projects/business-ideas/`
Source: `_Projects\Business Ideas and Social Enterprise\Business Plans and Home Admin\`

**⭐ Move:** Business plan lite.docx *(Business plan.doc = 🔄 older)* · PESTLE analysis.doc · SWOT analysis.doc · Social purpose healthcheck.doc · P&L and Cash Flow template.xls · plan so far in use.docx · some work so far.docx · bbeez plan approval.pdf · Copy of neww accounts.xlsx · competition (version 1).xlsb.ods · LOG.md
**📦 Archive:** Great Copilot Journey*.pdf · The Great Microsoft 365 Copilot Journey*.pdf · Tarot_Reading*.pdf · Facebook_Page_Research_Plan*.pdf · Gemini.pdf · Notion_Template_Business_Strategy___Build*.pdf
**🗑️ Local-only — do not move:** Gmail - Namecheap Order Summary*.pdf (billing) · Billing-accounts-Microsoft-365-admin-center*.jpg (billing)

---

## ✅ Batch 1 — already in `apps/knowledge/`
Master_Persona_Document_Tracie_Walker.docx · Your Portfolio Master Document.docx · Persona_Agent_Ecosystem_Local_Backup.docx · LOG.md · Tee Hq Summary.docx · Master Project Inventory.docx · Conflict_&_Clarity_Report_Master_Project_Ledger.docx · LIST OF PROJECTS AND ANYTHING.docx · business_project_document_summary.md · PROJECT_FILES.md

---

## Migration rules
1. Move editable source (`.docx`/`.md`) → the matching PDF export is a 🔄 duplicate, not a separate file.
2. Never move credentials, auth files, billing, or legal/benefits records into the repo.
3. Media (`.mp4`, `.m4a`, bulk images) stays in OneDrive.
4. `🔄 Review-Duplicate` = compare against the canonical copy, then delete the loser — never keep both.
5. Preserve app/website folder structures intact when moving them.
6. One writer: Claude authors moves, Tee commits + pushes.

## Execution note
Binary files (`.docx`/`.pdf`/`.pptx`/`.xlsx`) need either the Claude sandbox (currently down) for an automated pass, or manual drag-drop into the destination folders. Text/markdown Claude can place directly.
