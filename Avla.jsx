import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
/* Avla brand icons (from AvlaIcons.jsx, inlined so the file is self-contained) */
function Svg({ size = 24, color = "currentColor", strokeWidth = 2, fill = "none", children, ...rest }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" shapeRendering="geometricPrecision" style={{ display: "block" }} {...rest}>{children}</svg>);
}
const ChevronLeft = (p) => (<Svg {...p}><path d="M15 5 L8 12 L15 19" /></Svg>);
const ChevronDown = (p) => (<Svg {...p}><path d="M5 9 L12 16 L19 9" /></Svg>);
const Plus = (p) => (<Svg {...p}><path d="M12 4.5 V19.5 M4.5 12 H19.5" /></Svg>);
const Minus = (p) => (<Svg {...p}><path d="M4.5 12 H19.5" /></Svg>);
const Check = (p) => (<Svg {...p}><path d="M4.5 12.5 L9.5 17.5 L19.5 6" /></Svg>);
const X = (p) => (<Svg {...p}><path d="M6 6 L18 18 M18 6 L6 18" /></Svg>);
const Lock = (p) => (<Svg {...p}><path d="M5 10.5 H19 V20.5 H5 Z" /><path d="M8 10.5 V7 H16 V10.5" /><path d="M12 14 V17" /></Svg>);
const Users = (p) => (<Svg {...p}><path d="M6 8 H11 V12 H6 Z" /><path d="M3.5 20 V16 H13.5 V20" /><path d="M14 7 H18.5 V10.5 H14" /><path d="M16.5 20 V14.5 H20.5 V20" /></Svg>);
const Wallet = (p) => (<Svg {...p}><path d="M3.5 7 H20.5 V19 H3.5 Z" /><path d="M3.5 7 L6.5 4 H17.5" /><path d="M15.5 11 H20.5 V15 H15.5 Z" /></Svg>);
const ListChecks = (p) => (<Svg {...p}><path d="M3.5 7 L5.5 9 L8.5 5" /><path d="M3.5 16 L5.5 18 L8.5 14" /><path d="M11.5 7 H20.5" /><path d="M11.5 16 H20.5" /></Svg>);
const Star = (p) => (<Svg {...p}><path d="M12 3 L14.6 9.1 L21 9.6 L16.1 13.8 L17.7 20 L12 16.6 L6.3 20 L7.9 13.8 L3 9.6 L9.4 9.1 Z" /></Svg>);

/*
  AVLA. Single deployable entry. Two standalone QR products, one design system.

    default export AvlaApp  -> QR router.
        ?qr=payment  mounts AvlaPayment (Sunday-style digital bill)
        ?qr=menu     mounts AvlaMenu    (browse and order)
        no parameter -> AvlaMenu
    No landing, no choice screen.

  Brand Book (locked):
    color   primary #734EF9, ink #1A1A1A, paper #FFFFFF, surface #F5F4FA,
            success #1FA81F, accents (sparingly) #FF6600 / #6699FF.
    type    Archivo (Expanded) for display + numerals, Inter for UI,
            Georgian falls through to a sans Georgian face. No serif.
    radius  8 / 12 / 18.  space  8px base.
*/

const COL = { primary: "#734EF9", ink: "#1A1A1A", paper: "#FFFFFF", surface: "#F5F4FA", success: "#1FA81F", orange: "#FF6600", blue: "#6699FF" };
const c = {
  bg: COL.paper, surface: COL.surface, text: COL.ink,
  text2: "rgba(26,26,26,0.55)", text3: "rgba(26,26,26,0.38)",
  line: "rgba(26,26,26,0.08)", div: "rgba(26,26,26,0.06)",
  primary: COL.primary, primarySoft: "rgba(115,78,249,0.10)", primarySoft2: "rgba(115,78,249,0.06)",
  onPrimary: "#FFFFFF", success: COL.success, successSoft: "rgba(31,168,31,0.10)",
};
const CARD = "0 1px 2px rgba(26,26,26,0.04), 0 14px 30px -20px rgba(26,26,26,0.20)";
const SANS = "Inter, 'Noto Sans Georgian', system-ui, -apple-system, 'Segoe UI', sans-serif";
const DISP = "Archivo, 'Noto Sans Georgian', system-ui, sans-serif";
const num = { fontFamily: DISP, fontVariantNumeric: "tabular-nums", fontVariationSettings: "'wdth' 125" };
const disp = { fontFamily: DISP, fontVariationSettings: "'wdth' 125" };
const R = { sm: 8, md: 12, lg: 18 };
const SP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
const PAD = SP.lg, BTN = 54;
const EASE = [0.32, 0.72, 0, 1];
const SPRING = { type: "spring", stiffness: 440, damping: 40 };
const fmt = (n) => Number(n).toFixed(2);
const VENUE = { name: "სუფრა", table: 14 };

/* ------------------------------ data ------------------------------ */
const SPICE = { id: "spice", title: "სიმწვავე", type: "scale", required: false, def: "med",
  choices: [{ id: "mild", label: "მსუბუქი" }, { id: "med", label: "საშუალო" }, { id: "hot", label: "ცხარე" }] };
const CHAPTERS = [
  { id: "pop", label: "პოპულარული" }, { id: "start", label: "სტარტერი" }, { id: "main", label: "მთავარი" },
  { id: "mwadi", label: "მანგალი" }, { id: "salad", label: "სალათი" }, { id: "dessert", label: "დესერტი" }, { id: "drink", label: "სასმელი" },
];
const MENU = [
  { id: "khinkali", cat: ["pop", "main"], name: "ხინკალი კალმახით", desc: "ხელით ნაზელი ცომი, მთის კალმახით", price: 1.8, unit: "ცალი", note: "პოპულარული", pair: "wine",
    options: [
      { id: "count", title: "ულუფა", type: "single", required: true, replacesBase: true, def: "7", choices: [{ id: "5", label: "5 ცალი", price: 9.0 }, { id: "7", label: "7 ცალი", price: 12.6 }, { id: "10", label: "10 ცალი", price: 18.0 }] },
      { id: "addon", title: "დამატება", type: "multi", required: false, choices: [{ id: "butter", label: "გამდნარი კარაქი", price: 1.5 }, { id: "ajika", label: "ცხარე აჯიკა", price: 2.0 }] },
    ] },
  { id: "achma", cat: ["pop"], name: "აჭარული ხაჭაპური", desc: "გახსნილი ნავი, კარაქი და კვერცხი", price: 16.0, unit: "ულუფა", options: [] },
  { id: "chaqapuli", cat: ["main"], name: "ჩაქაფული", desc: "კრავი, ტყემალი, ტარხუნა და თეთრი ღვინო", price: 28.0, unit: "ულუფა", pair: "wine", options: [SPICE] },
  { id: "mwadi-ghori", cat: ["mwadi", "pop"], name: "ღორის მწვადი", desc: "შეშის მანგალზე, ბროწეულის წვენით", price: 24.0, unit: "შამფური", pair: "wine",
    options: [SPICE, { id: "side", title: "გარნირი", type: "single", required: true, def: "none", choices: [{ id: "none", label: "უგარნირო", price: 0 }, { id: "potato", label: "შემწვარი კარტოფილი", price: 6.0 }, { id: "pkhali", label: "ფხალის ასორტი", price: 7.0 }] }] },
  { id: "mwadi-mwvadi", cat: ["mwadi"], name: "ხბოს მწვადი", desc: "ნაზი ფილე, მარილწყალში გაჩერებული", price: 32.0, unit: "შამფური", options: [SPICE] },
  { id: "badrijani", cat: ["start", "pop"], name: "ბადრიჯანი ნიგვზით", desc: "კლასიკური რულეტი, ბროწეულით", price: 12.0, unit: "ულუფა", options: [] },
  { id: "lobio", cat: ["start"], name: "ლობიო ქოთანში", desc: "თიხის ქოთანში, ცხელი მჭადით", price: 14.0, unit: "ქოთანი", options: [] },
  { id: "pkhali", cat: ["start", "salad"], name: "ფხალის ასორტი", desc: "ჭარხალი, ისპანახი და წიწმატი", price: 13.0, unit: "ასორტი", options: [] },
  { id: "salad", cat: ["salad"], name: "სეზონური სალათი", desc: "პომიდორი, კიტრი და ნიგვზის სოუსი", price: 11.0, unit: "ულუფა", options: [] },
  { id: "churchkhela", cat: ["dessert", "pop"], name: "ჩურჩხელა", desc: "კახური, ნიგვზითა და ბადაგით", price: 6.0, unit: "ცალი", options: [] },
  { id: "icecream", cat: ["dessert"], name: "საფერავის სორბეტი", desc: "ღვინის ნაყინი", price: 9.0, unit: "ულუფა", note: "ახალი", options: [] },
  { id: "limonati", cat: ["drink"], name: "ტარხუნის ლიმონათი", desc: "ქართული, ნამდვილ შაქარზე", price: 5.0, unit: "ბოთლი", options: [] },
  { id: "wine", cat: ["drink", "pop"], name: "საფერავი, ჭიქა", desc: "ქვევრის მშრალი წითელი, კახეთი", price: 12.0, unit: "ჭიქა", options: [] },
];
const byId = (id) => MENU.find((m) => m.id === id);
const OPEN_BILL = [
  { id: "ob1", name: "აჭარული ხაჭაპური", qty: 1, total: 16.0 },
  { id: "ob2", name: "ხინკალი კალმახით", qty: 7, total: 12.6 },
  { id: "ob3", name: "ღორის მწვადი", qty: 2, total: 48.0 },
  { id: "ob4", name: "სეზონური სალათი", qty: 1, total: 11.0 },
  { id: "ob5", name: "საფერავი", qty: 2, total: 24.0 },
];
const TIPS = [{ id: "t0", label: "0%", pct: 0 }, { id: "t10", label: "10%", pct: 0.1 }, { id: "t15", label: "15%", pct: 0.15 }, { id: "t20", label: "20%", pct: 0.2 }];
const METHODS = [{ id: "apple", label: "Apple Pay" }, { id: "google", label: "Google Pay" }, { id: "card", label: "ბარათით" }];
const hasRequired = (item) => (item.options || []).some((o) => o.required);

function unitPrice(item, sel) {
  let total = 0, replaced = false;
  (item.options || []).forEach((o) => {
    if (o.type === "single") { const x = o.choices.find((y) => y.id === sel[o.id]); if (x) { total += x.price; if (o.replacesBase) replaced = true; } }
    else if (o.type === "multi") { (sel[o.id] || []).forEach((id) => { const x = o.choices.find((y) => y.id === id); if (x) total += x.price; }); }
  });
  return replaced ? total : item.price + total;
}
function defaultSel(item) {
  const s = {};
  (item.options || []).forEach((o) => {
    if (o.type === "single") s[o.id] = o.def || o.choices[0].id;
    if (o.type === "scale") s[o.id] = o.def || o.choices[1].id;
    if (o.type === "multi") s[o.id] = [];
  });
  return s;
}
function selLabel(item, sel) {
  const parts = [];
  (item.options || []).forEach((o) => {
    const v = sel[o.id]; if (!v) return;
    if (o.type === "multi") v.forEach((id) => { const x = o.choices.find((y) => y.id === id); if (x) parts.push(x.label); });
    else { const x = o.choices.find((y) => y.id === v); if (x && !(o.id === "side" && x.id === "none")) parts.push(x.label); }
  });
  return parts.join(", ");
}

/* ------------------------------ shared atoms ------------------------------ */
const AVLA_LOGO =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ4AAAFACAYAAABN45K5AAAYaElEQVR42u3dfWxd93nY8ef5nXNfKJJynMSZkxQNVmdrSgfb2gzBsg29ZFFsQIesQa1DiyJpz3qh0mRplxdscNP26KRFNnRD2i1rU1OWFFkkJd+bZElbdFiWlrrosGJOvG4YxDVtYzhLG9V24tjm2z1vv2d/XNI2NkuibcriPfp+AIHwH2Euzz33e3/nuS8/PTb78IkgqH3Yl9m6iQYiJiIqqB4VLWr1Zi1P1780vzB1LIraQaczWb6S3xXH5pJE/bHZditw4RfM8tRMnHHy3BRCHRr6Fb+52Wo2bhnvpc+Jc2G/HagcMy+Bq0lu7tZX+7uSRH0UtYOT5ya7c7MPPzDUvOX+zd6zEriA8+dmCMf8/D/e+ODsFw6k2dqjQVB7W1GmpYpz3PvVXHF4X4SqWuzG7+t0Jn0UtYP5c5M/Nzf78F9v1Ifv6qWrhSr1qHw4oqgd/Pq5n/rukanFyVp96A8CVwvKshBVZclZtRWHiIqomvjdum+t3Yn8iTh23/rW6n2aux+s1/a9My82ShEXcMSry3U6k2XcWg5PnZ9+pMjT42HYCFS15NBgh6sYEzkhp08fXdWyd6D0xbPO1dXMWHJUORwiIkl3oohby+GDS1OfTdP1TzUbo6GZFRwe7HTe0WrF4W8uzn49L3uzzgXOOVcK1yvVDkc/HuNlFLWDkwt3f6yXrv3nRmM4NPOsPLAj3W5SxK3l8NTC9G/nee/nGvWRUEx48ql6OETUxjqX+s8QRX6oyHuP12rNwMw8hwk7Wnl0J8q4tRyeXDj4Lzd7z51vNEZqrFwrHw6RRBIfRR03f376O1m2EZlZLwhC43oVO2QnuuNlHMduJHVH0nz9j+r1oVCElWulwyEi0ulMlq3Wcnj6wr1fy/LesTBgWIqd6w9LRX61M7mZF/mBsiiedq7uWLlWPBz969WJYu5dD9ROLR5aSLP1f82wFC/rkiVJfBS1gzNL04/5MptSVXHOeRFWrpUOh4jI/KPHi1YrDk8uTP3zXm/1PzUaIwxLsWPbL/PPL059Oc/Tj9Xrw6GI8uRT9XCIiI13xYt43dTedJ5vPsawFC9r5bH9Mv/i1KfSdPWzjcYow9KbIBzPD0vPnbv3u2WR3mXebzgXCsNS7Dwe/Zf539xzx9N07ZF6fV9oDEurHY7tJWertRw+uDTzP4oyP1IL625rWEo8sANqY2OXLOlMZkFWHiiL7ImQYWn1wyGyNSyde6B2cuHghSzb+Fdbw1KeNbCzVcfWsPQzD099Ky/zg6rOOxcYw9KKh0NEZH7+eBG3lsP5hYP3b/ZWf7fZGOGVFuzY85+JWpy6mOcbP1Ov7QtEHOdP1cMhIibdi97ENAs2prN8809qtWbIkhM7XnlsDUtPLk7/xma69kCzMcyw9CYIhySS+Mmo486eve8ZK+yA9+W6c6EYS07sOB79Yemf3vGmf9rL1v9LozHMsLTq4dhecrZacTi/NPm/iiI9HIZ1p8KwFDvVH5Z2k4miyIq7iyL9izBo8DJ/1cMh8sInIR9cPNTOsrVPMizFy1p1bA1LT1849O2yzCfFJHdBaKxcKx6OrevVrU9CHvp4L1v9EsNSvNyVa//8mfqveZn+dC1sBiJ8Jqry4RARk/GLPo5jt15m92T55h8zLMXLfPLpr1wXpk6l6eqnh/hM1E0RDkmSxK+s3KmLi7PPlZIf8L5ccwHvLMXLiUd/WPqWOw7+szRd/b1GY4RhadXDsb3kbLXi8MGHDl0qy94/CYO6U3Xc8dihrXeWJmJZT6fyfPObtYDPRFU+HCIvDEtPLkx/PkvXk2ZjJDRhyYmdr1yjqOPOdCafKjW7y4QvkLopwrF1vdofdi1Oneilz/2HZp3rVby8lWvcWg4fPDv9aJGlc3yB1E0SDnnRsLSoNe9N842VWm0oFOFlWuz4yaeYe9cDtZNLU+d6+cav8AVSN0c4nh+Wnj79vtXSigPeF885F7LHBnZs/tHjRRS1gwfP3f0vetna1meiGJbuNeH1WHJGkQWnzun/Pnpo4Z56Y+SL5n1uZmJildwdTlVURNm5bJdWrv1v2zcNiqWZTDYfqYXNt+dFLxNVV8n3J6uIioY3dTj68dAybi2HydLEl45Mn//F/SNv/ERRpNLfVbJK7TARUfG+kCzfEDZq36WVqyQ+iu4MPrM0/b37Jh860Bga+cN9+24d8r4UreAxNjNJs3UZpE9tXLfKJd2JMo5jlyRTvzQ38/CzzoVv8L70ptVZdaiZM1WvZj/ggnDW+9Kox26uXNvBmfbk/zw8fe69YVD70TTfLEXMVef8UTU1U7FhEfkZEVcflHjoa/T/UekZx5F72u9uBI3/luc9ryp7+cQu6vXhMEvX2vMLB++OonbQ6Uzu6flB/8knqfR7OuI4Di9/44eeVheMmpUmsvc3fH8trqssbi2HMl69O/zppzeD179+qPyLx564lQ8HX6eV69YH4sbGbqvcSu4tl0f1229etWf/7OnbTHMdpD/wNRnIJN2JQrrVO6mjqG2f/vRPlMdmLzD1v86XLVX8u0xMVdQ+dF+7kHywbrvjtARAOAAQDgCEAwDhAEA4AIBwACAcAAgHAMIBgHAAAOEAQDgAEA4AhAMA4QAAwgGAcAAgHAAIBwDCAYBwAADhAEA4ABAOAIMujGNzKyudgdl9rqq7euHKTEwno07lnuROPHlRoze1TV3DiWwOVjiSRD2nJvYyFTXpSGWfMOK531rtiQ7U5sPh+2eXflhco1EUe3vzyjCsSZ71fDC69kfz88dzHk43xVpDRdQ+eHjpLc697vvT3rp5Kyuz+bTzTr3z9u3e+q0iGg7UptNegt+pBfW39LfK3qs33UQ1EBcEhdsYequIPLm9YS8PruqKWxeDpCtFkYf3DQ3VflkDkZrWK/U3Bls/S8vFzIvIYGxaH5pYrygyb5ab2d680apmIl7FZLNWbxKLm42TvCgy731ZePNhFVdWqjpQK6lQRVRVnG09he/dIytqe/f24Xre+WaqKk5E3NbPihm805qXYwEQDgCEAwDhAEA4ABAOACAcAAgHAMIBgHAAIBwAQDgAEA4AhAMA4QBAOACAcAAgHAAIBwDCAYBwACAcAEA4ABAOAIQDAOEAcPMJOQQYELa1yXhV9w4erL1jOR+x9x9R5pwLVFRqToMKJlHEW8mKA9gNSXe8FBGxsvbZvOj9vpgry7KozMbjzjv1zpsGdquZftG5YMisNJG9v3M94cBeXmuYiMj84l2XReRyVf/Kj848NLwqjYIVB7C7a3mNoo4bG4tsZaVTmRXH2JO36cqbnrK80RixdFMH6Q8jHBiIlUenI2XV/ioTUxW1D93X9gN3mcVJCYBwACAcAAgHAMIBgHAAAOEAQDgAEA4AhAMA4QAAwgGAcAAgHAAIBwDCAQCEAwDhAEA4AOxlA/edo+oKF8fmOiui8Zjd0M15Ll9+1EVRW1RLAnwdxbFV8vhun8Pf+/PzbtCewwcqHCpqtbRYSxLdK1/u6kVE5mbbGzy8r1c0YreH7u/r4qMzD631pDFQO9QNSDhUzUxEbd+qNH/r2OyFTE3VVG/owVYzFTFv5m8ry1xURXmo755WKw6TJCmOHTo/22gOT2fZZmmqlVl9qJmamq2Kq4v4fWYmg7AZ04CtOExENKjVmj/Wf3zulUCreCulKNL+f2BXRFE76HQmi7mpxb8f1JtnVF1Qqw9V8ACrmJjk+aYM0ra4AzfjyPONPbe/hpmoVuiZcG9cnkyWx+9pv1XFtUW8S9O1XLTKw/zB2hQ35ADvxoUUD/ZdzLCurHR0bu5rNek91gnD+pvTbL1UdTWOzd7BsyT21mqjdTHodCZL2/yzzzTqI+9Js41C1QUcGcIBXCEay2HSnSiOTZ//2WZ99EgvXS1UlW1KuVQBXlo7ageTnYni2OyFHw+DxqeyfKMUsYB5MysO4KVXGnHsJjuT5dGZ9l8NXe28mVfvS2V6xIoDuAJTEZEPR3cOrTv5vHPhG7Nio2SuwYoDuPJqo3UxSBL1601/qlEf/uEs3yxUiAbhAK4Yja1h6MzS/Y3G6BTDUMIBXCMacZh0J4ojU4vvrdWGP5lm64WKsNIYENQdr7koagdJ/+3k7wjqQ+e8L7x5c6oMQ1lxAC/JdKxzyQ4f/uKoqzU+71xwS+lzU+VcJBzAS9NW60SQSOLDPH2oVh8a6w9DlUsUwgG8tLi1HHS7SXF0ZumXm43R9/V6DEMHFXcaXqNobA1DD52/u1Ef/ngvXStUWWkQDuAKtoehRw8t/K1arX66KDJvZo4vPuJSBXjplYbErtOJ/Ozs2TeEtcbnVN0+7wthGEo4gCswXYnuVBGRIWsu1cKhO/KiV/KlR4QDuPJqY+u7NY7NPPxvms3Rf9Cfa/B2csIBXDEa/beTH5lZvK/RGP4IbycnHMBVRVE7SLoTxdHpC3+nHg79ZlGkpZmx0iAcwBVWGnHsOp3J8gP3tm8PgqAjIvWyLJS3kxMO4ApMV1bu1ChqB6WXh2th8/uKMmUYSjiAq6w2toahr2v4f99ojPxo/xOvDEMJB3DFaGx/0fDiB5qN0fdvMgwlHMDVbA9Dj0yfHw9r+/7dC180DMIBvNRKY2sYOjfb/v5aWL8g4p33pSpfNFxpoYiUW/9s+4tjUVVaioiK7dbu76ZJor7VWg5Vv3PBueCv5Plm1v/wmpUc72qH45Z6bV/gfSbsYVFtZj6o1/dJ3lsf3p1LlI67/fZ/G6bPPHVhZPi292xuPiON+kh9kDZPxisMh4n+Tpqv325laZSj8hempaRroVf7QxGRsbFLr/gRvr0x9Nxs+z0uCG95bu3J31aTUCTjOAMAXuKiN45jJ3KCI3FTOSFJkvjd+m2cQwAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2Lo2idjD25G18gc/NYlxkZeUp63Qmd+mr/Uzj1kW+mBgAcI0Vx9zMhZ8XDd4oUnozvpm6ypyYD8OhMM97/31+8e6z/a//e2Vf6LP9vz1yT/vddQ2OlGW2amy+dNMIReXDQ0P7X+/LXPjK0Woz89Js7pf82b/8XRE5u7Jy5yu+w5PkhMWxuMcfr/1JaPnfHh29/Ud66ao4F/BdxTdFOESe7qWr+80XZpSj2stL0cJEQlF7dhd+m51ITFT0mZ8+tPjj6xvf/aqqe1uWrXtV54x6VD4cgYqG/U1VuFSpfDz62zLuyiWFiloUtYPPLE1+79j0hamgVv+DIKiFpS8c51LVL3uBV6HTmSxbreXw5OLBr+Z573gYNAPtb/wEwgFcWbc7Ucy964HaqcVDZ9Ns9deajdHQzAqODOEArmr+0eNFO2oH8+cOfqSXrX2l0RgOzTwrD8IBXJVdGrvUf0E/z6fyvPfNMGwGZuY5NIQDuKIkSXwUddz8+env+LIXmVkaBKGJGC+xEA7gyl4Yls5+NS96x8OwEQjDUsIBXEu3O1HEreXw1OKhs1lv/Vf7w1LPsJRwANe4bOmOl3ErDh9YuPujvWztK436CK+0EA7gWtRkXLyqSL4ph/Ki980wbIQMSwkHcPVVx9aw9Exn8qnc8gMMSwkHsCPbw9LT5w59jWEp4QB2rNudKOL4/x2WMu8gHMA1L1vGy9aLh6W8s5RwANemNj4uXlQkD+QQ7ywlHMAOVx2Jn4w67syZ7WGpT10QmhnDUsIBXEWnM1nGzw9L0+O1sBGoMiwlHMC1Vh4vemdpr7fGsJRwADuNx3gZRe3g5MLBj/Z6a19pNEZCE4alhAO4KrWxrY/h5+nqoTzf/GYYMCwlHMC1Vh3Pv7P0yPPD0iAIzXhnKeEArubFw9KizOfCoMF3lhIOYAcrj+5EMTf3QO3BhYMP9VKGpYQD2KH5+bkiitrBW9/+xx/rZWu/zztLCQewA2pjnUuWJIlt+N5Ukaf/h3eWEg7g2pcskvgoaruFhXuezCWNRCwLHO8s3YvCQbvBZuL33uakKqpEeDdsD0uThyYeOTKz+P6hxv7TPitzEXNmVd2idPDOn4ELRy2su722u6CZl7LMedTv1spj652lycLEmaMzF/7myL5bfzbN1kW1om02k6LMWHFcz9VGUWYrIlaYqOoNfr3fRFXNTERH1ekdrKh3Mx79d5a+9Y7oI5cf67zJafDOwvcK1eqsOl44hzU0k7FBWnWEg5IM1UDNyo2apOO/fu7e7+6ZNaaIHZ1p/1g9qP9enqeeS5ZdO7TW6cj2qyqHqvyXfnD27BsyaTyuGoyYlSYDsGH3wJ3kLhxy/VrbDT+4UdR2IiKqnlhcx4LEcVzJ47t9Dm+f01yqALv4+EqShGtAVhwACAcAwgEAhAMA4QBAOAAQDgCEAwAIBwDCAYBwACAcAAgHABAOAIQDAOEAQDgAEA4AhAMACAcAwgGAcAAgHAAIBwAQDgC7i53c8Kr0t2ccd3JxAG7suMiJE+OlqrIzHOHAjZQkiRdJ/EDc2K5IknCfEQ7cuJWGxC6RxB+/98Lfc9L4kbLsFap7d5d1M2dBUAvTIv/y6cXJr2/ffu5JwoHXUmvcSTfxVtrs8P7XH9/sPSNOgz17c828NJqjkj37xDER+bq0xElXCAfhwI3h1nrpapHlvULE9vL5VJpKYGYp9xnhwI2m5lQ0FDHp/9yzaw5V0cC5vXs5NVBPFxwCAIQDAOEAQDgAEA4AhAMACAcAwgGAcAAgHAAIBwAQDgCEAwDhAEA4ABAOACAcAAgHAMIBgHAAqBS+rHgXqAvMzLyIeNvDe4SpqjczbybsZAbCcaN5X4bN5ogTEbeH9yQSM1+v14Ykzzaa3GsgHDdIpxN5ERGru6/m6eY/9L7Y08/kTr318g1XFuVfvvj2A4TjtV38m4jIqVOTT4vIlwf19gOE48ZcBGgUdQZm0Dw2dsn6m0UDhOOGPnN3OlJyHHCz4OVYAIQDAOEAQDgAEA4AhAMACAcAwgGAcAAgHAAIBwAQDgCEAwDhAEA4ABAOACAcAAgHAMIBgHAAIBwACAcAEA4AhAMA4QAw8AZuJ7c0S8O4tRzOrz2q8chytfY+HRdZWXnKOp1JdoW7TkwkiFvLocjjYdxavqG3Zfscvpz9eShaIxzXi4rYm9/+fU8lixNFJc/qbv9HHMeOvV2vzxlkUj6XdCcKEdkz51AcLz91+RtPDNST4ICEQ9XMxETrl7/xxMfnZi+sqamaWnVWHN4sCJthnve+niRTX4qidsDKY3fPobLMxak7MDfbfpv4MhCnNzTO2+fw5W88MWKidTETEVXCscuLTFVt1OvDJ1S0gie2iagTFzg5duj8T5xcmvyPcSsOk25S8KDfFa4sU2mEQwedqx3cW/e8SZZt9M8BVhzX5xBn2XphYlU9uX2gtTAIa0vHpxbfnZyf/tM4NpckymXLLl2q5EWvNOnZ3rpVOnCPxXAA7/2wmiuOvtKysh7ue11u/nMzMw/9XRHZFDEVUeOBvysP00A5CK9++cYh2GvPiS7I8s2i0Rj+G0NSP5Uk6uPWxYAjA8KBq8dDNeylq0WzOXr3sZml+5PuRNF/CREgHLj6dW+QZetFLdz3ycPTS/+oH4+YeIBw4Ort8N47b4U1wsa541OLfy3pJkUURVy2gHDgqpcsrvS5dy681cLa5z4QtUfGxsasPywFCAeueMnywrC0aNrpJEkYloJwYEcrj/6wtDEaHZ1Z+vmkO1HEMcNSEA5cc+WhQZqtFfXa8C/NzSy+N0l4pQWEAztoh/fmfFn4IGieOzx97geT7kQRRW0uW0A4cLVLFnGl5eZceEsYNLaGpZfMGJaCcOBalyxZvlE0asPvzBv+TJIk/gTDUhAOXHvl4cJetloMNfcfODJ9/hd4ZykIB3a88kiztaJZ3/eJwzOL70u6E0WLd5aCcOBa7fDeB0WZ+3rQPDt37+I7ut2EYSkIB651yaLqLTfngv1i9c8fPvzg6NjYJYsl5n4F4cDVLllckOe9olHbNxZko59NksRLa9yJCK+0gHDgqiuPsJeuFkPN0Z86Nnv+F7eGpVyygHBgB/HI1op6bV8y9/ywlFdaQDhwDeZ9UJaFd2Hz7JHZ8z/U5Z2lIBzYwapjawuAYH8owRc+NH1u/9jYJYtjhqUgHLh6PFye94p6fd87elp7KEkSLxcZloJw4NrxCHvZWjHU3P+TR2eWPsGwFIQDO4uHaNBL14pGfeQXjs0s3sUnaUE4sKN2mPmgKDIfBs0zRw8u3dnpTJbEA4QD17pkUe8LUReMBrXwcwxLQTiw03j8f8PSlZU7VRiWgnDgGvEIe+laMdQc/cmjsw9/cuuSZbfue6f9Ddadqgr/bo5/vLPw5olHf1haa94/N3PhkfmFyS9GUTvodCbLV/N7TWy19OWmimRmxvl0k/i/pgzrtIWwnUYAAAAASUVORK5CYII=";
function Logo({ className = "h-6" }) {
  return <img src={AVLA_LOGO} alt="Avla" className={`${className} w-auto`} style={{ display: "block" }} />;
}
function Money({ value, size = 14, weight = 500, color = c.text, style = {} }) {
  return <span style={{ ...num, fontSize: size, fontWeight: weight, color, ...style }}>{fmt(value)} ₾</span>;
}
function Amount({ value, size = 14, weight = 600, color = c.text, style = {} }) {
  const [d, setD] = useState(value);
  const prev = useRef(value);
  useEffect(() => { const a = animate(prev.current, value, { duration: 0.32, ease: [0.4, 0, 0.2, 1], onUpdate: (v) => setD(v) }); prev.current = value; return () => a.stop(); }, [value]);
  return <span style={{ ...num, fontSize: size, fontWeight: weight, color, ...style }}>{fmt(d)} ₾</span>;
}
const TableChip = () => <span className="inline-flex items-center" style={{ height: 30, padding: `0 ${SP.md}px`, borderRadius: 999, background: c.surface, color: c.text2, fontSize: 13, fontWeight: 500 }}>მაგიდა {VENUE.table}</span>;
function Header({ onBack, title, right, logo = false, bg = "rgba(255,255,255,0.82)" }) {
  return (
    <div className="sticky top-0 z-30" style={{ background: bg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
      <div className="flex items-center justify-between" style={{ height: 52, paddingLeft: SP.sm, paddingRight: SP.sm, paddingTop: "env(safe-area-inset-top)" }}>
        <div className="flex items-center min-w-0" style={{ gap: SP.xs }}>
          {onBack && <button onClick={onBack} className="grid place-items-center rounded-full active:bg-black/5" style={{ width: 44, height: 44 }}><ChevronLeft size={24} color={c.text} /></button>}
          {logo ? <div className="flex items-center" style={{ gap: SP.sm, paddingLeft: SP.sm }}><span style={{ fontSize: 18, fontWeight: 700, color: c.text }}>{VENUE.name}</span><Logo className="h-5" /></div> : <span style={{ paddingLeft: SP.sm, fontSize: 17, fontWeight: 600, color: c.text }}>{title}</span>}
        </div>
        <div style={{ paddingRight: SP.sm }}>{right}</div>
      </div>
    </div>
  );
}
function Stepper({ value, setValue, min = 1, max = 99, soft = false }) {
  return (
    <div className="inline-flex items-center" style={{ height: 40, borderRadius: 999, background: soft ? c.surface : c.bg, boxShadow: soft ? "none" : "inset 0 0 0 1px " + c.line }}>
      <button onClick={() => setValue(Math.max(min, value - 1))} className="grid place-items-center rounded-full active:bg-black/5" style={{ width: 40, height: 40 }}><Minus size={17} color={value <= min ? c.text3 : c.text} /></button>
      <span style={{ ...num, fontSize: 15, fontWeight: 600, color: c.text, minWidth: 26, textAlign: "center" }}>{value}</span>
      <button onClick={() => setValue(Math.min(max, value + 1))} className="grid place-items-center rounded-full active:bg-black/5" style={{ width: 40, height: 40 }}><Plus size={17} color={c.primary} /></button>
    </div>
  );
}
function Segmented({ options, value, onChange, id }) {
  return (
    <div className="flex" style={{ padding: SP.xs, borderRadius: R.md, background: c.surface }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} className="relative flex-1" style={{ height: 36, borderRadius: R.sm, fontSize: 13.5, fontWeight: 500, color: on ? c.text : c.text2 }}>
            {on && <motion.span layoutId={id} transition={SPRING} className="absolute inset-0" style={{ borderRadius: R.sm, background: c.bg, boxShadow: "0 1px 3px rgba(26,26,26,0.12)", zIndex: 0 }} />}
            <span className="relative z-10 grid place-items-center h-full">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
function Chip({ on, onClick, children }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} style={{ height: 44, minWidth: 56, padding: `0 ${SP.lg}px`, borderRadius: R.md, fontSize: 15, fontWeight: 600, background: on ? c.primary : c.surface, color: on ? c.onPrimary : c.text2, border: "none", flex: 1 }}>{children}</motion.button>
  );
}
function PrimaryBtn({ onClick, children, bg = c.primary, color = c.onPrimary, disabled = false }) {
  const shadow = disabled ? "none" : bg === c.primary ? "0 8px 20px -6px rgba(115,78,249,0.5)" : "0 8px 20px -8px rgba(26,26,26,0.45)";
  return (
    <motion.button whileTap={disabled ? {} : { scale: 0.98 }} onClick={disabled ? undefined : onClick} disabled={disabled}
      className="w-full flex items-center justify-center" style={{ height: BTN, borderRadius: R.lg, gap: SP.sm, fontSize: 16, fontWeight: 600, background: disabled ? "rgba(115,78,249,0.40)" : bg, color: "#fff", boxShadow: shadow }}>{children}</motion.button>
  );
}
function DockedBar({ children }) {
  return (
    <div className="absolute left-0 right-0 bottom-0 z-30" style={{ background: "rgba(245,244,250,0.86)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
      <div style={{ padding: `${SP.md}px ${PAD}px`, paddingBottom: "max(14px,env(safe-area-inset-bottom))" }}>{children}</div>
    </div>
  );
}
function Group({ title, children }) {
  return (
    <div style={{ marginTop: SP.xl }}>
      {title && <div style={{ padding: `0 ${SP.xs}px`, marginBottom: SP.sm, fontSize: 13, fontWeight: 500, color: c.text2 }}>{title}</div>}
      <div style={{ borderRadius: R.lg, overflow: "hidden", background: c.surface }}>{children}</div>
    </div>
  );
}
function Splash({ caption, table }) {
  return (
    <div className="h-full w-full grid place-items-center relative" style={{ background: c.bg }}>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col items-center" style={{ gap: SP.lg }}>
        <Logo className="h-11" />
        {table && <div className="text-center"><div style={{ fontSize: 15, fontWeight: 600, color: c.text }}>{VENUE.name}</div><div style={{ fontSize: 13, color: c.text2, marginTop: 2 }}>მაგიდა {VENUE.table}</div></div>}
      </motion.div>
      <div className="absolute left-0 right-0 flex items-center justify-center" style={{ bottom: "max(34px,env(safe-area-inset-bottom))", gap: SP.sm, color: c.text2 }}>
        <Lock size={12} /><span style={{ fontSize: 12.5 }}>{caption}</span>
      </div>
    </div>
  );
}
function Processing({ label }) {
  return (
    <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="h-full w-full grid place-items-center" style={{ background: c.bg }}>
      <div className="flex flex-col items-center" style={{ gap: SP.lg }}>
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} style={{ width: 26, height: 26, borderRadius: 13, border: `2.5px solid ${c.primarySoft}`, borderTopColor: c.primary, display: "block" }} />
        <span style={{ fontSize: 15, color: c.text2 }}>{label}</span>
      </div>
    </motion.div>
  );
}
function Shell({ bg = c.bg, children }) {
  useEffect(() => {
    const id = "avla-fonts";
    if (!document.getElementById(id)) {
      const l = document.createElement("link"); l.id = id; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,500;125,600;125,700&family=Inter:wght@300;400;500;600&family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
  }, []);
  return (
    <div className="w-full min-h-[100dvh] grid place-items-center" style={{ background: "rgba(26,26,26,0.05)", fontFamily: SANS, color: c.text }}>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}*{-webkit-tap-highlight-color:transparent}::selection{background:${c.primarySoft}}`}</style>
      <div className="relative w-full max-w-[420px] h-[100dvh] sm:h-[90dvh] sm:max-h-[900px] sm:rounded-[44px] overflow-hidden sm:border-[10px]" style={{ background: bg, borderColor: COL.ink, boxShadow: "0 30px 90px -24px rgba(0,0,0,0.4)" }}>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   PRODUCT 1. AVLA PAYMENT  (Sunday-style digital bill)
   ============================================================ */
function Avatars({ guests }) {
  const show = Math.min(guests, 5);
  return (
    <div className="flex items-center">
      {Array.from({ length: show }).map((_, i) => (
        <div key={i} className="grid place-items-center" style={{ width: 30, height: 30, borderRadius: 15, marginLeft: i ? -9 : 0, border: "2px solid #fff", background: i === 0 ? c.primary : c.primarySoft, color: i === 0 ? "#fff" : c.primary, fontSize: 11, fontWeight: 600 }}>{i === 0 ? "მე" : i + 1}</div>
      ))}
      {guests > show && <div className="grid place-items-center" style={{ width: 30, height: 30, borderRadius: 15, marginLeft: -9, border: "2px solid #fff", background: c.surface, color: c.text2, fontSize: 11, fontWeight: 600 }}>+{guests - show}</div>}
    </div>
  );
}
function ModeCard({ active, onClick, icon, title, subtitle, right, children }) {
  return (
    <motion.div whileTap={{ scale: 0.985 }} onClick={onClick} role="button"
      style={{ marginTop: SP.md, borderRadius: R.lg, background: c.bg, cursor: "pointer", boxShadow: active ? `${CARD}, 0 0 0 2px ${c.primary}` : CARD, transition: "box-shadow .2s" }}>
      <div className="flex items-center" style={{ gap: SP.md, padding: SP.lg }}>
        <div className="grid place-items-center" style={{ width: 42, height: 42, borderRadius: R.md, background: active ? c.primary : c.primarySoft, color: active ? "#fff" : c.primary, flexShrink: 0, transition: "background .2s,color .2s" }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 15.5, fontWeight: 600, color: c.text }}>{title}</div>
          <div style={{ fontSize: 12.5, color: c.text2, marginTop: 1 }}>{subtitle}</div>
        </div>
        <div className="flex items-center" style={{ gap: SP.sm }}>
          {right}
          <span className="grid place-items-center" style={{ width: 22, height: 22, borderRadius: 11, background: active ? c.primary : "transparent", border: `1.5px solid ${active ? c.primary : c.text3}`, transition: "background .2s" }}>{active && <Check size={14} color="#fff" strokeWidth={3} />}</span>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {active && children && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: `0 ${SP.lg}px ${SP.lg}px` }}>{children}</div>
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
  const time = new Date().toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" });
  const togglePick = (id) => setPicked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const payLabel = method === "apple" ? "Apple Pay" : method === "google" ? "Google Pay" : "გადახდა";

  return (
    <motion.div key="bill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full w-full flex flex-col" style={{ background: c.surface }}>
      <Header logo right={<TableChip />} bg="rgba(245,244,250,0.82)" />
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: `${SP.md}px ${PAD}px`, paddingBottom: 132 }}>

        {/* the billfold */}
        <div style={{ borderRadius: R.lg, background: c.bg, boxShadow: CARD, overflow: "hidden" }}>
          <div className="flex items-center justify-between" style={{ padding: `${SP.lg}px ${SP.lg}px ${SP.sm}px` }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: c.text2 }}>თქვენი ანგარიში</span>
            <span style={{ fontSize: 12.5, color: c.text3 }}>მაგიდა {VENUE.table}, {time}</span>
          </div>
          <div style={{ padding: `0 ${SP.lg}px ${SP.sm}px` }}>
            {bill.map((l, k) => {
              const on = picked.has(l.id);
              return (
                <motion.div key={l.id} onClick={checklist ? () => togglePick(l.id) : undefined} whileTap={checklist ? { scale: 0.99 } : {}}
                  className="flex items-center" style={{ gap: SP.md, padding: `${SP.md}px ${checklist ? SP.sm : 0}px`, marginTop: k ? 0 : 0, borderTop: k ? `1px solid ${c.div}` : "none", borderRadius: checklist ? R.md : 0, background: checklist && on ? c.primarySoft2 : "transparent", cursor: checklist ? "pointer" : "default", transition: "background .15s" }}>
                  {checklist && (
                    <motion.span animate={on ? { scale: [1, 1.18, 1] } : {}} transition={{ duration: 0.25 }} className="grid place-items-center shrink-0" style={{ width: 24, height: 24, borderRadius: 12, background: on ? c.primary : "transparent", border: `1.5px solid ${on ? c.primary : c.text3}` }}>{on && <Check size={15} color="#fff" strokeWidth={3} />}</motion.span>
                  )}
                  <span className="flex-1" style={{ fontSize: 14.5, color: c.text }}><span style={{ ...num, color: c.text2, marginRight: 6 }}>{l.qty}×</span>{l.name}</span>
                  <Money value={l.total} color={checklist && !on ? c.text2 : c.text} />
                </motion.div>
              );
            })}
          </div>
          <div style={{ height: 1, background: c.div, margin: `0 ${SP.lg}px` }} />
          <div className="flex items-center justify-between" style={{ padding: `${SP.md}px ${SP.lg}px` }}>
            <span style={{ fontSize: 14, color: c.text2 }}>{checklist ? "მონიშნული" : "სრული ანგარიში"}</span>
            <Money value={checklist ? pickedSum : subtotal} size={16} weight={600} />
          </div>
        </div>

        {/* you pay */}
        <div style={{ marginTop: SP.xl, padding: `0 ${SP.xs}px` }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: c.text2 }}>თქვენ იხდით</div>
          <div style={{ marginTop: 2 }}><Amount value={payTotal} size={46} weight={700} /></div>
        </div>

        {/* how to pay */}
        <div style={{ marginTop: SP.lg, padding: `0 ${SP.xs}px`, fontSize: 13, fontWeight: 500, color: c.text2 }}>როგორ გადაიხდით?</div>
        <ModeCard active={mode === "full"} onClick={() => setMode("full")} icon={<Wallet size={20} />} title="სრულად გადახდა" subtitle="მთელი ანგარიში"
          right={<Money value={subtotal} size={14} weight={600} color={mode === "full" ? c.text : c.text2} />} />
        <ModeCard active={mode === "equal"} onClick={() => setMode("equal")} icon={<Users size={20} />} title="თანაბრად გაყოფა" subtitle={`${guests} სტუმარი`}>
          <div style={{ height: 1, background: c.div, marginBottom: SP.md }} />
          <div className="flex items-center justify-between">
            <div onClick={(e) => e.stopPropagation()}><Avatars guests={guests} /></div>
            <div onClick={(e) => e.stopPropagation()}><Stepper value={guests} setValue={setGuests} min={2} max={12} soft /></div>
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: SP.md }}>
            <span style={{ fontSize: 14, color: c.text2 }}>თითო სტუმარი</span>
            <Money value={subtotal / guests} size={18} weight={700} color={c.primary} />
          </div>
        </ModeCard>
        <ModeCard active={mode === "item"} onClick={() => setMode("item")} icon={<ListChecks size={20} />} title="ჩემი კერძების გადახდა" subtitle="მონიშნეთ რაც შეჭამეთ"
          right={mode === "item" ? <Money value={pickedSum} size={14} weight={600} color={c.primary} /> : null}>
          <div style={{ fontSize: 12.5, color: c.text2, paddingTop: 2 }}>მონიშნეთ თქვენი კერძები ზემოთ, ანგარიშში.</div>
        </ModeCard>

        {/* tip */}
        <div style={{ marginTop: SP.xl, padding: `0 ${SP.xs}px`, fontSize: 13, fontWeight: 500, color: c.text2 }}>მადლობა მომსახურებისთვის</div>
        <div className="flex" style={{ gap: SP.sm, marginTop: SP.sm }}>
          {TIPS.map((t) => <Chip key={t.id} on={tip.mode === "pct" && tip.pct === t.pct} onClick={() => setTip((p) => ({ ...p, mode: "pct", pct: t.pct }))}>{t.label}</Chip>)}
          <Chip on={tip.mode === "custom"} onClick={() => setTip((p) => ({ ...p, mode: "custom" }))}>სხვა</Chip>
        </div>
        <AnimatePresence initial={false}>
          {tip.mode === "custom" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
              <div className="flex items-center" style={{ marginTop: SP.sm, height: 50, padding: `0 ${SP.lg}px`, borderRadius: R.md, background: c.bg, boxShadow: CARD, gap: SP.sm }}>
                <span style={{ fontSize: 15, color: c.text2 }}>დანამატი</span>
                <input inputMode="decimal" value={tip.custom} onChange={(e) => setTip((p) => ({ ...p, mode: "custom", custom: e.target.value.replace(/[^0-9.]/g, "") }))} placeholder="0.00"
                  style={{ ...num, flex: 1, textAlign: "right", border: "none", outline: "none", background: "transparent", fontSize: 17, fontWeight: 600, color: c.text }} />
                <span style={{ ...num, fontSize: 17, fontWeight: 600, color: c.text }}>₾</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {tipAmt > 0 && <div style={{ marginTop: SP.sm, padding: `0 ${SP.xs}px`, fontSize: 12.5, color: c.text2 }}>დაემატება {fmt(tipAmt)} ₾</div>}

        {/* method */}
        <div style={{ marginTop: SP.xl, padding: `0 ${SP.xs}px`, fontSize: 13, fontWeight: 500, color: c.text2 }}>გადახდის მეთოდი</div>
        <div className="flex" style={{ gap: SP.sm, marginTop: SP.sm }}>
          {METHODS.map((m) => <Chip key={m.id} on={method === m.id} onClick={() => setMethod(m.id)}>{m.label}</Chip>)}
        </div>

        {/* receipt contact, sent after payment */}
        <div style={{ marginTop: SP.xl, padding: `0 ${SP.xs}px`, fontSize: 13, fontWeight: 500, color: c.text2 }}>ქვითარი</div>
        <div className="flex items-center" style={{ marginTop: SP.sm, height: 50, padding: `0 ${SP.lg}px`, borderRadius: R.md, background: c.bg, boxShadow: CARD }}>
          <input value={receipt} onChange={(e) => setReceipt(e.target.value)} placeholder="ტელეფონი ან ელ. ფოსტა (არასავალდებულო)"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: c.text, fontFamily: SANS }} />
        </div>

        <div className="flex items-center justify-center" style={{ marginTop: SP.xl, gap: SP.sm }}><Lock size={13} color={c.text2} /><span style={{ fontSize: 13, color: c.text2 }}>უსაფრთხო გადახდა</span></div>
      </div>

      <DockedBar>
        <motion.button whileTap={blocked ? {} : { scale: 0.98 }} onClick={blocked ? undefined : () => onPay({ total: payTotal, share: shareSub, tip: tipAmt, method, mode, guests, picked: [...picked], receipt: receipt.trim() })}
          animate={{ backgroundColor: blocked ? "rgba(115,78,249,0.40)" : method === "card" ? c.primary : c.text }} transition={{ duration: 0.25 }}
          className="w-full flex items-center justify-center" style={{ height: BTN, borderRadius: R.lg, gap: SP.sm, paddingLeft: SP.xl, paddingRight: SP.xl, fontSize: 16, fontWeight: 600, color: "#fff", boxShadow: blocked ? "none" : "0 8px 22px -8px rgba(26,26,26,0.4)" }}>
          {blocked ? <span>აირჩიეთ კერძები</span> : (<><span>{payLabel}</span><Amount value={payTotal} color="#fff" style={{ marginLeft: "auto" }} /></>)}
        </motion.button>
      </DockedBar>
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
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
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between active:opacity-70" style={{ padding: `0 ${SP.lg}px`, height: 54, background: "none", border: "none" }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: c.text }}>ქვითარი № {result.code}</span>
        <ChevronDown size={18} color={c.text3} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: `0 ${SP.lg}px ${SP.lg}px` }}>
              <div style={{ height: 1, background: c.div, marginBottom: SP.sm }} />
              {lines.map((l) => (
                <div key={l.id} className="flex items-baseline justify-between" style={{ padding: `${SP.sm}px 0` }}>
                  <span style={{ fontSize: 14, color: c.text }}><span style={{ ...num, color: c.text2 }}>{l.qty}×</span> {l.name}</span>
                  <Money value={l.total} size={13.5} />
                </div>
              ))}
              <div style={{ height: 1, background: c.div, margin: `${SP.sm}px 0` }} />
              <div className="flex items-center justify-between" style={{ paddingTop: 2 }}><span style={{ fontSize: 13.5, color: c.text2 }}>თქვენი წილი</span><Money value={result.share} size={13.5} /></div>
              <div className="flex items-center justify-between" style={{ paddingTop: 6 }}><span style={{ fontSize: 13.5, color: c.text2 }}>დანამატი</span><Money value={result.tip} size={13.5} /></div>
              <div className="flex items-center justify-between" style={{ paddingTop: SP.md }}><span style={{ fontSize: 15, fontWeight: 600, color: c.text }}>გადახდილია, {methodLabel}</span><Money value={result.total} size={16} weight={700} /></div>
              {note && <div style={{ fontSize: 12.5, color: c.text2, marginTop: SP.sm }}>{note}</div>}
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
    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="relative h-full w-full flex flex-col" style={{ background: c.surface }}>
      <Confetti />
      <div className="grid place-items-center" style={{ paddingTop: SP.lg, paddingBottom: SP.sm }}><Logo className="h-6" /></div>
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: `${SP.lg}px ${PAD}px`, paddingBottom: 40 }}>
        <div className="flex flex-col items-center text-center relative" style={{ zIndex: 6, paddingTop: SP.lg }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.05 }} className="grid place-items-center" style={{ width: 78, height: 78, borderRadius: 39, background: c.success, boxShadow: "0 12px 30px -10px rgba(31,168,31,0.5)" }}>
            <Check size={40} color="#FFFFFF" strokeWidth={3} />
          </motion.div>
          <h2 style={{ ...disp, fontSize: 27, fontWeight: 700, color: c.text, marginTop: SP.lg }}>გადახდილია</h2>
          <p style={{ fontSize: 14.5, color: c.text2, marginTop: SP.xs }}>მადლობა, რომ მოგვინახულეთ</p>
          <div style={{ marginTop: SP.md }}><Amount value={result.total} size={34} weight={700} /></div>
        </div>

        {/* rating */}
        <div className="text-center" style={{ marginTop: SP.xl }}>
          <div style={{ fontSize: 14, color: c.text2 }}>როგორ შეგვაფასებთ?</div>
          <div className="flex items-center justify-center" style={{ gap: SP.sm, marginTop: SP.md }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button key={n} whileTap={{ scale: 0.8 }} onClick={() => setRating(n)} style={{ background: "none", border: "none", cursor: "pointer", color: n <= rating ? COL.orange : c.text3, lineHeight: 0 }}>
                <Star size={32} fill={n <= rating ? COL.orange : "none"} strokeWidth={1.5} />
              </motion.button>
            ))}
          </div>
          <AnimatePresence>{rating > 0 && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 13, color: c.success, marginTop: SP.sm }}>მადლობა შეფასებისთვის!</motion.div>}</AnimatePresence>
        </div>

        <div style={{ marginTop: SP.xl }}><Receipt result={result} /></div>
        <div className="text-center" style={{ marginTop: SP.lg, fontSize: 13, color: c.text3 }}>
          {result.receipt ? `ქვითარი გაიგზავნა: ${result.receipt}` : "ქვითარი ხელმისაწვდომია ზემოთ"}
        </div>

        <div className="flex items-center justify-center" style={{ marginTop: SP.xl, gap: 6, opacity: 0.65 }}>
          <span style={{ fontSize: 12, color: c.text2 }}>გთავაზობთ</span><Logo className="h-4" />
        </div>
        <p style={{ fontSize: 13, color: c.text3, marginTop: SP.lg, textAlign: "center" }}>მაგიდა {VENUE.table}, შეგიძლიათ დატოვოთ მაგიდა</p>
      </div>
    </motion.div>
  );
}
export function AvlaPayment() {
  const [screen, setScreen] = useState("splash");
  const [result, setResult] = useState(null);
  useEffect(() => { if (screen === "splash") { const t = setTimeout(() => setScreen("bill"), 1200); return () => clearTimeout(t); } }, [screen]);
  useEffect(() => { if (screen === "processing") { const t = setTimeout(() => setScreen("success"), 1200); return () => clearTimeout(t); } }, [screen]);
  const pay = (r) => { setResult({ ...r, code: "AV-" + Math.floor(2000 + Math.random() * 8000) }); setScreen("processing"); };
  return (
    <Shell bg={c.surface}>
      <AnimatePresence mode="wait">
        {screen === "splash" && <motion.div key="s" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><Splash table caption="უსაფრთხო გადახდა" /></motion.div>}
        {screen === "bill" && <ActiveBill key="b" bill={OPEN_BILL} onPay={pay} />}
        {screen === "processing" && <Processing key="pr" label="მუშავდება გადახდა" />}
        {screen === "success" && <PaySuccess key="su" result={result} />}
      </AnimatePresence>
    </Shell>
  );
}

/* ============================================================
   PRODUCT 2. AVLA MENU  (browse and send an order)
   ============================================================ */
function MenuHeader({ right }) {
  return (
    <div className="sticky top-0 z-30" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
      <div className="flex items-center justify-between" style={{ height: 52, padding: `0 ${SP.md}px`, paddingTop: "env(safe-area-inset-top)" }}>
        <div className="flex items-center" style={{ gap: SP.sm, paddingLeft: SP.sm }}><Logo className="h-6" /></div>
        <div style={{ paddingRight: SP.sm }}>{right}</div>
      </div>
      <div style={{ height: 1, background: c.line }} />
    </div>
  );
}
function Menu({ active, setActive, onOpen, onQuickAdd, cartCount, onCart }) {
  const items = useMemo(() => MENU.filter((m) => m.cat.includes(active)), [active]);
  const [added, setAdded] = useState(null);
  const quick = (it) => { onQuickAdd(it); setAdded(it.id); setTimeout(() => setAdded((a) => (a === it.id ? null : a)), 1100); };
  return (
    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full w-full flex flex-col" style={{ background: c.bg }}>
      <MenuHeader right={<TableChip />} />
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: 96 }}>
        <div style={{ padding: `${SP.lg}px ${PAD}px ${SP.md}px` }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: c.text, lineHeight: 1.1 }}>{VENUE.name}</h1>
          <p style={{ fontSize: 14.5, color: c.text2, marginTop: SP.xs }}>აირჩიეთ კერძები</p>
        </div>
        <div className="sticky z-20" style={{ top: 0, background: c.bg }}>
          <div className="no-scrollbar flex overflow-x-auto" style={{ gap: SP.sm, padding: `0 ${PAD}px ${SP.md}px` }}>
            {CHAPTERS.map((ch) => {
              const on = ch.id === active;
              return <button key={ch.id} onClick={() => setActive(ch.id)} className="shrink-0" style={{ height: 38, padding: `0 ${SP.lg}px`, borderRadius: 999, fontSize: 14, fontWeight: 500, background: on ? c.primary : c.surface, color: on ? c.onPrimary : c.text2 }}>{ch.label}</button>;
            })}
          </div>
          <div style={{ height: 1, background: c.line }} />
        </div>
        <div style={{ padding: `0 ${PAD}px` }}>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
              {items.map((it, i) => {
                const isAdded = added === it.id;
                return (
                  <div key={it.id} role="button" onClick={() => onOpen(it)} className="flex items-center cursor-pointer active:opacity-60" style={{ gap: SP.md, minHeight: 56, padding: `${SP.md}px 0`, borderBottom: i === items.length - 1 ? "none" : `1px solid ${c.line}` }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center" style={{ gap: SP.sm }}>
                        <span className="truncate" style={{ fontSize: 16, fontWeight: 600, color: c.text, lineHeight: 1.25 }}>{it.name}</span>
                        {it.note && <span className="inline-flex items-center" style={{ height: 18, padding: `0 ${SP.sm}px`, borderRadius: 999, fontSize: 11, fontWeight: 500, color: c.primary, background: c.primarySoft }}>{it.note}</span>}
                      </div>
                      <p className="truncate" style={{ fontSize: 13.5, color: c.text2, marginTop: 3 }}>{it.desc}</p>
                      <div style={{ marginTop: SP.xs }}><Money value={it.price} weight={600} /></div>
                    </div>
                    <motion.button onClick={(e) => { e.stopPropagation(); hasRequired(it) ? onOpen(it) : quick(it); }} aria-label="დამატება" whileTap={{ scale: 0.88 }}
                      className="grid place-items-center shrink-0" style={{ width: 44, height: 44, borderRadius: 22, background: isAdded ? c.primary : c.primarySoft, color: isAdded ? c.onPrimary : c.primary, transition: "background .2s" }}>
                      <AnimatePresence mode="wait" initial={false}>
                        {isAdded
                          ? <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}><Check size={21} strokeWidth={3} /></motion.span>
                          : <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.12 }}><Plus size={22} /></motion.span>}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={SPRING} className="absolute left-0 right-0 bottom-0 z-30">
            <div style={{ padding: `${SP.md}px ${PAD}px`, paddingBottom: "max(14px,env(safe-area-inset-bottom))", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: `1px solid ${c.line}` }}>
              <PrimaryBtn onClick={onCart}>
                <motion.span key={cartCount} initial={{ scale: 1.35 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} className="grid place-items-center" style={{ width: 24, height: 24, borderRadius: 12, fontSize: 12.5, fontWeight: 600, background: "rgba(255,255,255,0.22)", ...num }}>{cartCount}</motion.span>
                <span>ნახეთ შეკვეთა</span>
              </PrimaryBtn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
function ItemSheet({ item, onClose, onAdd, onAddPair }) {
  const [qty, setQty] = useState(1);
  const [sel, setSel] = useState(() => defaultSel(item));
  const unit = unitPrice(item, sel);
  const total = unit * qty;
  const pair = item.pair ? byId(item.pair) : null;
  const toggle = (oid, cid) => setSel((s) => { const cur = s[oid] || []; return { ...s, [oid]: cur.includes(cid) ? cur.filter((x) => x !== cid) : [...cur, cid] }; });
  return (
    <motion.div className="absolute inset-0 z-40 flex items-end" initial="h" animate="s" exit="h">
      <motion.div className="absolute inset-0" style={{ background: "rgba(26,26,26,0.32)" }} variants={{ h: { opacity: 0 }, s: { opacity: 1 } }} transition={{ duration: 0.25 }} onClick={onClose} />
      <motion.div variants={{ h: { y: "100%" }, s: { y: 0 } }} transition={SPRING}
        drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.4 }} onDragEnd={(e, i) => { if (i.offset.y > 120) onClose(); }}
        className="relative w-full flex flex-col" style={{ maxHeight: "90%", background: c.bg, borderTopLeftRadius: R.lg, borderTopRightRadius: R.lg }}>
        <div className="grid place-items-center shrink-0" style={{ paddingTop: SP.sm, paddingBottom: SP.xs }}><div style={{ width: 38, height: 5, borderRadius: 3, background: c.line }} /></div>
        <button onClick={onClose} className="absolute grid place-items-center active:bg-black/5" style={{ top: SP.md, right: SP.md, width: 32, height: 32, borderRadius: 16, background: c.surface }}><X size={17} color={c.text2} /></button>
        <div className="overflow-y-auto no-scrollbar" style={{ padding: `0 ${PAD}px ${SP.lg}px` }}>
          <div style={{ paddingTop: SP.sm, paddingRight: SP.xl }}>
            {item.note && <div className="inline-flex items-center" style={{ height: 18, padding: `0 ${SP.sm}px`, borderRadius: 999, fontSize: 11, fontWeight: 500, color: c.primary, background: c.primarySoft, marginBottom: SP.sm }}>{item.note}</div>}
            <h3 style={{ fontSize: 22, fontWeight: 700, color: c.text, lineHeight: 1.2 }}>{item.name}</h3>
            <p style={{ fontSize: 14.5, color: c.text2, marginTop: SP.sm, lineHeight: 1.5 }}>{item.desc}</p>
          </div>
          {(item.options || []).map((o) => (
            <div key={o.id} style={{ marginTop: SP.xl }}>
              <div className="flex items-baseline justify-between" style={{ marginBottom: SP.md }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: c.text2 }}>{o.title}</span>
                {o.required && <span style={{ fontSize: 12, fontWeight: 500, color: c.primary }}>აუცილებელი</span>}
              </div>
              {o.type === "scale" ? (
                <Segmented id={`sc-${o.id}`} value={sel[o.id]} onChange={(v) => setSel((s) => ({ ...s, [o.id]: v }))} options={o.choices.map((x) => ({ id: x.id, label: x.label }))} />
              ) : (
                <div style={{ borderRadius: R.lg, overflow: "hidden", background: c.surface }}>
                  {o.choices.map((x, k) => {
                    const on = o.type === "single" ? sel[o.id] === x.id : (sel[o.id] || []).includes(x.id);
                    return (
                      <button key={x.id} onClick={() => (o.type === "single" ? setSel((s) => ({ ...s, [o.id]: x.id })) : toggle(o.id, x.id))} className="w-full flex items-center justify-between active:bg-black/[0.02]" style={{ padding: `0 ${SP.lg}px`, height: 50, borderTop: k ? `1px solid ${c.div}` : "none" }}>
                        <span style={{ fontSize: 15, color: c.text }}>{x.label}</span>
                        <span className="flex items-center" style={{ gap: SP.md }}>
                          {x.price > 0 && <Money value={x.price} color={c.text2} />}
                          <span className="grid place-items-center" style={{ width: 22, height: 22, borderRadius: o.type === "single" ? 11 : R.sm, background: on ? c.primary : c.bg, border: `1.5px solid ${on ? c.primary : c.text3}` }}>{on && <Check size={14} color={c.onPrimary} strokeWidth={3} />}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {pair && (
            <div className="flex items-center" style={{ marginTop: SP.xl, gap: SP.md, padding: `${SP.md}px ${SP.lg}px`, borderRadius: R.lg, background: c.primarySoft }}>
              <div className="flex-1"><div style={{ fontSize: 12, fontWeight: 500, color: c.primary }}>ხშირად ემატება</div><div style={{ fontSize: 15, fontWeight: 500, color: c.text, marginTop: 2 }}>{pair.name}</div></div>
              <button onClick={() => onAddPair(pair)} className="flex items-center active:scale-95" style={{ height: 36, padding: `0 ${SP.md}px`, borderRadius: 999, gap: SP.xs, fontSize: 13.5, fontWeight: 600, background: c.primary, color: c.onPrimary }}><Plus size={15} /> {fmt(pair.price)} ₾</button>
            </div>
          )}
          <div className="flex items-center justify-between" style={{ marginTop: SP.xl }}><span style={{ fontSize: 15, fontWeight: 500, color: c.text }}>რაოდენობა</span><Stepper value={qty} setValue={setQty} soft /></div>
        </div>
        <div className="shrink-0" style={{ padding: `${SP.md}px ${PAD}px`, paddingBottom: "max(16px,env(safe-area-inset-bottom))", borderTop: `1px solid ${c.line}` }}>
          <PrimaryBtn onClick={() => onAdd(item, sel, qty, unit)}><span>დაამატეთ</span><Amount value={total} color={c.onPrimary} style={{ marginLeft: "auto" }} /></PrimaryBtn>
        </div>
      </motion.div>
    </motion.div>
  );
}
function Order({ cart, setCart, onBack, onSend, addSuggestion }) {
  const subtotal = cart.reduce((s, l) => s + l.unit * l.qty, 0);
  const setQty = (uid, q) => setCart((p) => (q <= 0 ? p.filter((l) => l.uid !== uid) : p.map((l) => (l.uid === uid ? { ...l, qty: q } : l))));
  const inCart = new Set(cart.map((l) => l.item.id));
  const suggestion = MENU.find((m) => (m.cat.includes("dessert") || m.cat.includes("drink")) && !inCart.has(m.id));
  return (
    <motion.div key="order" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.22, ease: EASE }} className="h-full w-full flex flex-col" style={{ background: c.bg }}>
      <Header onBack={onBack} title="შენი შეკვეთა" right={<TableChip />} />
      <div style={{ height: 1, background: c.line }} />
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: `${SP.lg}px ${PAD}px`, paddingBottom: 150 }}>
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center" style={{ paddingTop: 80 }}>
            <div className="grid place-items-center" style={{ width: 56, height: 56, borderRadius: 28, background: c.primarySoft, marginBottom: SP.lg }}><Plus size={26} color={c.primary} /></div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>ჯერ არაფერი დაგიმატებიათ</h3>
            <p style={{ fontSize: 14, color: c.text2, marginTop: SP.xs }}>აირჩიეთ კერძი მენიუდან.</p>
            <button onClick={onBack} className="active:scale-95" style={{ marginTop: SP.lg, height: 44, padding: `0 ${SP.xl}px`, borderRadius: 999, fontSize: 15, fontWeight: 600, background: c.primary, color: c.onPrimary }}>მენიუ</button>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {cart.map((l, i) => (
                <motion.div key={l.uid} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex items-center" style={{ gap: SP.md, padding: `${SP.md}px 0`, borderBottom: i === cart.length - 1 ? "none" : `1px solid ${c.line}` }}>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 16, fontWeight: 600, color: c.text }}>{l.item.name}</div>
                    {l.label && <div className="truncate" style={{ fontSize: 12.5, color: c.text2, marginTop: 2 }}>{l.label}</div>}
                    <div style={{ marginTop: SP.xs }}><Money value={l.unit * l.qty} weight={600} /></div>
                  </div>
                  <Stepper value={l.qty} setValue={(q) => setQty(l.uid, q)} min={0} soft />
                </motion.div>
              ))}
            </AnimatePresence>
            {suggestion && (
              <div className="flex items-center" style={{ marginTop: SP.lg, gap: SP.md, padding: `${SP.md}px ${SP.lg}px`, borderRadius: R.lg, background: c.surface }}>
                <div className="flex-1"><div style={{ fontSize: 12, fontWeight: 500, color: c.primary }}>დაამატეთ</div><div style={{ fontSize: 15, fontWeight: 500, color: c.text, marginTop: 2 }}>{suggestion.name}, <span style={num}>{fmt(suggestion.price)} ₾</span></div></div>
                <button onClick={() => addSuggestion(suggestion)} className="grid place-items-center active:scale-90" style={{ width: 40, height: 40, borderRadius: 20, background: c.primarySoft, color: c.primary }}><Plus size={21} /></button>
              </div>
            )}
            <button onClick={onBack} className="w-full text-center" style={{ marginTop: SP.lg, fontSize: 14.5, fontWeight: 500, color: c.primary }}>დაამატეთ კიდევ</button>
          </>
        )}
      </div>
      {cart.length > 0 && (
        <DockedBar>
          <div className="flex items-center justify-between" style={{ marginBottom: SP.md }}>
            <span style={{ fontSize: 15, color: c.text2 }}>ჯამი</span>
            <Amount value={subtotal} size={17} weight={700} />
          </div>
          <PrimaryBtn onClick={onSend}>გააგზავნეთ შეკვეთა</PrimaryBtn>
        </DockedBar>
      )}
    </motion.div>
  );
}
const STATUS = ["მიღებულია", "მზადდება", "მზადაა"];
function OrderSent({ order, onAgain }) {
  const [stage, setStage] = useState(0);
  useEffect(() => { const i = setInterval(() => setStage((s) => Math.min(2, s + 1)), 3000); return () => clearInterval(i); }, []);
  const time = new Date().toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" });
  return (
    <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="h-full w-full flex flex-col" style={{ background: c.bg }}>
      <div className="grid place-items-center" style={{ paddingTop: SP.md, paddingBottom: SP.sm }}><Logo className="h-6" /></div>
      <div style={{ height: 1, background: c.line }} />
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: `${SP.xl}px ${PAD}px`, paddingBottom: 110 }}>
        <div className="flex flex-col items-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.05 }} className="grid place-items-center" style={{ width: 64, height: 64, borderRadius: 32, background: c.success }}><Check size={32} color="#FFFFFF" strokeWidth={3} /></motion.div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: c.text, marginTop: SP.lg }}>შეკვეთა მიღებულია</h2>
          <p style={{ fontSize: 14.5, color: c.text2, marginTop: SP.xs }}>სამზარეულო უკვე ემზადება</p>
        </div>
        <div style={{ marginTop: SP.xl, padding: SP.lg, borderRadius: R.lg, background: c.surface }}>
          <div className="flex items-center justify-between" style={{ marginBottom: SP.md }}><span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>სტატუსი</span><span style={{ fontSize: 12.5, color: c.text2 }}>მაგიდა {VENUE.table}, {time}</span></div>
          <div className="flex items-center" style={{ gap: SP.sm }}>
            {STATUS.map((s, i) => (
              <div key={i} className="flex-1"><div style={{ height: 6, borderRadius: 3, background: i <= stage ? c.success : c.line }} /><div style={{ fontSize: 11.5, marginTop: SP.sm, fontWeight: 500, color: i <= stage ? c.text : c.text3 }}>{s}</div></div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: SP.lg }}>
          {order.map((l) => (
            <div key={l.uid} className="flex items-baseline justify-between" style={{ padding: `${SP.sm}px 0`, borderBottom: `1px solid ${c.line}` }}>
              <span style={{ fontSize: 14, color: c.text }}><span style={{ ...num, color: c.text2 }}>{l.qty}×</span> {l.item.name}</span>
              <Money value={l.unit * l.qty} size={13.5} />
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: c.text2, marginTop: SP.lg, textAlign: "center" }}>გადახდა მიმტანთან ან გადახდის QR კოდით</p>
      </div>
      <DockedBar><PrimaryBtn onClick={onAgain}>დაამატეთ კიდევ</PrimaryBtn></DockedBar>
    </motion.div>
  );
}
export function AvlaMenu() {
  const [screen, setScreen] = useState("splash");
  const [active, setActive] = useState("pop");
  const [sheetItem, setSheetItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [sentOrder, setSentOrder] = useState([]);
  useEffect(() => { if (screen === "splash") { const t = setTimeout(() => setScreen("menu"), 1100); return () => clearTimeout(t); } }, [screen]);
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const addLine = (item, sel, qty, unit) => {
    const label = selLabel(item, sel); const key = item.id + "|" + label;
    setCart((p) => { const ex = p.find((l) => l.key === key); if (ex) return p.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l)); return [...p, { uid: Math.random().toString(36).slice(2), key, item, sel, label, unit, qty }]; });
  };
  const quickAdd = (item) => addLine(item, defaultSel(item), 1, unitPrice(item, defaultSel(item)));
  const onAdd = (item, sel, qty, unit) => { addLine(item, sel, qty, unit); setSheetItem(null); };
  const send = () => { setSentOrder(cart); setCart([]); setScreen("sent"); };
  const again = () => { setActive("pop"); setScreen("menu"); };
  return (
    <Shell>
      <AnimatePresence mode="wait">
        {screen === "splash" && <motion.div key="s" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Splash caption="კეთილი იყოს თქვენი მობრძანება" /></motion.div>}
        {screen === "menu" && <Menu key="m" active={active} setActive={setActive} onOpen={setSheetItem} onQuickAdd={quickAdd} cartCount={cartCount} onCart={() => setScreen("order")} />}
        {screen === "order" && <Order key="o" cart={cart} setCart={setCart} onBack={() => setScreen("menu")} onSend={send} addSuggestion={quickAdd} />}
        {screen === "sent" && <OrderSent key="se" order={sentOrder} onAgain={again} />}
      </AnimatePresence>
      <AnimatePresence>{sheetItem && <ItemSheet item={sheetItem} onClose={() => setSheetItem(null)} onAdd={onAdd} onAddPair={quickAdd} />}</AnimatePresence>
    </Shell>
  );
}

/* ============================================================
   QR ROUTER  (default export)
     ?qr=payment -> AvlaPayment   ·   ?qr=menu / none -> AvlaMenu
   ============================================================ */
export default function AvlaApp({ product }) {
  const qr = product || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("qr") : null);
  return qr === "payment" ? <AvlaPayment /> : <AvlaMenu />;
}
