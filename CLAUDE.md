# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Avla** — a premium Georgian QR-based restaurant platform. Each restaurant gets a QR encoding its service tier, resolved by `src/App.jsx` from the `?qr=` param:

- **Payment only** (`?qr=payment`, default) → `AvlaPayment.jsx`. Guests land on their live bill and pay in 10–15 seconds with flexible split options (full/equal/by-item), tip, and multiple payment methods.
- **Menu + Payment** (`?qr=menu`) → `AvlaMenu.jsx`. Guests browse the menu (category bar, dish cards, dish detail sheet), build an order, then check out (tip + method + slide-to-pay) — reusing the same payment sheets and success/receipt as the payment flow.

`AvlaMenu` imports its design tokens and shared primitives (`Shell`, `SlideButton`, `Chip`, `Sheet`, `ApplePaySheet`, `CardSheet`, `Confetti`, etc.) from `AvlaPayment.jsx` via a named-export block, so both tiers stay pixel-identical and the design system has one source of truth.

**Tech Stack:**
- React 18 + Framer Motion (spring animations)
- Vite (build/dev server)
- Tailwind utilities + custom inline styles
- Self-contained components (no external UI library)

**Deployed to:** Vercel at https://avla-payment.vercel.app/?qr=payment

---

## Architecture & Design System

### Brand System (Locked Constants)

All design tokens are hardcoded as constants in `AvlaPayment.jsx`. Changes require updating the constants and re-testing across all screens.

```javascript
// Colors (from Brand Book)
const COL = {
  primary: "#734EF9",      // Brand purple
  ink: "#1A1A1A",          // Black text
  paper: "#FFFFFF",        // White background
  surface: "#F5F4FA",      // Light surface
  success: "#1FA81F",      // Green (success state)
  orange: "#FF6600",       // Rating stars
  blue: "#6699FF"          // Accent
};

// Typography
const SANS = "Inter, 'Noto Sans Georgian', system-ui, -apple-system, 'Segoe UI', sans-serif";
const DISP = "Archivo, 'Noto Sans Georgian', system-ui, sans-serif";
const num = { fontFamily: DISP, fontVariantNumeric: "tabular-nums", fontVariationSettings: "'wdth' 125" };

// Spacing (8px base grid)
const SP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

// Radius
const R = { sm: 8, md: 12, lg: 18 };

// Button height
const BTN = 56;
```

### Component Architecture

**AvlaPayment.jsx** is self-contained (~1800 lines, single file). All components are internal functions:

1. **Splash** — 1.2s intro screen (venue name + table)
2. **ActiveBill** — Main interactive bill screen
   - Bill card display (line items with qty × name)
   - "You pay" amount (animated via Framer Motion)
   - Mode selection: Full payment / Equal split / By-item checkout
   - Tip selection: 0/10/15/20% pills + custom input
   - Payment method: Apple Pay / Google Pay / Card
   - Receipt field (phone/email, optional)
3. **Processing** — 1.2s loading state (spinner)
4. **PaySuccess** — Post-payment screen
   - Checkmark animation + confetti
   - 5-star rating (orange, interactive)
   - Receipt expansion panel (detail view)
   - "Powered by Avla" footer

**Helper Components:**
- `Money()` — Formats currency (₾ symbol, 2 decimals)
- `Amount()` — Animates number changes (Framer Motion)
- `Stepper()` — Guest count ± buttons
- `Chip()` — Pill buttons (tip %, method, mode)
- `ModeCard()` — Bill-split mode selector with expand/collapse
- `Avatars()` — Guest avatars (capped at 5 + overflow count)
- `BillHeader()` — Sticky header (venue name, logo, table number)
- `Confetti()` — Post-payment animation burst (26 pieces)
- `Receipt()` — Expandable receipt detail
- `Shell()` — Outer container (loads fonts, applies global styles, centers mobile UI)
- `Logo()` — Base64 embedded Avla logo
- `Svg()` — Icon helper (all 15 brand icons inlined)

### State Flow

```
AvlaPayment (root)
  ├─ screen: "splash" → "bill" → "processing" → "success"
  ├─ result: { total, share, tip, method, mode, guests, picked[], receipt }
  
ActiveBill
  ├─ mode: "full" | "equal" | "item"
  ├─ guests: 2–12 (for equal split)
  ├─ picked: Set<string> (item IDs for by-item mode)
  ├─ tip: { mode: "pct" | "custom", pct: 0–0.2, custom: "0.00" }
  ├─ method: "apple" | "google" | "card"
  ├─ receipt: string (phone or email)
  
  Derived:
  ├─ shareSub: subtotal | (subtotal / guests) | pickedSum
  ├─ tipAmt: shareSub * pct | parseFloat(custom)
  ├─ payTotal: shareSub + tipAmt
  ├─ blocked: mode === "item" && picked.size === 0
```

### Data Model

**Bill Item:**
```javascript
{ id: "ob1", name: "აჭარული ხაჭაპური", qty: 1, total: 16.0 }
```

**Tip Presets:**
```javascript
[
  { id: "t0", label: "0%", pct: 0 },
  { id: "t10", label: "10%", pct: 0.1 },
  // ...
]
```

**Payment Methods:**
```javascript
[
  { id: "apple", label: "Apple Pay" },
  { id: "google", label: "Google Pay" },
  { id: "card", label: "ბარათით" }
]
```

---

## Responsive Design & Accessibility

### Mobile-First

- **Max width:** 420px (typical restaurant tablet display)
- **Safe areas:** All padding uses `env(safe-area-inset-*)` for notch/home indicator
- **Touch targets:** All buttons ≥ 44px (WCAG AA minimum)
- **Overflow:** Sticky header + scrollable content + sticky payment button

### Accessibility (WCAG AA)

- **Color contrast:** All text meets WCAG AA (7:1 on primary purple)
- **Keyboard nav:** Buttons support `onKeyDown` Enter key
- **Aria labels:** All icon buttons have `aria-label` and `aria-pressed`
- **Semantic:** Proper heading hierarchy (`<h2>` for success state)
- **Font loading:** Google Fonts preloaded; fallback to system fonts

### Animation Performance

- Framer Motion `animate()` for smooth number transitions (0.32s ease)
- Spring animations capped at 60fps
- Confetti uses `useMemo` to prevent re-renders
- `AnimatePresence mode="wait"` for screen transitions (no overlap)

---

## Common Development Tasks

### Run locally
```bash
npm install
npm run dev
# Opens http://localhost:5173/?qr=payment
```

### Build for production
```bash
npm run build
# Output: dist/ folder
```

### Test with URL parameters
```
http://localhost:5173/?qr=payment    # Payment QR (AvlaPayment)
http://localhost:5173/?qr=menu       # Menu QR (if Avla.jsx router is used)
```

### Add a new bill item
Edit `OPEN_BILL` constant in AvlaPayment.jsx:
```javascript
{ id: "ob6", name: "ხორბალი", qty: 1, total: 8.5 }
```

### Change venue/table number
Edit `VENUE` constant:
```javascript
const VENUE = { name: "Your Venue", table: 1 };
```

### Modify colors or spacing
Update `COL`, `SP`, `R` constants at the top. **All components derive from these.**

### Add a new tip percentage
Add to `TIPS`:
```javascript
{ id: "t25", label: "25%", pct: 0.25 }
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/AvlaPayment.jsx` | Payment flow + shared design system (tokens, primitives, payment sheets). Named-exports the shared pieces for the menu flow. |
| `src/AvlaMenu.jsx` | Menu + ordering + checkout flow (`?qr=menu`). Imports shared UI from AvlaPayment. |
| `src/App.jsx` | React root; routes `?qr=menu` → AvlaMenu, else → AvlaPayment |
| `src/main.jsx` | React DOM mount point |
| `index.html` | HTML entry point (Vite SPA template) |
| `vite.config.js` | Vite build config (port 5173) |
| `package.json` | Dependencies: react, react-dom, framer-motion, vite |
| `.gitignore` | Excludes node_modules, dist, .env, PDFs, images |
| `DEPLOY.md` | Step-by-step Vercel deployment guide |

---

## Deployment

Push to GitHub, then deploy to Vercel (auto-builds and deploys):

```bash
git add -A
git commit -m "Message"
git push origin main
```

Vercel detects the push, runs `npm run build`, and serves from `dist/`. Live URL: https://avla-payment.vercel.app/?qr=payment

For QR codes, use https://qr-server.com or similar to generate PNG from the live URL.

---

## Critical Design Decisions

1. **Single File Component:** AvlaPayment.jsx avoids prop drilling and makes brand-lock easy to enforce. All state is co-located.

2. **Inline Styles + Framer Motion:** No Tailwind classes (only utility helpers). Inline styles allow dynamic color/spacing changes from constants.

3. **Brand-Locked Design System:** Colors, fonts, spacing are constants. Changing one constant updates the entire app.

4. **No External UI Library:** All components (buttons, inputs, cards) are custom to match the brand aesthetic (billfold metaphor, spring animations).

5. **Confetti via useMemo:** Animation pieces are generated once at mount; prevents re-renders during transitions.

6. **Animated Amount Changes:** Framer Motion `animate()` smoothly transitions bill totals as the user changes split mode or tip.

7. **Safe-Area Aware:** Mobile notches and home indicators are handled via CSS `env()` variables (not hardcoded pixels).

---

## Common Pitfalls

- **Don't hardcode colors.** Use `COL`, `c` (color aliases), or `c.text2` (semantic color).
- **Don't hardcode spacing.** Use `SP.xs`, `SP.sm`, etc. (8px grid).
- **Don't change button height without updating form inputs.** `BTN = 56` and input height `= 44` are aligned intentionally.
- **Don't remove logo embedding.** The base64 data URI keeps the app self-contained (no external image requests).
- **Don't skip safe-area padding on mobile.** Always wrap containers with `padding: "env(safe-area-inset-*)"`
