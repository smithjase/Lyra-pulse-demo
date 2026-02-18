import { useState, useEffect, useCallback } from "react";

// ─── Lyra Pulse MVP v2 — with AI Efficacy Baseline ─────────────────────────
// Now incorporates:
// - 6 baseline lenses (Adoption, Purpose, Flow, Trust, Value, Representation)
// - Scaled anchor items alongside qualitative prompts
// - Directional signal indicators per dimension
// - Net Value synthesis (Benefit – Friction – Risk – Intensification)
// - Pattern density/stability metrics
// - Longitudinal movement tracking across pulse cycles
// - Baseline visualisations

// ─── Baseline Model ─────────────────────────────────────────────────────────

const DIMENSIONS = {
  adoption: { label: "Adoption", color: "#5B8C5A", desc: "Where and how AI is entering real work", icon: "◆" },
  purpose: { label: "Purpose", color: "#2D6A4F", desc: "Whether people understand why AI exists here", icon: "◇" },
  flow: { label: "Flow", color: "#3D8B7A", desc: "How AI affects workflow and cognitive load", icon: "○" },
  trust: { label: "Trust", color: "#7A6C5D", desc: "Confidence, risk perception, governance clarity", icon: "△" },
  value: { label: "Value", color: "#D4A373", desc: "Whether AI improves outcomes, not just speed", icon: "□" },
  representation: { label: "Representation", color: "#9B8EA0", desc: "Whether org knowledge is reflected in AI tools", icon: "⬡" },
};

// Anchor items: scaled 1-5 for longitudinal tracking
const ANCHOR_ITEMS = {
  adoption: [
    { id: "A_anc1", text: "I use AI tools regularly as part of my core work (not just experimenting).", scale: true },
    { id: "A_anc2", text: "AI is integrated into tasks that matter, not just peripheral activities.", scale: true },
  ],
  purpose: [
    { id: "P_anc1", text: "I have a clear understanding of what AI is meant to help me do.", scale: true },
    { id: "P_anc2", text: "The organisation's intent for AI aligns with my role's actual needs.", scale: true },
  ],
  flow: [
    { id: "F_anc1", text: "AI fits naturally into my workflow without creating extra steps.", scale: true },
    { id: "F_anc2", text: "The effort of using AI is worth the output I get.", scale: true },
  ],
  trust: [
    { id: "T_anc1", text: "I feel confident that AI outputs are reliable where it matters.", scale: true },
    { id: "T_anc2", text: "I feel safe being honest about how I use AI at work.", scale: true },
  ],
  value: [
    { id: "V_anc1", text: "AI has genuinely improved the quality or speed of my work.", scale: true },
    { id: "V_anc2", text: "The benefits of AI outweigh the friction it creates.", scale: true },
  ],
  representation: [
    { id: "R_anc1", text: "AI tools reflect how work is actually done here, not a generic version.", scale: true },
    { id: "R_anc2", text: "Important knowledge about my role is captured in systems AI can use.", scale: true },
  ],
};

// Qualitative prompts per dimension
const QUAL_PROMPTS = {
  adoption: [
    { id: "A_q1", text: "Describe the AI tools you use most — and the ones you avoid. Why?" },
    { id: "A_q2", text: "Where has AI become a natural part of your work? Where does it still feel like an experiment?" },
    { id: "A_q3", text: "Are there tasks where you've stopped using AI after trying it? What happened?" },
  ],
  purpose: [
    { id: "P_q1", text: "In your own words, what is AI meant to help you do in your role?" },
    { id: "P_q2", text: "Does the organisation's message about AI match your day-to-day reality?" },
    { id: "P_q3", text: "Where do you think AI is being used for the wrong reasons — even if it works?" },
  ],
  flow: [
    { id: "F_q1", text: "Walk me through a recent task where you used AI. Where did it help and where did it get in the way?" },
    { id: "F_q2", text: "How often do you need to significantly rework what AI produces?" },
    { id: "F_q3", text: "Does using AI make your work feel easier or more mentally taxing? Why?" },
    { id: "F_q4", text: "Where does AI speed things up in one place but create more work elsewhere?" },
  ],
  trust: [
    { id: "T_q1", text: "How clear are the rules or expectations around AI use in your role?" },
    { id: "T_q2", text: "What are the unwritten rules in your team about using AI?" },
    { id: "T_q3", text: "Have you ever kept your AI use private because of how it might be perceived?" },
  ],
  value: [
    { id: "V_q1", text: "Where does AI genuinely save you effort — and where does that value disappear?" },
    { id: "V_q2", text: "Has anything been lost — in quality, character, or craft — since AI entered your workflow?" },
    { id: "V_q3", text: "Who benefits most from AI in your team? Who bears the hidden costs?" },
  ],
  representation: [
    { id: "R_q1", text: "What important knowledge about your work isn't written down anywhere?" },
    { id: "R_q2", text: "What would an AI system misunderstand about your role or how decisions are made?" },
    { id: "R_q3", text: "Does AI output sound like your organisation — or something more generic?" },
  ],
};

// ─── Simulated Baseline Data ────────────────────────────────────────────────
// For the prototype, we simulate what the LLM analysis would produce

const SIMULATED_BASELINE = {
  cycle: 1,
  respondents: 47,
  participation_rate: 0.78,
  dimension_signals: {
    adoption: { signal: 0.62, direction: "stable", confidence: "emerging", anchor_mean: 3.4 },
    purpose: { signal: 0.41, direction: "weak", confidence: "early", anchor_mean: 2.8 },
    flow: { signal: 0.55, direction: "mixed", confidence: "emerging", anchor_mean: 3.1 },
    trust: { signal: 0.38, direction: "fragile", confidence: "early", anchor_mean: 2.6 },
    value: { signal: 0.52, direction: "uneven", confidence: "emerging", anchor_mean: 3.2 },
    representation: { signal: 0.29, direction: "weak", confidence: "early", anchor_mean: 2.3 },
  },
  net_value: {
    benefit_signal: 0.58,
    friction_signal: 0.45,
    risk_signal: 0.35,
    intensification_signal: 0.40,
    net: 0.58 - 0.45 - 0.15 - 0.12,  // simplified weighted
  },
  patterns: [
    { theme: "Quiet adoption", dimension: "adoption", recurrence: "strong", density: 0.72, sentiment: "cautious" },
    { theme: "Purpose drift", dimension: "purpose", recurrence: "recurring", density: 0.58, sentiment: "uncertain" },
    { theme: "Rework burden", dimension: "flow", recurrence: "strong", density: 0.65, sentiment: "frustrated" },
    { theme: "Governance ambiguity", dimension: "trust", recurrence: "recurring", density: 0.61, sentiment: "anxious" },
    { theme: "Value pockets", dimension: "value", recurrence: "recurring", density: 0.54, sentiment: "mixed" },
    { theme: "Knowledge gaps", dimension: "representation", recurrence: "emerging", density: 0.41, sentiment: "unaware" },
    { theme: "Shadow AI normalising", dimension: "trust", recurrence: "strong", density: 0.68, sentiment: "resigned" },
    { theme: "Hidden rework cost", dimension: "value", recurrence: "recurring", density: 0.57, sentiment: "frustrated" },
  ],
  friction_hotspots: [
    { area: "Review & verification", intensity: 0.72, roles: ["Legal", "Compliance", "Senior leads"] },
    { area: "Prompt iteration", intensity: 0.58, roles: ["All roles"] },
    { area: "Output correction", intensity: 0.64, roles: ["Content", "Marketing", "Comms"] },
    { area: "Tool switching", intensity: 0.45, roles: ["Operations", "Finance"] },
  ],
  insights: {
    headline: "AI is being used more than reported — but value is being eroded by hidden rework, governance uncertainty, and uneven relevance across roles.",
    cards: [
      {
        title: "Adoption is deeper than dashboards suggest — but largely invisible",
        dimension: "adoption",
        observations: [
          "Usage extends well beyond sanctioned tools into personal workflows and workarounds.",
          "Frequency is higher than self-reported, particularly for drafting, structuring, and sense-checking.",
          "Avoidance zones cluster around high-stakes, client-facing, and compliance-adjacent work.",
        ],
        possible_causes: [
          "Sanctioned tools don't match the pace or shape of real work.",
          "Perceived risk of disclosure outweighs perceived benefit of transparency.",
          "No shared language exists for describing 'responsible informal use'.",
        ],
        quotes: [
          "I use it every day — I just wouldn't call it 'using AI' in a survey.",
          "The approved tools are fine for simple stuff. For real work, I've found my own way.",
        ],
        why_matters: "When adoption is invisible, leaders make investment decisions based on incomplete data. Shadow patterns become the real operating system while the official one is measured.",
        explore_next: ["Map the gap between sanctioned and actual tool use by function", "Surface the 'workaround economy' without creating fear"],
        evidence_note: "Strong signal across multiple roles — consistent 'quiet use' language pattern.",
      },
      {
        title: "Value exists in pockets — but the net picture is cloudier than expected",
        dimension: "value",
        observations: [
          "Time savings are reported for first-draft and ideation tasks — but frequently offset by verification effort.",
          "Roles closest to content creation see highest perceived value; operational roles see lowest.",
          "Hidden rework — correcting, reformatting, fact-checking AI output — is rarely accounted for.",
        ],
        possible_causes: [
          "Value measurement focuses on speed rather than end-to-end quality.",
          "Verification burden falls unevenly, often on senior staff or reviewers.",
          "Work intensification is invisible because it's distributed across the chain.",
        ],
        quotes: [
          "It saves me twenty minutes writing and costs me thirty minutes checking.",
          "The first draft is faster. Everything after that... I'm not sure it's quicker overall.",
        ],
        why_matters: "If net value is lower than perceived value, AI investment decisions rest on optimistic assumptions. The rework tax is real but rarely measured.",
        explore_next: ["Quantify the verification burden by role", "Map where value genuinely compounds vs where it merely shifts effort"],
        evidence_note: "Recurring signal — consistent across content, legal, and analytical roles. Rework language is strong.",
      },
      {
        title: "Trust is fragile — and silence is the dominant signal",
        dimension: "trust",
        observations: [
          "Most people describe uncertainty about what's acceptable, not what's possible.",
          "Governance rules exist on paper but feel ambiguous in daily practice.",
          "People are optimising for personal safety rather than organisational learning.",
        ],
        possible_causes: [
          "Policy language doesn't translate into scenario-level guidance.",
          "No safe mechanism exists for discussing failed or uncertain AI use.",
          "Social norms haven't formed — so people default to silence.",
        ],
        quotes: [
          "I know the policy. I don't know if what I'm doing follows it.",
          "I'd share more if I knew it wouldn't come back to bite me.",
        ],
        why_matters: "Trust fragility suppresses the signal quality of everything else. If people self-censor, every other dimension is measured through a filter of caution rather than reality.",
        explore_next: ["Identify where 'safe-to-discuss' zones could be created", "Explore what governance clarity would actually look like in practice"],
        evidence_note: "Strong, consistent signal — trust language appears across all roles and functions.",
      },
    ],
    net_value_narrative: "Early signals suggest that AI is creating genuine value in specific pockets — primarily first-draft and ideation work — but this value appears to be partially offset by verification burden, rework costs, and cognitive load that isn't currently visible in productivity metrics. The net value picture is cloudier than headline adoption numbers suggest.",
    next_pulse_suggestions: [
      "Deepen into Flow: map the actual rework chain from AI draft to final output by role.",
      "Explore Purpose alignment: test whether leadership's AI narrative matches frontline experience.",
      "Investigate the verification burden: who carries it, how much time it takes, and whether it's recognised.",
    ],
  },
};

// Simulated Cycle 2 data for longitudinal comparison
const SIMULATED_CYCLE_2 = {
  cycle: 2,
  respondents: 52,
  participation_rate: 0.83,
  dimension_signals: {
    adoption: { signal: 0.68, direction: "growing", confidence: "emerging", anchor_mean: 3.6, delta: +0.06 },
    purpose: { signal: 0.49, direction: "improving", confidence: "emerging", anchor_mean: 3.1, delta: +0.08 },
    flow: { signal: 0.52, direction: "mixed", confidence: "emerging", anchor_mean: 3.0, delta: -0.03 },
    trust: { signal: 0.44, direction: "emerging", confidence: "emerging", anchor_mean: 2.9, delta: +0.06 },
    value: { signal: 0.56, direction: "clarifying", confidence: "emerging", anchor_mean: 3.3, delta: +0.04 },
    representation: { signal: 0.33, direction: "early", confidence: "early", anchor_mean: 2.5, delta: +0.04 },
  },
  movement: {
    persisting: ["Quiet adoption", "Rework burden", "Governance ambiguity"],
    emerging: ["Verification fatigue", "Role-based value divergence"],
    declining: ["Shadow AI normalising"],
    resolved: [],
  },
};

// ─── API Helper ─────────────────────────────────────────────────────────────
async function callClaude(systemPrompt, userMessage) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    const data = await response.json();
    return data.content?.map(b => b.text || "").join("\n") || "";
  } catch (err) {
    console.error("API error:", err);
    return null;
  }
}

// ─── Visualisation Components ───────────────────────────────────────────────

function BaselineRadar({ signals, cycle, compact }) {
  const dims = Object.entries(signals);
  const cx = compact ? 90 : 140, cy = compact ? 90 : 140, r = compact ? 65 : 105;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getPoint = (index, value) => {
    const angle = (Math.PI * 2 * index) / dims.length - Math.PI / 2;
    return { x: cx + r * value * Math.cos(angle), y: cy + r * value * Math.sin(angle) };
  };

  const pathPoints = dims.map(([, d], i) => getPoint(i, d.signal));
  const pathD = pathPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  const size = compact ? 180 : 280;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {levels.map(l => {
        const pts = dims.map((_, i) => getPoint(i, l));
        return <polygon key={l} points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="var(--border)" strokeWidth={l === 0.5 ? 1 : 0.5} strokeDasharray={l === 1 ? "none" : "3,3"} />;
      })}
      {dims.map(([key, d], i) => {
        const end = getPoint(i, 1.0);
        const label = getPoint(i, 1.18);
        return (
          <g key={key}>
            <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--border)" strokeWidth={0.5} />
            {!compact && <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="500" fill={DIMENSIONS[key].color}>{DIMENSIONS[key].label}</text>}
          </g>
        );
      })}
      <polygon points={pathPoints.map(p => `${p.x},${p.y}`).join(" ")} fill="rgba(45,106,79,0.12)" stroke="#2D6A4F" strokeWidth={2}>
        <animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze" />
      </polygon>
      {pathPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={compact ? 3 : 4} fill={DIMENSIONS[Object.keys(signals)[i]].color} stroke="white" strokeWidth={1.5}>
          <animate attributeName="r" from="0" to={compact ? 3 : 4} dur="0.6s" begin={`${i * 0.08}s`} fill="freeze" />
        </circle>
      ))}
    </svg>
  );
}

function SignalBar({ dimension, signal, anchorMean, delta, showDelta }) {
  const dim = DIMENSIONS[dimension];
  const pct = Math.round(signal * 100);
  const labels = ["Weak", "Early", "Emerging", "Developing", "Strong"];
  const labelIdx = Math.min(Math.floor(signal * 5), 4);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: dim.color, fontSize: "0.875rem", fontWeight: 600 }}>{dim.icon}</span>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--primary)" }}>{dim.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{labels[labelIdx]}</span>
          {showDelta && delta !== undefined && (
            <span style={{
              fontSize: "0.6875rem", fontWeight: 600,
              color: delta > 0 ? "#2D6A4F" : delta < 0 ? "#C1666B" : "var(--muted)",
              background: delta > 0 ? "#E8F5EE" : delta < 0 ? "#FDE8E8" : "var(--bg-warm)",
              padding: "1px 6px", borderRadius: 3,
            }}>
              {delta > 0 ? "+" : ""}{(delta * 100).toFixed(0)}
            </span>
          )}
        </div>
      </div>
      <div style={{ width: "100%", height: 6, background: "var(--border-light)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: dim.color, borderRadius: 3,
          transition: "width 1s ease",
        }} />
      </div>
      {anchorMean !== undefined && (
        <div style={{ fontSize: "0.6875rem", color: "var(--muted)", marginTop: 2 }}>
          Anchor mean: {anchorMean.toFixed(1)}/5
        </div>
      )}
    </div>
  );
}

function NetValueGauge({ netValue }) {
  const { benefit_signal, friction_signal, risk_signal, intensification_signal } = netValue;
  const barMax = 180;

  const Bar = ({ label, value, color, isNegative }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: 3 }}>
        <span style={{ color: "var(--secondary)" }}>{isNegative ? "−" : "+"} {label}</span>
        <span style={{ color: "var(--muted)" }}>{(value * 100).toFixed(0)}%</span>
      </div>
      <div style={{ width: "100%", height: 8, background: "var(--border-light)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${value * 100}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );

  const net = benefit_signal - (friction_signal * 0.35) - (risk_signal * 0.3) - (intensification_signal * 0.35);
  const netLabel = net > 0.15 ? "Positive" : net > 0 ? "Marginal" : net > -0.1 ? "Uncertain" : "Negative";
  const netColor = net > 0.15 ? "#2D6A4F" : net > 0 ? "#D4A373" : net > -0.1 ? "#C1666B" : "#8B3A3A";

  return (
    <div>
      <Bar label="Benefit signals" value={benefit_signal} color="#2D6A4F" />
      <Bar label="Friction signals" value={friction_signal} color="#C1666B" isNegative />
      <Bar label="Risk signals" value={risk_signal} color="#D4A373" isNegative />
      <Bar label="Work intensification" value={intensification_signal} color="#9B8EA0" isNegative />
      <div style={{
        marginTop: 16, padding: "10px 14px", borderRadius: 8,
        background: net > 0 ? "#E8F5EE" : "#FFF8F0",
        border: `1px solid ${net > 0 ? "#B7E4C7" : "#F0D9B5"}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--primary)" }}>Net value signal</span>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: netColor }}>{netLabel}</span>
      </div>
    </div>
  );
}

function PatternList({ patterns }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {patterns.map((p, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
          background: "white", border: "1px solid var(--border-light)", borderRadius: 8,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
            background: p.recurrence === "strong" ? "#2D6A4F" : p.recurrence === "recurring" ? "#D4A373" : "#B8B5B0",
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--primary)" }}>{p.theme}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {DIMENSIONS[p.dimension]?.label} · {p.recurrence} · {p.sentiment}
            </div>
          </div>
          <div style={{
            width: 44, height: 4, background: "var(--border-light)", borderRadius: 2, overflow: "hidden",
          }}>
            <div style={{ width: `${p.density * 100}%`, height: "100%", background: DIMENSIONS[p.dimension]?.color, borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FrictionMap({ hotspots }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {hotspots.map((h, i) => (
        <div key={i} style={{ padding: "12px 16px", background: "white", border: "1px solid var(--border-light)", borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--primary)" }}>{h.area}</span>
            <span style={{
              fontSize: "0.6875rem", fontWeight: 600, padding: "2px 8px", borderRadius: 3,
              color: h.intensity > 0.65 ? "#8B3A3A" : h.intensity > 0.5 ? "#8B6914" : "var(--muted)",
              background: h.intensity > 0.65 ? "#FDE8E8" : h.intensity > 0.5 ? "#FFF3CD" : "var(--bg-warm)",
            }}>
              {h.intensity > 0.65 ? "High" : h.intensity > 0.5 ? "Medium" : "Low"} friction
            </span>
          </div>
          <div style={{ width: "100%", height: 4, background: "var(--border-light)", borderRadius: 2, marginBottom: 6 }}>
            <div style={{
              width: `${h.intensity * 100}%`, height: "100%", borderRadius: 2,
              background: h.intensity > 0.65 ? "#C1666B" : h.intensity > 0.5 ? "#D4A373" : "#B8B5B0",
            }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            Roles affected: {h.roles.join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
}

function MovementTracker({ current, previous }) {
  if (!previous) return null;
  const dims = Object.keys(current);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {dims.map(d => {
        const delta = current[d].signal - (previous[d]?.signal || 0);
        const dir = delta > 0.03 ? "up" : delta < -0.03 ? "down" : "stable";
        return (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
            <span style={{ width: 80, fontSize: "0.8125rem", fontWeight: 500, color: DIMENSIONS[d].color }}>{DIMENSIONS[d].label}</span>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 60, height: 4, background: "var(--border-light)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${(previous[d]?.signal || 0) * 100}%`, height: "100%", background: DIMENSIONS[d].color, opacity: 0.3, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: "0.6875rem", color: "var(--muted)" }}>→</span>
              <div style={{ width: 60, height: 4, background: "var(--border-light)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${current[d].signal * 100}%`, height: "100%", background: DIMENSIONS[d].color, borderRadius: 2 }} />
              </div>
            </div>
            <span style={{
              fontSize: "0.6875rem", fontWeight: 600, width: 40, textAlign: "right",
              color: dir === "up" ? "#2D6A4F" : dir === "down" ? "#C1666B" : "var(--muted)",
            }}>
              {dir === "up" ? "↑" : dir === "down" ? "↓" : "→"} {Math.abs(delta * 100).toFixed(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Screen Components ──────────────────────────────────────────────────────

function OrgSetup({ onComplete }) {
  const [orgName, setOrgName] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [sector, setSector] = useState("");
  const [context, setContext] = useState("");

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <p style={{ color: "var(--muted)", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "0.8125rem" }}>
        AI Efficacy Baseline · Cycle 1
      </p>
      <h2 style={{ fontFamily: "var(--display)", fontSize: "2rem", fontWeight: 400, color: "var(--primary)", marginBottom: 12, letterSpacing: "-0.02em" }}>
        Set up your baseline
      </h2>
      <p style={{ color: "var(--secondary)", fontSize: "1.0625rem", marginBottom: 40, lineHeight: 1.6 }}>
        Tell Lyra about your organisation. The baseline will measure six dimensions of AI efficacy — Adoption, Purpose, Flow, Trust, Value, and Representation — to establish where you are today.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Field label="Organisation name" value={orgName} onChange={setOrgName} placeholder="e.g. Northstar Insurance Group" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Size" value={orgSize} onChange={setOrgSize} placeholder="e.g. ~3,000 employees" />
          <Field label="Sector" value={sector} onChange={setSector} placeholder="e.g. Financial services" />
        </div>
        <Field label="What's the current AI situation?" value={context} onChange={setContext} placeholder="e.g. We've rolled out Copilot across the org, but adoption is patchy. Leadership wants to understand the real picture." multiline />

        <div style={{ padding: 20, background: "var(--bg-warm)", borderRadius: 10, border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>
            Baseline structure
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {Object.entries(DIMENSIONS).map(([key, dim]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem" }}>
                <span style={{ color: dim.color, fontWeight: 600 }}>{dim.icon}</span>
                <span style={{ color: "var(--secondary)" }}>{dim.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 10, fontStyle: "italic" }}>
            Each dimension is measured through 2 scaled anchor items + 3-4 qualitative prompts. Full cycle: 5 rotating pulses over 8-12 weeks.
          </p>
        </div>

        <button onClick={() => {
          if (orgName && context) onComplete({ orgName, orgSize, sector, context });
        }}
          disabled={!orgName || !context}
          style={{
            padding: "14px 32px", background: orgName && context ? "var(--accent)" : "var(--border)",
            color: orgName && context ? "white" : "var(--muted)", border: "none", borderRadius: 8,
            fontSize: "1rem", fontWeight: 500, cursor: orgName && context ? "pointer" : "not-allowed",
            alignSelf: "flex-start", marginTop: 8,
          }}>
          Run baseline simulation →
        </button>
      </div>
    </div>
  );
}

function PulseRunning({ org, onComplete }) {
  const [phase, setPhase] = useState(0); // 0-4 for the 5 analysis stages
  const stages = [
    "Collecting pulse responses",
    "Extracting themes & patterns",
    "Clustering by dimension",
    "Computing baseline signals",
    "Synthesising narrative",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase(p => {
        if (p >= stages.length - 1) { clearInterval(timer); return p; }
        return p + 1;
      });
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <p style={{ color: "var(--muted)", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "0.8125rem" }}>
        {org.orgName} · Baseline Cycle 1
      </p>
      <h2 style={{ fontFamily: "var(--display)", fontSize: "1.75rem", fontWeight: 400, color: "var(--primary)", marginBottom: 32 }}>
        Running baseline analysis
      </h2>

      <div style={{
        background: "var(--bg-warm)", borderRadius: 12, padding: 32, marginBottom: 32,
      }}>
        <div style={{ fontSize: "2.5rem", fontFamily: "var(--display)", fontWeight: 300, color: "var(--accent)", marginBottom: 4 }}>
          47<span style={{ fontSize: "1.25rem", color: "var(--muted)" }}> responses</span>
        </div>
        <p style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>78% participation across 5 pulses</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
        {stages.map((stage, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
            background: i <= phase ? "var(--accent-bg)" : "var(--bg-warm)",
            borderRadius: 8, transition: "all 400ms ease",
            border: `1px solid ${i <= phase ? "var(--accent-border)" : "var(--border-light)"}`,
          }}>
            <span style={{
              width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: i < phase ? "var(--accent)" : i === phase ? "var(--accent-bg)" : "var(--border-light)",
              color: i < phase ? "white" : "var(--accent)",
              fontSize: "0.75rem", fontWeight: 600, flexShrink: 0,
              border: i === phase ? "2px solid var(--accent)" : "none",
            }}>
              {i < phase ? "✓" : i + 1}
            </span>
            <span style={{
              fontSize: "0.9375rem", fontWeight: i === phase ? 500 : 400,
              color: i <= phase ? "var(--primary)" : "var(--muted)",
            }}>{stage}</span>
            {i === phase && <LoadingDots small />}
          </div>
        ))}
      </div>

      {phase >= stages.length - 1 && (
        <button onClick={onComplete} style={{
          marginTop: 32, padding: "14px 32px", background: "var(--accent)", color: "white",
          border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 500, cursor: "pointer",
          animation: "fadeIn 400ms ease",
        }}>
          View baseline results →
        </button>
      )}
    </div>
  );
}

function BaselineResults({ org, data, cycle2Data, showCycle2, onToggleCycle2, onNextPulse }) {
  const [tab, setTab] = useState("overview"); // overview | signals | patterns | friction | insights

  const activeData = showCycle2 ? cycle2Data : data;
  const signals = activeData.dimension_signals;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ color: "var(--muted)", marginBottom: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "0.8125rem" }}>
            {org.orgName} · AI Efficacy Baseline · Cycle {showCycle2 ? 2 : 1}
          </p>
          <h2 style={{ fontFamily: "var(--display)", fontSize: "2rem", fontWeight: 400, color: "var(--primary)", letterSpacing: "-0.02em" }}>
            Baseline Results
          </h2>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onToggleCycle2(false)} style={{
            padding: "6px 14px", borderRadius: 6, fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
            border: `1px solid ${!showCycle2 ? "var(--accent)" : "var(--border)"}`,
            background: !showCycle2 ? "var(--accent)" : "white",
            color: !showCycle2 ? "white" : "var(--secondary)",
          }}>Cycle 1</button>
          <button onClick={() => onToggleCycle2(true)} style={{
            padding: "6px 14px", borderRadius: 6, fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
            border: `1px solid ${showCycle2 ? "var(--accent)" : "var(--border)"}`,
            background: showCycle2 ? "var(--accent)" : "white",
            color: showCycle2 ? "white" : "var(--secondary)",
          }}>Cycle 2</button>
        </div>
      </div>

      {/* Maturity notice */}
      <div style={{
        padding: "12px 18px", background: "var(--bg-warm)", borderRadius: 8,
        borderLeft: "3px solid var(--border)", marginBottom: 24,
        fontSize: "0.8125rem", color: "var(--muted)", fontStyle: "italic",
      }}>
        Baseline level · {activeData.respondents} responses · {Math.round(activeData.participation_rate * 100)}% participation · These are early directional signals, not definitive measurements.
      </div>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid var(--border-light)", paddingBottom: 2 }}>
        {[
          { id: "overview", label: "Overview" },
          { id: "signals", label: "Dimension Signals" },
          { id: "patterns", label: "Pattern Map" },
          { id: "friction", label: "Friction" },
          { id: "insights", label: "Insights" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 16px", fontSize: "0.875rem", fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? "var(--accent)" : "var(--secondary)",
            background: "none", border: "none", cursor: "pointer",
            borderBottom: tab === t.id ? "2px solid var(--accent)" : "2px solid transparent",
            marginBottom: -3,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ─── Overview Tab ─── */}
      {tab === "overview" && (
        <div style={{ animation: "fadeIn 300ms ease" }}>
          {/* Headline */}
          <div style={{
            fontFamily: "var(--display)", fontSize: "1.25rem", fontWeight: 400, lineHeight: 1.5,
            color: "var(--primary)", marginBottom: 28, padding: "18px 22px",
            background: "var(--accent-bg)", borderRadius: 10, borderLeft: "4px solid var(--accent)",
          }}>
            {data.insights.headline}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Radar */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16 }}>
                Efficacy Shape
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <BaselineRadar signals={signals} cycle={showCycle2 ? 2 : 1} />
              </div>
            </div>

            {/* Net Value */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16 }}>
                Net Value Signal
              </div>
              <NetValueGauge netValue={data.net_value} />
            </div>
          </div>

          {/* Movement (if cycle 2) */}
          {showCycle2 && (
            <div style={{ marginTop: 24, background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16 }}>
                Movement Since Cycle 1
              </div>
              <MovementTracker current={cycle2Data.dimension_signals} previous={data.dimension_signals} />
              <div style={{ marginTop: 16, padding: 14, background: "var(--bg-warm)", borderRadius: 8 }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--primary)", marginBottom: 6 }}>Theme movement</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {cycle2Data.movement.persisting.map(t => <Tag key={t} label={t} color="var(--muted)" bg="var(--bg-warm)" prefix="Persists:" />)}
                  {cycle2Data.movement.emerging.map(t => <Tag key={t} label={t} color="#D4A373" bg="#FFF8F0" prefix="New:" />)}
                  {cycle2Data.movement.declining.map(t => <Tag key={t} label={t} color="#2D6A4F" bg="#E8F5EE" prefix="Declining:" />)}
                </div>
              </div>
            </div>
          )}

          {/* Quick signals */}
          <div style={{ marginTop: 24, background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16 }}>
              Dimension Signals
            </div>
            {Object.entries(signals).map(([key, s]) => (
              <SignalBar key={key} dimension={key} signal={s.signal} anchorMean={s.anchor_mean} delta={s.delta} showDelta={showCycle2} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Signals Tab ─── */}
      {tab === "signals" && (
        <div style={{ animation: "fadeIn 300ms ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {Object.entries(signals).map(([key, s]) => (
              <div key={key} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: "1.25rem", color: DIMENSIONS[key].color }}>{DIMENSIONS[key].icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--primary)" }}>{DIMENSIONS[key].label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{DIMENSIONS[key].desc}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div style={{ padding: 10, background: "var(--bg-warm)", borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontFamily: "var(--display)", fontWeight: 300, color: DIMENSIONS[key].color }}>{(s.signal * 100).toFixed(0)}</div>
                    <div style={{ fontSize: "0.6875rem", color: "var(--muted)" }}>Signal strength</div>
                  </div>
                  <div style={{ padding: 10, background: "var(--bg-warm)", borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontFamily: "var(--display)", fontWeight: 300, color: DIMENSIONS[key].color }}>{s.anchor_mean.toFixed(1)}</div>
                    <div style={{ fontSize: "0.6875rem", color: "var(--muted)" }}>Anchor mean /5</div>
                  </div>
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--secondary)" }}>
                  <span style={{ fontWeight: 500 }}>Direction:</span> {s.direction} · <span style={{ fontWeight: 500 }}>Confidence:</span> {s.confidence}
                </div>
                {showCycle2 && s.delta !== undefined && (
                  <div style={{
                    marginTop: 8, fontSize: "0.8125rem", fontWeight: 500,
                    color: s.delta > 0 ? "#2D6A4F" : s.delta < 0 ? "#C1666B" : "var(--muted)",
                  }}>
                    {s.delta > 0 ? "↑" : s.delta < 0 ? "↓" : "→"} {s.delta > 0 ? "+" : ""}{(s.delta * 100).toFixed(0)} from Cycle 1
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Patterns Tab ─── */}
      {tab === "patterns" && (
        <div style={{ animation: "fadeIn 300ms ease" }}>
          <p style={{ fontSize: "0.9375rem", color: "var(--secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            Patterns are extracted from qualitative responses and ranked by recurrence and density. Stronger signals indicate themes that appear consistently across roles and functions.
          </p>
          <PatternList patterns={data.patterns} />
        </div>
      )}

      {/* ─── Friction Tab ─── */}
      {tab === "friction" && (
        <div style={{ animation: "fadeIn 300ms ease" }}>
          <p style={{ fontSize: "0.9375rem", color: "var(--secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            Friction hotspots identify where AI creates operational drag — rework, verification burden, tool-switching, and cognitive load. These are the areas where "time saved" claims are stress-tested.
          </p>
          <FrictionMap hotspots={data.friction_hotspots} />
          <div style={{
            marginTop: 20, padding: 16, background: "var(--bg-warm)", borderRadius: 8,
            borderLeft: "3px solid #D4A373",
          }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--primary)", marginBottom: 4 }}>Net value note</div>
            <p style={{ fontSize: "0.8125rem", color: "var(--secondary)", lineHeight: 1.6, margin: 0 }}>
              {data.insights.net_value_narrative}
            </p>
          </div>
        </div>
      )}

      {/* ─── Insights Tab ─── */}
      {tab === "insights" && (
        <div style={{ animation: "fadeIn 300ms ease" }}>
          <div style={{
            fontFamily: "var(--display)", fontSize: "1.25rem", fontWeight: 400, lineHeight: 1.5,
            color: "var(--primary)", marginBottom: 24, padding: "18px 22px",
            background: "var(--accent-bg)", borderRadius: 10, borderLeft: "4px solid var(--accent)",
          }}>
            {data.insights.headline}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {data.insights.cards.map((card, i) => (
              <div key={i} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{
                    fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                    color: DIMENSIONS[card.dimension]?.color, background: `${DIMENSIONS[card.dimension]?.color}15`,
                    padding: "3px 10px", borderRadius: 4,
                  }}>{DIMENSIONS[card.dimension]?.label}</span>
                </div>
                <h3 style={{ fontFamily: "var(--display)", fontSize: "1.1875rem", fontWeight: 500, color: "var(--primary)", marginBottom: 16 }}>
                  {card.title}
                </h3>

                <Section label="What we're noticing">
                  {card.observations.map((o, j) => <Bullet key={j}>{o}</Bullet>)}
                </Section>
                <Section label="Why this might be happening">
                  {card.possible_causes.map((c, j) => <Bullet key={j}>{c}</Bullet>)}
                </Section>
                {card.quotes?.length > 0 && (
                  <Section label="Signals">
                    {card.quotes.map((q, j) => (
                      <div key={j} style={{ fontSize: "0.9375rem", fontStyle: "italic", color: "var(--secondary)", padding: "6px 14px", background: "var(--bg-warm)", borderLeft: "3px solid #D4A373", borderRadius: "0 4px 4px 0", marginBottom: 6 }}>"{q}"</div>
                    ))}
                  </Section>
                )}
                <Section label="Why this matters">
                  <p style={{ fontSize: "0.9375rem", color: "var(--primary)", lineHeight: 1.7, padding: "10px 14px", background: "var(--bg-warm)", borderRadius: 8, margin: 0 }}>{card.why_matters}</p>
                </Section>
                <Section label="What to explore next" last>
                  {card.explore_next.map((e, j) => (
                    <div key={j} style={{ fontSize: "0.9375rem", color: "var(--accent)", paddingLeft: 18, position: "relative", marginBottom: 4 }}>
                      <span style={{ position: "absolute", left: 0 }}>→</span>{e}
                    </div>
                  ))}
                </Section>
                <div style={{ fontSize: "0.8125rem", color: "var(--muted)", fontStyle: "italic", paddingTop: 12, borderTop: "1px solid var(--border-light)", marginTop: 14 }}>
                  {card.evidence_note}
                </div>
              </div>
            ))}
          </div>

          {/* Next suggestions */}
          <div style={{ marginTop: 28, padding: 24, background: "var(--bg-warm)", borderRadius: 12 }}>
            <h3 style={{ fontFamily: "var(--display)", fontSize: "1.0625rem", fontWeight: 500, color: "var(--primary)", marginBottom: 14 }}>
              Suggested next pulse focus
            </h3>
            {data.insights.next_pulse_suggestions.map((s, i) => (
              <div key={i} style={{ fontSize: "0.9375rem", color: "var(--secondary)", padding: "6px 0 6px 18px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>○</span>{s}
              </div>
            ))}
            <button onClick={onNextPulse} style={{
              marginTop: 18, padding: "12px 28px", background: "var(--accent)", color: "white",
              border: "none", borderRadius: 8, fontSize: "0.9375rem", fontWeight: 500, cursor: "pointer",
            }}>
              Run Cycle 2 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Utility Components ─────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, multiline }) {
  const style = {
    width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8,
    fontFamily: "inherit", fontSize: "0.9375rem", color: "var(--primary)", background: "white", outline: "none",
  };
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.9375rem", fontWeight: 500, color: "var(--primary)", marginBottom: 6 }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ ...style, minHeight: 100, resize: "vertical", lineHeight: 1.6 }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style}
          onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
      )}
    </div>
  );
}

function Section({ label, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 16 }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--muted)", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function Bullet({ children }) {
  return (
    <div style={{ fontSize: "0.9375rem", color: "var(--secondary)", lineHeight: 1.6, paddingLeft: 18, position: "relative", marginBottom: 4 }}>
      <span style={{ position: "absolute", left: 0, top: "0.55em", width: 5, height: 5, background: "var(--accent-border)", borderRadius: "50%" }} />
      {children}
    </div>
  );
}

function Tag({ label, color, bg, prefix }) {
  return (
    <span style={{ fontSize: "0.75rem", color, background: bg, padding: "3px 8px", borderRadius: 4, border: `1px solid ${color}22` }}>
      {prefix && <span style={{ fontWeight: 600 }}>{prefix} </span>}{label}
    </span>
  );
}

function LoadingDots({ small }) {
  const s = small ? 5 : 8;
  return (
    <span style={{ display: "inline-flex", gap: small ? 3 : 5, alignItems: "center", marginLeft: 4 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: s, height: s, borderRadius: "50%", background: "var(--accent)", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </span>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────

export default function LyraPulseMVP() {
  const [screen, setScreen] = useState("setup"); // setup | running | results
  const [org, setOrg] = useState(null);
  const [showCycle2, setShowCycle2] = useState(false);

  return (
    <div style={{
      "--display": "'Fraunces', Georgia, serif",
      "--body": "'Source Sans 3', -apple-system, sans-serif",
      "--primary": "#1A1918", "--secondary": "#5C5A56", "--muted": "#8A8783",
      "--accent": "#2D6A4F", "--accent-soft": "#40916C", "--accent-bg": "#E8F5EE", "--accent-border": "#B7E4C7",
      "--bg": "#FAFAF8", "--bg-warm": "#F5F4F0", "--border": "#E8E6E1", "--border-light": "#F0EDE8",
      fontFamily: "var(--body)", background: "var(--bg)", minHeight: "100vh", color: "var(--primary)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 28px", background: "white", borderBottom: "1px solid var(--border-light)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <h1 style={{ fontFamily: "var(--display)", fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.02em" }}>
            Lyra <span style={{ fontWeight: 300, color: "var(--muted)" }}>Pulse</span>
          </h1>
          <span style={{ fontSize: "0.8125rem", color: "var(--secondary)" }}>AI Efficacy Baseline</span>
        </div>
        <span style={{
          fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em",
          color: "var(--accent)", background: "var(--accent-bg)", padding: "4px 10px", borderRadius: 4,
          border: "1px solid var(--accent-border)",
        }}>Prototype</span>
      </header>

      <main style={{ padding: "48px 28px", animation: "fadeIn 400ms ease" }}>
        {screen === "setup" && <OrgSetup onComplete={(o) => { setOrg(o); setScreen("running"); }} />}
        {screen === "running" && <PulseRunning org={org} onComplete={() => setScreen("results")} />}
        {screen === "results" && (
          <BaselineResults
            org={org}
            data={SIMULATED_BASELINE}
            cycle2Data={SIMULATED_CYCLE_2}
            showCycle2={showCycle2}
            onToggleCycle2={setShowCycle2}
            onNextPulse={() => setShowCycle2(true)}
          />
        )}
      </main>

      <footer style={{
        textAlign: "center", padding: "20px 28px", fontSize: "0.75rem", color: "var(--muted)",
        borderTop: "1px solid var(--border-light)",
      }}>
        Lyra Pulse · AI Efficacy Baseline · Simulated data for prototype testing
      </footer>
    </div>
  );
}
