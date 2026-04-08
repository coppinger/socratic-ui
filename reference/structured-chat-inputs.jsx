import { useState } from "react";

// --- Shared palette & primitives ---
const C = {
  bg: "#FAF9F7",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F3F0",
  border: "#E8E4DF",
  borderHover: "#D4CEC6",
  text: "#1A1612",
  textSoft: "#6B6560",
  textMuted: "#9C958E",
  accent: "#C75B2A",
  accentSoft: "#C75B2A18",
  accentHover: "#B04E22",
  success: "#2A7F5B",
  successSoft: "#2A7F5B14",
};

const font = `'Figtree', ui-sans-serif, system-ui, sans-serif`;
const fontMono = `'DM Mono', ui-monospace, monospace`;

const baseCard = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: "28px 28px 24px",
  fontFamily: font,
  width: "100%",
  boxSizing: "border-box",
};

const SectionLabel = ({ number, title, subtitle }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{
        fontFamily: fontMono, fontSize: 11, color: C.textMuted,
        background: C.surfaceAlt, borderRadius: 6, padding: "2px 8px",
        letterSpacing: 1, textTransform: "uppercase",
      }}>{number}</span>
    </div>
    <h3 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "0 0 3px", lineHeight: 1.35 }}>
      {title}
    </h3>
    <p style={{ fontSize: 13, color: C.textMuted, margin: 0, lineHeight: 1.4 }}>{subtitle}</p>
  </div>
);

const OptionCard = ({ title, subtitle, selected, onClick, disabled, indicator, style = {} }) => (
  <button onClick={disabled ? undefined : onClick} style={{
    width: "100%", boxSizing: "border-box", textAlign: "left",
    padding: "14px 16px", borderRadius: 12, cursor: disabled ? "default" : "pointer",
    fontFamily: font, transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: 14,
    border: selected ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
    background: selected ? C.accentSoft : C.surface,
    opacity: disabled ? 0.4 : 1,
    ...style,
  }}>
    {indicator && (
      <span style={{
        flexShrink: 0, width: 28, height: 28, borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, fontFamily: fontMono,
        background: selected ? C.accent : C.surfaceAlt,
        color: selected ? "#fff" : C.textMuted,
        transition: "all 0.15s",
      }}>{indicator}</span>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: selected ? C.accent : C.text, lineHeight: 1.3 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4, marginTop: 2 }}>
          {subtitle}
        </div>
      )}
    </div>
    {selected && !indicator && (
      <span style={{ fontSize: 16, color: C.accent, flexShrink: 0 }}>✓</span>
    )}
  </button>
);

const TextArea = ({ placeholder, value, onChange }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={e => onChange(e.target.value)}
    rows={2}
    style={{
      width: "100%", boxSizing: "border-box", padding: "10px 14px",
      borderRadius: 10, border: `1px solid ${C.border}`, fontFamily: font,
      fontSize: 14, color: C.text, background: C.surfaceAlt, resize: "vertical",
      outline: "none", marginTop: 12, lineHeight: 1.5,
    }}
    onFocus={e => e.target.style.borderColor = C.accent}
    onBlur={e => e.target.style.borderColor = C.border}
  />
);

// ───────────────────────────────────────────
// 1. SINGLE SELECT + OPTIONAL TEXT
// ───────────────────────────────────────────
const SingleSelect = () => {
  const [sel, setSel] = useState(null);
  const [note, setNote] = useState("");
  const opts = [
    { title: "Solo founder", sub: "Building alone, wearing all the hats" },
    { title: "Co-founding team", sub: "Two or more founders splitting responsibilities" },
    { title: "Within a company", sub: "Internal team with organisational backing" },
    { title: "Agency / consultancy", sub: "Building on behalf of a client" },
  ];
  return (
    <div style={baseCard}>
      <SectionLabel number="01" title="How are you building this product?" subtitle="Pick the option that best describes your setup" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {opts.map(o => (
          <OptionCard key={o.title} title={o.title} subtitle={o.sub}
            selected={sel === o.title} onClick={() => setSel(o.title)} />
        ))}
      </div>
      <TextArea placeholder="Any extra context…" value={note} onChange={setNote} />
    </div>
  );
};

// ───────────────────────────────────────────
// 2. MULTI SELECT WITH LIMITS
// ───────────────────────────────────────────
const MultiSelect = () => {
  const [sel, setSel] = useState(new Set());
  const MAX = 3;
  const opts = [
    { title: "Speed to market", sub: "Ship fast, iterate later" },
    { title: "Polish & quality", sub: "Get it right the first time" },
    { title: "Low cost", sub: "Minimise spend wherever possible" },
    { title: "Scalability", sub: "Build for growth from day one" },
    { title: "Simplicity", sub: "Keep the stack and scope tight" },
    { title: "Flexibility", sub: "Stay adaptable as requirements shift" },
  ];
  const toggle = o => setSel(prev => {
    const next = new Set(prev);
    if (next.has(o)) next.delete(o);
    else if (next.size < MAX) next.add(o);
    return next;
  });
  return (
    <div style={baseCard}>
      <SectionLabel number="02" title="What matters most right now?" subtitle="Choose up to 3 priorities to guide your plan" />
      <p style={{ fontSize: 13, color: C.textMuted, margin: "-8px 0 14px" }}>
        <span style={{ color: C.accent, fontWeight: 600 }}>{sel.size}/{MAX} selected</span>
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {opts.map(o => (
          <OptionCard key={o.title} title={o.title} subtitle={o.sub}
            selected={sel.has(o.title)} onClick={() => toggle(o.title)}
            disabled={!sel.has(o.title) && sel.size >= MAX} />
        ))}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────
// 3. PRIORITY RANKING (click to rank)
// ───────────────────────────────────────────
const PriorityRank = () => {
  const items = [
    { title: "User research", sub: "Validate the problem and audience" },
    { title: "Technical architecture", sub: "Choose stack, infra, and data model" },
    { title: "Visual design", sub: "Define the brand and UI direction" },
    { title: "Go-to-market", sub: "Plan distribution and launch" },
    { title: "Funding", sub: "Secure budget or investment" },
  ];
  const [ranked, setRanked] = useState([]);
  const unranked = items.filter(i => !ranked.includes(i.title));

  const add = title => setRanked(prev => [...prev, title]);
  const remove = title => setRanked(prev => prev.filter(i => i !== title));
  const getItem = title => items.find(i => i.title === title);

  return (
    <div style={baseCard}>
      <SectionLabel number="03" title="Rank what to tackle first" subtitle="Tap items in the order you'd prioritise them" />
      {ranked.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: unranked.length > 0 ? 14 : 0 }}>
          {ranked.map((title, i) => {
            const item = getItem(title);
            return (
              <OptionCard key={title} title={item.title} subtitle={item.sub}
                selected onClick={() => remove(title)} indicator={i + 1} />
            );
          })}
        </div>
      )}
      {unranked.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {unranked.map(item => (
            <OptionCard key={item.title} title={item.title} subtitle={item.sub}
              selected={false} onClick={() => add(item.title)}
              style={{ borderStyle: "dashed" }} />
          ))}
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 4. SPECTRUM / SLIDER
// ───────────────────────────────────────────
const Spectrum = () => {
  const [val, setVal] = useState(50);
  return (
    <div style={baseCard}>
      <SectionLabel number="04" title="What's your building philosophy?" subtitle="Drag the slider to where you sit on the spectrum" />
      <div style={{ display: "flex", gap: 16, alignItems: "stretch", marginBottom: 16 }}>
        <div style={{
          flex: 1, padding: "12px 14px", borderRadius: 12,
          border: `1px solid ${val < 40 ? C.accent : C.border}`,
          background: val < 40 ? C.accentSoft : C.surface,
          transition: "all 0.2s",
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: val < 40 ? C.accent : C.text }}>Move fast</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Ship now, fix later</div>
        </div>
        <div style={{
          flex: 1, padding: "12px 14px", borderRadius: 12,
          border: `1px solid ${val > 60 ? C.accent : C.border}`,
          background: val > 60 ? C.accentSoft : C.surface,
          transition: "all 0.2s",
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: val > 60 ? C.accent : C.text, textAlign: "right" }}>Methodical</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2, textAlign: "right" }}>Measure twice, cut once</div>
        </div>
      </div>
      <div style={{ padding: "0 4px" }}>
        <input type="range" min={0} max={100} value={val} onChange={e => setVal(+e.target.value)}
          style={{ width: "100%", accentColor: C.accent, cursor: "pointer" }} />
      </div>
    </div>
  );
};

// ───────────────────────────────────────────
// 5. CARD SORT / BUCKET
// ───────────────────────────────────────────
const CardSort = () => {
  const bucketNames = ["Must have", "Nice to have", "Not needed"];
  const allItems = [
    { title: "Auth system", sub: "Login, signup, permissions" },
    { title: "Analytics", sub: "Usage tracking and dashboards" },
    { title: "Dark mode", sub: "Alternate colour scheme" },
    { title: "Notifications", sub: "Email, push, or in-app alerts" },
    { title: "Search", sub: "Full-text search across content" },
    { title: "Export", sub: "CSV, PDF, or API data export" },
  ];
  const [sorted, setSorted] = useState({ "Must have": [], "Nice to have": [], "Not needed": [] });
  const [activeBucket, setActiveBucket] = useState(null);

  const placed = new Set(Object.values(sorted).flat());
  const unplaced = allItems.filter(i => !placed.has(i.title));

  const placeItem = (title) => {
    if (!activeBucket) return;
    setSorted(prev => ({ ...prev, [activeBucket]: [...prev[activeBucket], title] }));
  };

  const removeItem = (bucket, title) => {
    setSorted(prev => ({ ...prev, [bucket]: prev[bucket].filter(i => i !== title) }));
  };

  const bucketColors = {
    "Must have": { bg: "#C75B2A14", border: `${C.accent}50`, text: C.accent },
    "Nice to have": { bg: "#2A7F5B10", border: "#2A7F5B40", text: C.success },
    "Not needed": { bg: C.surfaceAlt, border: C.border, text: C.textMuted },
  };

  const getItem = title => allItems.find(i => i.title === title);

  return (
    <div style={baseCard}>
      <SectionLabel number="05" title="Prioritise these features" subtitle="Select a bucket, then tap features to sort them" />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {bucketNames.map(b => (
          <button key={b} onClick={() => setActiveBucket(activeBucket === b ? null : b)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 10, fontSize: 13, fontWeight: 600,
            fontFamily: font, cursor: "pointer", transition: "all 0.15s",
            border: activeBucket === b ? `1px solid ${bucketColors[b].text}` : `1px solid ${bucketColors[b].border}`,
            background: bucketColors[b].bg, color: bucketColors[b].text,
          }}>
            {b} ({sorted[b].length})
          </button>
        ))}
      </div>
      {Object.entries(sorted).map(([bucket, titles]) => titles.length > 0 && (
        <div key={bucket} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          {titles.map(title => {
            const item = getItem(title);
            return (
              <div key={title} onClick={() => removeItem(bucket, title)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                borderRadius: 10, cursor: "pointer", fontFamily: font,
                background: bucketColors[bucket].bg, border: `1px solid ${bucketColors[bucket].border}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: bucketColors[bucket].text }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{item.sub}</div>
                </div>
                <span style={{ color: bucketColors[bucket].text, fontSize: 14 }}>×</span>
              </div>
            );
          })}
        </div>
      ))}
      {unplaced.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          {unplaced.map(item => (
            <OptionCard key={item.title} title={item.title} subtitle={item.sub}
              selected={false} onClick={() => placeItem(item.title)}
              disabled={!activeBucket}
              style={{ borderStyle: "dashed" }} />
          ))}
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 6. CONDITIONAL BRANCH (Yes/No → follow-up)
// ───────────────────────────────────────────
const ConditionalBranch = () => {
  const [answer, setAnswer] = useState(null);
  const [detail, setDetail] = useState("");
  const yesOpts = [
    { title: "< 100", sub: "Early adopters, tight feedback loop" },
    { title: "100 – 1k", sub: "Growing base, starting to see patterns" },
    { title: "1k – 10k", sub: "Real traction, scaling concerns emerge" },
    { title: "10k+", sub: "Established product, optimisation mode" },
  ];
  return (
    <div style={baseCard}>
      <SectionLabel number="06" title="Do you have existing users?" subtitle="Your answer shapes the next question" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: answer !== null ? 14 : 0 }}>
        {[
          { title: "Yes", sub: "We have people actively using the product" },
          { title: "No", sub: "Pre-launch or still building" },
        ].map(o => (
          <OptionCard key={o.title} title={o.title} subtitle={o.sub}
            selected={answer === o.title} onClick={() => { setAnswer(o.title); setDetail(""); }} />
        ))}
      </div>
      {answer !== null && (
        <div style={{
          padding: 16, background: C.surfaceAlt, borderRadius: 12,
          borderLeft: `3px solid ${C.accent}`, transition: "all 0.2s",
        }}>
          <p style={{ fontSize: 14, color: C.text, margin: "0 0 12px", fontWeight: 500 }}>
            {answer === "Yes" ? "Roughly how many active users?" : "Who's your initial target audience?"}
          </p>
          {answer === "Yes" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {yesOpts.map(o => (
                <OptionCard key={o.title} title={o.title} subtitle={o.sub}
                  selected={detail === o.title} onClick={() => setDetail(o.title)} />
              ))}
            </div>
          ) : (
            <TextArea placeholder="Describe your target users…" value={detail} onChange={setDetail} />
          )}
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 7. MATRIX / GRID ASSESSMENT
// ───────────────────────────────────────────
const Matrix = () => {
  const rows = [
    { key: "Frontend", sub: "UI, components, styling" },
    { key: "Backend", sub: "APIs, databases, auth" },
    { key: "Design", sub: "UX, brand, visual polish" },
    { key: "DevOps", sub: "CI/CD, infra, monitoring" },
  ];
  const levels = ["None", "Basic", "Solid", "Expert"];
  const [vals, setVals] = useState({});
  const set = (row, level) => setVals(prev => ({ ...prev, [row]: level }));

  return (
    <div style={baseCard}>
      <SectionLabel number="07" title="Rate your team's capabilities" subtitle="Tap each cell to assess skill level across domains" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map(row => (
          <div key={row.key}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{row.key}</span>
              <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 8 }}>{row.sub}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${levels.length}, 1fr)`, gap: 6 }}>
              {levels.map((level, li) => {
                const selected = vals[row.key] === level;
                const filled = vals[row.key] && levels.indexOf(vals[row.key]) >= li;
                return (
                  <button key={level} onClick={() => set(row.key, level)} style={{
                    padding: "8px 4px", borderRadius: 8, cursor: "pointer",
                    transition: "all 0.15s", fontSize: 12, fontWeight: 500,
                    fontFamily: font,
                    border: selected ? `1px solid ${C.accent}` : "1px solid transparent",
                    background: selected ? C.accent : filled ? `${C.accent}20` : C.surfaceAlt,
                    color: selected ? "#fff" : filled ? C.accent : C.textMuted,
                  }}>{level}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────
// 8. QUICK ESTIMATE
// ───────────────────────────────────────────
const QuickEstimate = () => {
  const [budget, setBudget] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const budgetOpts = [
    { title: "< $5k", sub: "Bootstrapped, MVP-only budget" },
    { title: "$5–20k", sub: "Enough for a focused build" },
    { title: "$20–50k", sub: "Room for polish and iteration" },
    { title: "$50k+", sub: "Fully resourced project" },
  ];
  const timelineOpts = [
    { title: "2 weeks", sub: "Sprint to a prototype" },
    { title: "1 month", sub: "Enough for a solid v1" },
    { title: "3 months", sub: "Full product cycle" },
    { title: "6+ months", sub: "Long-term, phased delivery" },
  ];

  return (
    <div style={baseCard}>
      <SectionLabel number="08" title="Budget & timeline constraints" subtitle="Set both dimensions to frame the scope of work" />
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.textSoft, margin: "0 0 10px" }}>Budget range</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {budgetOpts.map(o => (
            <OptionCard key={o.title} title={o.title} subtitle={o.sub}
              selected={budget === o.title} onClick={() => setBudget(o.title)} />
          ))}
        </div>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.textSoft, margin: "0 0 10px" }}>Timeline</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {timelineOpts.map(o => (
            <OptionCard key={o.title} title={o.title} subtitle={o.sub}
              selected={timeline === o.title} onClick={() => setTimeline(o.title)} />
          ))}
        </div>
      </div>
      {budget && timeline && (
        <div style={{
          marginTop: 14, padding: "12px 16px", borderRadius: 10,
          background: C.successSoft, border: `1px solid ${C.success}30`,
          fontSize: 13, color: C.success, fontWeight: 500,
        }}>
          ✓ {budget} budget, {timeline} timeline — got it.
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 9. SPATIAL CANVAS (effort vs impact)
// ───────────────────────────────────────────
const SpatialCanvas = () => {
  const items = ["Onboarding flow", "API docs", "Mobile app", "Admin panel", "Integrations"];
  const [positions, setPositions] = useState({});
  const [dragging, setDragging] = useState(null);

  const placed = Object.keys(positions);
  const unplaced = items.filter(i => !placed.includes(i));

  const handleCanvasClick = (e) => {
    if (!dragging && unplaced.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    if (dragging) {
      setPositions(prev => ({ ...prev, [dragging]: { x, y } }));
      setDragging(null);
    }
  };

  const startPlace = (item) => setDragging(item);
  const removeItem = (item) => {
    setPositions(prev => {
      const next = { ...prev };
      delete next[item];
      return next;
    });
    setDragging(null);
  };

  return (
    <div style={baseCard}>
      <SectionLabel number="09" title="Map these on effort vs impact" subtitle="Tap an item below, then tap the canvas to place it" />
      <div
        onClick={handleCanvasClick}
        style={{
          position: "relative", width: "100%", height: 280, borderRadius: 12,
          background: C.surfaceAlt, border: `1px solid ${C.border}`,
          cursor: dragging ? "crosshair" : "default", overflow: "hidden",
        }}
      >
        {/* Axis labels */}
        <span style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Effort →</span>
        <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Impact →</span>
        {/* Quadrant lines */}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: `${C.border}` }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: `${C.border}` }} />
        {/* Placed items */}
        {Object.entries(positions).map(([item, pos]) => (
          <div key={item} onClick={(e) => { e.stopPropagation(); removeItem(item); }}
            style={{
              position: "absolute", left: `${pos.x * 100}%`, top: `${(1 - pos.y) * 100}%`,
              transform: "translate(-50%, -50%)", padding: "6px 12px", borderRadius: 8,
              background: C.accent, color: "#fff", fontSize: 12, fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap", fontFamily: font,
            }}>
            {item}
          </div>
        ))}
      </div>
      {(unplaced.length > 0 || dragging) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
          {unplaced.map(item => (
            <OptionCard key={item} title={item}
              subtitle={dragging === item ? "Now tap the canvas to place" : "Tap to start placing"}
              selected={dragging === item} onClick={() => startPlace(item)} />
          ))}
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 10. PROGRESSIVE DISCLOSURE CHAIN
// ───────────────────────────────────────────
const ProgressiveDisclosure = () => {
  const tree = {
    root: {
      question: "What type of product?",
      questionSub: "This shapes everything that follows",
      options: [
        { title: "Web app", sub: "Browser-based SaaS or tool", next: "web" },
        { title: "Mobile app", sub: "iOS, Android, or cross-platform", next: "mobile" },
        { title: "API / Developer tool", sub: "Infrastructure or dev-facing product", next: "api" },
      ],
    },
    web: {
      question: "Who's the primary user?",
      questionSub: "Determines UX complexity and onboarding",
      options: [
        { title: "Consumers", sub: "General public, simple UX", next: "web_b2c" },
        { title: "Business users", sub: "Teams, workflows, dashboards", next: "web_b2b" },
        { title: "Internal team", sub: "Ops tooling, no public-facing UI", next: "done" },
      ],
    },
    mobile: {
      question: "What platform?",
      questionSub: "Affects stack, timeline, and cost",
      options: [
        { title: "iOS only", sub: "Swift/SwiftUI, App Store", next: "done" },
        { title: "Android only", sub: "Kotlin, Play Store", next: "done" },
        { title: "Cross-platform", sub: "React Native, Flutter, or Expo", next: "done" },
      ],
    },
    api: {
      question: "What's the integration model?",
      questionSub: "How will developers consume this",
      options: [
        { title: "REST API", sub: "Standard HTTP endpoints", next: "done" },
        { title: "SDK / Library", sub: "Installable package for a language", next: "done" },
        { title: "CLI tool", sub: "Terminal-first interface", next: "done" },
      ],
    },
    web_b2c: {
      question: "Revenue model?",
      questionSub: "Affects feature gating and onboarding flow",
      options: [
        { title: "Freemium", sub: "Free tier with paid upgrades", next: "done" },
        { title: "Subscription", sub: "Monthly or annual plans", next: "done" },
        { title: "Marketplace / transaction", sub: "Take a cut per transaction", next: "done" },
      ],
    },
    web_b2b: {
      question: "Deal size?",
      questionSub: "Shapes sales motion and feature set",
      options: [
        { title: "Self-serve", sub: "Sign up and pay online", next: "done" },
        { title: "Sales-assisted", sub: "Demo calls, proposals", next: "done" },
        { title: "Enterprise", sub: "Custom contracts, procurement", next: "done" },
      ],
    },
  };

  const [path, setPath] = useState(["root"]);
  const [answers, setAnswers] = useState({});

  const currentKey = path[path.length - 1];
  const currentNode = tree[currentKey];

  const select = (option) => {
    setAnswers(prev => ({ ...prev, [currentKey]: option.title }));
    if (option.next !== "done") {
      setPath(prev => [...prev, option.next]);
    }
  };

  const reset = () => { setPath(["root"]); setAnswers({}); };

  const breadcrumb = path.map(k => answers[k]).filter(Boolean);

  return (
    <div style={baseCard}>
      <SectionLabel number="10" title="Let's narrow it down" subtitle="Each answer shapes the next question" />
      {breadcrumb.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {breadcrumb.map((b, i) => (
            <span key={i} style={{
              fontSize: 12, padding: "4px 10px", borderRadius: 8,
              background: C.accentSoft, color: C.accent, fontWeight: 600, fontFamily: font,
            }}>{b}</span>
          ))}
        </div>
      )}
      {currentNode && !answers[currentKey] ? (
        <>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>{currentNode.question}</p>
          <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 12px" }}>{currentNode.questionSub}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {currentNode.options.map(o => (
              <OptionCard key={o.title} title={o.title} subtitle={o.sub}
                selected={false} onClick={() => select(o)} />
            ))}
          </div>
        </>
      ) : (
        <div style={{
          padding: "14px 16px", borderRadius: 12, background: C.successSoft,
          border: `1px solid ${C.success}30`, display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 13, color: C.success, fontWeight: 500 }}>✓ All set — {breadcrumb.length} choices made</span>
          <button onClick={reset} style={{
            fontSize: 12, color: C.accent, background: "none", border: "none",
            cursor: "pointer", fontWeight: 600, fontFamily: font,
          }}>Start over</button>
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 11. EMOJI / ICON REACT
// ───────────────────────────────────────────
const EmojiReact = () => {
  const reactions = [
    { emoji: "🔥", label: "Love it" },
    { emoji: "👍", label: "Solid" },
    { emoji: "😐", label: "Meh" },
    { emoji: "👎", label: "Nah" },
    { emoji: "😬", label: "Yikes" },
  ];
  const statements = [
    { title: "AI writes the first draft of all copy", sub: "Let the model generate, you edit" },
    { title: "Ship weekly, no exceptions", sub: "Consistency over perfection" },
    { title: "No meetings before noon", sub: "Protect deep work hours" },
    { title: "Open source everything", sub: "Build in public, share the code" },
  ];
  const [vals, setVals] = useState({});

  return (
    <div style={baseCard}>
      <SectionLabel number="11" title="Quick reactions" subtitle="Gut-check each idea — don't overthink it" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {statements.map(s => (
          <div key={s.title} style={{
            padding: "14px 16px", borderRadius: 12,
            border: `1px solid ${vals[s.title] ? C.accent : C.border}`,
            background: vals[s.title] ? C.accentSoft : C.surface,
            transition: "all 0.15s",
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>{s.sub}</div>
            <div style={{ display: "flex", gap: 6 }}>
              {reactions.map(r => (
                <button key={r.emoji} onClick={() => setVals(prev => ({ ...prev, [s.title]: r.emoji }))}
                  style={{
                    flex: 1, padding: "8px 4px", borderRadius: 8, cursor: "pointer",
                    fontSize: 20, border: vals[s.title] === r.emoji ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
                    background: vals[s.title] === r.emoji ? C.accentSoft : C.surface,
                    transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  }}>
                  <span>{r.emoji}</span>
                  <span style={{ fontSize: 9, color: C.textMuted, fontFamily: font }}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────
// 12. VOICE MEMO SLOT
// ───────────────────────────────────────────
const VoiceMemo = () => {
  const [state, setState] = useState("idle"); // idle | recording | done
  const [seconds, setSeconds] = useState(0);

  const startRecording = () => {
    setState("recording");
    setSeconds(0);
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev >= 59) { clearInterval(interval); setState("done"); return prev; }
        return prev + 1;
      });
    }, 1000);
    window._voiceInterval = interval;
  };

  const stopRecording = () => {
    clearInterval(window._voiceInterval);
    setState("done");
  };

  const reset = () => { setState("idle"); setSeconds(0); };
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={baseCard}>
      <SectionLabel number="12" title="Tell me in your own words" subtitle="Tap to record a voice note — easier than typing" />
      {state === "idle" && (
        <button onClick={startRecording} style={{
          width: "100%", padding: "20px", borderRadius: 12, cursor: "pointer",
          border: `1px dashed ${C.border}`, background: C.surface, fontFamily: font,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          transition: "all 0.15s",
        }}>
          <span style={{ fontSize: 32 }}>🎙️</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Tap to record</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>Up to 60 seconds, transcribed automatically</span>
        </button>
      )}
      {state === "recording" && (
        <button onClick={stopRecording} style={{
          width: "100%", padding: "20px", borderRadius: 12, cursor: "pointer",
          border: `1px solid ${C.accent}`, background: C.accentSoft, fontFamily: font,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 32, animation: "pulse 1.5s ease-in-out infinite" }}>🔴</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>Recording… {fmt(seconds)}</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>Tap to stop</span>
        </button>
      )}
      {state === "done" && (
        <div style={{
          width: "100%", padding: "16px", borderRadius: 12,
          border: `1px solid ${C.success}40`, background: C.successSoft,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: `${C.success}20`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>✓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Voice note captured</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{fmt(seconds)} — ready for transcription</div>
          </div>
          <button onClick={reset} style={{
            fontSize: 12, color: C.accent, background: "none", border: "none",
            cursor: "pointer", fontWeight: 600, fontFamily: font,
          }}>Redo</button>
        </div>
      )}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
};

// ───────────────────────────────────────────
// 13. PHOTO / SCREENSHOT UPLOAD
// ───────────────────────────────────────────
const PhotoUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    }
  };

  const reset = () => { setFile(null); setPreview(null); };

  return (
    <div style={baseCard}>
      <SectionLabel number="13" title="Show me your current setup" subtitle="Upload a screenshot or photo — AI extracts the context" />
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => document.getElementById("photo-input").click()}
          style={{
            width: "100%", padding: "32px 20px", borderRadius: 12, cursor: "pointer",
            border: `1px dashed ${C.border}`, background: C.surfaceAlt, boxSizing: "border-box",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 32 }}>📷</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Drop an image or tap to upload</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>PNG, JPG, or screenshot</span>
          <input id="photo-input" type="file" accept="image/*" onChange={handleDrop} style={{ display: "none" }} />
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <img src={preview} alt="Upload preview" style={{
            width: "100%", borderRadius: 12, border: `1px solid ${C.border}`,
            maxHeight: 240, objectFit: "cover",
          }} />
          <button onClick={reset} style={{
            position: "absolute", top: 8, right: 8, padding: "4px 10px",
            borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: font,
            background: C.surface, border: `1px solid ${C.border}`,
            cursor: "pointer", color: C.text,
          }}>Remove</button>
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 14. FILL IN THE BLANK
// ───────────────────────────────────────────
const FillInTheBlank = () => {
  const [vals, setVals] = useState({ what: "", who: "", outcome: "" });
  const set = (key, val) => setVals(prev => ({ ...prev, [key]: val }));

  const slotStyle = (key) => ({
    border: "none", borderBottom: `2px solid ${vals[key] ? C.accent : C.border}`,
    background: "transparent", fontFamily: font, fontSize: 16, fontWeight: 600,
    color: C.accent, outline: "none", padding: "2px 4px", minWidth: 100,
    width: Math.max(100, (vals[key]?.length || 0) * 10),
    transition: "border-color 0.15s",
  });

  return (
    <div style={baseCard}>
      <SectionLabel number="14" title="Describe it in one sentence" subtitle="Fill in the blanks — constraints spark clarity" />
      <div style={{
        fontSize: 16, lineHeight: 2.4, color: C.text, fontWeight: 400,
      }}>
        I want to build a{" "}
        <input placeholder="product type" value={vals.what} onChange={e => set("what", e.target.value)} style={slotStyle("what")} />
        {" "}for{" "}
        <input placeholder="audience" value={vals.who} onChange={e => set("who", e.target.value)} style={slotStyle("who")} />
        {" "}that helps them{" "}
        <input placeholder="outcome" value={vals.outcome} onChange={e => set("outcome", e.target.value)} style={slotStyle("outcome")} />
        .
      </div>
      {vals.what && vals.who && vals.outcome && (
        <div style={{
          marginTop: 14, padding: "12px 16px", borderRadius: 10,
          background: C.successSoft, border: `1px solid ${C.success}30`,
          fontSize: 13, color: C.success, fontWeight: 500,
        }}>
          ✓ Clear and scoped — that's a strong starting point.
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 15. AGREEMENT SPECTRUM WITH CROWD DATA
// ───────────────────────────────────────────
const AgreementSpectrum = () => {
  const statements = [
    { text: "We should build in public from day one", crowd: 72 },
    { text: "A beautiful UI is table stakes", crowd: 85 },
    { text: "Launching without analytics is fine", crowd: 31 },
    { text: "We need a paid plan at launch", crowd: 44 },
  ];
  const labels = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
  const [vals, setVals] = useState({});

  return (
    <div style={baseCard}>
      <SectionLabel number="15" title="Where do you stand?" subtitle="Rate each statement — see how others responded" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {statements.map(s => (
          <div key={s.text} style={{
            padding: "14px 16px", borderRadius: 12,
            border: `1px solid ${vals[s.text] !== undefined ? C.accent : C.border}`,
            background: vals[s.text] !== undefined ? C.accentSoft : C.surface,
            transition: "all 0.15s",
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>{s.text}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
              {labels.map((l, i) => (
                <button key={l} onClick={() => setVals(prev => ({ ...prev, [s.text]: i }))}
                  style={{
                    padding: "8px 2px", borderRadius: 8, cursor: "pointer", fontSize: 11,
                    fontWeight: 500, fontFamily: font, transition: "all 0.15s",
                    border: vals[s.text] === i ? `1px solid ${C.accent}` : `1px solid transparent`,
                    background: vals[s.text] === i ? C.accent : C.surfaceAlt,
                    color: vals[s.text] === i ? "#fff" : C.textMuted,
                  }}>{l.split(" ").pop()}</button>
              ))}
            </div>
            {vals[s.text] !== undefined && (
              <div style={{ marginTop: 10, fontSize: 12, color: C.textMuted }}>
                <span style={{ color: C.accent, fontWeight: 600 }}>{s.crowd}%</span> of similar builders agree with this
                <div style={{ marginTop: 4, height: 4, borderRadius: 2, background: C.surfaceAlt, overflow: "hidden" }}>
                  <div style={{ width: `${s.crowd}%`, height: "100%", background: C.accent, borderRadius: 2, transition: "width 0.4s" }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────
// 16. NEGATION SELECT
// ───────────────────────────────────────────
const NegationSelect = () => {
  const [eliminated, setEliminated] = useState(new Set());
  const opts = [
    { title: "Complex onboarding", sub: "Multi-step signup, email verification, profile setup" },
    { title: "Social features", sub: "Feeds, comments, likes, followers" },
    { title: "Real-time collaboration", sub: "Live cursors, co-editing, presence" },
    { title: "Offline support", sub: "Service workers, local storage sync" },
    { title: "Internationalisation", sub: "Multi-language, RTL, locale-aware formatting" },
    { title: "Custom reporting", sub: "User-defined dashboards and data views" },
  ];
  const toggle = title => setEliminated(prev => {
    const next = new Set(prev);
    next.has(title) ? next.delete(title) : next.add(title);
    return next;
  });

  return (
    <div style={baseCard}>
      <SectionLabel number="16" title="What do you definitely NOT need?" subtitle="Eliminate what's out of scope — it's easier than picking what's in" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {opts.map(o => {
          const killed = eliminated.has(o.title);
          return (
            <button key={o.title} onClick={() => toggle(o.title)} style={{
              width: "100%", boxSizing: "border-box", textAlign: "left",
              padding: "14px 16px", borderRadius: 12, cursor: "pointer",
              fontFamily: font, transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: 14,
              border: `1px solid ${killed ? "#D4342820" : C.border}`,
              background: killed ? "#D4342808" : C.surface,
              opacity: killed ? 0.6 : 1,
            }}>
              <span style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700,
                background: killed ? "#D4342818" : C.surfaceAlt,
                color: killed ? "#D43428" : C.textMuted,
              }}>{killed ? "✕" : " "}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, color: killed ? "#D43428" : C.text,
                  textDecoration: killed ? "line-through" : "none",
                }}>{o.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{o.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
      {eliminated.size > 0 && (
        <div style={{
          marginTop: 14, padding: "10px 14px", borderRadius: 10,
          background: C.surfaceAlt, fontSize: 13, color: C.textSoft, fontWeight: 500,
        }}>
          {eliminated.size} eliminated — {opts.length - eliminated.size} remaining in scope
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 17. AUTO-SUGGESTED TAGS
// ───────────────────────────────────────────
const AutoSuggestedTags = () => {
  const suggested = [
    { title: "B2C", sub: "Consumer-facing product" },
    { title: "Solo founder", sub: "Based on earlier answers" },
    { title: "MVP stage", sub: "Pre-product-market fit" },
    { title: "Web-first", sub: "Desktop and mobile web" },
    { title: "Bootstrap", sub: "Self-funded, no investors" },
    { title: "NZ-based", sub: "Local market considerations" },
  ];
  const [confirmed, setConfirmed] = useState(new Set());
  const [dismissed, setDismissed] = useState(new Set());
  const [custom, setCustom] = useState("");
  const [customTags, setCustomTags] = useState([]);

  const confirm = title => {
    setConfirmed(prev => { const n = new Set(prev); n.add(title); return n; });
    setDismissed(prev => { const n = new Set(prev); n.delete(title); return n; });
  };
  const dismiss = title => {
    setDismissed(prev => { const n = new Set(prev); n.add(title); return n; });
    setConfirmed(prev => { const n = new Set(prev); n.delete(title); return n; });
  };
  const addCustom = () => {
    if (custom.trim()) { setCustomTags(prev => [...prev, custom.trim()]); setCustom(""); }
  };

  const visible = suggested.filter(s => !dismissed.has(s.title));

  return (
    <div style={baseCard}>
      <SectionLabel number="17" title="Does this look right?" subtitle="AI-generated tags based on the conversation — confirm, dismiss, or add your own" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visible.map(s => (
          <div key={s.title} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
            borderRadius: 12, fontFamily: font, transition: "all 0.15s",
            border: `1px solid ${confirmed.has(s.title) ? C.accent : C.border}`,
            background: confirmed.has(s.title) ? C.accentSoft : C.surface,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: confirmed.has(s.title) ? C.accent : C.text }}>{s.title}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 1 }}>{s.sub}</div>
            </div>
            <button onClick={() => confirm(s.title)} style={{
              padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: font, transition: "all 0.15s",
              border: `1px solid ${confirmed.has(s.title) ? C.accent : C.border}`,
              background: confirmed.has(s.title) ? C.accent : C.surface,
              color: confirmed.has(s.title) ? "#fff" : C.textSoft,
            }}>{confirmed.has(s.title) ? "✓" : "Yes"}</button>
            <button onClick={() => dismiss(s.title)} style={{
              padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: font, border: `1px solid ${C.border}`,
              background: C.surface, color: C.textMuted, transition: "all 0.15s",
            }}>✕</button>
          </div>
        ))}
      </div>
      {customTags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {customTags.map((t, i) => (
            <span key={i} style={{
              fontSize: 12, padding: "5px 12px", borderRadius: 8,
              background: C.accentSoft, color: C.accent, fontWeight: 600, fontFamily: font,
            }}>{t}</span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input placeholder="Add a custom tag…" value={custom} onChange={e => setCustom(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addCustom()}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`,
            fontFamily: font, fontSize: 13, color: C.text, background: C.surfaceAlt,
            outline: "none", boxSizing: "border-box",
          }} />
        <button onClick={addCustom} style={{
          padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          fontFamily: font, cursor: "pointer", border: `1px solid ${C.accent}`,
          background: C.accentSoft, color: C.accent,
        }}>Add</button>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────
// APP
// ───────────────────────────────────────────
export default function App() {
  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: font,
      padding: "40px 20px 80px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
      maxWidth: 680, margin: "0 auto",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>
          Structured Chat Inputs
        </h1>
        <p style={{ fontSize: 14, color: C.textMuted, margin: 0, lineHeight: 1.5 }}>
          17 interaction patterns for low-friction AI planning conversations
        </p>
      </div>

      <SingleSelect />
      <MultiSelect />
      <PriorityRank />
      <Spectrum />
      <CardSort />
      <ConditionalBranch />
      <Matrix />
      <QuickEstimate />
      <SpatialCanvas />
      <ProgressiveDisclosure />
      <EmojiReact />
      <VoiceMemo />
      <PhotoUpload />
      <FillInTheBlank />
      <AgreementSpectrum />
      <NegationSelect />
      <AutoSuggestedTags />
    </div>
  );
}
