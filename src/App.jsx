import React, { useState, useEffect, useCallback } from "react";

/* ————————————————————————————————————————————————
   RECOMEÇO · 21 dias — plano alimentar pós-diverticulite
   Estética: cutouts de revista sobre base Apple-clean
   ———————————————————————————————————————————————— */

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,900;1,9..144,500&family=Caveat:wght@500;700&display=swap');
`;

const PHASES = [
  {
    id: 0, name: "Repouso", days: [1, 2], color: "#4A7BA6", paper: "#E8F0F7",
    tagline: "líquidos & descanso intestinal",
    desc: "Só líquidos claros e sopas coadas. O intestino precisa de pausa total.",
    emoji: "🫖",
  },
  {
    id: 1, name: "Suave", days: [3, 4, 5, 6, 7], color: "#B15533", paper: "#F7E9E1",
    tagline: "baixo resíduo, digestão fácil",
    desc: "Sólidos brancos e cozidos. Zero fibra dura, zero cascas, zero cru.",
    emoji: "🍚",
  },
  {
    id: 2, name: "Transição", days: [8, 9, 10, 11, 12, 13, 14], color: "#D9962E", paper: "#F9F0DC",
    tagline: "um alimento novo de cada vez",
    desc: "Reintrodução gradual: legumes cozidos inteiros, fruta sem casca, aveia.",
    emoji: "🥕",
  },
  {
    id: 3, name: "Equilíbrio", days: [15, 16, 17, 18, 19, 20, 21], color: "#6F8B62", paper: "#EAF1E6",
    tagline: "rumo à fibra que te protege",
    desc: "Aproximação ao normal. Fibra progressiva, muita água, atenção aos sinais.",
    emoji: "🥗",
  },
];

const phaseForDay = (d) => PHASES.find((p) => p.days.includes(d)) || PHASES[3];

const MEALS = [
  { key: "pa", label: "Pequeno-almoço", icon: "☕️" },
  { key: "al", label: "Almoço", icon: "🍽️" },
  { key: "ln", label: "Lanche", icon: "🍐" },
  { key: "jn", label: "Jantar", icon: "🌙" },
];

/* Menus únicos por dia — 21 dias × 4 refeições, cada dia dentro das regras da sua fase */
const DAY_MENUS = {
  // ——— Fase 1 · Repouso (líquidos) ———
  1:  { pa: "Chá de camomila + gelatina", al: "Caldo de legumes coado", ln: "Água de arroz", jn: "Sopa passada e coada (batata + cenoura)" },
  2:  { pa: "Chá de cidreira + gelatina", al: "Sopa passada e coada de abóbora", ln: "Sumo de maçã sem polpa", jn: "Caldo de galinha coado, sem gordura" },
  // ——— Fase 2 · Suave (baixo resíduo) ———
  3:  { pa: "Torrada branca + iogurte natural", al: "Arroz branco + pescada cozida + puré de cenoura", ln: "Banana madura", jn: "Sopa passada + frango grelhado + batata cozida" },
  4:  { pa: "Pão branco + ovo cozido", al: "Massa branca + peru grelhado + abóbora cozida", ln: "Maçã assada sem casca", jn: "Sopa passada + pescada cozida + arroz branco" },
  5:  { pa: "Torrada + iogurte natural + banana", al: "Arroz branco + frango desfiado + cenoura cozida", ln: "Gelatina + bolacha Maria", jn: "Sopa passada + ovos mexidos + torrada branca" },
  6:  { pa: "Papas de farinha de arroz", al: "Batata cozida + dourada grelhada + courgette sem casca", ln: "Pêra cozida", jn: "Sopa passada + peru + massa branca" },
  7:  { pa: "Iogurte natural + bolacha Maria", al: "Massa branca + pescada + puré de abóbora", ln: "Maçã cozida c/ canela", jn: "Canja de galinha (arroz, sem pele)" },
  // ——— Fase 3 · Transição (reintrodução gradual) ———
  8:  { pa: "Papas de aveia suaves + banana", al: "Arroz + frango + feijão verde cozido", ln: "Pêra crua sem casca", jn: "Sopa c/ pedaços moles + pescada + batata" },
  9:  { pa: "Torrada + queijo fresco", al: "Massa + peru + brócolos cozidos", ln: "Iogurte natural + aveia", jn: "Sopa juliana suave + omelete + arroz" },
  10: { pa: "Aveia c/ maçã ralada sem casca", al: "Batata cozida + salmão grelhado + cenoura", ln: "Banana + bolacha Maria", jn: "Sopa + frango assado sem pele + courgette" },
  11: { pa: "Pão de mistura (testar) + ovo mexido", al: "Arroz de peixe malandrinho suave", ln: "Maçã crua sem casca", jn: "Sopa + peru + puré de courgette" },
  12: { pa: "Iogurte + aveia + pêra sem casca", al: "Massa c/ atum ao natural + abóbora", ln: "Queijo fresco + bolacha Maria", jn: "Sopa + pescada no forno + batata" },
  13: { pa: "Panquecas simples de aveia + banana", al: "Frango + arroz + brócolos cozidos", ln: "Gelatina + fruta cozida", jn: "Sopa + ovos escalfados + torrada de mistura" },
  14: { pa: "Pão de mistura + queijo fresco", al: "Dourada grelhada + batata + feijão verde", ln: "Iogurte natural + banana", jn: "Canja + torrada de mistura" },
  // ——— Fase 4 · Equilíbrio (rumo ao normal) ———
  15: { pa: "Aveia + fruta fresca", al: "Arroz + frango + salada leve (alface, cenoura)", ln: "Pêra ou maçã c/ casca fina", jn: "Sopa normal + pescada + legumes variados" },
  16: { pa: "Pão de mistura + ovo + sumo natural", al: "Massa + peru + legumes cozidos", ln: "Iogurte + aveia + mel", jn: "Creme de legumes + salmão + batata-doce cozida" },
  17: { pa: "Iogurte + aveia + banana", al: "Bife de frango + arroz + salada leve", ln: "Fruta da época", jn: "Puré de grão suave (testar) + legumes cozidos + ovo" },
  18: { pa: "Torrada de mistura + queijo fresco + fruta", al: "Peixe no forno + batata + brócolos", ln: "Aveia + iogurte", jn: "Sopa + omelete de legumes + salada leve" },
  19: { pa: "Papas de aveia + pêra", al: "Arroz de frango c/ legumes", ln: "Banana + frutos da época", jn: "Creme de lentilhas suave (testar) + torrada" },
  20: { pa: "Pão de mistura + ovo mexido", al: "Massa + atum + salada mista leve", ln: "Iogurte + fruta", jn: "Sopa + peru grelhado + legumes salteados leves" },
  21: { pa: "Aveia + fruta + iogurte 🎉", al: "Peixe + arroz + legumes + salada", ln: "Fruta + frutos secos (testar, poucos)", jn: "Sopa + prato leve à tua escolha" },
};
export { DAY_MENUS };

const GUIDE = {
  0: {
    yes: [
      { e: "💧", n: "Água (1,5–2L)" }, { e: "🫖", n: "Chás suaves" },
      { e: "🥣", n: "Caldos coados" }, { e: "🍮", n: "Gelatina" },
      { e: "🍎", n: "Sumo de maçã s/ polpa" }, { e: "🍚", n: "Água de arroz" },
    ],
    no: [
      { e: "☕️", n: "Café" }, { e: "🍺", n: "Álcool" },
      { e: "🥤", n: "Bebidas c/ gás" }, { e: "🍊", n: "Citrinos" },
    ],
  },
  1: {
    yes: [
      { e: "🍚", n: "Arroz branco" }, { e: "🍝", n: "Massa branca" },
      { e: "🥔", n: "Batata s/ casca" }, { e: "🍞", n: "Pão branco" },
      { e: "🐔", n: "Frango / peru" }, { e: "🐟", n: "Peixe branco" },
      { e: "🥚", n: "Ovos" }, { e: "🥕", n: "Cenoura cozida" },
      { e: "🎃", n: "Abóbora" }, { e: "🍌", n: "Banana madura" },
      { e: "🍏", n: "Maçã cozida s/ casca" }, { e: "🥛", n: "Iogurte natural" },
    ],
    no: [
      { e: "🌾", n: "Integrais" }, { e: "🫘", n: "Leguminosas" },
      { e: "🥗", n: "Cru / saladas" }, { e: "🥜", n: "Frutos secos" },
      { e: "🌽", n: "Milho" }, { e: "🍟", n: "Fritos" },
      { e: "🌶️", n: "Picante" }, { e: "🍺", n: "Álcool" },
    ],
  },
  2: {
    yes: [
      { e: "🥦", n: "Brócolos cozidos" }, { e: "🫛", n: "Feijão verde" },
      { e: "🥣", n: "Aveia" }, { e: "🍐", n: "Fruta crua s/ casca" },
      { e: "🍞", n: "Pão de mistura (testar)" }, { e: "🧀", n: "Queijo fresco" },
    ],
    no: [
      { e: "🫘", n: "Leguminosas (ainda)" }, { e: "🥗", n: "Cru pesado" },
      { e: "🌾", n: "Integrais duros" }, { e: "🍟", n: "Fritos" },
      { e: "🌶️", n: "Picante" }, { e: "🍺", n: "Álcool" },
    ],
  },
  3: {
    yes: [
      { e: "🥗", n: "Saladas leves" }, { e: "🍎", n: "Fruta c/ casca fina" },
      { e: "🌾", n: "Integrais graduais" }, { e: "🫘", n: "Leguminosas em puré" },
      { e: "💧", n: "Muita água c/ a fibra" }, { e: "🚶", n: "Movimento diário" },
    ],
    no: [
      { e: "🍟", n: "Fritos em excesso" }, { e: "🌶️", n: "Muito picante" },
      { e: "🍺", n: "Álcool (moderar)" }, { e: "🥓", n: "Enchidos" },
    ],
  },
};

const FEELINGS = [
  { v: 3, e: "😄", l: "Ótimo" },
  { v: 2, e: "🙂", l: "Bem" },
  { v: 1, e: "😕", l: "Desconforto" },
  { v: 0, e: "😣", l: "Dor" },
];

const STORAGE_KEY = "recomeco-21d-v1";
const TODAY_ISO = () => new Date().toISOString().slice(0, 10);

/* Adaptador de storage: window.storage nos artifacts do Claude,
   localStorage num browser normal (Vercel, etc.) */
const storage = (typeof window !== "undefined" && window.storage) || {
  async get(key) {
    const v = localStorage.getItem(key);
    if (v === null) throw new Error("Key not found: " + key);
    return { key, value: v, shared: false };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },
  async delete(key) { localStorage.removeItem(key); return { key, deleted: true }; },
  async list(prefix = "") {
    return { keys: Object.keys(localStorage).filter((k) => k.startsWith(prefix)) };
  },
};

const emptyDay = () => ({ meals: {}, water: 0, feeling: null, note: "" });

/* Torn-paper clip paths (irregular edges) */
const TORN = "polygon(0% 6%, 3% 0%, 10% 4%, 18% 1%, 27% 5%, 36% 0%, 45% 4%, 55% 1%, 64% 5%, 73% 0%, 82% 4%, 90% 1%, 97% 5%, 100% 2%, 100% 94%, 96% 100%, 88% 96%, 79% 100%, 69% 95%, 59% 100%, 49% 96%, 39% 100%, 29% 95%, 19% 100%, 10% 96%, 3% 100%, 0% 95%)";

function Tape({ style }) {
  return (
    <div style={{
      position: "absolute", width: 74, height: 24,
      background: "rgba(233, 220, 160, 0.75)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      backdropFilter: "blur(1px)",
      clipPath: "polygon(2% 10%, 98% 0%, 100% 88%, 0% 100%)",
      ...style,
    }} />
  );
}

/* Ransom-note style headline: each chunk is a paper scrap */
function CutoutTitle() {
  const chunks = [
    { t: "RE", f: "'Fraunces', serif", w: 900, bg: "#1D1A17", c: "#F7F4EE", r: -3 },
    { t: "CO", f: "'Outfit', sans-serif", w: 700, bg: "#B15533", c: "#fff", r: 2 },
    { t: "ME", f: "'Fraunces', serif", w: 600, bg: "#F7F4EE", c: "#1D1A17", r: -1, i: true },
    { t: "ÇO", f: "'Outfit', sans-serif", w: 600, bg: "#6F8B62", c: "#fff", r: 3 },
  ];
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "flex-end", flexWrap: "wrap" }}>
      {chunks.map((ch, i) => (
        <span key={i} style={{
          fontFamily: ch.f, fontWeight: ch.w, fontStyle: ch.i ? "italic" : "normal",
          background: ch.bg, color: ch.c,
          fontSize: 30, lineHeight: 1, padding: "7px 9px 6px",
          transform: `rotate(${ch.r}deg)`,
          boxShadow: "0 2px 5px rgba(0,0,0,0.16)",
          border: ch.bg === "#F7F4EE" ? "1px solid #E2DCD0" : "none",
          display: "inline-block", letterSpacing: "0.02em",
        }}>{ch.t}</span>
      ))}
    </div>
  );
}

function PhaseSticker({ phase, small }) {
  return (
    <div style={{
      position: "relative", display: "inline-block",
      transform: "rotate(-2deg)",
    }}>
      <div style={{
        clipPath: TORN, background: phase.paper,
        padding: small ? "8px 14px 9px" : "12px 20px 14px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}>
        <div style={{
          fontFamily: "'Caveat', cursive", fontWeight: 700,
          fontSize: small ? 17 : 22, color: phase.color, lineHeight: 1,
        }}>
          {phase.emoji} Fase {phase.id + 1} · {phase.name}
        </div>
        {!small && (
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 11.5,
            color: "#5c564d", marginTop: 3, letterSpacing: "0.04em",
          }}>{phase.tagline}</div>
        )}
      </div>
      <Tape style={{ top: -10, left: "50%", transform: "translateX(-50%) rotate(-4deg)", width: 56, height: 18 }} />
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null); // { startDate, days: { 1: {...} } }
  const [tab, setTab] = useState("hoje");
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveFlash, setSaveFlash] = useState(false);

  /* ——— storage ——— */
  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get(STORAGE_KEY);
        if (res && res.value) {
          setData(JSON.parse(res.value));
        } else {
          setData({ startDate: TODAY_ISO(), days: {} });
        }
      } catch {
        setData({ startDate: TODAY_ISO(), days: {} });
      }
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setData(next);
    try {
      await storage.set(STORAGE_KEY, JSON.stringify(next));
      setSaveFlash(true);
      setTimeout(() => setSaveFlash(false), 900);
    } catch (e) { console.error("storage", e); }
  }, []);

  if (loading || !data) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", padding: 60, textAlign: "center", color: "#8a8378" }}>
        <style>{FONTS}</style>A preparar o teu plano…
      </div>
    );
  }

  /* ——— derived ——— */
  const start = new Date(data.startDate + "T00:00:00");
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((now - start) / 86400000) + 1;
  const currentDay = Math.min(Math.max(diffDays, 1), 21);
  const activeDay = selectedDay || currentDay;
  const phase = phaseForDay(activeDay);
  const dayData = data.days[activeDay] || emptyDay();
  const done = currentDay > 21;

  const updateDay = (patch) => {
    const next = {
      ...data,
      days: { ...data.days, [activeDay]: { ...emptyDay(), ...dayData, ...patch } },
    };
    persist(next);
  };

  const toggleMeal = (k) => updateDay({ meals: { ...dayData.meals, [k]: !dayData.meals[k] } });

  const stats = (() => {
    let mealsDone = 0, mealsTotal = 0, waterAvg = 0, waterDays = 0, feelings = [];
    for (let d = 1; d <= Math.min(currentDay, 21); d++) {
      const dd = data.days[d];
      mealsTotal += 4;
      if (dd) {
        mealsDone += Object.values(dd.meals || {}).filter(Boolean).length;
        if (dd.water > 0) { waterAvg += dd.water; waterDays++; }
        if (dd.feeling !== null && dd.feeling !== undefined) feelings.push({ d, v: dd.feeling });
      }
    }
    return {
      adherence: mealsTotal ? Math.round((mealsDone / mealsTotal) * 100) : 0,
      water: waterDays ? (waterAvg / waterDays).toFixed(1) : "—",
      feelings,
    };
  })();

  /* ——— tokens ——— */
  const S = {
    app: {
      fontFamily: "'Outfit', sans-serif",
      background: "linear-gradient(180deg, #F7F4EE 0%, #F2EDE3 100%)",
      minHeight: "100vh", color: "#1D1A17",
      maxWidth: 460, margin: "0 auto", position: "relative",
      paddingBottom: 96,
    },
    glass: {
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      borderRadius: 22, border: "1px solid rgba(255,255,255,0.85)",
      boxShadow: "0 4px 20px rgba(29,26,23,0.06)",
    },
  };

  const TabBar = () => (
    <div style={{
      position: "fixed", bottom: 14, left: "50%", transform: "translateX(-50%)",
      width: "min(432px, calc(100% - 28px))", zIndex: 50,
      ...S.glass, borderRadius: 28, padding: 6,
      display: "flex", gap: 4,
      boxShadow: "0 8px 30px rgba(29,26,23,0.14)",
    }}>
      {[
        ["hoje", "Hoje", "✓"],
        ["plano", "Plano", "▦"],
        ["guia", "Guia", "❋"],
        ["progresso", "Evolução", "↗"],
      ].map(([k, l, ic]) => (
        <button key={k} onClick={() => { setTab(k); if (k === "hoje") setSelectedDay(null); }} style={{
          flex: 1, border: "none", cursor: "pointer",
          background: tab === k ? "#1D1A17" : "transparent",
          color: tab === k ? "#F7F4EE" : "#6d675d",
          borderRadius: 22, padding: "10px 4px",
          fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12.5,
          transition: "all .25s ease", letterSpacing: "0.02em",
        }}>
          <span style={{ display: "block", fontSize: 15, marginBottom: 1 }}>{ic}</span>{l}
        </button>
      ))}
    </div>
  );

  /* ——— HOJE ——— */
  const Hoje = () => (
    <div style={{ padding: "0 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#8a8378", fontWeight: 600, marginBottom: 6 }}>
            DIA {activeDay} DE 21 {selectedDay && selectedDay !== currentDay ? "· (a ver outro dia)" : ""}
          </div>
          <PhaseSticker phase={phase} />
        </div>
        <div style={{
          fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 44,
          color: phase.color, opacity: 0.24, lineHeight: 1, transform: "rotate(4deg)",
        }}>{String(activeDay).padStart(2, "0")}</div>
      </div>

      <p style={{ fontSize: 13.5, color: "#5c564d", lineHeight: 1.5, margin: "14px 2px 20px" }}>
        {phase.desc}
      </p>

      {/* Refeições — polaroid cutout cards */}
      <div style={{ display: "grid", gap: 12 }}>
        {MEALS.map((m, i) => {
          const checked = !!dayData.meals[m.key];
          return (
            <div key={m.key} onClick={() => toggleMeal(m.key)} style={{
              ...S.glass, padding: "14px 16px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14,
              transform: `rotate(${i % 2 === 0 ? -0.4 : 0.4}deg)`,
              opacity: checked ? 0.92 : 1,
              transition: "transform .2s ease",
              position: "relative",
            }}>
              <div style={{
                width: 52, height: 52, flexShrink: 0,
                background: phase.paper, clipPath: TORN,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26,
              }}>{m.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5, textDecoration: checked ? "line-through" : "none", textDecorationColor: phase.color }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: "#6d675d", lineHeight: 1.2, marginTop: 2 }}>
                  {(DAY_MENUS[activeDay] || {})[m.key] || "—"}
                </div>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                border: checked ? "none" : "2px solid #d8d2c6",
                background: checked ? phase.color : "transparent",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 700, transition: "all .2s ease",
              }}>{checked ? "✓" : ""}</div>
            </div>
          );
        })}
      </div>

      {/* Hidratação */}
      <div style={{ ...S.glass, marginTop: 16, padding: "16px 18px", position: "relative" }}>
        <Tape style={{ top: -9, right: 24, transform: "rotate(6deg)", width: 52, height: 16 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontWeight: 600, fontSize: 14.5 }}>💧 Água</div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 17, color: "#4A7BA6" }}>
            {dayData.water}/8 copos · meta 1,5–2L
          </div>
        </div>
        <div style={{ display: "flex", gap: 7, marginTop: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <button key={i} onClick={() => updateDay({ water: dayData.water === i + 1 ? i : i + 1 })} style={{
              flex: 1, height: 38, borderRadius: 11, cursor: "pointer",
              border: "1.5px solid " + (i < dayData.water ? "#4A7BA6" : "#ddd7cb"),
              background: i < dayData.water ? "linear-gradient(180deg,#7FA8CC,#4A7BA6)" : "rgba(255,255,255,0.6)",
              fontSize: 15, transition: "all .18s ease",
            }}>{i < dayData.water ? "💧" : ""}</button>
          ))}
        </div>
      </div>

      {/* Como te sentes */}
      <div style={{ ...S.glass, marginTop: 14, padding: "16px 18px" }}>
        <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 12 }}>Como te sentes hoje?</div>
        <div style={{ display: "flex", gap: 8 }}>
          {FEELINGS.map((f) => (
            <button key={f.v} onClick={() => updateDay({ feeling: dayData.feeling === f.v ? null : f.v })} style={{
              flex: 1, padding: "10px 4px", borderRadius: 14, cursor: "pointer",
              border: "1.5px solid " + (dayData.feeling === f.v ? phase.color : "#ddd7cb"),
              background: dayData.feeling === f.v ? phase.paper : "rgba(255,255,255,0.6)",
              transition: "all .18s ease",
            }}>
              <div style={{ fontSize: 22 }}>{f.e}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "#6d675d", marginTop: 2 }}>{f.l}</div>
            </button>
          ))}
        </div>
        {dayData.feeling === 0 && (
          <div style={{
            marginTop: 12, padding: "10px 12px", borderRadius: 12,
            background: "#F7E9E1", fontSize: 12.5, lineHeight: 1.45, color: "#8a4326",
          }}>
            Dor persistente, febre, vómitos ou sangue nas fezes → fala com o teu médico ou vai à urgência. Recua uma fase na alimentação.
          </div>
        )}
      </div>

      {/* Nota */}
      <div style={{ ...S.glass, marginTop: 14, padding: "14px 18px", position: "relative" }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: "#8a8378", marginBottom: 6 }}>
          notas do dia ✎
        </div>
        <textarea
          value={dayData.note}
          onChange={(e) => setData({ ...data, days: { ...data.days, [activeDay]: { ...emptyDay(), ...dayData, note: e.target.value } } })}
          onBlur={() => persist(data)}
          placeholder="O que comeste de novo? Como reagiu o corpo?"
          style={{
            width: "100%", minHeight: 58, border: "none", outline: "none",
            background: "transparent", resize: "vertical",
            fontFamily: "'Caveat', cursive", fontSize: 19, color: "#1D1A17",
            lineHeight: 1.4,
          }}
        />
      </div>
    </div>
  );

  /* ——— PLANO (21 dias) ——— */
  const Plano = () => (
    <div style={{ padding: "0 18px" }}>
      <div style={{ marginBottom: 18 }}>
        <span style={{
          fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 500,
          fontSize: 22, background: "#1D1A17", color: "#F7F4EE",
          padding: "4px 12px 6px", display: "inline-block", transform: "rotate(-1deg)",
        }}>as 3 semanas, de relance</span>
      </div>

      {PHASES.map((p) => (
        <div key={p.id} style={{ marginBottom: 20 }}>
          <PhaseSticker phase={p} small />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 10 }}>
            {p.days.map((d) => {
              const dd = data.days[d];
              const mealsCount = dd ? Object.values(dd.meals || {}).filter(Boolean).length : 0;
              const isToday = d === currentDay;
              const isFuture = d > currentDay;
              return (
                <button key={d} onClick={() => { setSelectedDay(d); setTab("hoje"); }} style={{
                  aspectRatio: "1", borderRadius: 14, cursor: "pointer",
                  border: isToday ? `2.5px solid ${p.color}` : "1px solid rgba(255,255,255,0.9)",
                  background: mealsCount === 4 ? p.color : mealsCount > 0 ? p.paper : "rgba(255,255,255,0.72)",
                  color: mealsCount === 4 ? "#fff" : "#1D1A17",
                  opacity: isFuture ? 0.45 : 1,
                  fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14,
                  boxShadow: "0 2px 6px rgba(29,26,23,0.05)",
                  position: "relative", transition: "all .18s ease",
                }}>
                  {d}
                  {mealsCount > 0 && mealsCount < 4 && (
                    <span style={{
                      position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
                      fontSize: 8, fontWeight: 600, color: p.color,
                    }}>{mealsCount}/4</span>
                  )}
                  {dd && dd.feeling !== null && dd.feeling !== undefined && (
                    <span style={{ position: "absolute", top: 2, right: 3, fontSize: 9 }}>
                      {FEELINGS.find((f) => f.v === dd.feeling)?.e}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ ...S.glass, padding: "14px 18px", marginTop: 6 }}>
        <div style={{ fontSize: 12.5, color: "#6d675d", lineHeight: 1.5 }}>
          <strong>Início do plano:</strong> {new Date(data.startDate + "T00:00:00").toLocaleDateString("pt-PT", { day: "numeric", month: "long" })}
          <button onClick={() => {
            if (confirm("Recomeçar o plano com início hoje? Os registos mantêm-se por dia.")) {
              persist({ ...data, startDate: TODAY_ISO() });
            }
          }} style={{
            marginLeft: 10, border: "1px solid #ddd7cb", background: "transparent",
            borderRadius: 10, padding: "3px 10px", fontSize: 11.5, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif", color: "#8a8378",
          }}>reiniciar hoje</button>
        </div>
      </div>
    </div>
  );

  /* ——— GUIA ——— */
  const [guidePhase, setGuidePhase] = [tab === "guia" ? (data._gp ?? phase.id) : phase.id, (v) => setData({ ...data, _gp: v })];
  const gp = PHASES[guidePhase];
  const Guia = () => (
    <div style={{ padding: "0 18px" }}>
      {/* Apple segmented control */}
      <div style={{
        display: "flex", background: "rgba(29,26,23,0.06)", borderRadius: 16,
        padding: 4, marginBottom: 20, gap: 2,
      }}>
        {PHASES.map((p) => (
          <button key={p.id} onClick={() => setGuidePhase(p.id)} style={{
            flex: 1, border: "none", cursor: "pointer", borderRadius: 12,
            padding: "9px 2px", fontFamily: "'Outfit', sans-serif",
            fontWeight: 600, fontSize: 12,
            background: guidePhase === p.id ? "#fff" : "transparent",
            color: guidePhase === p.id ? p.color : "#8a8378",
            boxShadow: guidePhase === p.id ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            transition: "all .2s ease",
          }}>{p.emoji} F{p.id + 1}</button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}><PhaseSticker phase={gp} /></div>

      <div style={{
        fontFamily: "'Caveat', cursive", fontSize: 21, color: "#6F8B62",
        margin: "18px 2px 10px", transform: "rotate(-0.5deg)",
      }}>✓ pode entrar no prato</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {GUIDE[gp.id].yes.map((f, i) => (
          <div key={i} style={{
            background: "#fff", clipPath: TORN, padding: "16px 8px 14px",
            textAlign: "center", transform: `rotate(${(i % 3) - 1}deg)`,
            boxShadow: "0 2px 6px rgba(29,26,23,0.07)",
          }}>
            <div style={{ fontSize: 30 }}>{f.e}</div>
            <div style={{ fontSize: 11, fontWeight: 600, marginTop: 5, lineHeight: 1.25, color: "#3d382f" }}>{f.n}</div>
          </div>
        ))}
      </div>

      <div style={{
        fontFamily: "'Caveat', cursive", fontSize: 21, color: "#B15533",
        margin: "24px 2px 10px", transform: "rotate(0.5deg)",
      }}>✗ fica de fora, por agora</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {GUIDE[gp.id].no.map((f, i) => (
          <div key={i} style={{
            background: "#F1EBE0", clipPath: TORN, padding: "16px 8px 14px",
            textAlign: "center", transform: `rotate(${((i + 1) % 3) - 1}deg)`,
            opacity: 0.85, position: "relative",
          }}>
            <div style={{ fontSize: 30, filter: "grayscale(0.55)" }}>{f.e}</div>
            <div style={{ fontSize: 11, fontWeight: 600, marginTop: 5, lineHeight: 1.25, color: "#8a8378", textDecoration: "line-through", textDecorationColor: "#B15533" }}>{f.n}</div>
          </div>
        ))}
      </div>

      <div style={{ ...S.glass, marginTop: 22, padding: "14px 18px", position: "relative" }}>
        <Tape style={{ top: -9, left: 20, transform: "rotate(-5deg)", width: 50, height: 16 }} />
        <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "#5c564d" }}>
          <strong style={{ color: "#1D1A17" }}>Regra de ouro:</strong> um alimento novo de cada vez, e escuta o corpo nas 24h seguintes. Se a dor voltar, recua uma fase. Plano orientador — as indicações do teu médico têm sempre prioridade.
        </div>
      </div>
    </div>
  );

  /* ——— PROGRESSO ——— */
  const Progresso = () => (
    <div style={{ padding: "0 18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { big: `${Math.min(currentDay, 21)}`, small: "dias de plano", c: "#1D1A17" },
          { big: `${stats.adherence}%`, small: "refeições registadas", c: "#B15533" },
          { big: stats.water, small: "copos de água / dia", c: "#4A7BA6" },
          { big: `F${phase.id + 1}`, small: `fase atual · ${phase.name.toLowerCase()}`, c: phase.color },
        ].map((s, i) => (
          <div key={i} style={{ ...S.glass, padding: "18px 16px", transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 34, color: s.c, lineHeight: 1 }}>{s.big}</div>
            <div style={{ fontSize: 11.5, color: "#8a8378", marginTop: 6, fontWeight: 500 }}>{s.small}</div>
          </div>
        ))}
      </div>

      {/* Feeling timeline */}
      <div style={{ ...S.glass, padding: "18px", position: "relative" }}>
        <Tape style={{ top: -9, right: 30, transform: "rotate(5deg)", width: 54, height: 16 }} />
        <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 14 }}>Como te tens sentido</div>
        {stats.feelings.length === 0 ? (
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: "#8a8378" }}>
            Regista como te sentes no separador «Hoje» e a linha aparece aqui ✎
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 90 }}>
            {Array.from({ length: Math.min(currentDay, 21) }).map((_, i) => {
              const f = stats.feelings.find((x) => x.d === i + 1);
              const h = f ? 20 + f.v * 22 : 6;
              const col = f ? ["#B15533", "#D9962E", "#9BAF8E", "#6F8B62"][f.v] : "#E5DFD3";
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: "100%", maxWidth: 14, height: h, background: col, borderRadius: 5, transition: "height .3s ease" }} />
                  {(i + 1) % 7 === 0 || i === 0 ? <div style={{ fontSize: 8, color: "#8a8378" }}>{i + 1}</div> : <div style={{ fontSize: 8 }}>&nbsp;</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {done && (
        <div style={{ marginTop: 18, textAlign: "center", padding: "22px 16px", background: "#EAF1E6", clipPath: TORN }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 22, color: "#6F8B62" }}>21 dias completos 🎉</div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 19, color: "#5c564d", marginTop: 4 }}>
            agora: fibra, água e movimento — a melhor prevenção
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={S.app}>
      <style>{FONTS + `
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        button:focus-visible, textarea:focus-visible { outline: 2px solid #B15533; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        textarea::placeholder { color: #b5aea0; font-family: 'Caveat', cursive; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "26px 18px 18px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <CutoutTitle />
            <div style={{
              fontFamily: "'Caveat', cursive", fontSize: 19, color: "#8a8378",
              marginTop: 9, transform: "rotate(-0.8deg)",
            }}>
              21 dias para o intestino voltar ao normal · Bruno
            </div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600, color: saveFlash ? "#6F8B62" : "transparent",
            transition: "color .3s ease", paddingTop: 8, letterSpacing: "0.06em",
          }}>GUARDADO ✓</div>
        </div>
      </div>

      {tab === "hoje" && Hoje()}
      {tab === "plano" && Plano()}
      {tab === "guia" && Guia()}
      {tab === "progresso" && Progresso()}

      {TabBar()}
    </div>
  );
}
