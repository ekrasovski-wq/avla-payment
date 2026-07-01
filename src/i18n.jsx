import React, { createContext, useContext, useState, useEffect } from "react";

/* ============================================================
   Tiny i18n for Avla. Georgian (ka) is the default; English (en)
   is the alternate. Strings are co-located at call sites via
   t(ka, en) — no key registry to keep in sync.
   Usage:  const { t } = useT();  ...  {t("გადახდა", "Pay")}
   ============================================================ */

const Ctx = createContext({ lang: "ka", t: (ka) => ka, setLang: () => {}, toggle: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("avla-lang") || "ka"; } catch { return "ka"; }
  });
  useEffect(() => { try { localStorage.setItem("avla-lang", lang); } catch { /* ignore */ } }, [lang]);
  useEffect(() => { try { document.documentElement.lang = lang; } catch { /* ignore */ } }, [lang]);

  const t = (ka, en) => (lang === "en" && en != null ? en : ka);
  const toggle = () => setLang((l) => (l === "ka" ? "en" : "ka"));

  return <Ctx.Provider value={{ lang, setLang, t, toggle }}>{children}</Ctx.Provider>;
}

export function useT() { return useContext(Ctx); }

/* small KA/EN switch — shows the language you'd switch TO */
export function LangToggle({ style }) {
  const { lang, toggle } = useT();
  return (
    <button onClick={(e) => { e.stopPropagation(); toggle(); }} aria-label={lang === "ka" ? "Switch to English" : "ქართულად გადართვა"}
      style={{ height: 44, minWidth: 44, padding: "0 10px", borderRadius: 2, background: "rgba(26,26,26,0.05)", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#734EF9", letterSpacing: "0.03em", display: "inline-flex", alignItems: "center", ...style }}>
      {lang === "ka" ? "EN" : "ქარ"}
    </button>
  );
}
