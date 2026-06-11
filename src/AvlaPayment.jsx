import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";

/* Avla brand icons */
function Svg({ size = 24, color = "currentColor", strokeWidth = 2, fill = "none", children, ...rest }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" shapeRendering="geometricPrecision" style={{ display: "block" }} {...rest}>{children}</svg>);
}
const ChevronDown = (p) => (<Svg {...p}><path d="M5 9 L12 16 L19 9" /></Svg>);
const Plus = (p) => (<Svg {...p}><path d="M12 4.5 V19.5 M4.5 12 H19.5" /></Svg>);
const Minus = (p) => (<Svg {...p}><path d="M4.5 12 H19.5" /></Svg>);
const Check = (p) => (<Svg {...p}><path d="M4.5 12.5 L9.5 17.5 L19.5 6" /></Svg>);
const Lock = (p) => (<Svg {...p}><path d="M5 10.5 H19 V20.5 H5 Z" /><path d="M8 10.5 V7 H16 V10.5" /><path d="M12 14 V17" /></Svg>);
const Users = (p) => (<Svg {...p}><path d="M6 8 H11 V12 H6 Z" /><path d="M3.5 20 V16 H13.5 V20" /><path d="M14 7 H18.5 V10.5 H14" /><path d="M16.5 20 V14.5 H20.5 V20" /></Svg>);
const Wallet = (p) => (<Svg {...p}><path d="M3.5 7 H20.5 V19 H3.5 Z" /><path d="M3.5 7 L6.5 4 H17.5" /><path d="M15.5 11 H20.5 V15 H15.5 Z" /></Svg>);
const ListChecks = (p) => (<Svg {...p}><path d="M3.5 7 L5.5 9 L8.5 5" /><path d="M3.5 16 L5.5 18 L8.5 14" /><path d="M11.5 7 H20.5" /><path d="M11.5 16 H20.5" /></Svg>);
const Star = (p) => (<Svg {...p}><path d="M12 3 L14.6 9.1 L21 9.6 L16.1 13.8 L17.7 20 L12 16.6 L6.3 20 L7.9 13.8 L3 9.6 L9.4 9.1 Z" /></Svg>);
const Close = (p) => (<Svg {...p}><path d="M6 6 L18 18" /><path d="M18 6 L6 18" /></Svg>);
const FaceId = (p) => (<Svg {...p}><path d="M4 8 V4 H8" /><path d="M16 4 H20 V8" /><path d="M20 16 V20 H16" /><path d="M8 20 H4 V16" /><path d="M8.5 9.5 V11.5" /><path d="M15.5 9.5 V11.5" /><path d="M12 9.5 V13.5 H11" /><path d="M8.5 16 Q12 18.5 15.5 16" /></Svg>);
const CardGlyph = (p) => (<Svg {...p}><path d="M3.5 5.5 H20.5 V18.5 H3.5 Z" /><path d="M3.5 9.5 H20.5" /><path d="M7 14.5 H12" /></Svg>);
const AppleLogo = ({ size = 18, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" style={{ display: "block", ...style }}>
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702" />
  </svg>
);

const COL = { primary: "#734EF9", ink: "#1A1A1A", paper: "#FFFFFF", surface: "#F5F4FA", success: "#1FA81F", orange: "#FF6600", blue: "#6699FF", danger: "#E03131" };
const c = {
  bg: COL.paper, surface: COL.surface, text: COL.ink,
  text2: "rgba(26,26,26,0.62)", text3: "rgba(26,26,26,0.40)",
  line: "rgba(26,26,26,0.08)", div: "rgba(26,26,26,0.06)",
  primary: COL.primary, primarySoft: "rgba(115,78,249,0.10)", primarySoft2: "rgba(115,78,249,0.06)",
  onPrimary: "#FFFFFF", success: COL.success, danger: COL.danger, dangerSoft: "rgba(224,49,49,0.08)",
};
const CARD = "0 1px 2px rgba(26,26,26,0.04), 0 14px 30px -20px rgba(26,26,26,0.20)";
const SANS = "Inter, 'Noto Sans Georgian', system-ui, -apple-system, 'Segoe UI', sans-serif";
const DISP = "Archivo, 'Noto Sans Georgian', system-ui, sans-serif";
const num = { fontFamily: DISP, fontVariantNumeric: "tabular-nums", fontVariationSettings: "'wdth' 125" };
const disp = { fontFamily: DISP, fontVariationSettings: "'wdth' 125" };
const R = { sm: 8, md: 12, lg: 18 };
const SP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
const PAD = SP.lg, BTN = 56;
const fmt = (n) => Number(n).toFixed(2);
const r2 = (n) => Math.round(n * 100) / 100;

const VENUE = { name: "სუფრა", table: 14 };
const OPEN_BILL = [
  { id: "ob1", name: "აჭარული ხაჭაპური", qty: 1, total: 16.0 },
  { id: "ob2", name: "ხინკალი კალმახით", qty: 7, total: 12.6 },
  { id: "ob3", name: "ღორის მწვადი", qty: 2, total: 48.0 },
  { id: "ob4", name: "სეზონური სალათი", qty: 1, total: 11.0 },
  { id: "ob5", name: "საფერავი", qty: 2, total: 24.0 },
];
const TIPS = [{ id: "t0", label: "0%", pct: 0 }, { id: "t10", label: "10%", pct: 0.1 }, { id: "t15", label: "15%", pct: 0.15 }, { id: "t20", label: "20%", pct: 0.2 }];
const METHODS = [{ id: "apple", label: "Apple Pay" }, { id: "google", label: "Google Pay" }, { id: "card", label: "ბარათით" }];

const AVLA_LOGO = "/avla-logo.png";

function Logo({ h = 24, style = {} }) {
  return <img src={AVLA_LOGO} alt="Avla" style={{ height: h, width: "auto", display: "block", ...style }} />;
}

function Money({ value, size = 14, weight = 500, color = c.text, style = {} }) {
  return <span style={{ ...num, fontSize: size, fontWeight: weight, color, ...style }}>{fmt(value)} ₾</span>;
}

function Amount({ value, size = 14, weight = 600, color = c.text, style = {} }) {
  const [d, setD] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const a = animate(prev.current, value, { duration: 0.32, ease: [0.4, 0, 0.2, 1], onUpdate: (v) => setD(v) });
    prev.current = value;
    return () => a.stop();
  }, [value]);
  return <span style={{ ...num, fontSize: size, fontWeight: weight, color, ...style }}>{fmt(d)} ₾</span>;
}

function BillHeader() {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(245,244,250,0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", paddingTop: "max(16px, env(safe-area-inset-top))" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 56, padding: `0 ${PAD}px`, paddingBottom: SP.md }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: c.text, letterSpacing: "-0.01em" }}>{VENUE.name}</span>
          <span style={{ width: 1, height: 18, background: c.line }} />
          <Logo h={20} />
        </div>
        <span style={{ height: 44, padding: `0 ${SP.md}px`, borderRadius: 999, background: c.surface, color: c.text2, fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center" }}>მაგიდა {VENUE.table}</span>
      </div>
    </div>
  );
}

function Stepper({ value, setValue, min = 2, max = 12 }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", height: 44, borderRadius: 999, background: c.surface, gap: 0 }}>
      <button onClick={() => setValue(Math.max(min, value - 1))} style={{ width: 44, height: 44, background: "none", border: "none", display: "grid", placeItems: "center", cursor: "pointer" }} aria-label="Decrease">
        <Minus size={18} color={value <= min ? c.text3 : c.text} />
      </button>
      <span style={{ ...num, fontSize: 16, fontWeight: 600, color: c.text, minWidth: 40, textAlign: "center" }}>{value}</span>
      <button onClick={() => setValue(Math.min(max, value + 1))} style={{ width: 44, height: 44, background: "none", border: "none", display: "grid", placeItems: "center", cursor: "pointer" }} aria-label="Increase">
        <Plus size={18} color={c.primary} />
      </button>
    </div>
  );
}

function Chip({ on, onClick, children }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick} style={{
      height: 44, minWidth: 56, padding: `0 ${SP.md}px`, borderRadius: R.md, fontSize: 15, fontWeight: 600, whiteSpace: "nowrap",
      background: on ? c.primary : c.surface, color: on ? c.onPrimary : c.text2, border: "none", flex: 1, cursor: "pointer",
      transition: "background 0.2s, color 0.2s"
    }} aria-pressed={on}>{children}</motion.button>
  );
}

function Splash() {
  return (
    <div style={{ height: "100%", width: "100%", display: "grid", placeItems: "center", background: c.bg, position: "relative", padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: SP.lg }}>
        <Logo h={56} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: c.text }}>{VENUE.name}</div>
          <div style={{ fontSize: 13, color: c.text2, marginTop: SP.xs }}>მაგიდა {VENUE.table}</div>
        </div>
      </motion.div>
      <div style={{ position: "absolute", bottom: "max(16px, env(safe-area-inset-bottom))", left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: SP.sm, color: c.text2, fontSize: 12 }}>
        <Lock size={12} /> უსაფრთხო გადახდა
      </div>
    </div>
  );
}

function Processing() {
  return (
    <div style={{ height: "100%", width: "100%", display: "grid", placeItems: "center", background: c.bg }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: SP.lg }}>
        <Logo h={32} style={{ marginBottom: SP.sm }} />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: 28, height: 28, borderRadius: 14, border: `2.5px solid ${c.primarySoft}`, borderTopColor: c.primary }} />
        <span style={{ fontSize: 14, color: c.text2 }}>მუშავდება გადახდა</span>
      </div>
    </div>
  );
}

function Shell({ children }) {
  useEffect(() => {
    const id = "avla-fonts";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id;
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,500;125,600;125,700&family=Inter:wght@300;400;500;600&family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
  }, []);
  return (
    <div style={{ width: "100%", minHeight: "100dvh", display: "grid", placeItems: "center", background: "rgba(26,26,26,0.05)", fontFamily: SANS, color: c.text }}>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}*{-webkit-tap-highlight-color:transparent}::selection{background:${c.primarySoft}}`}</style>
      <div style={{ position: "relative", width: "100%", maxWidth: "420px", height: "100dvh", background: c.surface, overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }}>
        {children}
      </div>
    </div>
  );
}

function Avatars({ guests }) {
  const show = Math.min(guests, 5);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: show }).map((_, i) => (
        <div key={i} style={{ width: 32, height: 32, borderRadius: 16, marginLeft: i ? -10 : 0, border: "2px solid #fff", background: i === 0 ? c.primary : c.primarySoft, color: i === 0 ? "#fff" : c.primary, fontSize: 11, fontWeight: 600, display: "grid", placeItems: "center" }}>
          {i === 0 ? "მე" : i + 1}
        </div>
      ))}
      {guests > show && <div style={{ width: 32, height: 32, borderRadius: 16, marginLeft: -10, border: "2px solid #fff", background: c.surface, color: c.text2, fontSize: 11, fontWeight: 600, display: "grid", placeItems: "center" }}>+{guests - show}</div>}
    </div>
  );
}

function ModeCard({ active, onClick, icon, title, subtitle, right, children }) {
  return (
    <motion.div whileTap={{ scale: 0.98 }} onClick={onClick} style={{
      marginTop: SP.md, borderRadius: R.lg, background: c.bg, cursor: "pointer", boxShadow: active ? `${CARD}, 0 0 0 2px ${c.primary}` : CARD, transition: "box-shadow .2s", padding: SP.lg
    }}>
      <div role="button" tabIndex={0} aria-pressed={active} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
        style={{ display: "flex", alignItems: "center", gap: SP.md, outline: "none" }}>
        <div style={{ width: 44, height: 44, borderRadius: R.md, background: active ? c.primary : c.primarySoft, color: active ? "#fff" : c.primary, display: "grid", placeItems: "center", transition: "background .2s,color .2s", flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: c.text }}>{title}</div>
          <div style={{ fontSize: 12, color: c.text2, marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: SP.sm }}>
          {right}
          <span style={{ width: 24, height: 24, borderRadius: 12, background: active ? c.primary : "transparent", border: `1.5px solid ${active ? c.primary : c.text3}`, display: "grid", placeItems: "center", transition: "background .2s" }}>
            {active && <Check size={15} color="#fff" strokeWidth={3} />}
          </span>
        </div>
      </div>
      <AnimatePresence>
        {active && children && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden", marginTop: SP.lg }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ActiveBill({ bill, onPay }) {
  const subtotal = bill.reduce((s, l) => s + l.total, 0);
  const [mode, setMode] = useState("full");
  const [guests, setGuests] = useState(2);
  const [picked, setPicked] = useState(() => new Set());
  const [tip, setTip] = useState({ mode: "pct", pct: 0.1, custom: "" });
  const [method, setMethod] = useState("apple");
  const [receipt, setReceipt] = useState("");

  const pickedSum = bill.filter((l) => picked.has(l.id)).reduce((s, l) => s + l.total, 0);
  const shareSub = r2(mode === "full" ? subtotal : mode === "equal" ? subtotal / guests : pickedSum);
  const tipAmt = r2(tip.mode === "custom" ? Number(tip.custom) || 0 : shareSub * tip.pct);
  const payTotal = r2(shareSub + tipAmt);
  const blocked = mode === "item" && picked.size === 0;
  const checklist = mode === "item";
  const togglePick = (id) => setPicked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const payLabel = method === "apple" ? "Apple Pay" : method === "google" ? "Google Pay" : "ბარათით გადახდა";

  return (
    <motion.div key="bill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", background: c.surface }}>
      <BillHeader />
      <div style={{ flex: 1, overflowY: "auto", padding: `${SP.md}px ${PAD}px`, paddingBottom: 140 }} className="no-scrollbar">

        {/* BILL CARD */}
        <div style={{ borderRadius: R.lg, background: c.bg, boxShadow: CARD, overflow: "hidden" }}>
          <div style={{ padding: `${SP.lg}px ${SP.lg}px ${SP.sm}px`, color: c.text2, fontSize: 12, fontWeight: 600 }}>თქვენი ანგარიში</div>
          <div style={{ padding: `0 ${SP.lg}px ${SP.sm}px` }}>
            {bill.map((l, k) => {
              const on = picked.has(l.id);
              return (
                <motion.div key={l.id} onClick={checklist ? () => togglePick(l.id) : undefined} whileTap={checklist ? { scale: 0.99 } : {}}
                  role={checklist ? "checkbox" : undefined} aria-checked={checklist ? on : undefined} tabIndex={checklist ? 0 : undefined}
                  onKeyDown={checklist ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); togglePick(l.id); } } : undefined}
                  style={{
                    display: "flex", alignItems: "center", gap: SP.md, padding: `${SP.md}px ${checklist ? SP.sm : 0}px`, borderTop: k ? `1px solid ${c.div}` : "none", borderRadius: checklist ? R.md : 0,
                    background: checklist && on ? c.primarySoft2 : "transparent", cursor: checklist ? "pointer" : "default", transition: "background .15s"
                  }}>
                  {checklist && (
                    <motion.span animate={on ? { scale: [1, 1.18, 1] } : {}} transition={{ duration: 0.25 }} style={{
                      width: 24, height: 24, borderRadius: 12, background: on ? c.primary : "transparent", border: `1.5px solid ${on ? c.primary : c.text3}`,
                      display: "grid", placeItems: "center", flexShrink: 0
                    }}>
                      {on && <Check size={15} color="#fff" strokeWidth={3} />}
                    </motion.span>
                  )}
                  <span style={{ flex: 1, fontSize: 14, color: c.text }}><span style={{ ...num, color: c.text2, marginRight: 6 }}>{l.qty}×</span>{l.name}</span>
                  <Money value={l.total} color={checklist && !on ? c.text2 : c.text} />
                </motion.div>
              );
            })}
          </div>
          <div style={{ height: 1, background: c.div, margin: `0 ${SP.lg}px` }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${SP.md}px ${SP.lg}px`, fontSize: 13, color: c.text2 }}>
            {checklist ? "მონიშნული" : "სრული ანგარიში"}
            <Money value={checklist ? pickedSum : subtotal} size={15} weight={600} />
          </div>
        </div>

        {/* YOU PAY */}
        <div style={{ marginTop: SP.xl }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: c.text2 }}>თქვენ იხდით</div>
          <div style={{ marginTop: 4 }}><Amount value={payTotal} size={48} weight={700} /></div>
        </div>

        {/* MODE SELECTION */}
        <div style={{ marginTop: SP.xl, fontSize: 13, fontWeight: 500, color: c.text2 }}>როგორ გადაიხდით?</div>
        <ModeCard active={mode === "full"} onClick={() => setMode("full")} icon={<Wallet size={20} />} title="სრულად გადახდა" subtitle="მთელი ანგარიში"
          right={<Money value={subtotal} size={14} weight={600} color={mode === "full" ? c.text : c.text2} />} />
        <ModeCard active={mode === "equal"} onClick={() => setMode("equal")} icon={<Users size={20} />} title="თანაბრად გაყოფა" subtitle={`${guests} სტუმარი`}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: SP.md }}>
            <Avatars guests={guests} />
            <Stepper value={guests} setValue={setGuests} min={2} max={12} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: SP.md }}>
            <span style={{ fontSize: 13, color: c.text2 }}>თითო სტუმარი</span>
            <Money value={subtotal / guests} size={18} weight={700} color={c.primary} />
          </div>
        </ModeCard>
        <ModeCard active={mode === "item"} onClick={() => setMode("item")} icon={<ListChecks size={20} />} title="ჩემი კერძების გადახდა" subtitle="მონიშნეთ რაც შეჭამეთ"
          right={mode === "item" ? <Money value={pickedSum} size={14} weight={600} color={c.primary} /> : null}>
          <div style={{ fontSize: 12, color: c.text2, paddingTop: 4 }}>მონიშნეთ თქვენი კერძები ზემოთ, ანგარიშში.</div>
        </ModeCard>

        {/* TIP */}
        <div style={{ marginTop: SP.xl, fontSize: 13, fontWeight: 500, color: c.text2 }}>მადლობა მომსახურებისთვის</div>
        <div style={{ display: "flex", gap: SP.sm, marginTop: SP.sm }}>
          {TIPS.map((t) => <Chip key={t.id} on={tip.mode === "pct" && tip.pct === t.pct} onClick={() => setTip((p) => ({ ...p, mode: "pct", pct: t.pct }))}>{t.label}</Chip>)}
          <Chip on={tip.mode === "custom"} onClick={() => setTip((p) => ({ ...p, mode: "custom" }))}>სხვა</Chip>
        </div>
        {tip.mode === "custom" && (
          <div style={{ display: "flex", alignItems: "center", marginTop: SP.sm, height: 44, padding: `0 ${SP.lg}px`, borderRadius: R.md, background: c.bg, boxShadow: CARD, gap: SP.sm }}>
            <span style={{ fontSize: 14, color: c.text2 }}>დანამატი</span>
            <input inputMode="decimal" aria-label="დანამატის თანხა" value={tip.custom} onChange={(e) => setTip((p) => ({ ...p, mode: "custom", custom: e.target.value.replace(/[^0-9.]/g, "") }))} placeholder="0.00"
              style={{ ...num, flex: 1, textAlign: "right", border: "none", outline: "none", background: "transparent", fontSize: 16, fontWeight: 600, color: c.text }} />
            <span style={{ ...num, fontSize: 16, fontWeight: 600, color: c.text }}>₾</span>
          </div>
        )}
        {tipAmt > 0 && <div style={{ marginTop: SP.sm, fontSize: 12, color: c.text2 }}>დაემატება {fmt(tipAmt)} ₾</div>}

        {/* METHOD */}
        <div style={{ marginTop: SP.xl, fontSize: 13, fontWeight: 500, color: c.text2 }}>გადახდის მეთოდი</div>
        <div style={{ display: "flex", gap: SP.sm, marginTop: SP.sm }}>
          {METHODS.map((m) => <Chip key={m.id} on={method === m.id} onClick={() => setMethod(m.id)}>{m.label}</Chip>)}
        </div>

        {/* RECEIPT */}
        <div style={{ marginTop: SP.xl, fontSize: 13, fontWeight: 500, color: c.text2 }}>ქვითარი</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: SP.sm, height: 44, padding: `0 ${SP.lg}px`, borderRadius: R.md, background: c.bg, boxShadow: CARD }}>
          <input value={receipt} onChange={(e) => setReceipt(e.target.value)} placeholder="ტელეფონი ან ელ. ფოსტა (არასავალდებულო)" aria-label="ტელეფონი ან ელ. ფოსტა ქვითრისთვის"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16, color: c.text, fontFamily: SANS }} />
        </div>

        {/* SECURITY */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: SP.xl, gap: SP.sm, fontSize: 12, color: c.text2 }}>
          <Lock size={12} /> უსაფრთხო გადახდა
        </div>
      </div>

      {/* STICKY BUTTON */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "rgba(245,244,250,0.90)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div style={{ padding: `${SP.md}px ${PAD}px` }}>
          <motion.button whileTap={blocked ? {} : { scale: 0.97 }} onClick={blocked ? undefined : () => onPay({ total: payTotal, share: shareSub, tip: tipAmt, method, mode, guests, picked: [...picked], receipt: receipt.trim() })}
            style={{
              width: "100%", height: BTN, borderRadius: R.lg, gap: SP.md, padding: `0 ${SP.xl}px`, fontSize: 15, fontWeight: 600, color: "#fff", border: "none", cursor: blocked ? "not-allowed" : "pointer",
              background: blocked ? "rgba(115,78,249,0.40)" : method === "card" ? c.primary : c.text, boxShadow: blocked ? "none" : "0 8px 22px -8px rgba(26,26,26,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.25s, opacity 0.25s", opacity: blocked ? 0.6 : 1
            }}>
            {blocked ? "აირჩიეთ კერძები" : (<>
              {method === "apple"
                ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppleLogo size={18} color="#fff" style={{ marginTop: -2 }} /><span>Pay</span></span>
                : <span>{payLabel}</span>}
              <Amount value={payTotal} color="#fff" style={{ marginLeft: "auto" }} />
            </>)}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function Confetti() {
  const palette = [COL.primary, COL.success, COL.orange, COL.blue];
  const pieces = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    id: i, x: (Math.random() * 2 - 1) * 150, rot: Math.random() * 720 - 360, delay: Math.random() * 0.22,
    dur: 1.4 + Math.random() * 0.9, size: 6 + Math.random() * 6, color: palette[i % palette.length],
    rad: Math.random() > 0.5 ? "50%" : "2px", drift: (Math.random() * 2 - 1) * 40,
  })), []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }}>
      {pieces.map((p) => (
        <motion.span key={p.id} initial={{ opacity: 0, x: 0, y: -20, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: [0, p.x + p.drift], y: [-20, 320], rotate: p.rot }}
          transition={{ duration: p.dur, delay: p.delay, ease: [0.2, 0.6, 0.4, 1], times: [0, 0.1, 0.8, 1] }}
          style={{ position: "absolute", left: "50%", top: "24%", width: p.size, height: p.size * 1.3, background: p.color, borderRadius: p.rad, display: "block" }} />
      ))}
    </div>
  );
}

function Receipt({ result }) {
  const [open, setOpen] = useState(false);
  const methodLabel = METHODS.find((m) => m.id === result.method).label + (result.cardLast4 ? ` •••• ${result.cardLast4}` : "");
  const note = result.mode === "equal" ? `გაყოფილია ${result.guests} ნაწილად` : result.mode === "item" ? "გადახდილია არჩეული კერძები" : null;
  const lines = result.mode === "item" ? OPEN_BILL.filter((l) => result.picked.includes(l.id)) : OPEN_BILL;

  const receiptItems = [
    { type: "header", label: VENUE.name, subLabel: `მაგიდა ${result.guests}` },
    ...lines.map((l) => ({ type: "line", qty: l.qty, name: l.name, total: l.total })),
    { type: "divider" },
    { type: "row", label: "თქვენი წილი", value: result.share },
    { type: "row", label: "დანამატი", value: result.tip },
    { type: "total", label: methodLabel, value: result.total },
    ...(note ? [{ type: "note", text: note }] : [])
  ];

  return (
    <div style={{ borderRadius: R.lg, background: c.bg, boxShadow: CARD, overflow: "hidden" }}>
      <button onClick={() => setOpen((v) => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${SP.lg}px`, height: 56, background: "none", border: "none", cursor: "pointer" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: c.text }}>ქვითარი № {result.code}</span>
        <ChevronDown size={18} color={c.text3} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "visible" }}>
            <motion.div style={{ position: "relative", padding: `0 ${SP.lg}px ${SP.lg}px`, background: "#F9F9F9", perspective: 1200 }}>
              {/* Receipt paper effect */}
              <motion.div
                initial={{ rotateX: 15, y: 20 }}
                animate={{ rotateX: 0, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  transformStyle: "preserve-3d",
                  background: "#FAFAFA",
                  borderRadius: 2,
                  padding: `${SP.md}px ${SP.md}px ${SP.lg}px`,
                  boxShadow: "0 10px 40px rgba(26,26,26,0.18), 0 2px 8px rgba(26,26,26,0.12)",
                  position: "relative",
                  marginTop: 8
                }}>

                {/* Printer effect top */}
                <div style={{ position: "absolute", top: -6, left: 0, right: 0, height: 6, background: "linear-gradient(to bottom, rgba(0,0,0,0.06), transparent)", borderRadius: "2px 2px 0 0" }} />

                {/* Receipt content - line by line animation */}
                {receiptItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.35, ease: "easeOut" }}
                    style={{ overflow: "hidden" }}>

                    {item.type === "header" && (
                      <div style={{ textAlign: "center", paddingBottom: SP.sm, borderBottom: `1px dashed ${c.line}`, marginBottom: SP.sm }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: c.text, ...num }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: c.text2, marginTop: 2 }}>{item.subLabel}</div>
                        <div style={{ fontSize: 10, color: c.text3, marginTop: 4 }}>---</div>
                      </div>
                    )}

                    {item.type === "line" && (
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: `${SP.xs}px 0`, fontSize: 12, fontFamily: SANS, letterSpacing: 0.3 }}>
                        <span style={{ color: c.text, flex: 1 }}>
                          <span style={{ ...num, color: c.text2, marginRight: 4 }}>{item.qty}×</span>
                          {item.name}
                        </span>
                        <span style={{ ...num, color: c.text, marginLeft: SP.sm, whiteSpace: "nowrap", fontWeight: 500 }}>{fmt(item.total)} ₾</span>
                      </div>
                    )}

                    {item.type === "divider" && (
                      <div style={{ borderTop: `1px dashed ${c.line}`, margin: `${SP.sm}px 0` }} />
                    )}

                    {item.type === "row" && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${SP.xs}px 0`, fontSize: 12 }}>
                        <span style={{ color: c.text2 }}>{item.label}</span>
                        <span style={{ ...num, color: item.value > 0 ? c.text : c.text2, fontWeight: 500 }}>{fmt(item.value)} ₾</span>
                      </div>
                    )}

                    {item.type === "total" && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${SP.md}px 0 0`, paddingTop: SP.sm, borderTop: `2px solid ${c.text}`, fontSize: 13, fontWeight: 700 }}>
                        <span style={{ color: c.text, ...num }}>გადახდილია</span>
                        <span style={{ ...num, color: c.primary, fontSize: 14 }}>{fmt(item.value)} ₾</span>
                      </div>
                    )}

                    {item.type === "note" && (
                      <div style={{ fontSize: 11, color: c.text2, marginTop: SP.sm, fontStyle: "italic", textAlign: "center" }}>({item.text})</div>
                    )}
                  </motion.div>
                ))}

                {/* Receipt bottom curl effect */}
                <motion.div
                  initial={{ scaleY: 0.8, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: receiptItems.length * 0.08 + 0.2, duration: 0.4 }}
                  style={{
                    position: "absolute",
                    bottom: -12,
                    left: 0,
                    right: 0,
                    height: 12,
                    background: "linear-gradient(to bottom, #FAFAFA, #F5F5F5)",
                    clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)",
                    boxShadow: "0 4px 12px rgba(26,26,26,0.12)"
                  }} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- payment sheets ---------- */

const SAVED_CARD_KEY = "avla-saved-card";
const onlyDigits = (s) => s.replace(/\D/g, "");
const formatCardNumber = (s) => onlyDigits(s).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (s) => {
  let d = onlyDigits(s);
  if (d.length > 4) d = d.slice(0, 2) + d.slice(-2); // "062027" (paste/autofill) → "0627"
  d = d.slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};
const cardBrand = (digits) => (digits.startsWith("4") ? "Visa" : /^5[1-5]/.test(digits) || /^2[2-7]/.test(digits) ? "Mastercard" : "");
const luhnValid = (d) => {
  let s = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    s += n;
  }
  return d.length > 0 && s % 10 === 0;
};
const expiryValid = (e) => {
  const m = /^(\d{2})\/(\d{2})$/.exec(e);
  if (!m) return false;
  const mm = Number(m[1]);
  if (mm < 1 || mm > 12) return false;
  return new Date(2000 + Number(m[2]), mm, 1) > new Date();
};
const readSavedCard = () => {
  try {
    const v = JSON.parse(localStorage.getItem(SAVED_CARD_KEY));
    if (v && /^\d{4}$/.test(String(v.last4)) && typeof v.holder === "string" && expiryValid(v.exp)) return v;
    localStorage.removeItem(SAVED_CARD_KEY); // expired or malformed — fall back to the blank form
    return null;
  } catch { return null; }
};

function Sheet({ open, onClose, label, children }) {
  const ref = useRef(null);
  const prevFocus = useRef(null);
  useEffect(() => {
    if (open) {
      prevFocus.current = document.activeElement;
      requestAnimationFrame(() => ref.current && ref.current.focus());
    } else if (prevFocus.current && prevFocus.current.focus) {
      prevFocus.current.focus();
      prevFocus.current = null;
    }
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
            onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(26,26,26,0.45)", zIndex: 40 }} />
          <motion.div key="sheet" ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label}
            onKeyDown={(e) => e.key === "Escape" && onClose && onClose()}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 400, damping: 40 }}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 41, background: c.bg, borderRadius: "20px 20px 0 0", boxShadow: "0 -12px 44px rgba(26,26,26,0.18)", maxHeight: "92%", display: "flex", flexDirection: "column", outline: "none" }}>
            <div style={{ display: "grid", placeItems: "center", paddingTop: SP.sm, flexShrink: 0 }}>
              <span style={{ width: 36, height: 4, borderRadius: 2, background: c.line }} />
            </div>
            <div className="no-scrollbar" style={{ overflowY: "auto", scrollPaddingBottom: 80, padding: `${SP.md}px ${PAD}px max(${SP.xl}px, env(safe-area-inset-bottom))` }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Spinner({ size = 28 }) {
  return <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: size, height: size, borderRadius: size / 2, border: `2.5px solid ${c.primarySoft}`, borderTopColor: c.primary }} />;
}

function SheetStatus({ children }) {
  return <div style={{ minHeight: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{children}</div>;
}

function DoneMark() {
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}
      style={{ width: 64, height: 64, borderRadius: 32, background: c.success, boxShadow: "0 12px 30px -10px rgba(31,168,31,0.5)", display: "grid", placeItems: "center" }}>
      <Check size={32} color="#FFFFFF" strokeWidth={3} />
    </motion.div>
  );
}

function SheetRow({ label, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${SP.sm}px 0`, gap: SP.md }}>
      <span style={{ fontSize: 13, color: c.text2 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: c.text, textAlign: "right" }}>{children}</span>
    </div>
  );
}

function ApplePaySheet({ open, payload, onClose, onDone }) {
  const [step, setStep] = useState("review"); // review → auth → processing → done
  useEffect(() => { if (open) setStep("review"); }, [open]);
  useEffect(() => {
    if (!open) return;
    if (step === "auth") { const t = setTimeout(() => setStep("processing"), 1500); return () => clearTimeout(t); }
    if (step === "processing") { const t = setTimeout(() => setStep("done"), 1300); return () => clearTimeout(t); }
    if (step === "done") { const t = setTimeout(() => onDone({ cardLast4: "4242" }), 1000); return () => clearTimeout(t); }
  }, [open, step]);
  const total = payload ? payload.total : 0;
  const closable = step === "review";
  return (
    <Sheet open={open} onClose={closable ? onClose : undefined} label="Apple Pay">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: SP.md }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 17, fontWeight: 700, color: c.text }}>
          <AppleLogo size={17} color={c.text} style={{ marginTop: -2 }} /> Pay
        </span>
        {closable && (
          <button onClick={onClose} aria-label="დახურვა" style={{ width: 44, height: 44, margin: -6, background: "none", border: "none", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <span style={{ width: 32, height: 32, borderRadius: 16, background: c.surface, display: "grid", placeItems: "center" }}>
              <Close size={13} color={c.text2} strokeWidth={2.5} />
            </span>
          </button>
        )}
      </div>
      <AnimatePresence mode="wait">
        {step === "review" && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: SP.md, padding: SP.md, borderRadius: R.md, background: c.surface }}>
              <div style={{ width: 46, height: 30, borderRadius: 6, background: "linear-gradient(135deg, #8B6CFF, #4A2EC0)", position: "relative", flexShrink: 0 }}>
                <span style={{ position: "absolute", right: 5, bottom: 4, color: "#fff", fontSize: 7, fontWeight: 700, letterSpacing: "0.06em" }}>VISA</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>Visa •••• 4242</div>
                <div style={{ fontSize: 12, color: c.text2, marginTop: 1 }}>ძირითადი ბარათი</div>
              </div>
              <ChevronDown size={16} color={c.text3} style={{ transform: "rotate(-90deg)" }} />
            </div>
            <div style={{ marginTop: SP.md }}>
              <SheetRow label="მიმღები">Avla • {VENUE.name}</SheetRow>
              <SheetRow label="მაგიდა">{VENUE.table}</SheetRow>
              {payload && payload.tip > 0 && <SheetRow label="დანამატი">{fmt(payload.tip)} ₾</SheetRow>}
            </div>
            <div style={{ height: 1, background: c.div, margin: `${SP.sm}px 0 ${SP.md}px` }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: c.text2 }}>ჯამი</span>
              <Money value={total} size={22} weight={700} />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep("auth")}
              style={{ width: "100%", height: BTN, marginTop: SP.xl, borderRadius: R.lg, border: "none", cursor: "pointer", background: c.text, color: "#fff", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: SP.sm }}>
              <FaceId size={20} color="#fff" strokeWidth={1.8} /> დაადასტურეთ Face ID-ით
            </motion.button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: SP.md, fontSize: 12, color: c.text2 }}>
              <Lock size={12} /> Apple Pay • უსაფრთხო გადახდა
            </div>
          </motion.div>
        )}
        {step === "auth" && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <SheetStatus>
              <motion.div animate={{ scale: [1, 1.07, 1], opacity: [1, 0.75, 1] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}>
                <FaceId size={64} color={c.primary} strokeWidth={1.5} />
              </motion.div>
              <div style={{ fontSize: 15, fontWeight: 600, color: c.text, marginTop: SP.lg }}>Face ID</div>
              <div style={{ fontSize: 13, color: c.text2, marginTop: SP.xs }}>მიმდინარეობს ამოცნობა…</div>
            </SheetStatus>
          </motion.div>
        )}
        {step === "processing" && (
          <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <SheetStatus>
              <Spinner />
              <div style={{ fontSize: 14, color: c.text2, marginTop: SP.lg }}>მუშავდება გადახდა…</div>
            </SheetStatus>
          </motion.div>
        )}
        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <SheetStatus>
              <DoneMark />
              <div style={{ ...disp, fontSize: 20, fontWeight: 700, color: c.text, marginTop: SP.lg }}>გადახდილია</div>
              <div style={{ marginTop: SP.xs }}><Money value={total} size={15} weight={600} color={c.text2} /></div>
            </SheetStatus>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  );
}

function Toggle({ on, onChange, label, sub }) {
  return (
    <button type="button" onClick={() => onChange(!on)} role="switch" aria-checked={on}
      style={{ display: "flex", alignItems: "center", gap: SP.md, width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
      <span style={{ width: 46, height: 28, borderRadius: 14, background: on ? c.primary : "rgba(26,26,26,0.14)", position: "relative", transition: "background .2s", flexShrink: 0 }}>
        <motion.span animate={{ x: on ? 18 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 34 }}
          style={{ position: "absolute", top: 2, left: 2, width: 24, height: 24, borderRadius: 12, background: "#fff", boxShadow: "0 1px 3px rgba(26,26,26,0.25)" }} />
      </span>
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text }}>{label}</span>
        {sub && <span style={{ display: "block", fontSize: 12, color: c.text2, marginTop: 2 }}>{sub}</span>}
      </span>
    </button>
  );
}

function Field({ label, error, children }) {
  return (
    <label style={{ display: "block", flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: c.text2 }}>{label}</span>
      <div style={{ marginTop: 6, height: 48, borderRadius: R.md, background: c.surface, display: "flex", alignItems: "center", gap: SP.sm, padding: `0 ${SP.md}px`, boxShadow: error ? `inset 0 0 0 1.5px ${c.danger}` : "none", transition: "box-shadow .15s" }}>
        {children}
      </div>
      <span style={{ display: "block", fontSize: 11, color: c.danger, marginTop: 4, minHeight: 14 }}>{error || ""}</span>
    </label>
  );
}

function CardPreview({ value, holder, exp }) {
  const digits = onlyDigits(value);
  const brand = cardBrand(digits);
  const shown = digits.padEnd(16, "•").replace(/(.{4})(?=.)/g, "$1 ");
  return (
    <div style={{ width: "100%", aspectRatio: "1.62", borderRadius: 16, background: "linear-gradient(135deg, #8B6CFF 0%, #734EF9 45%, #4A2EC0 100%)", color: "#fff", padding: SP.lg, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 18px 40px -18px rgba(115,78,249,0.55)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: 80, background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", right: 30, bottom: -70, width: 140, height: 140, borderRadius: 70, background: "rgba(255,255,255,0.06)" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ ...disp, fontSize: 14, fontWeight: 700, letterSpacing: "0.02em" }}>Avla</span>
        <span style={{ fontSize: 13, fontWeight: 700, fontStyle: "italic", opacity: 0.92, minHeight: 16 }}>{brand}</span>
      </div>
      <span style={{ width: 38, height: 27, borderRadius: 6, background: "linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.18))" }} />
      <div style={{ ...num, fontSize: 19, fontWeight: 600, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{shown}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: SP.md }}>
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.92, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{holder.trim() || "სახელი გვარი"}</span>
        <span style={{ ...num, fontSize: 12, opacity: 0.92, flexShrink: 0 }}>{exp || "MM/YY"}</span>
      </div>
    </div>
  );
}

function CardSheet({ open, payload, onClose, onDone }) {
  const [step, setStep] = useState("form"); // form → processing → done
  const [saved, setSaved] = useState(null);
  const [useSaved, setUseSaved] = useState(false);
  const [number, setNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [holder, setHolder] = useState("");
  const [save, setSave] = useState(false);
  const [touched, setTouched] = useState({});
  useEffect(() => {
    if (!open) return;
    const sc = readSavedCard();
    setSaved(sc); setUseSaved(!!sc);
    setStep("form"); setNumber(""); setExp(""); setCvc(""); setHolder(""); setSave(false); setTouched({});
  }, [open]);

  const digits = onlyDigits(number);
  const errors = {
    number: digits.length === 16 && luhnValid(digits) ? "" : "შეიყვანეთ ბარათის სწორი ნომერი",
    exp: expiryValid(exp) ? "" : "არასწორი ვადა",
    cvc: /^\d{3,4}$/.test(cvc) ? "" : "შეიყვანეთ CVC",
    holder: holder.trim().length >= 3 ? "" : "მფლობელის სახელი და გვარი",
  };
  const formValid = !errors.number && !errors.exp && !errors.cvc && !errors.holder;
  const canPay = useSaved ? true : formValid;
  const total = payload ? payload.total : 0;

  const submit = () => {
    if (!canPay) { setTouched({ number: true, exp: true, cvc: true, holder: true }); return; }
    setStep("processing");
  };
  useEffect(() => {
    if (!open) return;
    if (step === "processing") { const t = setTimeout(() => setStep("done"), 1400); return () => clearTimeout(t); }
    if (step === "done") {
      const t = setTimeout(() => {
        const last4 = useSaved ? saved.last4 : digits.slice(-4);
        let savedOk = false;
        if (!useSaved && save) {
          try { localStorage.setItem(SAVED_CARD_KEY, JSON.stringify({ last4, holder: holder.trim(), exp, brand: cardBrand(digits) || "ბარათი" })); savedOk = true; } catch { /* private mode / quota — pay anyway */ }
        }
        onDone({ cardLast4: last4, cardSaved: savedOk });
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [open, step]);

  const closable = step === "form";
  const err = (k) => (touched[k] ? errors[k] : "");
  const inputStyle = { flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontSize: 16, color: c.text, fontFamily: SANS };
  return (
    <Sheet open={open} onClose={closable ? onClose : undefined} label="ბარათით გადახდა">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: SP.md }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: SP.sm, fontSize: 17, fontWeight: 700, color: c.text }}>
          <span style={{ width: 32, height: 32, borderRadius: R.sm, background: c.primarySoft, color: c.primary, display: "grid", placeItems: "center" }}><CardGlyph size={18} /></span>
          ბარათით გადახდა
        </span>
        {closable && (
          <button onClick={onClose} aria-label="დახურვა" style={{ width: 44, height: 44, margin: -6, background: "none", border: "none", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <span style={{ width: 32, height: 32, borderRadius: 16, background: c.surface, display: "grid", placeItems: "center" }}>
              <Close size={13} color={c.text2} strokeWidth={2.5} />
            </span>
          </button>
        )}
      </div>
      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {saved && (
              <div style={{ marginBottom: SP.lg }}>
                <button type="button" onClick={() => setUseSaved(true)} aria-pressed={useSaved} style={{ width: "100%", display: "flex", alignItems: "center", gap: SP.md, padding: SP.md, borderRadius: R.md, background: useSaved ? c.primarySoft2 : c.surface, border: "none", cursor: "pointer", textAlign: "left", boxShadow: useSaved ? `inset 0 0 0 1.5px ${c.primary}` : "none" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 12, background: useSaved ? c.primary : "transparent", border: `1.5px solid ${useSaved ? c.primary : c.text3}`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    {useSaved && <Check size={14} color="#fff" strokeWidth={3} />}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text }}>{saved.brand} •••• {saved.last4}</span>
                    <span style={{ display: "block", fontSize: 12, color: c.text2, marginTop: 1 }}>შენახული ბარათი • {saved.exp}</span>
                  </span>
                </button>
                <button type="button" onClick={() => setUseSaved(false)} aria-pressed={!useSaved} style={{ width: "100%", display: "flex", alignItems: "center", gap: SP.md, padding: SP.md, marginTop: SP.sm, borderRadius: R.md, background: useSaved ? c.surface : c.primarySoft2, border: "none", cursor: "pointer", textAlign: "left", boxShadow: useSaved ? "none" : `inset 0 0 0 1.5px ${c.primary}` }}>
                  <span style={{ width: 24, height: 24, borderRadius: 12, background: useSaved ? "transparent" : c.primary, border: `1.5px solid ${useSaved ? c.text3 : c.primary}`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    {!useSaved && <Check size={14} color="#fff" strokeWidth={3} />}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>სხვა ბარათით გადახდა</span>
                </button>
              </div>
            )}
            {!useSaved && (
              <>
                <CardPreview value={number} holder={holder} exp={exp} />
                <div style={{ marginTop: SP.lg }}>
                  <Field label="ბარათის ნომერი" error={err("number")}>
                    <input value={number} onChange={(e) => setNumber(formatCardNumber(e.target.value))} onBlur={() => setTouched((t) => ({ ...t, number: true }))}
                      placeholder="0000 0000 0000 0000" inputMode="numeric" autoComplete="cc-number" style={{ ...inputStyle, ...num, letterSpacing: "0.04em" }} />
                    {cardBrand(digits) && <span style={{ fontSize: 12, fontWeight: 700, fontStyle: "italic", color: c.primary, flexShrink: 0 }}>{cardBrand(digits)}</span>}
                  </Field>
                  <div style={{ display: "flex", gap: SP.md }}>
                    <Field label="მოქმედების ვადა" error={err("exp")}>
                      <input value={exp} onChange={(e) => setExp(formatExpiry(e.target.value))} onBlur={() => setTouched((t) => ({ ...t, exp: true }))}
                        placeholder="MM/YY" inputMode="numeric" autoComplete="cc-exp" style={{ ...inputStyle, ...num }} />
                    </Field>
                    <Field label="CVC" error={err("cvc")}>
                      <input value={cvc} onChange={(e) => setCvc(onlyDigits(e.target.value).slice(0, 4))} onBlur={() => setTouched((t) => ({ ...t, cvc: true }))}
                        placeholder="•••" type="password" inputMode="numeric" autoComplete="cc-csc" maxLength={4} style={{ ...inputStyle, ...num }} />
                      <Lock size={14} color={c.text3} />
                    </Field>
                  </div>
                  <Field label="ბარათის მფლობელი" error={err("holder")}>
                    <input value={holder} onChange={(e) => setHolder(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, holder: true }))}
                      placeholder="სახელი გვარი" autoComplete="cc-name" style={inputStyle} />
                  </Field>
                </div>
                <div style={{ padding: SP.md, borderRadius: R.md, background: c.surface }}>
                  <Toggle on={save} onChange={setSave} label="ბარათის დამახსოვრება" sub="შემდეგ ჯერზე გადაიხდით ერთი შეხებით" />
                </div>
              </>
            )}
            <motion.button whileTap={{ scale: 0.97 }} onClick={submit}
              style={{ width: "100%", height: BTN, marginTop: SP.lg, padding: `0 ${SP.xl}px`, borderRadius: R.lg, border: "none", cursor: canPay ? "pointer" : "not-allowed", background: c.primary, opacity: canPay ? 1 : 0.55, color: "#fff", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: SP.md, transition: "opacity .2s" }}>
              <span>გადახდა</span>
              <Money value={total} color="#fff" weight={600} style={{ marginLeft: "auto", fontSize: 15 }} />
            </motion.button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: SP.md, fontSize: 12, color: c.text2 }}>
              <Lock size={12} /> მონაცემები გადაიცემა დაშიფრულად
            </div>
          </motion.div>
        )}
        {step === "processing" && (
          <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <SheetStatus>
              <Spinner />
              <div style={{ fontSize: 14, color: c.text2, marginTop: SP.lg }}>მუშავდება გადახდა…</div>
              <div style={{ fontSize: 12, color: c.text2, marginTop: SP.xs }}>არ დახუროთ გვერდი</div>
            </SheetStatus>
          </motion.div>
        )}
        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <SheetStatus>
              <DoneMark />
              <div style={{ ...disp, fontSize: 20, fontWeight: 700, color: c.text, marginTop: SP.lg }}>გადახდილია</div>
              <div style={{ marginTop: SP.xs }}><Money value={total} size={15} weight={600} color={c.text2} /></div>
            </SheetStatus>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  );
}

function PaySuccess({ result }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ position: "relative", height: "100%", width: "100%", display: "flex", flexDirection: "column", background: c.surface }}>
      <Confetti />
      <div style={{ display: "grid", placeItems: "center", paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: SP.sm }}><Logo h={24} /></div>
      <div style={{ flex: 1, overflowY: "auto", padding: `${SP.lg}px ${PAD}px`, paddingBottom: "max(40px, calc(env(safe-area-inset-bottom) + 24px))" }} className="no-scrollbar">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 6, paddingTop: SP.lg }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.05 }} style={{ width: 78, height: 78, borderRadius: 39, background: c.success, boxShadow: "0 12px 30px -10px rgba(31,168,31,0.5)", display: "grid", placeItems: "center" }}>
            <Check size={40} color="#FFFFFF" strokeWidth={3} />
          </motion.div>
          <h2 style={{ ...disp, fontSize: 28, fontWeight: 700, color: c.text, marginTop: SP.lg }}>გადახდილია</h2>
          <p style={{ fontSize: 14, color: c.text2, marginTop: SP.xs }}>მადლობა, რომ მოგვინახულეთ</p>
          <div style={{ marginTop: SP.md }}><Amount value={result.total} size={36} weight={700} /></div>
        </div>

        <div style={{ textAlign: "center", marginTop: SP.xl }}>
          <div style={{ fontSize: 14, color: c.text2 }}>როგორ შეგვაფასებთ?</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: SP.sm, marginTop: SP.md }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button key={n} whileTap={{ scale: 0.8 }} onClick={() => !sent && setRating(n)} aria-label={`${n} ვარსკვლავი`} aria-pressed={n <= rating} disabled={sent}
                style={{ width: 44, height: 44, display: "grid", placeItems: "center", background: "none", border: "none", cursor: sent ? "default" : "pointer", color: n <= rating ? COL.orange : c.text3 }}>
                <Star size={32} fill={n <= rating ? COL.orange : "none"} strokeWidth={1.5} />
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {!sent && rating > 0 && (
              <motion.div key="review-box" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}>
                <div style={{ marginTop: SP.md, borderRadius: R.lg, background: c.bg, boxShadow: CARD, padding: SP.md, textAlign: "left" }}>
                  <textarea value={review} onChange={(e) => setReview(e.target.value.slice(0, 300))} rows={3} maxLength={300} aria-label="შეფასების ტექსტი"
                    placeholder="გაგვიზიარეთ შთაბეჭდილება — კერძები, მომსახურება, ატმოსფერო…"
                    style={{ width: "100%", border: "none", outline: "none", resize: "none", background: "transparent", fontSize: 16, lineHeight: 1.5, color: c.text, fontFamily: SANS }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: SP.sm }}>
                    <span style={{ ...num, fontSize: 11, color: c.text2 }}>{review.length}/300</span>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => setSent(true)}
                      style={{ height: 44, padding: `0 ${SP.lg}px`, borderRadius: 999, background: c.primary, color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                      შეფასების გაგზავნა
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
            {sent && (
              <motion.div key="review-sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}
                style={{ display: "inline-flex", alignItems: "center", gap: SP.sm, marginTop: SP.md, padding: `10px ${SP.lg}px`, borderRadius: 999, background: "rgba(31,168,31,0.10)", color: c.success, fontSize: 13, fontWeight: 600 }}>
                <Check size={15} strokeWidth={2.5} /> მადლობა გამოხმაურებისთვის!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ marginTop: SP.xl }}><Receipt result={result} /></div>
        <div style={{ textAlign: "center", marginTop: SP.lg, fontSize: 13, color: c.text2 }}>
          {result.receipt ? `ქვითარი გაიგზავნა: ${result.receipt}` : "ქვითარი ხელმისაწვდომია ზემოთ"}
        </div>
        {result.cardSaved && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: SP.sm, fontSize: 13, color: c.text2 }}>
            <Check size={14} color={c.success} strokeWidth={2.5} /> ბარათი დამახსოვრებულია შემდეგი ვიზიტისთვის
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: SP.xl, gap: 6, opacity: 0.65 }}>
          <span style={{ fontSize: 12, color: c.text2 }}>გთავაზობთ</span><Logo h={16} />
        </div>
        <p style={{ fontSize: 13, color: c.text2, marginTop: SP.lg, textAlign: "center" }}>მაგიდა {VENUE.table}, შეგიძლიათ დატოვოთ მაგიდა</p>
      </div>
    </motion.div>
  );
}

export default function AvlaPayment() {
  const [screen, setScreen] = useState("splash");
  const [result, setResult] = useState(null);
  const [sheet, setSheet] = useState({ kind: null, payload: null });
  useEffect(() => { if (screen === "splash") { const t = setTimeout(() => setScreen("bill"), 1200); return () => clearTimeout(t); } }, [screen]);
  useEffect(() => { if (screen === "processing") { const t = setTimeout(() => setScreen("success"), 1200); return () => clearTimeout(t); } }, [screen]);
  const pay = (r) => {
    const payload = { ...r, code: "AV-" + Math.floor(2000 + Math.random() * 8000) };
    if (r.method === "apple") setSheet({ kind: "apple", payload });
    else if (r.method === "card") setSheet({ kind: "card", payload });
    else { setResult(payload); setScreen("processing"); }
  };
  const closeSheet = () => setSheet((s) => ({ ...s, kind: null }));
  const finishSheet = (extra) => {
    setResult({ ...sheet.payload, ...(extra || {}) });
    setSheet((s) => ({ ...s, kind: null }));
    setScreen("success");
  };
  return (
    <Shell>
      <AnimatePresence mode="wait">
        {screen === "splash" && <motion.div key="s" style={{ height: "100%" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><Splash /></motion.div>}
        {screen === "bill" && <ActiveBill key="b" bill={OPEN_BILL} onPay={pay} />}
        {screen === "processing" && <Processing key="pr" />}
        {screen === "success" && <PaySuccess key="su" result={result} />}
      </AnimatePresence>
      <ApplePaySheet open={sheet.kind === "apple"} payload={sheet.payload} onClose={closeSheet} onDone={finishSheet} />
      <CardSheet open={sheet.kind === "card"} payload={sheet.payload} onClose={closeSheet} onDone={finishSheet} />
    </Shell>
  );
}
