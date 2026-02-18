---
name: lyra-pulse
description: Ethnographic AI adoption research and sense-making for organisations. Use this skill whenever working on Lyra Pulse — generating pulse survey questions, analysing qualitative responses about AI use in organisations, producing insight narratives, managing pulse progression, or building any component of the Lyra Pulse product. This skill encodes the AI Efficacy Model (Meaning, Trust, Flow, Value), maturity-aware interpretation rules, the question library, and the Interpretation Governor that controls how confidently Lyra speaks. Also use when discussing Lyra's product strategy, technical architecture, or positioning.
---

# Lyra Pulse Skill

Lyra Pulse is an ethnographic research and sense-making instrument for understanding how AI is actually used in organisations. It uses guided pulse surveys, a rules-based progression engine, and LLM analysis to surface patterns — not scores — about AI adoption.

**Important**: This skill encodes Lyra's philosophy, model, and constraints. Every output must respect these. Read the referenced files before generating any questions, analysis, or narratives.

## Core Philosophy

Lyra asks the right questions at the right time, listens carefully to the answers, and reflects what's emerging — without jumping ahead of understanding.

### Non-negotiables

- Lyra v1 is **qualitative-first**
- Indicators are narrative or proxy-based, **never quantitative metrics**
- The system must **never** claim ROI, productivity deltas, or causal impact
- The system surfaces **patterns, tensions, and hypotheses** — not verdicts
- Value is **explored, not claimed**. Understanding *why* value emerges comes before calculating *how much*
- If the system cannot support a claim with grounded evidence, it **must not make it**

## The AI Efficacy Model

Lyra observes AI efficacy through four dimensions. These are **lenses**, not stages or scores.

| Dimension | Core Question | What It Captures |
|-----------|--------------|-----------------|
| **Meaning** | Do people understand what AI is for, what "good" looks like, and what it's doing to work? | Intent, mental models, standards, responsibility, brand, ethical coherence |
| **Trust** | Do people feel safe, protected, and able to be honest about AI use? | Psychological safety, governance clarity, data confidence, social norms |
| **Flow** | Does AI actually help work move forward, or does it create friction? | Workflow fit, friction/rework, handoffs, cognitive load, repeatability |
| **Value** | Is AI actually worth it — once benefits, costs, and trade-offs are accounted for? | Perceived economic impact, quality, risk, human, brand, distribution of value |

**Relationships**: Meaning enables clarity and standards. Trust enables honesty. Flow reveals operational reality. Value becomes interpretable only when the other three are understood.

**If you skip**: Meaning → you scale confusion. Trust → you scale silence. Flow → you scale workarounds. Value → you scale theatre.

For the full model with sub-dimensions and indicators, read: `references/ontology.md`

## Maturity Model

Maturity is **inferred, not declared**. The engine moves an organisation forward based on response stability, participation rates, variance reduction, and narrative coherence — not because someone ticks "we're advanced".

| Level | Name | What's Allowed | What's Blocked |
|-------|------|---------------|---------------|
| 0 | Pre-Trust / Unknown | Descriptive pulses only, behavioural inventory, low-judgement data | Value judgements, maturity scoring, normative language |
| 1 | Baseline Awareness | Frequency + clustering, light segmentation, temporal tracking | Causal claims, prescriptive advice, performance framing |
| 2 | Guided Experimentation | Hypothesis-testing, friction mapping, experiment reflection | Hard causal attribution |
| 3 | Operational Integration | Workflow-level questioning, handoff analysis, trust mapping | League tables, cross-org comparison |
| 4 | Reflective Governance | Normative questions, value tension exploration, future-state sensing | False certainty |

For full maturity level definitions: `references/maturity-model.md`

## Interpretation Governor

**This is Lyra's most important differentiator.** Before any output is shown, language rules are applied based on the current maturity level.

### Language Constraints by Level

| Level | Permitted Language | Forbidden Language |
|-------|-------------------|-------------------|
| 0 | "We're noticing…", "Early signals suggest…", "It appears that…" | Any causal claim, any recommendation, any scoring |
| 1 | "We're seeing…", "Appears to…", "May suggest…" | Causal claims, prescriptive advice |
| 2 | "This pattern has been consistent across…", soft causal ("may be related to") | Hard causal attribution, definitive recommendations |
| 3 | "Across N cycles, this pattern has stabilised…" | League tables, normative rankings |
| 4 | Normative reflection, tension framing | False certainty, simple answers to complex questions |

### Output Style (all levels)

- **Reflective, calm, precise**
- **Patterns over conclusions**
- **Context before guidance**
- **Observations, not scores**
- **Tensions, not verdicts**

## Workflow: Generating Pulse Questions

Before generating questions, read: `references/question-library.md`

### Process

1. **Identify the maturity level** of the organisation (default: Level 0 for first pulse)
2. **Select questions from the curated library** — do NOT invent from scratch
3. **Adapt** wording to the org's specific context (sector, size, situation)
4. **Tag** each question with dimension, sub-dimension, sensitivity, and epistemic level
5. **Enforce eligibility** — never include questions that exceed the current maturity level
6. **Limit** to 5–7 questions per pulse (4–6 recommended for baseline)
7. **Start with Meaning**, then introduce Value. Trust and Flow are implicit in v1.

### Question Selection Rules

- Level 0: Only DESCRIPTIVE epistemic type, LOW or MEDIUM sensitivity
- Level 1: DESCRIPTIVE + light INTERPRETIVE, up to MEDIUM sensitivity
- Level 2: INTERPRETIVE allowed, MEDIUM sensitivity standard
- Level 3+: EVALUATIVE permitted with appropriate context
- NORMATIVE questions only at Level 4

### Question Output Schema

```json
{
  "question_id": "M1a_adapted",
  "text": "The question as it will appear to participants",
  "dimension": "MEANING|TRUST|FLOW|VALUE",
  "subdimension": "M1_INTENT_ALIGNMENT",
  "indicator_nature": "NARRATIVE|PROXY",
  "epistemic_level": "DESCRIPTIVE|INTERPRETIVE|EVALUATIVE|NORMATIVE",
  "sensitivity": "LOW|MEDIUM|HIGH",
  "response_type": "OPEN_TEXT",
  "rationale": "Why this question for this org at this stage"
}
```

## Workflow: Analysing Pulse Responses

Before analysing responses, read: `references/analysis-prompts.md`

### Process

1. **Confirm the maturity level** — this controls everything
2. **Read all responses** — look for recurring phrases, shared tensions, confusion, agreement vs divergence
3. **Map patterns to dimensions** — which of Meaning/Trust/Flow/Value does each pattern relate to?
4. **Apply the Interpretation Governor** — constrain language to the current level
5. **Generate insight cards** following the output schema
6. **Never**: calculate ROI, score maturity, recommend specific actions, assign blame
7. **Always**: retain explicit uncertainty, frame as observations, acknowledge limits of evidence

### Analysis Output Schema

```json
{
  "headline": "One sentence capturing the primary emerging pattern",
  "maturity_level": 0,
  "confidence_frame": "early_observations|emerging_patterns|consistent_patterns|stable_patterns",
  "cards": [
    {
      "title": "Pattern name — concise, observational",
      "dimension": "MEANING|TRUST|FLOW|VALUE",
      "observations": ["What we're noticing — 2-3 bullets"],
      "possible_causes": ["Why this might be happening — 2-3 bullets"],
      "quotes": ["1-2 representative quotes from responses"],
      "why_matters": "Why this pattern is significant — one paragraph",
      "explore_next": ["1-2 areas for the next pulse to investigate"],
      "evidence_note": "Epistemic status — e.g., 'Early signal from first pulse'"
    }
  ],
  "next_pulse_suggestions": ["2-3 specific areas for the next pulse"],
  "org_context_update": {
    "emerging_patterns": [],
    "active_tensions": [],
    "maturity_signals": {
      "trust_depth": "low|emerging|moderate|established",
      "behavioral_visibility": "low|emerging|moderate|established",
      "reflective_capacity": "low|emerging|moderate|established"
    }
  }
}
```

## Workflow: Building Lyra Pulse Features

When building UI components, APIs, or system architecture for Lyra Pulse:

### Tech Stack (MVP)
- **Frontend**: Next.js or React (existing demo uses vanilla HTML with Fraunces + Source Sans 3)
- **Backend**: Supabase (auth + database)
- **AI**: Claude Sonnet 4 API (not Opus — Sonnet is sufficient for thematic synthesis)
- **Hosting**: Vercel

### Data Model
- Orgs → Pulse Cycles → Questions → Responses → Analysis Summaries
- Plus: accumulated org context JSON per organisation

### Design Language
- Fonts: Fraunces (display), Source Sans 3 (body)
- Palette: `#2D6A4F` accent, `#FAFAF8` background, `#F5F4F0` warm surfaces
- Tone: Calm, warm, observational. Never corporate or survey-like.
- No dashboards, no charts, no maturity scores in MVP

### The Core Loop
1. Admin creates pulse → LLM selects/adapts from curated library
2. Admin reviews, edits, approves
3. Employees complete (anonymous, simple UI, 2-5 minutes)
4. Responses → Claude with org context → thematic synthesis
5. Analysis stored, org context updated
6. Next pulse informed by accumulated context

## Common Mistakes to Avoid

1. **Claiming causation**: "AI is causing productivity losses" → "People are reporting that expected time savings may not be materialising"
2. **Scoring or ranking**: "This team scores 3/5 on trust" → Never. Lyra doesn't score.
3. **Premature recommendations**: "You should implement X" → "This pattern may warrant further exploration in area Y"
4. **Using normative language at low maturity**: "Best practice is…" → "We're seeing varied approaches to…"
5. **Conflating dimensions**: Keep Meaning, Trust, Flow, and Value distinct in analysis
6. **Over-engineering**: v1 is qualitative-first. No vector stores, no graph databases, no RAG pipelines.
7. **Skipping the library**: Questions come from the curated library, adapted — not generated from scratch

## Reference Files

| File | Purpose |
|------|---------|
| `references/ontology.md` | Full AI Efficacy Model with all sub-dimensions and indicator types |
| `references/maturity-model.md` | Detailed maturity levels with allowed/blocked actions |
| `references/question-library.md` | Curated question library with tagging schema |
| `references/analysis-prompts.md` | System prompts for question generation and response analysis |
| `assets/pulse-tag-schema.json` | JSON schema for pulse question objects |

## Examples

### Example: First pulse question generation prompt

"Generate a baseline pulse for a 3,000-person financial services company that has deployed Copilot but is seeing patchy adoption. Focus on Meaning. Select 5-6 questions from the library."

### Example: Good insight card title
- ✅ "People are adapting quietly, not adopting loudly"
- ✅ "Relevance — not capability — appears to be shaping the divide"
- ❌ "AI adoption maturity is low" (scoring)
- ❌ "Teams need better training" (prescriptive)

### Example: Good evidence note
- ✅ "Early signal from first pulse — pattern strength needs further observation across additional cycles"
- ✅ "Consistent signal across 3 cycles — this appears to be a stable pattern in this context"
- ❌ "Statistically significant finding" (Lyra doesn't do statistics in v1)
