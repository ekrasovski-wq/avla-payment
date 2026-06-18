import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  COL, c, CARD, SANS, num, disp, R, SP, PAD, BTN, fmt, r2,
  VENUE, TIPS, METHODS,
  Svg, Plus, Minus, Check, Lock, Star, Close,
  Logo, Money, Amount, Chip, Shell, Splash, Processing, Confetti,
  Sheet, SlideButton, ApplePaySheet, CardSheet,
} from "./AvlaPayment";

/* ---------- menu-only icons (same geometric line style as the brand set) ---------- */
const ArrowLeft = (p) => (<Svg {...p}><path d="M19 12 H5" /><path d="M11 6 L5 12 L11 18" /></Svg>);
const Bag = (p) => (<Svg {...p}><path d="M6 8 H18 L17 20.5 H7 Z" /><path d="M9 8 V6.5 A3 3 0 0 1 15 6.5 V8" /></Svg>);
const Trash = (p) => (<Svg {...p}><path d="M5 7 H19" /><path d="M9 7 V5 H15 V7" /><path d="M6.5 7 L7.5 20 H16.5 L17.5 7" /></Svg>);
const Leaf = (p) => (<Svg {...p}><path d="M5 19 C5 11 11 5 19 5 C19 13 13 19 5 19 Z" /><path d="M5 19 L19 5" /></Svg>);

/* ---------- menu data (Georgian restaurant "სუფრა") ---------- */
const CATS = [
  { id: "pop", label: "პოპულარული" },
  { id: "khach", label: "ხაჭაპური" },
  { id: "khink", label: "ხინკალი" },
  { id: "hot", label: "ცხელი კერძები" },
  { id: "salad", label: "სალათები" },
  { id: "side", label: "გარნირი" },
  { id: "dessert", label: "დესერტი" },
  { id: "drink", label: "სასმელი" },
];
const CAT_LABEL = Object.fromEntries(CATS.map((x) => [x.id, x.label]));
const TINT = { khach: "#FFF1DB", khink: "#EAF0FF", hot: "#FFE9E2", salad: "#E8F7E9", side: "#FBF3E0", dessert: "#F3E9FF", drink: "#FCE8F0" };

const DISHES = [
  { id: "d1", cat: "khach", name: "აჭარული ხაჭაპური", desc: "ნავის ფორმის, კვერცხითა და კარაქით", price: 16.0, emoji: "🧀", pop: true },
  { id: "d2", cat: "khach", name: "იმერული ხაჭაპური", desc: "სულგუნით სავსე, ტრადიციული", price: 13.0, emoji: "🧀" },
  { id: "d3", cat: "khach", name: "მეგრული ხაჭაპური", desc: "ორმაგი ყველით, ზემოდან სულგუნი", price: 15.0, emoji: "🧀" },
  { id: "d4", cat: "khink", name: "ხინკალი ხორცით", desc: "ხელით დაგრეხილი, წვნიანი", price: 1.2, emoji: "🥟", pop: true, unit: "ც" },
  { id: "d5", cat: "khink", name: "ხინკალი ყველით", desc: "სულგუნით, ვეგეტარიანული", price: 1.3, emoji: "🥟", tag: "ვეგ", unit: "ც" },
  { id: "d6", cat: "khink", name: "ხინკალი კალმახით", desc: "კალმახის ფარშით, ტარხუნით", price: 1.8, emoji: "🥟", unit: "ც" },
  { id: "d7", cat: "hot", name: "ღორის მწვადი", desc: "შამფურზე შემწვარი, მოცხარის საწებლით", price: 24.0, emoji: "🍢", pop: true },
  { id: "d8", cat: "hot", name: "ქათმის შქმერული", desc: "ნივრიან-რძიან სოუსში, ცხელ ქვაბში", price: 22.0, emoji: "🍗" },
  { id: "d9", cat: "hot", name: "ჩაქაფული", desc: "ბატკანი ტყემლითა და ტარხუნით", price: 28.0, emoji: "🍲" },
  { id: "d10", cat: "hot", name: "ლობიო ქოთანში", desc: "ცხელ თიხის ქოთანში, მჭადით", price: 12.0, emoji: "🫘", tag: "ვეგ" },
  { id: "d11", cat: "salad", name: "სეზონური სალათი", desc: "პომიდორი, კიტრი, მწვანილი, ნიგვზის ღილით", price: 11.0, emoji: "🥗", pop: true, tag: "ვეგ" },
  { id: "d12", cat: "salad", name: "ბადრიჯანი ნიგვზით", desc: "შემწვარი ბადრიჯანი, ნიგვზის პასტით", price: 14.0, emoji: "🍆", tag: "ვეგ" },
  { id: "d13", cat: "salad", name: "ფხალეული", desc: "სამი სახის ფხალი, ნარ-შირით", price: 13.0, emoji: "🥬", tag: "ვეგ" },
  { id: "d14", cat: "side", name: "მჭადი", desc: "სიმინდის ცხელი მჭადი", price: 2.5, emoji: "🌽", tag: "ვეგ", unit: "ც" },
  { id: "d15", cat: "side", name: "შოთის პური", desc: "თონის ცხელი პური", price: 1.5, emoji: "🍞", tag: "ვეგ", unit: "ც" },
  { id: "d16", cat: "dessert", name: "ჩურჩხელა", desc: "ნიგვზით და ყურძნის ბადაგით", price: 4.0, emoji: "🍇" },
  { id: "d17", cat: "dessert", name: "ნაყინი პელამუშით", desc: "ვანილის ნაყინი, ყურძნის პელამუში", price: 7.0, emoji: "🍨" },
  { id: "d18", cat: "drink", name: "საფერავი", desc: "მშრალი წითელი ღვინო, ჭიქა 150მლ", price: 12.0, emoji: "🍷", pop: true },
  { id: "d19", cat: "drink", name: "ტარხუნის ლიმონათი", desc: "ბუნებრივი, სახლის ლიმონათი", price: 5.0, emoji: "🥤", tag: "ვეგ" },
  { id: "d20", cat: "drink", name: "ბორჯომი", desc: "მინერალური წყალი 0.5ლ", price: 3.5, emoji: "💧" },
];
const DISH = Object.fromEntries(DISHES.map((d) => [d.id, d]));

/* sections in tab order; "popular" is a virtual section pulling pop:true items */
const SECTIONS = CATS.map((cat) => ({
  ...cat,
  items: cat.id === "pop" ? DISHES.filter((d) => d.pop) : DISHES.filter((d) => d.cat === cat.id),
}));

/* ---------- small pieces ---------- */
function Thumb({ dish, size = 56 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 2, background: TINT[dish.cat] || c.primarySoft, overflow: "hidden", flexShrink: 0 }}>
      <img src={`/images/${dish.id}.jpg`} alt={dish.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

/* vegetarian indicator — geometric leaf, brand icon style (replaces the "ვეგ" text) */
function VegBadge({ size = 18 }) {
  return (
    <span role="img" aria-label="ვეგეტარიანული" title="ვეგეტარიანული"
      style={{ display: "inline-grid", placeItems: "center", width: size, height: size, borderRadius: 2, background: "rgba(31,168,31,0.12)", color: c.success, flexShrink: 0 }}>
      <Leaf size={Math.round(size * 0.66)} color={c.success} strokeWidth={2} />
    </span>
  );
}

function QtyControl({ qty, onInc, onDec, compact }) {
  const h = compact ? 32 : 36;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", height: h, borderRadius: 2, background: c.primarySoft, color: c.primary }} onClick={(e) => e.stopPropagation()}>
      <button onClick={onDec} aria-label="შემცირება" style={{ width: h, height: h, background: "none", border: "none", display: "grid", placeItems: "center", cursor: "pointer", color: c.primary }}>
        {qty <= 1 ? <Trash size={15} color={c.primary} /> : <Minus size={16} color={c.primary} />}
      </button>
      <span style={{ ...num, fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{qty}</span>
      <button onClick={onInc} aria-label="დამატება" style={{ width: h, height: h, background: "none", border: "none", display: "grid", placeItems: "center", cursor: "pointer", color: c.primary }}>
        <Plus size={16} color={c.primary} />
      </button>
    </div>
  );
}

function AddButton({ onClick }) {
  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); onClick(); }} aria-label="კალათაში დამატება"
      style={{ width: 36, height: 36, borderRadius: 2, background: c.primary, border: "none", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 6px 16px -8px rgba(115,78,249,0.7)" }}>
      <Plus size={18} color="#fff" strokeWidth={2.5} />
    </motion.button>
  );
}

/* ---------- dish row ---------- */
function DishRow({ dish, qty, onOpen, onInc, onDec, onAdd, first }) {
  return (
    <motion.div whileTap={{ scale: 0.995 }} onClick={() => onOpen(dish)} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onOpen(dish); } }}
      style={{ display: "flex", alignItems: "center", gap: SP.md, padding: `${SP.md}px 0`, borderTop: first ? "none" : `1px solid ${c.div}`, cursor: "pointer" }}>
      <Thumb dish={dish} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: SP.sm }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dish.name}</span>
          {dish.tag && <VegBadge />}
        </div>
        <div style={{ fontSize: 12.5, color: c.text2, marginTop: 3, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dish.desc}</div>
        <div style={{ marginTop: 6 }}>
          <Money value={dish.price} size={14} weight={700} />
          {dish.unit && <span style={{ fontSize: 12, color: c.text3, marginLeft: 4 }}>/ {dish.unit}</span>}
        </div>
      </div>
      <div style={{ alignSelf: "center", flexShrink: 0 }}>
        {qty > 0
          ? <QtyControl qty={qty} onInc={(e) => { e?.stopPropagation?.(); onInc(); }} onDec={(e) => { e?.stopPropagation?.(); onDec(); }} compact />
          : <AddButton onClick={onAdd} />}
      </div>
    </motion.div>
  );
}

/* ---------- dish detail sheet ---------- */
function DishDetailSheet({ dish, qty, onClose, onAdd, onInc, onDec }) {
  return (
    <Sheet open={!!dish} onClose={onClose} label={dish ? dish.name : "კერძი"}>
      {dish && (
        <div>
          <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 2, background: TINT[dish.cat] || c.primarySoft, overflow: "hidden", position: "relative" }}>
            <img src={`/images/${dish.id}.jpg`} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <button onClick={onClose} aria-label="დახურვა" style={{ position: "absolute", top: SP.sm, right: SP.sm, width: 36, height: 36, borderRadius: 2, background: "rgba(255,255,255,0.85)", border: "none", display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(6px)" }}>
              <Close size={14} color={c.text2} strokeWidth={2.5} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: SP.sm, marginTop: SP.lg }}>
            <h3 style={{ ...disp, fontSize: 20, fontWeight: 700, color: c.text, flex: 1 }}>{dish.name}</h3>
            {dish.tag && <VegBadge />}
          </div>
          <p style={{ fontSize: 14, color: c.text2, marginTop: SP.sm, lineHeight: 1.5 }}>{dish.desc}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: SP.lg }}>
            <Money value={dish.price} size={20} weight={700} />
            {dish.unit && <span style={{ fontSize: 13, color: c.text2 }}>ფასი {dish.unit}-ზე</span>}
          </div>
          <div style={{ marginTop: SP.xl }}>
            {qty > 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: SP.md }}>
                <QtyControl qty={qty} onInc={onInc} onDec={onDec} />
                <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
                  style={{ flex: 1, height: BTN, borderRadius: R.lg, border: "none", background: c.primary, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: SP.sm }}>
                  მზადაა <Check size={18} color="#fff" strokeWidth={2.5} />
                </motion.button>
              </div>
            ) : (
              <motion.button whileTap={{ scale: 0.97 }} onClick={onAdd}
                style={{ width: "100%", height: BTN, padding: `0 ${SP.lg}px`, borderRadius: R.lg, border: "none", background: c.primary, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: SP.sm }}>
                <Plus size={18} color="#fff" strokeWidth={2.5} />
                <span style={{ whiteSpace: "nowrap" }}>კალათაში დამატება</span>
                <Money value={dish.price} color="#fff" weight={600} style={{ marginLeft: "auto", fontSize: 15, whiteSpace: "nowrap" }} />
              </motion.button>
            )}
          </div>
        </div>
      )}
    </Sheet>
  );
}

/* ---------- menu header + category bar ---------- */
function MenuHeader({ count }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(245,244,250,0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", paddingTop: "max(16px, env(safe-area-inset-top))" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 56, padding: `0 ${PAD}px`, paddingBottom: SP.md }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo h={22} />
        </div>
        <span style={{ height: 44, padding: `0 ${SP.md}px`, borderRadius: 2, background: c.surface, color: c.text2, fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center" }}>მაგიდა {VENUE.table}</span>
      </div>
    </div>
  );
}

function CategoryBar({ active, onPick }) {
  const barRef = useRef(null);
  useEffect(() => {
    const el = barRef.current && barRef.current.querySelector(`[data-cat="${active}"]`);
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);
  return (
    <div ref={barRef} className="no-scrollbar" style={{ position: "sticky", top: 0, zIndex: 20, display: "flex", gap: SP.sm, overflowX: "auto", padding: `${SP.sm}px ${PAD}px`, background: "rgba(245,244,250,0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <button key={s.id} data-cat={s.id} onClick={() => onPick(s.id)} aria-pressed={on}
            style={{ height: 38, padding: `0 ${SP.md}px`, borderRadius: 2, whiteSpace: "nowrap", fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", flexShrink: 0, background: on ? c.primary : c.bg, color: on ? c.onPrimary : c.text2, boxShadow: on ? "none" : CARD, transition: "background .2s, color .2s" }}>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- menu screen (browse) ---------- */
function MenuScreen({ cart, add, inc, dec, onOpenDish, count, subtotal, onCheckout }) {
  const scrollRef = useRef(null);
  const secRefs = useRef({});
  const [active, setActive] = useState(SECTIONS[0].id);
  const lockUntil = useRef(0);

  const onScroll = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc || Date.now() < lockUntil.current) return;
    const top = sc.scrollTop + 120; // account for sticky header + tab bar
    let current = SECTIONS[0].id;
    for (const s of SECTIONS) {
      const el = secRefs.current[s.id];
      if (el && el.offsetTop <= top) current = s.id;
    }
    setActive((p) => (p === current ? p : current));
  }, []);

  const jump = (id) => {
    const sc = scrollRef.current, el = secRefs.current[id];
    if (!sc || !el) return;
    setActive(id);
    lockUntil.current = Date.now() + 650; // ignore scroll-spy during the animated jump
    sc.scrollTo({ top: Math.max(0, el.offsetTop - 96), behavior: "smooth" });
  };

  return (
    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", background: c.surface }}>
      <MenuHeader count={count} />
      <div ref={scrollRef} onScroll={onScroll} className="no-scrollbar" style={{ flex: 1, overflowY: "auto", paddingBottom: count > 0 ? 132 : 32 }}>
        <CategoryBar active={active} onPick={jump} />
        <div style={{ padding: `${SP.sm}px ${PAD}px 0` }}>
          {SECTIONS.map((s) => (
            <section key={s.id} ref={(el) => (secRefs.current[s.id] = el)} style={{ scrollMarginTop: 96, paddingTop: SP.md }}>
              <h2 style={{ ...disp, fontSize: 17, fontWeight: 700, color: c.text, padding: `${SP.sm}px 0` }}>{s.label}</h2>
              <div style={{ borderRadius: R.lg, background: c.bg, boxShadow: CARD, padding: `${SP.xs}px ${SP.lg}px` }}>
                {s.items.map((d, i) => (
                  <DishRow key={d.id} dish={d} first={i === 0} qty={cart[d.id] || 0}
                    onOpen={onOpenDish} onAdd={() => add(d.id)} onInc={() => inc(d.id)} onDec={() => dec(d.id)} />
                ))}
              </div>
            </section>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: SP.xl, gap: 6, opacity: 0.6 }}>
            <span style={{ fontSize: 12, color: c.text2 }}>გთავაზობთ</span><Logo h={15} />
          </div>
        </div>
      </div>

      {/* floating cart bar */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div key="cartbar" initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 36 }}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: `0 ${PAD}px`, paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            <motion.button whileTap={{ scale: 0.98 }} onClick={onCheckout}
              style={{ width: "100%", height: BTN, borderRadius: R.lg, border: "none", cursor: "pointer", background: c.primary, color: "#fff", display: "flex", alignItems: "center", gap: SP.md, padding: `0 ${SP.lg}px`, boxShadow: "0 10px 28px -10px rgba(115,78,249,0.75)" }}>
              <span style={{ position: "relative", display: "grid", placeItems: "center" }}>
                <Bag size={22} color="#fff" />
                <span style={{ ...num, position: "absolute", top: -8, right: -10, minWidth: 18, height: 18, padding: "0 4px", borderRadius: 2, background: "#fff", color: c.primary, fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center" }}>{count}</span>
              </span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>შეკვეთის ნახვა</span>
              <Amount value={subtotal} color="#fff" weight={700} style={{ marginLeft: "auto", fontSize: 16 }} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- order review (cart + tip + method + pay) ---------- */
function ReviewScreen({ items, inc, dec, subtotal, onBack, onPay }) {
  const [tip, setTip] = useState({ mode: "pct", pct: 0.1, custom: "" });
  const [method, setMethod] = useState("apple");
  const [receipt, setReceipt] = useState("");
  const tipAmt = r2(tip.mode === "custom" ? Number(tip.custom) || 0 : subtotal * tip.pct);
  const total = r2(subtotal + tipAmt);
  const payLabel = method === "apple" ? "Apple Pay" : method === "google" ? "Google Pay" : "ბარათით გადახდა";

  return (
    <motion.div key="review" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.22 }}
      style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", background: c.surface }}>
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(245,244,250,0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", paddingTop: "max(16px, env(safe-area-inset-top))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: SP.sm, minHeight: 56, padding: `0 ${PAD}px`, paddingBottom: SP.md }}>
          <button onClick={onBack} aria-label="უკან" style={{ width: 40, height: 40, marginLeft: -8, background: "none", border: "none", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <ArrowLeft size={22} color={c.text} />
          </button>
          <span style={{ fontSize: 18, fontWeight: 700, color: c.text }}>თქვენი შეკვეთა</span>
          <span style={{ marginLeft: "auto", height: 44, padding: `0 ${SP.md}px`, borderRadius: 2, background: c.surface, color: c.text2, fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center" }}>მაგიდა {VENUE.table}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: `${SP.md}px ${PAD}px`, paddingBottom: 140 }} className="no-scrollbar">
        {/* items */}
        <div style={{ borderRadius: R.lg, background: c.bg, boxShadow: CARD, padding: `${SP.xs}px ${SP.lg}px` }}>
          <AnimatePresence initial={false}>
            {items.map((it, i) => (
              <motion.div key={it.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                style={{ display: "flex", alignItems: "center", gap: SP.md, padding: `${SP.md}px 0`, borderTop: i === 0 ? "none" : `1px solid ${c.div}` }}>
                <Thumb dish={it} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</div>
                  <div style={{ marginTop: 2 }}><Money value={it.price} size={12.5} weight={500} color={c.text2} />{it.unit && <span style={{ fontSize: 11, color: c.text3, marginLeft: 3 }}>/ {it.unit}</span>}</div>
                </div>
                <QtyControl qty={it.qty} onInc={() => inc(it.id)} onDec={() => dec(it.id)} compact />
                <Money value={it.price * it.qty} size={14} weight={700} style={{ minWidth: 64, textAlign: "right" }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: SP.md, background: "none", border: "none", color: c.primary, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}>
          <Plus size={15} color={c.primary} strokeWidth={2.5} /> კიდევ დაამატე
        </button>

        {/* you pay */}
        <div style={{ marginTop: SP.xl }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: c.text2 }}>თქვენ იხდით</div>
          <div style={{ marginTop: 4 }}><Amount value={total} size={44} weight={700} /></div>
        </div>

        {/* tip */}
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

        {/* method */}
        <div style={{ marginTop: SP.xl, fontSize: 13, fontWeight: 500, color: c.text2 }}>გადახდის მეთოდი</div>
        <div style={{ display: "flex", gap: SP.sm, marginTop: SP.sm }}>
          {METHODS.map((m) => <Chip key={m.id} on={method === m.id} onClick={() => setMethod(m.id)}>{m.label}</Chip>)}
        </div>

        {/* receipt */}
        <div style={{ marginTop: SP.xl, fontSize: 13, fontWeight: 500, color: c.text2 }}>ქვითარი</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: SP.sm, height: 44, padding: `0 ${SP.lg}px`, borderRadius: R.md, background: c.bg, boxShadow: CARD }}>
          <input value={receipt} onChange={(e) => setReceipt(e.target.value)} placeholder="ტელეფონი ან ელ. ფოსტა (არასავალდებულო)" aria-label="ტელეფონი ან ელ. ფოსტა ქვითრისთვის"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16, color: c.text, fontFamily: SANS }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: SP.xl, gap: SP.sm, fontSize: 12, color: c.text2 }}>
          <Lock size={12} /> უსაფრთხო გადახდა
        </div>
      </div>

      {/* sticky slide-to-pay */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "rgba(245,244,250,0.90)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div style={{ padding: `${SP.md}px ${PAD}px` }}>
          <SlideButton onComplete={() => onPay({ total, tip: tipAmt, subtotal, method, receipt: receipt.trim(), items })} payLabel={payLabel} amount={total} />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- order receipt (thermal style, matches the payment receipt) ---------- */
function OrderReceipt({ result }) {
  const rows = [
    { type: "header" },
    ...result.items.map((it) => ({ type: "line", qty: it.qty, name: it.name, total: it.price * it.qty })),
    { type: "divider" },
    { type: "row", label: "კერძები", value: result.subtotal },
    ...(result.tip > 0 ? [{ type: "row", label: "დანამატი", value: result.tip }] : []),
    { type: "total", value: result.total },
  ];
  const baseDelay = 0.5, step = 0.08;
  return (
    <div style={{ marginTop: SP.xl }}>
      <motion.div initial={{ rotateX: 15, y: 40, opacity: 0, scale: 0.95 }} animate={{ rotateX: 0, y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d", transformOrigin: "top center", background: "#F5F5F0", border: "1px solid #E5E5DC", borderRadius: 2, padding: `${SP.md}px ${SP.lg}px`, boxShadow: "0 20px 50px rgba(26,26,26,0.28), 0 4px 12px rgba(26,26,26,0.12)", position: "relative", maxWidth: 320, margin: "0 auto" }}>
        <div style={{ position: "absolute", top: -10, left: 0, right: 0, height: 5, background: "repeating-linear-gradient(90deg, #bbb 0, #bbb 6px, transparent 6px, transparent 10px)" }} />
        {rows.map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: baseDelay + idx * step, duration: 0.4, ease: "easeOut" }} style={{ overflow: "hidden" }}>
            {item.type === "header" && (
              <div style={{ textAlign: "center", paddingBottom: SP.sm, marginBottom: SP.sm, borderBottom: "1px dashed #999" }}>
                <div style={{ ...num, fontSize: 13, fontWeight: 700, color: c.text, letterSpacing: 0.5 }}>{VENUE.name.toUpperCase()}</div>
                <div style={{ ...num, fontSize: 11, color: "#666", marginTop: 3 }}>TABLE {VENUE.table} · ORDER {result.code}</div>
              </div>
            )}
            {item.type === "line" && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12, color: c.text, fontFamily: "Courier New, monospace", letterSpacing: 0.2 }}>
                <span style={{ flex: 1 }}><span style={{ color: "#888", marginRight: 6 }}>{item.qty}×</span>{item.name}</span>
                <span style={{ marginLeft: 12, whiteSpace: "nowrap", fontWeight: 600 }}>{fmt(item.total)} ₾</span>
              </div>
            )}
            {item.type === "divider" && <div style={{ borderTop: "1px dashed #999", margin: `${SP.sm}px 0` }} />}
            {item.type === "row" && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11, color: "#666", fontFamily: "Courier New, monospace" }}>
                <span>{item.label}</span><span style={{ marginLeft: 12, whiteSpace: "nowrap" }}>{fmt(item.value)} ₾</span>
              </div>
            )}
            {item.type === "total" && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: `${SP.sm}px 0 0`, borderTop: "2px solid #333", fontSize: 12, fontWeight: 700, color: c.text, fontFamily: "Courier New, monospace" }}>
                <span>PAID</span><span style={{ marginLeft: 12, whiteSpace: "nowrap" }}>{fmt(item.value)} ₾</span>
              </div>
            )}
          </motion.div>
        ))}
        <motion.div initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ delay: baseDelay + rows.length * step + 0.25, duration: 0.35 }}
          style={{ marginTop: SP.md, textAlign: "center", fontSize: 10, color: "#999", letterSpacing: 1 }}>✂ ✂ ✂</motion.div>
        <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: baseDelay + rows.length * step + 0.4, duration: 0.4 }}
          style={{ position: "absolute", bottom: -10, left: 0, right: 0, height: 10, background: "repeating-linear-gradient(90deg, #ddd 0, #ddd 6px, transparent 6px, transparent 10px)", borderRadius: "0 0 2px 2px", transformOrigin: "top center" }} />
      </motion.div>
    </div>
  );
}

/* ---------- success ---------- */
function OrderSuccess({ result }) {
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);
  return (
    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      style={{ position: "relative", height: "100%", width: "100%", display: "flex", flexDirection: "column", background: c.surface }}>
      <Confetti />
      <div style={{ display: "grid", placeItems: "center", paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: SP.sm }}><Logo h={24} /></div>
      <div style={{ flex: 1, overflowY: "auto", padding: `${SP.lg}px ${PAD}px`, paddingBottom: "max(40px, calc(env(safe-area-inset-bottom) + 24px))" }} className="no-scrollbar">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 6, paddingTop: SP.lg }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.05 }}
            style={{ width: 78, height: 78, borderRadius: 2, background: c.success, boxShadow: "0 12px 30px -10px rgba(31,168,31,0.5)", display: "grid", placeItems: "center" }}>
            <Check size={40} color="#FFFFFF" strokeWidth={3} />
          </motion.div>
          <h2 style={{ ...disp, fontSize: 28, fontWeight: 700, color: c.text, marginTop: SP.lg }}>შეკვეთა მიღებულია</h2>
          <p style={{ fontSize: 14, color: c.text2, marginTop: SP.xs }}>სამზარეულომ მიიღო · მალე მოგიტანთ</p>
          <div style={{ marginTop: SP.md }}><Amount value={result.total} size={36} weight={700} /></div>
        </div>

        <div style={{ textAlign: "center", marginTop: SP.xl }}>
          <div style={{ fontSize: 14, color: c.text2 }}>როგორ შეგვაფასებთ?</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: SP.sm, marginTop: SP.md }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button key={n} whileTap={{ scale: 0.8 }} onClick={() => !sent && (setRating(n), setSent(true))} aria-label={`${n} ვარსკვლავი`} aria-pressed={n <= rating} disabled={sent}
                style={{ width: 44, height: 44, display: "grid", placeItems: "center", background: "none", border: "none", cursor: sent ? "default" : "pointer", color: n <= rating ? COL.orange : c.text3 }}>
                <Star size={32} fill={n <= rating ? COL.orange : "none"} strokeWidth={1.5} />
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {sent && (
              <motion.div key="thanks" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}
                style={{ display: "inline-flex", alignItems: "center", gap: SP.sm, marginTop: SP.md, padding: `10px ${SP.lg}px`, borderRadius: 2, background: "rgba(31,168,31,0.10)", color: c.success, fontSize: 13, fontWeight: 600 }}>
                <Check size={15} strokeWidth={2.5} /> მადლობა გამოხმაურებისთვის!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <OrderReceipt result={result} />
        <div style={{ textAlign: "center", marginTop: SP.lg, fontSize: 13, color: c.text2 }}>
          {result.receipt ? `ქვითარი გაიგზავნა: ${result.receipt}` : "ქვითარი ხელმისაწვდომია ზემოთ"}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: SP.xl, gap: 6, opacity: 0.65 }}>
          <span style={{ fontSize: 12, color: c.text2 }}>გთავაზობთ</span><Logo h={16} />
        </div>
        <p style={{ fontSize: 13, color: c.text2, marginTop: SP.lg, textAlign: "center" }}>მაგიდა {VENUE.table} · შეგიძლიათ დაისვენოთ, კერძები მაგიდასთან მოვა</p>
      </div>
    </motion.div>
  );
}

/* ---------- root ---------- */
export default function AvlaMenu() {
  const [screen, setScreen] = useState("splash");
  const [cart, setCart] = useState({});           // { dishId: qty }
  const [openDish, setOpenDish] = useState(null);  // dish object or null
  const [result, setResult] = useState(null);
  const [sheet, setSheet] = useState({ kind: null, payload: null });

  useEffect(() => { if (screen === "splash") { const t = setTimeout(() => setScreen("menu"), 1200); return () => clearTimeout(t); } }, [screen]);
  useEffect(() => { if (screen === "processing") { const t = setTimeout(() => setScreen("success"), 1200); return () => clearTimeout(t); } }, [screen]);

  const add = (id) => setCart((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const inc = add;
  const dec = (id) => setCart((p) => { const q = (p[id] || 0) - 1; const n = { ...p }; if (q <= 0) delete n[id]; else n[id] = q; return n; });

  const items = useMemo(() => DISHES.filter((d) => cart[d.id] > 0).map((d) => ({ ...d, qty: cart[d.id] })), [cart]);
  const count = useMemo(() => Object.values(cart).reduce((s, q) => s + q, 0), [cart]);
  const subtotal = useMemo(() => r2(items.reduce((s, it) => s + it.price * it.qty, 0)), [items]);

  // if the cart empties on the review screen, go back to the menu
  useEffect(() => { if (screen === "review" && count === 0) setScreen("menu"); }, [screen, count]);

  const pay = (r) => {
    const payload = { ...r, code: "AV-" + Math.floor(2000 + Math.random() * 8000) };
    if (r.method === "apple") setSheet({ kind: "apple", payload });
    else if (r.method === "card") setSheet({ kind: "card", payload });
    else { setResult(payload); setScreen("processing"); }
  };
  const closeSheet = () => setSheet((s) => ({ ...s, kind: null }));
  const finishSheet = (extra) => { setResult({ ...sheet.payload, ...(extra || {}) }); setSheet((s) => ({ ...s, kind: null })); setScreen("success"); };

  const openQty = openDish ? cart[openDish.id] || 0 : 0;

  return (
    <Shell>
      <AnimatePresence mode="wait">
        {screen === "splash" && <motion.div key="s" style={{ height: "100%" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><Splash /></motion.div>}
        {screen === "menu" && (
          <MenuScreen key="m" cart={cart} add={add} inc={inc} dec={dec} count={count} subtotal={subtotal}
            onOpenDish={setOpenDish} onCheckout={() => setScreen("review")} />
        )}
        {screen === "review" && (
          <ReviewScreen key="r" items={items} inc={inc} dec={dec} subtotal={subtotal}
            onBack={() => setScreen("menu")} onPay={pay} />
        )}
        {screen === "processing" && <Processing key="pr" />}
        {screen === "success" && <OrderSuccess key="su" result={result} />}
      </AnimatePresence>

      {/* dish detail (only meaningful on the menu screen) */}
      {screen === "menu" && (
        <DishDetailSheet dish={openDish} qty={openQty}
          onClose={() => setOpenDish(null)}
          onAdd={() => add(openDish.id)} onInc={() => inc(openDish.id)} onDec={() => dec(openDish.id)} />
      )}

      <ApplePaySheet open={sheet.kind === "apple"} payload={sheet.payload} onClose={closeSheet} onDone={finishSheet} />
      <CardSheet open={sheet.kind === "card"} payload={sheet.payload} onClose={closeSheet} onDone={finishSheet} />
    </Shell>
  );
}
