# Lyra Pulse — AI Efficacy Baseline Prototype

**A structured ethnographic sensing system for understanding how AI is actually experienced in organisations.**

Lyra Pulse measures six dimensions of AI efficacy — Adoption, Purpose, Flow, Trust, Value, and Representation — through guided pulse surveys and LLM-powered analysis.

## 🚀 Live Demo

**[View the prototype →](https://YOUR_GITHUB_USERNAME.github.io/lyra-pulse-demo/)**

> Replace `YOUR_GITHUB_USERNAME` with your GitHub username after enabling Pages.

## What This Prototype Demonstrates

- **Baseline measurement model** — Six dimensions with scaled anchor items + qualitative prompts
- **Efficacy radar** — Visual shape of an org's AI efficacy profile
- **Net value synthesis** — Benefit minus friction, risk, and work intensification
- **Pattern detection** — Themes extracted from qualitative responses, ranked by recurrence
- **Friction mapping** — Operational drag by area and affected roles
- **Longitudinal tracking** — Cycle-over-cycle movement with deltas and theme persistence
- **Maturity-aware language** — The Interpretation Governor constrains how confidently the system speaks

## Running Locally

No build step required. Just open the file:

```bash
git clone https://github.com/YOUR_USERNAME/lyra-pulse-demo.git
cd lyra-pulse-demo
open index.html
```

Or use any local server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploying as a Live Demo (GitHub Pages)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch** → `main` → `/ (root)`
4. Your demo will be live at `https://YOUR_USERNAME.github.io/lyra-pulse-demo/`

That's it. No CI/CD needed.

## Architecture Notes (for CTO)

This prototype is a **single-file React app** loaded via CDN — no build tooling. The production MVP would be:

| Component | Prototype | Production MVP |
|-----------|-----------|----------------|
| Frontend | Single HTML + React via CDN | Next.js |
| Data | Simulated JSON | Supabase (Postgres) |
| AI | Fallback data (API-ready) | Claude Sonnet 4 API |
| Auth | None | Supabase Auth |
| Hosting | GitHub Pages | Vercel |

### Data Model (MVP)

```
Orgs → Pulse Cycles → Questions → Responses → Analysis Summaries
                                                    ↓
                                          Accumulated Org Context JSON
```

### The Core Loop

1. Admin creates pulse → LLM selects/adapts from curated question library
2. Admin reviews, edits, approves
3. Employees complete (anonymous, 4-6 min)
4. Responses → Claude with org context → thematic synthesis
5. Baseline signals computed, org context updated
6. Next pulse informed by accumulated context

### Key Files

```
lyra-pulse-demo/
├── index.html          # Complete prototype (self-contained)
├── README.md           # This file
├── skill/              # Lyra Pulse skill (model + ontology + prompts)
│   ├── SKILL.md
│   └── references/
│       ├── ontology.md
│       ├── maturity-model.md
│       ├── question-library.md
│       └── analysis-prompts.md
└── docs/
    └── baseline-methodology.md
```

## The Baseline Model

Six dimensions, measured through anchor items (scaled 1-5 for trending) and qualitative prompts (for depth):

| Dimension | What It Measures |
|-----------|-----------------|
| **Adoption** | Where and how AI is entering real work |
| **Purpose** | Whether people understand why AI exists here |
| **Flow** | How AI affects workflow and cognitive load |
| **Trust** | Confidence, risk perception, governance clarity |
| **Value** | Whether AI improves outcomes, not just speed |
| **Representation** | Whether org knowledge is reflected in AI tools |

**Net Value** = Benefit – Friction – Risk – Work Intensification

## License

Proprietary — Lyra AI. Not for redistribution.
