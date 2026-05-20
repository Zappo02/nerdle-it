import { useState, useEffect, useCallback } from "react";

// ─── DATABASE ────────────────────────────────────────────────────────────────
// 250 equazioni da 7 caratteri + 223 da 8 caratteri = 473 giorni senza ripetizioni
// Tutte verificate: lunghezza esatta, matematicamente corrette, nessun duplicato

const EQS7 = [
  "10×3=30","11+8=19","11×8=88","12×6=72","13-3=10","14×7=98","15-12=3","16+6=22",
  "17-11=6","18-10=8","18-3=15","18-8=10","19+3=22","19-6=13","2+10=12","2+19=21",
  "2+29=31","2+33=35","2+34=36","2+39=41","2+83=85","2+9-2=9","2+91=93","2+93=95",
  "2-3+8=7","20+9=29","20-6=14","20÷2=10","22+8=30","22-3=19","24×2=48","25-16=9",
  "25-20=5","26-5=21","27+4=31","27-8=19","28-22=6","28-8=20","2×10=20","2×48=96",
  "2×5-4=6","2×5-5=5","2÷4×8=4","3+10=13","3+30=33","3+32=35","3+7-7=3","3+75=78",
  "3+8-8=3","3-4+9=8","32+9=41","32-5=27","34+4=38","34+7=41","36-29=7","37+9=46",
  "37-4=33","37-5=32","38-8=30","39-33=6","3×4-4=8","3×7÷7=3","3÷3+4=5","3÷3+6=7",
  "3÷6×6=3","4+21=25","4+31=35","4+37=41","4+38=42","4+50=54","4+62=66","4+8÷8=5",
  "4-3+7=8","4-3+8=9","4-6+9=7","40+8=48","41-34=7","42+8=50","42-33=9","42÷2=21",
  "43+4=47","43-37=6","44-36=8","45-38=7","46+7=53","46-8=38","47-41=6","48+8=56",
  "48-40=8","48÷12=4","49-41=8","49-9=40","4×14=56","4×3-6=6","4×3-8=4","4×4-9=7",
  "4×9÷6=6","5+17=22","5+21=26","5+2×2=9","5+44=49","5+9-5=9","5+9-6=8","5+92=97",
  "5-6+9=8","50+5=55","50÷10=5","51+3=54","51-44=7","51÷3=17","52-44=8","52-7=45",
  "53-5=48","54-7=47","54÷18=3","55-2=53","55-7=48","55-8=47","57-49=8","57÷3=19",
  "58+4=62","58-49=9","58-50=8","58-5=53","59+5=64","5×2-2=8","5÷5×7=7","6+33=39",
  "6+5-7=4","6+60=66","6+63=69","6+87=93","6+8÷4=8","6+8÷8=7","6-5+8=9","6-8÷4=4",
  "60+2=62","60+6=66","60+7=67","60÷15=4","61-5=56","62+9=71","62-56=6","62-8=54",
  "63+8=71","63-2=61","64+3=67","64-60=4","65-8=57","65-9=56","66+5=71","67+8=75",
  "68÷2=34","69+4=73","69-66=3","69÷3=23","6×2-4=8","6×7÷7=6","6×8÷8=6","6÷4×6=9",
  "6÷6×4=4","7+25=32","7+29=36","7+43=50","7+63=70","7+8-9=6","7+84=91","7-2+2=7",
  "7-4+3=6","7-5+7=9","7-6÷2=4","7-7+8=8","7-8+5=4","7-9÷3=4","70-63=7","70÷10=7",
  "71-7=64","72+8=80","72-6=66","74+2=76","74-66=8","76+8=84","77+3=80","77-68=9",
  "77-74=3","78-9=69","79+5=84","79-2=77","79-76=3","7÷7+5=6","8+14=22","8+15=23",
  "8+3-5=6","8+39=47","8+4-5=7","8+41=49","8+4÷4=9","8+6-6=8","8+62=70","8+74=82",
  "8+8-7=9","8+88=96","8-2÷2=7","8-4÷2=6","8-5+2=5","8-6+2=4","8-9÷9=7","80-72=8",
  "82÷2=41","83+2=85","83-2=81","83-4=79","83-5=78","83-6=77","84-79=5","84÷3=28",
  "85-5=80","85-82=3","87-4=83","88+3=91","88÷22=4","8×11=88","8×3÷4=6","8÷8+7=8",
  "8÷9×9=8","9+26=35","9+27=36","9+53=62","9+61=70","9-3+3=9","9-7+7=9","91-86=5",
  "92+3=95","92+6=98","92-6=86","93+2=95","93-89=4","95-2=93","95-90=5","96-8=88",
  "96÷12=8","96÷3=32","98-6=92","98-94=4","99-91=8","99-92=7","99-93=6","9×4÷4=9",
  "9÷5×5=9","9÷9+7=8",
];

const EQS8 = [
  "10+17=27","10+43=53","10-2-4=4","10-9+4=5","10-9+8=9","10×2÷4=5","11+3-8=6","11-2-3=6",
  "12+15=27","12+57=69","12-4-2=6","12-5+2=9","12-8+3=7","13+78=91","13-8+3=8","14+54=68",
  "14+73=87","14+74=88","14÷2-4=3","14÷7+6=8","15+27=42","15+37=52","15+39=54","15+61=76",
  "15-6×2=3","16+63=79","16+76=92","16÷4+3=7","16÷4+5=9","17+76=93","17-5-9=3","19+38=57",
  "2+2+7=11","2+3×6=20","2-7+12=7","20+30=50","20-5-9=6","20÷2-3=7","22+24=46","22+44=66",
  "22-8×2=6","23+22=45","23+46=69","23+69=92","23-7-8=8","24+43=67","24+58=82","24÷2÷3=4",
  "25+27=52","25+53=78","25÷5-2=3","26+12=38","27÷3-5=4","27÷9×2=6","28-8×3=4","29+18=47",
  "29-6×4=5","2×4×5=40","2×7+5=19","2×9-10=8","2÷4×10=5","2÷6×15=5","30+31=61","31+22=53",
  "31+47=78","32+24=56","32+35=67","32+60=92","32-17=15","34+26=60","34+46=80","35+18=53",
  "35+26=61","36+44=80","36+54=90","36-12=24","37+34=71","38+49=87","38+57=95","38-20=18",
  "39+22=61","3×5×3=45","3×6+8=26","3×7-16=5","3×7×4=84","3×9-24=3","4+10-8=6","4+14÷7=6",
  "4+7+2=13","4+8×5=44","40+10=50","40-28=12","40-30=10","42-31=11","44+14=58","44+54=98",
  "45+25=70","45-19=26","45-33=12","45-34=11","46+18=64","46-11=35","48-15=33","48-21=27",
  "49+43=92","49+47=96","4×5-16=4","4×6+3=27","4×8-23=9","4÷2×5=10","4÷8×10=5","5+2×4=13",
  "5+4×9=41","5+7+2=14","50+44=94","51-15=36","51-22=29","53+30=83","53-14=39","53-32=21",
  "55+22=77","56+16=72","56-15=41","57+39=96","58+27=85","58-12=46","5×3×5=75","5×5+3=28",
  "5×8-7=33","5×8×2=80","5×8÷10=4","5×9+7=52","6+2+9=17","6+2×4=14","6+4+8=18","6+9+2=17",
  "6+9×8=78","6-4+9=11","60-14=46","61-30=31","62+19=81","62+24=86","62-18=44","62-20=42",
  "63-24=39","66+20=86","66-44=22","66-50=16","68+22=90","68+30=98","68-19=49","68-38=30",
  "69-27=42","6×2+2=14","6×3-11=7","6×4-3=21","7+3×9=34","7+9×7=70","7+9÷3=10","7-12+8=3",
  "7-4+7=10","70+25=95","71+10=81","72-12=60","72-44=28","72-50=22","74-31=43","75+11=86",
  "76-10=66","76-64=12","77-67=10","78-12=66","7×2+5=19","7×6÷3=14","7×7-4=45","7÷14×6=3",
  "8+6×2=20","8+7-10=5","8-4+9=13","81-54=27","82-43=39","82-44=38","82-54=28","82-70=12",
  "84-53=31","85-34=51","85-51=34","86-66=20","87-10=77","87-49=38","88-40=48","88-45=43",
  "8×4+4=36","8×8-3=61","8÷24×9=3","8÷4×9=18","9+5+2=16","9+6-3=12","9+9+5=23","90-23=67",
  "90-57=33","91-18=73","92-33=59","92-46=46","92-47=45","93-63=30","95-67=28","95-72=23",
  "95-82=13","96-25=71","96-27=69","96-79=17","97-56=41","97-59=38","99-36=63","99-63=36",
  "99-71=28","9×4-27=9","9×4-4=32","9×5+3=48","9×5÷15=3","9×6-8=46","9×7-3=60",
];

// ─── COSTANTI ─────────────────────────────────────────────────────────────────

const ALL = [...EQS7, ...EQS8];
const MAX_TENTATIVI = 6;
const STORAGE_KEY = "nerdle_it_v1";

// Epoch: 1 gennaio 2026. Ogni giorno avanza di 1 indice, ciclo a 473.
const EPOCH = new Date("2026-01-01T00:00:00+01:00");

// ─── UTILITY ──────────────────────────────────────────────────────────────────

function getDailyTarget() {
  const todayStr = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Rome" })
    .format(new Date()); // "YYYY-MM-DD"
  const today = new Date(todayStr + "T00:00:00+01:00");
  const days = Math.floor((today - EPOCH) / 86400000);
  const idx = ((days % ALL.length) + ALL.length) % ALL.length;
  return ALL[idx];
}

function getItalianDate() {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

function validateEquation(eq) {
  const parts = eq.split("=");
  if (parts.length !== 2) return false;
  try {
    const expr = parts[0].replace(/×/g, "*").replace(/÷/g, "/");
    // eslint-disable-next-line no-new-func
    const val = Function('"use strict"; return (' + expr + ")")();
    return Math.abs(val - parseFloat(parts[1])) < 0.001 && isFinite(val);
  } catch {
    return false;
  }
}

function computeFeedback(guess, target) {
  const n = target.length;
  const result = Array(n).fill("absent");
  const used = Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    if (guess[i] === target[i]) { result[i] = "correct"; used[i] = true; }
  }
  for (let i = 0; i < n; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < n; j++) {
      if (!used[j] && guess[i] === target[j]) {
        result[i] = "present"; used[j] = true; break;
      }
    }
  }
  return result;
}

function buildShareText(target, guesses, status, date) {
  const n = guesses.length;
  const won = status === "won";
  let text = `Nerdle·IT ${date}\n${won ? n : "X"}/${MAX_TENTATIVI} (${target.length} caratteri)\n\n`;
  guesses.forEach((g) => {
    const fb = computeFeedback(g, target);
    text += fb.map((f) => (f === "correct" ? "🟩" : f === "present" ? "🟨" : "⬛")).join("") + "\n";
  });
  text += "\nuniversosportivo.com/nerdle";
  return text;
}

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}

function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
  catch { /* storage non disponibile */ }
}

// ─── STILI INLINE ─────────────────────────────────────────────────────────────
// Tutto inline per garantire portabilità senza CSS modules o Tailwind

const S = {
  root: {
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    background: "#0d0f0c",
    color: "#d1fae5",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px 8px 32px",
    position: "relative",
    overflow: "hidden",
  },
  scanlines: {
    position: "fixed",
    inset: 0,
    background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  inner: { position: "relative", zIndex: 1, width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", alignItems: "center" },
  header: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #2a3028", paddingBottom: 10, marginBottom: 12 },
  logo: { fontFamily: "'Share Tech Mono', 'Courier New', monospace", fontSize: 22, color: "#4ade80", letterSpacing: 2 },
  logoSpan: { color: "#fbbf24" },
  stat: { fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#6b7280", textAlign: "right", lineHeight: 1.6 },
  statStrong: { color: "#34d399" },
  badge: { fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#6b7280", letterSpacing: 1, marginBottom: 6, alignSelf: "flex-start" },
  grid: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14, width: "100%" },
  row: { display: "flex", gap: 5, justifyContent: "center" },
  cell: (state) => ({
    width: 46, height: 46,
    border: `1px solid ${
      state === "correct" ? "#4ade80" :
      state === "present" ? "#fbbf24" :
      state === "absent"  ? "#4b5563" :
      state === "active"  ? "#3a4a38" :
      state === "filled"  ? "#34d399" :
      state === "eqfix"   ? "#2a3a50" :
      "#2a3028"
    }`,
    borderRadius: 4,
    background:
      state === "correct" ? "#1a3d27" :
      state === "present" ? "#3d3010" :
      state === "absent"  ? "#1f2320" :
      state === "eqfix"   ? "#0d1a2a" :
      "#1a1e18",
    color:
      state === "correct" ? "#4ade80" :
      state === "present" ? "#fbbf24" :
      state === "absent"  ? "#4b5563" :
      state === "eqfix"   ? "#6baed6" :
      "#d1fae5",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 21,
    transition: "transform 0.08s, border-color 0.15s",
    transform: state === "filled" ? "scale(1.05)" : "scale(1)",
    userSelect: "none",
  }),
  msg: { height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: "#fbbf24", letterSpacing: 1, marginBottom: 8, minWidth: 300, textAlign: "center" },
  kbd: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 },
  kbdRow: { display: "flex", gap: 5, justifyContent: "center" },
  key: (ks) => ({
    height: 44, minWidth: 38, padding: "0 8px",
    border: `1px solid ${ks === "correct" ? "#4ade80" : ks === "present" ? "#fbbf24" : ks === "absent" ? "#222" : "#2a3028"}`,
    borderRadius: 4,
    background: ks === "correct" ? "#1a3d27" : ks === "present" ? "#3d3010" : ks === "absent" ? "#111" : "#141710",
    color: ks === "correct" ? "#4ade80" : ks === "present" ? "#fbbf24" : ks === "absent" ? "#333" : "#d1fae5",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 16,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.1s",
    userSelect: "none",
    WebkitUserSelect: "none",
  }),
  keyWide: { minWidth: 60, fontSize: 12, letterSpacing: 0.5 },
  endgame: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 4 },
  solution: (won) => ({ fontFamily: "'Share Tech Mono', monospace", fontSize: 20, color: won ? "#4ade80" : "#f87171", letterSpacing: 3 }),
  btn: { height: 40, padding: "0 20px", border: "1px solid #34d399", borderRadius: 4, background: "transparent", color: "#34d399", fontFamily: "'Share Tech Mono', monospace", fontSize: 13, cursor: "pointer", letterSpacing: 1 },
  next: { fontSize: 11, color: "#6b7280", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 },
  archive: { width: "100%", marginTop: 16 },
  archTitle: { fontSize: 10, color: "#6b7280", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, marginBottom: 6 },
  archList: { display: "flex", gap: 8, flexWrap: "wrap" },
  archItem: { fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#6b7280", background: "#141710", border: "1px solid #2a3028", borderRadius: 3, padding: "3px 8px" },
  copied: { fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#6b7280" },
  googleFont: `@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Outfit:wght@400;500;600&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0d0f0c; }
@keyframes flip { 0%{transform:scaleY(1)} 50%{transform:scaleY(0)} 100%{transform:scaleY(1)} }
@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
@keyframes bounce { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-10px) scale(1.1)} 70%{transform:translateY(-4px) scale(1.05)} }
.cell-flip { animation: flip 0.35s ease forwards; }
.cell-shake { animation: shake 0.4s ease; }
.cell-bounce { animation: bounce 0.3s ease; }`,
};

// ─── COMPONENTE PRINCIPALE ────────────────────────────────────────────────────

export default function NerdleIT() {
  const TARGET = getDailyTarget();
  const LEN = TARGET.length;
  const TODAY = getItalianDate();

  // Inizializza stato da localStorage
  const [gameState, setGameState] = useState(() => {
    const saved = loadState();
    if (saved.date !== TODAY) {
      return { date: TODAY, guesses: [], status: "playing", archive: saved.archive || [] };
    }
    return saved;
  });

  const [input, setInput] = useState([]);
  const [message, setMessage] = useState("");
  const [animating, setAnimating] = useState(false);
  const [shakeRow, setShakeRow] = useState(false);
  const [flippingRow, setFlippingRow] = useState(null); // indice riga in flip
  const [bouncingRow, setBouncingRow] = useState(null);
  const [copied, setCopied] = useState(false);

  // Salva su localStorage a ogni cambio
  useEffect(() => { saveState(gameState); }, [gameState]);

  // Keydown fisico
  useEffect(() => {
    const handler = (e) => {
      if (gameState.status !== "playing" || animating) return;
      if (e.key === "Backspace") { handleKey("DEL"); return; }
      if (e.key === "Enter") { handleKey("INVIO"); return; }
      if ("0123456789".includes(e.key)) { handleKey(e.key); return; }
      if ("+-=".includes(e.key)) { handleKey(e.key); return; }
      if (e.key === "*") { handleKey("×"); return; }
      if (e.key === "/") { e.preventDefault(); handleKey("÷"); return; }
      if (e.key === "x" || e.key === "X") { handleKey("×"); return; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // Comunicazione altezza iframe a WordPress
  useEffect(() => {
    const sendHeight = () => {
      const h = document.body.scrollHeight;
      window.parent?.postMessage({ type: "nerdle-height", height: h }, "*");
    };
    sendHeight();
    const ro = new ResizeObserver(sendHeight);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  const showMessage = useCallback((txt, duration = 2000) => {
    setMessage(txt);
    if (duration > 0) setTimeout(() => setMessage(""), duration);
  }, []);

  const handleKey = useCallback((k) => {
    if (gameState.status !== "playing" || animating) return;
    if (k === "DEL") {
      setInput((prev) => prev.slice(0, -1));
      return;
    }
    if (k === "INVIO") {
      submitGuess();
      return;
    }
    setInput((prev) => prev.length < LEN ? [...prev, k] : prev);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.status, animating, input, LEN]);

  const submitGuess = () => {
    const guess = input.join("");
    if (guess.length < LEN) {
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 400);
      showMessage(`Troppo corta (${guess.length}/${LEN})`);
      return;
    }
    if (!guess.includes("=")) {
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 400);
      showMessage("Manca il simbolo =");
      return;
    }
    if (!validateEquation(guess)) {
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 400);
      showMessage("Equazione matematicamente errata");
      return;
    }

    const rowIdx = gameState.guesses.length;
    setAnimating(true);
    setFlippingRow(rowIdx);
    setInput([]);

    const won = guess === TARGET;
    const newGuesses = [...gameState.guesses, guess];
    const lost = !won && newGuesses.length >= MAX_TENTATIVI;

    setTimeout(() => {
      setFlippingRow(null);
      setAnimating(false);

      const newArchive = [...(gameState.archive || [])];
      if (!newArchive.find((a) => a.date === TODAY)) {
        newArchive.push({ date: TODAY, eq: TARGET, result: won ? "won" : lost ? "lost" : "playing", att: newGuesses.length });
        if (newArchive.length > 7) newArchive.shift();
      }

      setGameState((prev) => ({
        ...prev,
        guesses: newGuesses,
        status: won ? "won" : lost ? "lost" : "playing",
        archive: newArchive,
      }));

      if (won) {
        setBouncingRow(rowIdx);
        setTimeout(() => setBouncingRow(null), 500);
        showMessage("🎯 Esatto!", 0);
      } else if (lost) {
        showMessage("Soluzione: " + TARGET, 0);
      }
    }, LEN * 60 + 400);
  };

  // Calcola stati tastiera
  const keyStates = {};
  gameState.guesses.forEach((g) => {
    const fb = computeFeedback(g, TARGET);
    g.split("").forEach((ch, i) => {
      const cur = keyStates[ch], next = fb[i];
      if (!cur) keyStates[ch] = next;
      else if (cur === "correct") return;
      else if (next === "correct") keyStates[ch] = "correct";
      else if (next === "present") keyStates[ch] = "present";
    });
  });

  const handleShare = async () => {
    const text = buildShareText(TARGET, gameState.guesses, gameState.status, TODAY);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback per iOS/browser senza clipboard API
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ─── RENDER GRIGLIA ──────────────────────────────────────────────────────────

  const renderGrid = () => {
    const rows = [];
    for (let r = 0; r < MAX_TENTATIVI; r++) {
      const isCurrentRow = r === gameState.guesses.length && gameState.status === "playing";
      const isFlipping = flippingRow === r;
      const isBouncing = bouncingRow === r;
      const isShaking = shakeRow && isCurrentRow;
      const guess = gameState.guesses[r];
      const feedback = guess ? computeFeedback(guess, TARGET) : null;

      const cells = [];
      for (let c = 0; c < LEN; c++) {
        let cellState = "empty";
        let char = "";

        if (guess) {
          char = guess[c];
          cellState = isFlipping ? "filled" : (feedback[c] === "correct" && TARGET[c] === "=" ? "eqfix" : feedback[c]);
          // dopo il flip, = in posizione giusta resta eqfix ma con sfondo verde
          if (!isFlipping && feedback[c] === "correct" && TARGET[c] === "=") cellState = "correct";
        } else if (isCurrentRow) {
          char = input[c] || "";
          cellState = char ? "filled" : "active";
        }

        const animClass = isFlipping ? "cell-flip" : isBouncing ? "cell-bounce" : isShaking ? "cell-shake" : "";

        cells.push(
          <div
            key={c}
            className={animClass}
            style={{
              ...S.cell(cellState),
              animationDelay: isFlipping ? `${c * 60}ms` : isBouncing ? `${c * 80}ms` : "0ms",
            }}
          >
            {char}
          </div>
        );
      }

      rows.push(
        <div key={r} style={S.row}>{cells}</div>
      );
    }
    return rows;
  };

  // ─── RENDER TASTIERA ─────────────────────────────────────────────────────────

  const KBD_ROWS = [
    ["7", "8", "9", "+", "-"],
    ["4", "5", "6", "×", "÷"],
    ["1", "2", "3", "0", "="],
    ["DEL", "INVIO"],
  ];

  const renderKbd = () =>
    KBD_ROWS.map((row, ri) => (
      <div key={ri} style={S.kbdRow}>
        {row.map((k) => (
          <button
            key={k}
            onPointerDown={(e) => { e.preventDefault(); handleKey(k); }}
            style={{
              ...S.key(keyStates[k]),
              ...(k === "DEL" || k === "INVIO" ? S.keyWide : {}),
            }}
          >
            {k}
          </button>
        ))}
      </div>
    ));

  // ─── STAT HEADER ─────────────────────────────────────────────────────────────

  const statText = () => {
    const { status, guesses } = gameState;
    if (status === "won") return { top: `${guesses.length}/6`, bottom: TODAY };
    if (status === "lost") return { top: "0/6", bottom: TODAY };
    return { top: `${guesses.length + 1}/${MAX_TENTATIVI}`, bottom: TODAY };
  };
  const st = statText();

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{S.googleFont}</style>
      <div style={S.root}>
        <div style={S.scanlines} />
        <div style={S.inner}>

          {/* Header */}
          <div style={S.header}>
            <div style={S.logo}>
              NERD<span style={S.logoSpan}>LE</span>·IT
            </div>
            <div style={S.stat}>
              <span style={S.statStrong}>{st.top}</span>
              <br />{st.bottom}
            </div>
          </div>

          {/* Badge lunghezza */}
          <div style={S.badge}>{LEN} CARATTERI PER EQUAZIONE</div>

          {/* Griglia */}
          <div style={S.grid}>{renderGrid()}</div>

          {/* Messaggio */}
          <div style={S.msg}>{message}</div>

          {/* Tastiera */}
          {gameState.status === "playing" && (
            <div style={S.kbd}>{renderKbd()}</div>
          )}

          {/* Endgame */}
          {gameState.status !== "playing" && (
            <div style={S.endgame}>
              <div style={S.solution(gameState.status === "won")}>{TARGET}</div>
              <button style={S.btn} onClick={handleShare}>
                📋 COPIA RISULTATO
              </button>
              {copied && <div style={S.copied}>Copiato negli appunti!</div>}
              <div style={S.next}>Prossima equazione domani a mezzanotte</div>

              {/* Archivio */}
              {gameState.archive?.length > 0 && (
                <div style={S.archive}>
                  <div style={S.archTitle}>ARCHIVIO</div>
                  <div style={S.archList}>
                    {[...gameState.archive].reverse().slice(0, 7).map((a, i) => (
                      <div key={i} style={S.archItem}>
                        {a.date.slice(0, 5)} · {a.eq} · {a.result === "won" ? `${a.att}/6` : "✗"}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
