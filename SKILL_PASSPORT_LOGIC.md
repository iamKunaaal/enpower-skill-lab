# Skill Passport — Complete Logic Documentation
## EmpowerSkillLab / NeoRiSE Framework

---

## 1. OVERVIEW

The Skill Passport is a profiling and reporting system that tracks student competency development across projects throughout an academic year. It generates per-project reports and an annual passport based on teacher-entered scores.

---

## 2. PROGRAM STRUCTURE

Each academic year consists of:
- **3 Main Projects** (Life Form / Machines & Materials / Human Services)
- **1 Final Project**
- **Plug-Ins** (optional, one per project — may or may not be present)

**Rules:**
- Plug-In 1 is linked to Project 1
- Plug-In 2 is linked to Project 2
- Plug-In 3 is linked to Project 3
- Plug-In 4 is linked to Final Project
- Projects are **completely isolated** from each other — no cross-project weightage
- Profile **resets** after every project — each project report is independent

---

## 3. COMPETENCY FRAMEWORK

### Pillars (5 total)
| # | Pillar | Color |
|---|--------|-------|
| 1 | Self Exploration | Teal |
| 2 | Foundational Literacy | Purple |
| 3 | Tech of the Future | Blue |
| 4 | Human Skills | Orange |
| 5 | Future Competencies | Green |

### Sub-Pillars (17 total: SP1–SP17)
Each Sub-Pillar belongs to a Pillar and contains competencies.

### Competencies
- Each Sub-Pillar has multiple competencies
- Competencies are tagged by stage — stage indicates which class range the competency is for:
  - Foundational → Class 1–2
  - Preparatory  → Class 3–5
  - Middle       → Class 6–8
  - Secondary    → Class 9–12
- Competency codes are defined manually by the superadmin (e.g. SP1.C4, SP1.C6)
- Competency code format: `SP{subpillar_number}.C{competency_number}`
- Example: `SP1.C4` = Sub-Pillar 1, Competency 4

### Profiles (15 total)
Each profile has:
- **2–3 Primary Competencies** (high weightage)
- **2–3 Secondary Competencies** (fixed 10% each)

---

## 4. SCORE INPUT

- Teachers score each student on a **1 to 10 scale** per competency:
- Each project can have a maximum of **6 assessments**
- Each assessment can have a maximum of **8–10 competencies** (pending final confirmation)
- Scores are stored in the `ScoreEntry` model per student per assessment-competency

---

## 5. PROJECT TYPES

| Type | Description |
|------|-------------|
| Life Form | Main project type |
| Machines & Materials | Main project type |
| Human Services | Main project type |
| Plug In | Optional, linked to a parent project via `linked_project` FK |
| Final Project | End of year project, same rules as main projects |

---

## 6. PLUG-IN LINKING

- A Plug-In is a `Project` with `project_type = "Plug In"`
- It has a `linked_project` FK pointing to its parent Project
- When creating a Plug-In, the admin selects the parent Project from a dropdown
- If `linked_project` is NULL → it is a normal project (not a Plug-In)

---

## 7. PROJECT ORDERING

- Each `Project` has a `sequence_number` field (set manually by superadmin)
- Example: Project 1 = 1, Project 2 = 2, Project 3 = 3, Final Project = 4
- Used to determine the "most recent" project for Annual Passport calculation
- Plug-In sequence number does not matter — it merges with its linked project

---

## 8. SCORE CALCULATION — WITHIN A PROJECT (WITHOUT PLUG-IN)

**Step 1:** Collect all assessment scores for the student in this project

**Step 2:** For each competency, if it appears in multiple assessments → **average** all scores

```
Example:
SP1.C4 → Assessment 1 (score 7) + Assessment 2 (score 9)
       → Final score = (7 + 9) / 2 = 8.0

SP1.C5 → Only in Assessment 1 (score 6)
       → Final score = 6.0
```

**Step 3:** These final competency scores go directly into the Profiling Engine

---

## 9. SCORE CALCULATION — WITH PLUG-IN

**Step 1 — Calculate Plug-In competency scores:**
Collect all Plug-In assessment scores → average if same competency repeats

```
SP1.C4 → Plugin Ass1(7) + Plugin Ass2(9) → (7+9)/2 = 8.0
SP1.C5 → Only Plugin Ass1(6)             → 6.0
SP9.C4 → Plugin Ass1(5) + Plugin Ass2(7) → (5+7)/2 = 6.0
```

**Step 2 — Calculate Project competency scores:**
Collect all Project assessment scores → average if same competency repeats

```
SP1.C4  → Project Ass1(6) + Project Ass2(8) → (6+8)/2 = 7.0
SP1.C5  → Only Project Ass1(5)              → 5.0
SP7.C4  → Only Project Ass1(8)              → 8.0
SP11.C4 → Only Project Ass2(9)              → 9.0
SP8.C4  → Only Project Ass2(4)              → 4.0
```

**Step 3 — Combine Plug-In + Project scores (per competency):**

| Situation | Rule |
|-----------|------|
| Competency in both Plug-In and Project | Average of both |
| Competency only in Plug-In | Use Plug-In score directly |
| Competency only in Project | Use Project score directly |

```
SP1.C4  → Plugin(8.0) + Project(7.0) → (8.0+7.0)/2 = 7.5
SP1.C5  → Plugin(6.0) + Project(5.0) → (6.0+5.0)/2 = 5.5
SP9.C4  → Only in Plugin             → 6.0
SP7.C4  → Only in Project            → 8.0
SP11.C4 → Only in Project            → 9.0
SP8.C4  → Only in Project            → 4.0
```

**Final Competency Scores (go into Profiling Engine):**
```
SP1.C4  = 7.5
SP1.C5  = 5.5
SP9.C4  = 6.0
SP7.C4  = 8.0
SP11.C4 = 9.0
SP8.C4  = 4.0
```

---

## 10. PROFILING ENGINE — 4 STEPS

Runs after final competency scores are ready. Resets per project.

---

### STEP 1 — Profile Unlock

A profile is **eligible** only if **at least 2 of its primary competencies** were assessed in the project.

```
Profile 1 (Primary: SP1.C4, SP1.C5):
  SP1.C4 ✓, SP1.C5 ✓ → 2 primary assessed → UNLOCKED ✓

Profile 2 (Primary: SP9.C4, SP11.C4):
  SP9.C4 ✓, SP11.C4 ✓ → 2 primary assessed → UNLOCKED ✓

Profile 3 (Primary: SP5.C4, SP6.C4):
  SP5.C4 ✗, SP6.C4 ✗ → 0 primary assessed → LOCKED ✗
```

---

### STEP 2 — Weightage Distribution

For each **unlocked** profile, distribute 100% weightage:

**Rules:**
- Each **secondary competency** = **10% fixed**
- **Primary competency not assessed** in this project → weightage = 0%, redistributed equally to other assessed primaries
- **Remaining %** after secondary = distributed equally among assessed primary competencies

```
Example: Profile 1
  Primary: SP1.C4 (assessed ✓), SP1.C5 (assessed ✓)
  Secondary: SP9.C4, SP7.C4

  Secondary: SP9.C4 = 10%, SP7.C4 = 10% → Total = 20%
  Remaining for primary: 100% - 20% = 80%
  Primary: 80% / 2 = 40% each
  → SP1.C4 = 40%, SP1.C5 = 40%

Example: Profile with 3 primary (2 assessed, 1 not):
  Primary: SP1.C4 ✓, SP1.C5 ✓, SP6.C3 ✗ (not in project)
  Secondary: SP9.C4, SP7.C4

  Secondary: 10% + 10% = 20%
  SP6.C3 → 0% (not assessed, its share redistributed)
  Remaining: 80% shared between 2 assessed primaries = 40% each
  → SP1.C4 = 40%, SP1.C5 = 40%, SP6.C3 = 0%
```

---

### STEP 3 — Profile Score Calculation

```
Profile Score = Σ (Competency Score × Competency Weightage)
```

```
Example: Profile 1
= (SP1.C4 × 40%) + (SP1.C5 × 40%) + (SP9.C4 × 10%) + (SP7.C4 × 10%)
= (7.5 × 0.4) + (5.5 × 0.4) + (6.0 × 0.1) + (8.0 × 0.1)
= 3.0 + 2.2 + 0.6 + 0.8
= 6.6

Example: Profile 2
= (SP9.C4 × 40%) + (SP11.C4 × 40%) + (SP1.C4 × 10%) + (SP8.C4 × 10%)
= (6.0 × 0.4) + (9.0 × 0.4) + (7.5 × 0.1) + (4.0 × 0.1)
= 2.4 + 3.6 + 0.75 + 0.4
= 7.15
```

---

### STEP 4 — Identify Top 3 Profiles

Rank all unlocked profiles by score → select **Top 3 highest scoring** profiles.

```
Profile 2 → 7.15  ← 1st
Profile 1 → 6.6   ← 2nd
...
Profile 3 → LOCKED
```

---

## 11. PROJECT REPORT OUTPUT (STEP 5)

After profiling engine runs, the report contains:

| Field | Description |
|-------|-------------|
| Top 3 Profiles | Highest scoring profiles |
| Top 5 Competencies | Highest scoring competencies with labels |
| Skills to Work On | Lowest scoring competencies |
| All Competency Scores | Every assessed competency with score |
| Written Teacher Feedback | Teacher's qualitative feedback |

**Competency Labels:**
| Label | Description |
|-------|-------------|
| Very Strong | Highest performers |
| Strong | Above average |
| Emerging | Developing |
| Skill to Work On | Needs improvement |

*Note: Exact score thresholds for each label to be confirmed with client (scale is 1–10).*

---

## 12. REPORT GENERATION

- Reports are **pre-calculated and stored** in the database (`ProjectReport` model)
- Teacher manually triggers report via **"Generate Report"** button
- Flow:
  1. Teacher enters all student scores
  2. Teacher clicks "Generate Report"
  3. Calculation engine runs → result stored in `ProjectReport`
  4. Report displayed from stored data (fast page loads)

**Edge Case — Score changed after report generation:**
- `is_outdated = True` is set on the report
- Warning shown: *"Scores updated after report generation. Please regenerate report."*
- "Regenerate Report" button is displayed

---

## 13. PROJECT REPORT MODEL

```
ProjectReport:
  student               → FK to Student
  project               → FK to Project
  top_3_profiles        → JSON
  top_5_competencies    → JSON
  skills_to_work_on     → JSON
  all_competency_scores → JSON
  generated_at          → DateTime
  is_outdated           → Boolean (default False)
```

---

## 14. ANNUAL SKILL PASSPORT

### Rule:
Each competency's annual score = its **most recent score** across all projects (determined by `sequence_number`)

### Logic:
- If a competency was assessed in multiple projects → take the score from the **highest sequence_number** project
- If a competency was assessed in only one project → take that score
- If a competency was never assessed → not included in annual passport

### Examples:
```
SP1.C4 → Project 1 (score 7), Project 2 (score 9), not in Project 3
       → Annual score = 9 (Project 2 is latest where it was assessed)

SP7.C4 → Only in Project 1 (score 8)
       → Annual score = 8

SP11.C4 → Project 1 (score 6), Project 3 (score 9)
        → Annual score = 9 (Project 3 is latest)
```

### Annual Profile Calculation:
- Same 4-step Profiling Engine runs on the full set of latest competency scores
- Annual Top 3 Profiles = based on latest scores across all projects

---

## 15. SUMMARY TABLE

| Scenario | Logic |
|----------|-------|
| Same competency in multiple assessments (one project) | Average |
| Plug-In + Project combined score | Average of both |
| No Plug-In for a project | Project scores only |
| Annual competency score | Latest score across all projects |
| Annual profiles | Calculated from latest competency scores |
| Projects relationship | Fully isolated |
| Profile calculation | Resets per project |

---

## 16. PENDING CLIENT CONFIRMATIONS

| Item | Status |
|------|--------|
| Scoring scale | ✅ Confirmed — 1 to 10 |
| Max competencies per assessment | ⏳ Pending — likely 8 or 10 |
| Competency label thresholds (1–10 scale) | ⏳ Pending |
| Plug-In combining formula | ✅ Confirmed — average of both |
| Final Project special weightage | ✅ Confirmed — no special weightage |
| Profile unlock rule | ✅ Confirmed — at least 2 primary |

---

## 17. FLEXIBLE CONSTANTS (easy to change)

```python
MAX_SCORE = 10
MIN_SCORE = 1
MAX_ASSESSMENTS_PER_PROJECT = 6
MAX_COMPETENCIES_PER_ASSESSMENT = 8  # pending confirmation
SECONDARY_COMPETENCY_WEIGHT = 0.10   # 10% fixed
MIN_PRIMARY_FOR_UNLOCK = 2           # at least 2 primary to unlock profile
TOP_PROFILES_COUNT = 3
TOP_COMPETENCIES_COUNT = 5
```
