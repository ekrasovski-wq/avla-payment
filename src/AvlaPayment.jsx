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

const COL = { primary: "#734EF9", ink: "#1A1A1A", paper: "#FFFFFF", surface: "#F5F4FA", success: "#1FA81F", orange: "#FF6600", blue: "#6699FF" };
const c = {
  bg: COL.paper, surface: COL.surface, text: COL.ink,
  text2: "rgba(26,26,26,0.55)", text3: "rgba(26,26,26,0.40)",
  line: "rgba(26,26,26,0.08)", div: "rgba(26,26,26,0.06)",
  primary: COL.primary, primarySoft: "rgba(115,78,249,0.10)", primarySoft2: "rgba(115,78,249,0.06)",
  onPrimary: "#FFFFFF", success: COL.success,
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

const AVLA_LOGO = "data:image/png;base64,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De5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDе5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDde5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s/zw8fe69YVD70TTfLEXMVefNDe5s";

function Logo({ className = "h-6" }) {
  return <img src={AVLA_LOGO} alt="Avla" className={`${className} w-auto`} style={{ display: "block" }} />;
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
        <div style={{ display: "flex", alignItems: "center", gap: SP.sm }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: c.text, letterSpacing: "-0.01em" }}>{VENUE.name}</span>
          <Logo className="h-5" />
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
      height: 44, minWidth: 56, padding: `0 ${SP.lg}px`, borderRadius: R.md, fontSize: 15, fontWeight: 600,
      background: on ? c.primary : c.surface, color: on ? c.onPrimary : c.text2, border: "none", flex: 1, cursor: "pointer",
      transition: "background 0.2s, color 0.2s"
    }} aria-pressed={on}>{children}</motion.button>
  );
}

function Splash() {
  return (
    <div style={{ height: "100%", width: "100%", display: "grid", placeItems: "center", background: c.bg, position: "relative", padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: SP.lg }}>
        <Logo className="h-12" />
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
    <motion.div whileTap={{ scale: 0.98 }} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick()} style={{
      marginTop: SP.md, borderRadius: R.lg, background: c.bg, cursor: "pointer", boxShadow: active ? `${CARD}, 0 0 0 2px ${c.primary}` : CARD, transition: "box-shadow .2s", padding: SP.lg
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: SP.md }}>
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
  let shareSub = mode === "full" ? subtotal : mode === "equal" ? subtotal / guests : pickedSum;
  const tipAmt = tip.mode === "custom" ? Number(tip.custom) || 0 : shareSub * tip.pct;
  const payTotal = shareSub + tipAmt;
  const blocked = mode === "item" && picked.size === 0;
  const checklist = mode === "item";
  const togglePick = (id) => setPicked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const payLabel = method === "apple" ? "Apple Pay" : method === "google" ? "Google Pay" : "გადახდა";

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
            <input inputMode="decimal" value={tip.custom} onChange={(e) => setTip((p) => ({ ...p, mode: "custom", custom: e.target.value.replace(/[^0-9.]/g, "") }))} placeholder="0.00"
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
          <input value={receipt} onChange={(e) => setReceipt(e.target.value)} placeholder="ტელეფონი ან ელ. ფოსტა (არასავალდებულო)"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: c.text, fontFamily: SANS }} />
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
              width: "100%", height: BTN, borderRadius: R.lg, gap: SP.sm, fontSize: 15, fontWeight: 600, color: "#fff", border: "none", cursor: blocked ? "not-allowed" : "pointer",
              background: blocked ? "rgba(115,78,249,0.40)" : method === "card" ? c.primary : c.text, boxShadow: blocked ? "none" : "0 8px 22px -8px rgba(26,26,26,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.25s, opacity 0.25s", opacity: blocked ? 0.6 : 1
            }}>
            {blocked ? "აირჩიეთ კერძები" : (<><span>{payLabel}</span><Amount value={payTotal} color="#fff" style={{ marginLeft: "auto" }} /></>)}
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
  const methodLabel = METHODS.find((m) => m.id === result.method).label;
  const note = result.mode === "equal" ? `გაყოფილია ${result.guests} ნაწილად` : result.mode === "item" ? "გადახდილია არჩეული კერძები" : null;
  const lines = result.mode === "item" ? OPEN_BILL.filter((l) => result.picked.includes(l.id)) : OPEN_BILL;
  return (
    <div style={{ borderRadius: R.lg, background: c.bg, boxShadow: CARD, overflow: "hidden" }}>
      <button onClick={() => setOpen((v) => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${SP.lg}px`, height: 56, background: "none", border: "none", cursor: "pointer" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: c.text }}>ქვითარი № {result.code}</span>
        <ChevronDown size={18} color={c.text3} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: `0 ${SP.lg}px ${SP.lg}px` }}>
              <div style={{ height: 1, background: c.div, marginBottom: SP.sm }} />
              {lines.map((l) => (
                <div key={l.id} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: `${SP.sm}px 0` }}>
                  <span style={{ fontSize: 13, color: c.text }}><span style={{ ...num, color: c.text2 }}>{l.qty}×</span> {l.name}</span>
                  <Money value={l.total} size={13} />
                </div>
              ))}
              <div style={{ height: 1, background: c.div, margin: `${SP.sm}px 0` }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}><span style={{ fontSize: 13, color: c.text2 }}>თქვენი წილი</span><Money value={result.share} size={13} /></div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}><span style={{ fontSize: 13, color: c.text2 }}>დანამატი</span><Money value={result.tip} size={13} /></div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: SP.md }}><span style={{ fontSize: 15, fontWeight: 600, color: c.text }}>გადახდილია, {methodLabel}</span><Money value={result.total} size={16} weight={700} /></div>
              {note && <div style={{ fontSize: 12, color: c.text2, marginTop: SP.sm }}>{note}</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PaySuccess({ result }) {
  const [rating, setRating] = useState(0);
  return (
    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ position: "relative", height: "100%", width: "100%", display: "flex", flexDirection: "column", background: c.surface }}>
      <Confetti />
      <div style={{ display: "grid", placeItems: "center", paddingTop: SP.lg, paddingBottom: SP.sm }}><Logo className="h-6" /></div>
      <div style={{ flex: 1, overflowY: "auto", padding: `${SP.lg}px ${PAD}px`, paddingBottom: 40 }} className="no-scrollbar">
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
              <motion.button key={n} whileTap={{ scale: 0.8 }} onClick={() => setRating(n)} style={{ background: "none", border: "none", cursor: "pointer", color: n <= rating ? COL.orange : c.text3, lineHeight: 0 }}>
                <Star size={32} fill={n <= rating ? COL.orange : "none"} strokeWidth={1.5} />
              </motion.button>
            ))}
          </div>
          <AnimatePresence>{rating > 0 && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 13, color: c.success, marginTop: SP.sm }}>მადლობა შეფასებისთვის!</motion.div>}</AnimatePresence>
        </div>

        <div style={{ marginTop: SP.xl }}><Receipt result={result} /></div>
        <div style={{ textAlign: "center", marginTop: SP.lg, fontSize: 13, color: c.text3 }}>
          {result.receipt ? `ქვითარი გაიგზავნა: ${result.receipt}` : "ქვითარი ხელმისაწვდომია ზემოთ"}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: SP.xl, gap: 6, opacity: 0.65 }}>
          <span style={{ fontSize: 12, color: c.text2 }}>გთავაზობთ</span><Logo className="h-4" />
        </div>
        <p style={{ fontSize: 13, color: c.text3, marginTop: SP.lg, textAlign: "center" }}>მაგიდა {VENUE.table}, შეგიძლიათ დატოვოთ მაგიდა</p>
      </div>
    </motion.div>
  );
}

export default function AvlaPayment() {
  const [screen, setScreen] = useState("splash");
  const [result, setResult] = useState(null);
  useEffect(() => { if (screen === "splash") { const t = setTimeout(() => setScreen("bill"), 1200); return () => clearTimeout(t); } }, [screen]);
  useEffect(() => { if (screen === "processing") { const t = setTimeout(() => setScreen("success"), 1200); return () => clearTimeout(t); } }, [screen]);
  const pay = (r) => { setResult({ ...r, code: "AV-" + Math.floor(2000 + Math.random() * 8000) }); setScreen("processing"); };
  return (
    <Shell>
      <AnimatePresence mode="wait">
        {screen === "splash" && <motion.div key="s" style={{ height: "100%" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><Splash /></motion.div>}
        {screen === "bill" && <ActiveBill key="b" bill={OPEN_BILL} onPay={pay} />}
        {screen === "processing" && <Processing key="pr" />}
        {screen === "success" && <PaySuccess key="su" result={result} />}
      </AnimatePresence>
    </Shell>
  );
}
