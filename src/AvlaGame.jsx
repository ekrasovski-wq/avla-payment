import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createGame, resize, tick, tryJump, totalScore, GROUND_H, CW, CH, CHAR_X } from "./game-core";

/* ============================================================
   AVLA RUNNER — one-tap endless runner (Mario/Dino style).
   The Avla receipt-creature auto-runs, jumps obstacles, and
   collects ₾ coins. Tap / Space / ArrowUp = jump.
   Simulation lives in ./game-core (headlessly tested); this file
   renders it to <canvas> and provides the React chrome.
   Self-contained (inlined brand tokens) — no AvlaPayment import,
   so AvlaPayment can import GameCard back without a cycle.
   ============================================================ */

const PURPLE = "#734EF9", INK = "#1A1A1A", GREEN = "#1FA81F", GRAPHITE = "#3A3550";
const SANS = "Inter, 'Noto Sans Georgian', system-ui, -apple-system, sans-serif";
const DISP = "'Space Grotesk', 'Noto Sans Georgian', system-ui, sans-serif";
const SP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* draw the Avla creature with squash/stretch, leg run cycle, blink, death face */
function drawAvla(ctx, g, gy) {
  const x = CHAR_X, y = g.charY, w = CW, h = CH;
  const air = g.air, over = g.over, t = g.t, sq = g.squash;

  // shadow
  const alt = Math.max(0, (gy - CH) - y);
  ctx.fillStyle = `rgba(0,0,0,${Math.max(0.05, 0.22 - alt / 900)})`;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, gy + 4, Math.max(9, 17 - alt / 22), 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // squash/stretch about the feet
  const sx = 1 + Math.max(0, sq) * 0.22 - Math.max(0, -sq) * 0.12;
  const sy = 1 - Math.max(0, sq) * 0.22 + Math.max(0, -sq) * 0.16;
  ctx.save();
  ctx.translate(x + w / 2, y + h);
  ctx.scale(sx, sy);
  ctx.translate(-(x + w / 2), -(y + h));

  // legs (run cycle, tuck in the air)
  ctx.fillStyle = PURPLE;
  for (let i = 0; i < 4; i++) {
    const lx = x + 6 + i * 8;
    const wig = air ? 2 : 3 + Math.sin(t * 17 + i * 1.6) * 3;
    rr(ctx, lx, y + h - 2, 5, 5 + wig, 2);
    ctx.fill();
  }

  // body with folded top-right corner (the receipt metaphor)
  const r = 7, fold = 11;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - fold, y);
  ctx.lineTo(x + w, y + fold);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fillStyle = PURPLE;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + w - fold, y);
  ctx.lineTo(x + w, y + fold);
  ctx.lineTo(x + w - fold, y + fold);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.fill();

  // eyes
  ctx.fillStyle = "#fff";
  const ey = y + h * 0.36;
  if (over) {
    // X_X
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    for (const ex of [x + 12, x + 25]) {
      ctx.beginPath();
      ctx.moveTo(ex - 3, ey - 1); ctx.lineTo(ex + 3, ey + 5);
      ctx.moveTo(ex + 3, ey - 1); ctx.lineTo(ex - 3, ey + 5);
      ctx.stroke();
    }
  } else {
    const blinking = g.blink < 0.11;
    const eh = air ? 3 : blinking ? 1.6 : 6;
    rr(ctx, x + 8, ey + (6 - eh) / 2, 8, eh, 1.5); ctx.fill();
    rr(ctx, x + 21, ey + (6 - eh) / 2, 8, eh, 1.5); ctx.fill();
  }
  ctx.restore();
}

function GameOverlay({ onClose }) {
  const canvasRef = useRef(null);
  const G = useRef(null);
  const dims = useRef({ W: 0, H: 0 });
  const phaseRef = useRef("ready");
  const [phase, setPhase] = useState("ready");
  const [res, setRes] = useState({ score: 0, best: readBest(), coins: 0 });

  const setPhaseBoth = (p) => { phaseRef.current = p; setPhase(p); };

  const restart = useCallback(() => {
    const { W, H } = dims.current;
    G.current = createGame(W, H);
  }, []);

  const act = useCallback(() => {
    if (phaseRef.current === "ready" || phaseRef.current === "over") { restart(); setPhaseBoth("playing"); return; }
    tryJump(G.current);
  }, [restart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let dpr = 1, raf = 0, last = performance.now();

    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.clientWidth, H = canvas.clientHeight;
      dims.current = { W, H };
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (G.current) resize(G.current, W, H);
    };
    fit();
    G.current = createGame(dims.current.W, dims.current.H);
    const onResize = () => fit();
    window.addEventListener("resize", onResize);

    const endRun = () => {
      const g = G.current;
      const score = totalScore(g);
      const best = Math.max(score, readBest());
      writeBest(best);
      setRes({ score, best, coins: g.coins_n });
      setPhaseBoth("over");
    };

    const draw = () => {
      const g = G.current;
      const { W, H } = dims.current;
      const gy = H - GROUND_H;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (g.shake > 0) {
        const s = g.shake * 6;
        ctx.translate((Math.random() * 2 - 1) * s, (Math.random() * 2 - 1) * s);
      }

      // background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#16131F"); bg.addColorStop(1, INK);
      ctx.fillStyle = bg;
      ctx.fillRect(-12, -12, W + 24, H + 24);

      // QR-like generative pattern, parallax
      ctx.fillStyle = "rgba(115,78,249,0.06)";
      const cell = 26, ox = (g.dist * 0.16) % cell;
      for (let yy = 26; yy < gy - 18; yy += cell)
        for (let xx = -cell; xx < W + cell; xx += cell)
          if (((xx / cell + yy / cell) | 0) % 3 === 0) ctx.fillRect(xx - ox, yy, 7, 7);

      // coins
      for (const cn of g.coins) {
        if (cn.got) continue;
        ctx.save();
        ctx.translate(cn.x, cn.y);
        ctx.scale(1 + Math.sin(g.t * 5 + cn.x * 0.05) * 0.08, 1);
        ctx.fillStyle = PURPLE;
        ctx.beginPath(); ctx.arc(0, 0, cn.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "700 13px " + DISP;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("₾", 0, 1);
        ctx.restore();
      }

      // dust particles
      for (const p of g.particles) {
        ctx.globalAlpha = Math.max(0, p.life * 2.5);
        ctx.fillStyle = "rgba(180,170,230,0.9)";
        ctx.fillRect(p.x, p.y, p.r, p.r);
      }
      ctx.globalAlpha = 1;

      // ground
      ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(-12, gy, W + 24, GROUND_H + 12);
      ctx.fillStyle = PURPLE; ctx.fillRect(-12, gy, W + 24, 3);
      ctx.fillStyle = "rgba(115,78,249,0.5)";
      const tox = g.dist % 22;
      for (let xx = -22; xx < W + 22; xx += 22) ctx.fillRect(xx - tox, gy + 9, 9, 3);

      // obstacles
      for (const o of g.obstacles) {
        const oy = gy - o.h;
        ctx.fillStyle = o.tall ? GRAPHITE : PURPLE;
        rr(ctx, o.x, oy, o.w, o.h, 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.16)"; ctx.fillRect(o.x, oy, o.w, 3);
      }

      // character
      drawAvla(ctx, g, gy);

      // live score + coin pop
      if (phaseRef.current !== "ready") {
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.font = "700 24px " + DISP;
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillText(String(totalScore(g)), 18, 46);
        if (g.pop > 0) {
          ctx.globalAlpha = g.pop;
          ctx.fillStyle = PURPLE; ctx.font = "700 14px " + DISP;
          ctx.fillText("+10", CHAR_X + 2, g.charY - 8 - (1 - g.pop) * 18);
          ctx.globalAlpha = 1;
        }
      }
    };

    const loop = (t) => {
      const dt = Math.min((t - last) / 1000, 0.045);
      last = t;
      if (phaseRef.current === "playing") {
        if (tick(G.current, dt)) endRun();
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onKey = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); act(); }
      else if (e.code === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [restart, act, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      onPointerDown={act}
      style={{ position: "absolute", inset: 0, zIndex: 60, background: INK, overflow: "hidden", touchAction: "manipulation", userSelect: "none", WebkitUserSelect: "none" }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

      <button onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="დახურვა"
        style={{ position: "absolute", top: "max(14px, env(safe-area-inset-top))", right: 14, zIndex: 62, width: 40, height: 40, borderRadius: 2, background: "rgba(255,255,255,0.12)", border: "none", display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(6px)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="square"><path d="M6 6 L18 18" /><path d="M18 6 L6 18" /></svg>
      </button>

      <AnimatePresence>
        {phase !== "playing" && (
          <motion.div key={phase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
            style={{ position: "absolute", inset: 0, zIndex: 61, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, pointerEvents: "none", color: "#fff", fontFamily: SANS }}>
            <MascotSvg size={78} />
            {phase === "ready" ? (
              <>
                <div style={{ fontFamily: DISP, fontSize: 27, fontWeight: 700, marginTop: SP.lg }}>ავლა-მორბენალი</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", marginTop: SP.sm, maxWidth: 270, lineHeight: 1.55 }}>
                  შეეხე ეკრანს, რომ ახტე დაბრკოლებებზე და შეაგროვო ₾.
                </div>
                {res.best > 0 && <div style={{ fontFamily: DISP, fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: SP.md }}>რეკორდი {res.best}</div>}
                <div style={{ marginTop: SP.xl, padding: "13px 24px", borderRadius: 2, background: PURPLE, fontSize: 15, fontWeight: 600 }}>დაწყება ▸</div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: DISP, fontSize: 24, fontWeight: 700, marginTop: SP.lg }}>თამაში დასრულდა</div>
                <div style={{ fontFamily: DISP, fontSize: 54, fontWeight: 700, marginTop: SP.sm, lineHeight: 1 }}>{res.score}</div>
                <div style={{ fontFamily: DISP, fontSize: 13, color: res.score >= res.best ? GREEN : "rgba(255,255,255,0.55)", marginTop: SP.sm }}>
                  {res.score >= res.best ? "ახალი რეკორდი!" : `რეკორდი ${res.best}`}
                  {res.coins > 0 ? `  ·  ₾ ${res.coins}` : ""}
                </div>
                <div style={{ marginTop: SP.xl, padding: "13px 24px", borderRadius: 2, background: PURPLE, fontSize: 15, fontWeight: 600 }}>თავიდან ▸</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function readBest() { try { return Number(localStorage.getItem("avla-game-best") || 0) || 0; } catch { return 0; } }
function writeBest(v) { try { localStorage.setItem("avla-game-best", String(v)); } catch { /* ignore */ } }

/* static SVG mascot — launcher card + start screen */
export function MascotSvg({ size = 64 }) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 50 54" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <ellipse cx="25" cy="51" rx="13" ry="2.4" fill="rgba(0,0,0,0.18)" />
      {[12, 20, 28, 36].map((lx) => <rect key={lx} x={lx} y="42" width="5" height="8" rx="2" fill={PURPLE} />)}
      <path d="M13 4 L34 4 L44 14 L44 37 Q44 44 37 44 L13 44 Q6 44 6 37 L6 11 Q6 4 13 4 Z" fill={PURPLE} />
      <path d="M34 4 L44 14 L34 14 Z" fill="rgba(255,255,255,0.32)" />
      <rect x="15" y="22" width="8" height="6" rx="2.5" fill="#fff" />
      <rect x="28" y="22" width="8" height="6" rx="2.5" fill="#fff" />
    </svg>
  );
}

/* embeddable launcher — drop into any success screen */
export function GameCard({ subtitle = "ითამაშეთ ავლა-მორბენალი, სანამ შეკვეთა მზადდება" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button whileTap={{ scale: 0.985 }} onClick={() => setOpen(true)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: SP.md, padding: SP.lg, borderRadius: 2, border: "none", cursor: "pointer", textAlign: "left", background: "linear-gradient(100deg, #1A1A1A, #2A2350)", color: "#fff", boxShadow: "0 12px 30px -16px rgba(115,78,249,0.6)", overflow: "hidden", position: "relative" }}>
        <MascotSvg size={44} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 15, fontWeight: 600 }}>მოგწყინდათ ლოდინი?</span>
          <span style={{ display: "block", fontSize: 12.5, color: "rgba(255,255,255,0.66)", marginTop: 2 }}>{subtitle}</span>
        </span>
        <span style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 2, background: PURPLE, display: "grid", placeItems: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M7 4 L20 12 L7 20 Z" /></svg>
        </span>
      </motion.button>
      <AnimatePresence>{open && <GameOverlay key="game" onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

/* full-page direct-play route (used by App for ?qr=game) */
export function GamePage() {
  useEffect(() => {
    const id = "avla-fonts-game";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Noto+Sans+Georgian:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap";
      document.head.appendChild(l);
    }
  }, []);
  return (
    <div style={{ width: "100%", minHeight: "100dvh", display: "grid", placeItems: "center", background: "rgba(26,26,26,0.06)" }}>
      <div style={{ position: "relative", width: "min(100vw, 460px)", height: "100dvh", background: INK, overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }}>
        <GameOverlay onClose={() => { window.location.href = window.location.origin + "/?qr=menu"; }} />
      </div>
    </div>
  );
}
