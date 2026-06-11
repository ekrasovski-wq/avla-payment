# Avla

QR ordering and payment for restaurants. One file, two independent products, one design system.

| Product | Mounts on | What the guest does |
| --- | --- | --- |
| **AvlaPayment** | `?qr=payment` | Lands directly on the live table check. Split, tip, pay. |
| **AvlaMenu** | `?qr=menu` (or no parameter) | Browses the menu and sends an order to the kitchen. |

Each product is fully self-contained. A venue can run one, the other, or both. There is no landing page and no choice screen: each QR code opens its product directly.

---

## Requirements

- React 18+
- `framer-motion`
- `lucide-react`
- Tailwind CSS (used for layout utilities only; all colors and tokens are inline from the brand system)

```bash
npm install react react-dom framer-motion lucide-react
```

Fonts (Archivo, Inter, Noto Sans Georgian) are loaded at runtime from Google Fonts by the component itself. No extra setup needed.

---

## Install the component

Copy `Avla.jsx` into your project (for example `src/Avla.jsx`) and add the logo asset (see below).

```jsx
import AvlaApp from "./Avla";

export default function App() {
  return <AvlaApp />;
}
```

`AvlaApp` is the default export and acts as the QR router. The two products are also exported by name if you prefer to mount one directly:

```jsx
import AvlaApp, { AvlaPayment, AvlaMenu } from "./Avla";

// Router (reads ?qr= from the URL):
<AvlaApp />

// Force a product, ignoring the URL:
<AvlaApp product="payment" />

// Mount a single product on its own route:
<AvlaPayment />
<AvlaMenu />
```

---

## The logo asset (required)

The brand logo is rendered, not generated. Serve the file at the site root:

```
public/avla-logo.png
```

It is referenced in three places (splash, header, success) as:

```jsx
<img src="/avla-logo.png" alt="Avla" className="h-6 w-auto" />
```

If you deploy under a sub-path, change the `Logo` component's `src` to match (for example `/app/avla-logo.png`).

---

## QR routing setup

Each physical table gets a short URL. Encode that URL into the QR sticker. The router reads the `qr` parameter and mounts the matching product.

| QR sticker | URL to encode | Opens |
| --- | --- | --- |
| Payment | `https://avla.ge/t/14?qr=payment` | AvlaPayment |
| Menu | `https://avla.ge/t/14?qr=menu` | AvlaMenu |

Rules the router follows:

- `qr=payment` → `AvlaPayment`
- `qr=menu` → `AvlaMenu`
- missing or unknown `qr` → `AvlaMenu` (safe default)

The `t/14` segment is the table identifier. In this build the table number is the `VENUE.table` constant; in production read it from the path and pass it through (see "Connecting real data").

### Generating the QR codes

Point any QR generator at the encoded URL. Example with the `qrcode` CLI:

```bash
npx qrcode "https://avla.ge/t/14?qr=payment" -o table-14-pay.png
npx qrcode "https://avla.ge/t/14?qr=menu"    -o table-14-menu.png
```

Print one pair per table. A venue that only takes payments prints only the payment code; a venue that only takes orders prints only the menu code.

---

## Build and deploy

Any static host or React framework works (Vite, Next.js, CRA). Minimal Vite example:

```bash
npm create vite@latest avla -- --template react
cd avla
npm install framer-motion lucide-react
# add src/Avla.jsx and public/avla-logo.png, import AvlaApp in src/App.jsx
npm run build      # outputs static files in dist/
```

Deploy `dist/` to Netlify, Vercel, Cloudflare Pages, or any static host. Make sure the host serves `?qr=` query strings to the same SPA entry (default for all of the above).

---

## Connecting real data

This build ships with realistic sample data as in-file constants. Replace these with your backend:

| Constant | In | Replace with |
| --- | --- | --- |
| `VENUE` (`name`, `table`) | both | Venue config + table id from the URL path |
| `MENU`, `CHAPTERS` | AvlaMenu | Live menu from your POS / CMS |
| `OPEN_BILL` | AvlaPayment | The table's open check from your POS |

The order and payment handlers (`send`, `pay`) currently simulate success with a timeout. Wire them to your kitchen/order API and payment provider respectively.

---

## Production checklist

- [ ] Serve `public/avla-logo.png`.
- [ ] Read the real table id from the URL path and feed it to `VENUE`/data fetches.
- [ ] Fetch the live `OPEN_BILL` and `MENU` from your backend.
- [ ] Integrate a payment provider; replace the simulated `pay` with a real charge.
- [ ] Apple Pay / Google Pay should use the platform's official payment-sheet button and APIs, not a styled look-alike, where required by guidelines.
- [ ] Confirm the brand logo renders crisply at `h-5` and `h-6` (export a 2x or SVG asset).

---

## Design system (locked)

Do not introduce new tokens. Everything below comes from the Avla Brand Book.

**Color**

| Token | Value | Use |
| --- | --- | --- |
| primary | `#734EF9` | actions, taps, selected states, confirmations |
| ink | `#1A1A1A` | text, dark CTA (Apple/Google Pay) |
| paper | `#FFFFFF` | background |
| surface | `#F5F4FA` | cards and insets |
| success | `#1FA81F` | paid / order received |
| accents | `#FF6600`, `#6699FF` | sparingly (success confetti only) |

Secondary and tertiary text are opacities of ink, not new colors.

**Type** — Archivo (Expanded, `wdth` 125) for display and numerals, Inter (300 to 600) for UI, with a sans Georgian fallback for Georgian script. No serif.

**Radius** — `8 / 12 / 18`.   **Spacing** — `8px` base grid.

---

Built and ready to ship.
