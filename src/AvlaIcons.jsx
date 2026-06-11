import React from "react";

/*
  AVLA ICONS — a single brand-native icon system.

  Design language (from the Avla Brand Book + the logomark):
    · Orthogonal, square-cut geometry. "One mark. Total discipline."
    · square line caps, miter joins — never rounded.
    · 45° chamfers echo the mark's cuts.
    · QR-derived rhythm; purple leads, the rest accents.

  API is drop-in compatible with lucide-react:
    <Plus />  <Check size={20} />  <Wallet size={20} color="#734EF9" />
    <Star size={32} fill="#FF6600" strokeWidth={1.5} />

  Props: size (number, default 24), color (default "currentColor"),
         strokeWidth (default 2), fill (default "none"), plus any svg props.
*/

const BRAND = "#734EF9";

function Svg({ size = 24, color = "currentColor", strokeWidth = 2, fill = "none", children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      shapeRendering="geometricPrecision"
      style={{ display: "block" }}
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ----------------------------- navigation ----------------------------- */
export const ChevronLeft = (p) => (<Svg {...p}><path d="M15 5 L8 12 L15 19" /></Svg>);
export const ChevronRight = (p) => (<Svg {...p}><path d="M9 5 L16 12 L9 19" /></Svg>);
export const ChevronDown = (p) => (<Svg {...p}><path d="M5 9 L12 16 L19 9" /></Svg>);
export const ChevronUp = (p) => (<Svg {...p}><path d="M5 15 L12 8 L19 15" /></Svg>);

export const ArrowRight = (p) => (
  <Svg {...p}><path d="M3.5 12 H19.5" /><path d="M13 5.5 L19.5 12 L13 18.5" /></Svg>
);
export const ArrowLeft = (p) => (
  <Svg {...p}><path d="M20.5 12 H4.5" /><path d="M11 5.5 L4.5 12 L11 18.5" /></Svg>
);

/* ------------------------------- controls ------------------------------ */
export const Plus = (p) => (<Svg {...p}><path d="M12 4.5 V19.5 M4.5 12 H19.5" /></Svg>);
export const Minus = (p) => (<Svg {...p}><path d="M4.5 12 H19.5" /></Svg>);
export const Check = (p) => (<Svg {...p}><path d="M4.5 12.5 L9.5 17.5 L19.5 6" /></Svg>);
export const X = (p) => (<Svg {...p}><path d="M6 6 L18 18 M18 6 L6 18" /></Svg>);
export const Close = X;

/* -------------------------------- status ------------------------------- */
// 8-ray spark — host suggestion / "moment of action"
export const Spark = (p) => (
  <Svg {...p}><path d="M12 3 V21 M3 12 H21 M5.6 5.6 L18.4 18.4 M18.4 5.6 L5.6 18.4" /></Svg>
);

// crisp angular 5-point star — ratings (supports fill like lucide Star)
export const Star = (p) => (
  <Svg {...p}>
    <path d="M12 3 L14.6 9.1 L21 9.6 L16.1 13.8 L17.7 20 L12 16.6 L6.3 20 L7.9 13.8 L3 9.6 L9.4 9.1 Z" />
  </Svg>
);

/* ------------------------------- payment ------------------------------- */
// wallet — pay the full bill
export const Wallet = (p) => (
  <Svg {...p}>
    <path d="M3.5 7 H20.5 V19 H3.5 Z" />
    <path d="M3.5 7 L6.5 4 H17.5" />
    <path d="M15.5 11 H20.5 V15 H15.5 Z" />
  </Svg>
);

// card — pay by card
export const Card = (p) => (
  <Svg {...p}>
    <path d="M3 6 H21 V18 H3 Z" />
    <path d="M3 10 H21" />
    <path d="M6.5 14 H11.5" />
  </Svg>
);

// contactless / tap-to-pay (angular, brand-orthogonal waves)
export const Contactless = (p) => (
  <Svg {...p}>
    <path d="M8 6 L13 12 L8 18" />
    <path d="M13 6 L18 12 L13 18" />
  </Svg>
);

/* ------------------------------ bill / split --------------------------- */
// two figures — split equally / guests
export const Users = (p) => (
  <Svg {...p}>
    <path d="M6 8 H11 V12 H6 Z" />
    <path d="M3.5 20 V16 H13.5 V20" />
    <path d="M14 7 H18.5 V10.5 H14" />
    <path d="M16.5 20 V14.5 H20.5 V20" />
  </Svg>
);

// list with checks — pay my own items
export const ListChecks = (p) => (
  <Svg {...p}>
    <path d="M3.5 7 L5.5 9 L8.5 5" />
    <path d="M3.5 16 L5.5 18 L8.5 14" />
    <path d="M11.5 7 H20.5" />
    <path d="M11.5 16 H20.5" />
  </Svg>
);

/* -------------------------------- trust -------------------------------- */
// padlock — secure payment (squared shackle, no curves)
export const Lock = (p) => (
  <Svg {...p}>
    <path d="M5 10.5 H19 V20.5 H5 Z" />
    <path d="M8 10.5 V7 H16 V10.5" />
    <path d="M12 14 V17" />
  </Svg>
);

/* -------------------------- scan / receipt / contact ------------------- */
// QR scan frame — the Avla signature (four corner brackets + center mark)
export const QrScan = (p) => (
  <Svg {...p}>
    <path d="M3 8 V3 H8" />
    <path d="M16 3 H21 V8" />
    <path d="M21 16 V21 H16" />
    <path d="M8 21 H3 V16" />
    <path d="M9.5 9.5 H11.5 V11.5 H9.5 Z" fill={p.color || "currentColor"} stroke="none" />
    <path d="M12.5 12.5 H14.5 V14.5 H12.5 Z" fill={p.color || "currentColor"} stroke="none" />
  </Svg>
);

// receipt — itemised bill / e-receipt (jagged foot)
export const Receipt = (p) => (
  <Svg {...p}>
    <path d="M5.5 3 H18.5 V21 L16 19 L13.5 21 L11 19 L8.5 21 L5.5 19 Z" />
    <path d="M9 8 H15" />
    <path d="M9 12 H15" />
  </Svg>
);

// message bubble — send receipt by SMS (squared)
export const Message = (p) => (
  <Svg {...p}>
    <path d="M4 5 H20 V16 H11 L6.5 20.5 V16 H4 Z" />
    <path d="M8 9 H16" />
    <path d="M8 12.5 H13" />
  </Svg>
);

// envelope — send receipt by email (orthogonal)
export const Mail = (p) => (
  <Svg {...p}>
    <path d="M3.5 6 H20.5 V18 H3.5 Z" />
    <path d="M3.5 6 L12 13 L20.5 6" />
  </Svg>
);

// phone handset — call / contact (squared)
export const Phone = (p) => (
  <Svg {...p}>
    <path d="M6 3 H10 L11.5 8 L9 10 C10 13 11 14 14 15 L16 12.5 L21 14 V18 C21 19.5 20 20.5 18.5 20.5 C10 20 4 14 3.5 5.5 C3.5 4 4.5 3 6 3 Z" />
  </Svg>
);

/* ------------------------------- the menu ------------------------------ */
// flame — spice level (angular)
export const Flame = (p) => (
  <Svg {...p}>
    <path d="M12 2.5 L7 9 L9 11 L6 15.5 C6 19 8.5 21.5 12 21.5 C15.5 21.5 18 19 18 15.5 L13.5 8.5 L12 11 Z" />
  </Svg>
);

// wine glass — cellar / pairing (angular goblet)
export const Wine = (p) => (
  <Svg {...p}>
    <path d="M7 3.5 H17 L15 11 H9 Z" />
    <path d="M12 11 V18.5" />
    <path d="M8 20.5 H16" />
  </Svg>
);

// table — table context / dine-in
export const Table = (p) => (
  <Svg {...p}>
    <path d="M3 8 H21" />
    <path d="M3 5.5 H21 V8" />
    <path d="M6 8 V18.5" />
    <path d="M18 8 V18.5" />
  </Svg>
);

/* -------------------------------- the mark ----------------------------- */
// Avla logomark — four modular meander units, 4-fold rotational symmetry.
// Solid mark (uses `color` as fill). Drop into anywhere a logo glyph is wanted.
export const Mark = ({ size = 24, color = BRAND, ...rest }) => {
  const Unit = ({ fill }) => (
    <g fill={fill}>
      <rect x="20" y="20" width="92" height="22" />
      <rect x="20" y="20" width="22" height="74" />
      <rect x="54" y="54" width="58" height="22" />
      <rect x="54" y="54" width="22" height="40" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{ display: "block" }} {...rest}>
      {[0, 90, 180, 270].map((r) => (
        <g key={r} transform={`rotate(${r} 120 120)`}><Unit fill={color} /></g>
      ))}
    </svg>
  );
};

export default {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowRight, ArrowLeft,
  Plus, Minus, Check, X, Close, Spark, Star,
  Wallet, Card, Contactless, Users, ListChecks, Lock,
  QrScan, Receipt, Message, Mail, Phone, Flame, Wine, Table, Mark,
};
