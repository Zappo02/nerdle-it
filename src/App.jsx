import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATABASE ────────────────────────────────────────────────────────────────

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
const STORAGE_KEY = "nerdle_it_v2"; // v2: storage multi-sessione
const THEME_KEY = "nerdle_it_theme";
const EPOCH = new Date("2026-01-01T00:00:00+01:00");
const FLIP_DELAY = 120;
const ARCHIVE_DAYS = 7; // giorni precedenti accessibili (si accumulano)

// ─── UTILITY ──────────────────────────────────────────────────────────────────

function getTargetForDate(dateStr) {
  // dateStr: "DD/MM/YYYY"
  const [d, m, y] = dateStr.split("/").map(Number);
  const date = new Date(y, m - 1, d, 0, 0, 0);
  const epoch = new Date(2026, 0, 1, 0, 0, 0);
  const days = Math.floor((date - epoch) / 86400000);
  return ALL[((days % ALL.length) + ALL.length) % ALL.length];
}

function getItalianDate(offsetDays = 0) {
  const now = new Date();
  now.setDate(now.getDate() + offsetDays); // offset negativo = giorni fa
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric",
  }).format(now);
}

// Genera lista date: oggi + ultimi N giorni passati (in ordine cronologico inverso)
function getAvailableDates() {
  const dates = [];
  for (let i = 0; i >= -ARCHIVE_DAYS; i--) {
    dates.push(getItalianDate(i));
  }
  return dates; // [oggi, ieri, 2 giorni fa, ...]
}

function getMidnightCountdown() {
  const romeStr = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).format(new Date());
  const [h, m, s] = romeStr.split(":").map(Number);
  const left = (23 - h) * 3600 + (59 - m) * 60 + (60 - s);
  return [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60]
    .map((n) => String(n).padStart(2, "0")).join(":");
}

function validateEquation(eq) {
  const p = eq.split("=");
  if (p.length !== 2) return false;
  try {
    // eslint-disable-next-line no-new-func
    const v = Function('"use strict";return(' + p[0].replace(/×/g, "*").replace(/÷/g, "/") + ")")();
    return Math.abs(v - parseFloat(p[1])) < 0.001 && isFinite(v);
  } catch { return false; }
}

function computeFeedback(guess, target) {
  const n = target.length, res = Array(n).fill("absent"), used = Array(n).fill(false);
  for (let i = 0; i < n; i++) if (guess[i] === target[i]) { res[i] = "correct"; used[i] = true; }
  for (let i = 0; i < n; i++) {
    if (res[i] === "correct") continue;
    for (let j = 0; j < n; j++) if (!used[j] && guess[i] === target[j]) { res[i] = "present"; used[j] = true; break; }
  }
  return res;
}

function buildShareText(target, guesses, status, date) {
  const won = status === "won";
  let t = `Nerdle·IT ${date}\n${won ? guesses.length : "X"}/${MAX_TENTATIVI} (${target.length} caratteri)\n\n`;
  guesses.forEach((g) => {
    t += computeFeedback(g, target).map((f) => f === "correct" ? "🟩" : f === "present" ? "🟨" : "⬛").join("") + "\n";
  });
  return t + "\nuniversosportivo.com/nerdle";
}

function computeStats(sessions) {
  // sessions: { [dateStr]: { guesses, status, ... } }
  const all = Object.values(sessions).filter((s) => s.status === "won" || s.status === "lost");
  const played = all.length;
  const wonList = all.filter((s) => s.status === "won");
  const dist = [0, 0, 0, 0, 0, 0];
  wonList.forEach((s) => { if (s.guesses.length >= 1 && s.guesses.length <= 6) dist[s.guesses.length - 1]++; });
  // Streak su date consecutive (oggi → indietro)
  const dates = getAvailableDates(); // ordinato dal più recente
  let streak = 0;
  for (const d of dates) {
    const s = sessions[d];
    if (s && s.status === "won") streak++;
    else if (s && s.status === "lost") break;
    else break; // non ancora giocata → streak spezzata
  }
  // Max streak su tutte le sessioni ordinate per data
  const sortedDates = Object.keys(sessions).sort();
  let maxStreak = 0, cur = 0;
  sortedDates.forEach((d) => {
    if (sessions[d].status === "won") { cur++; maxStreak = Math.max(maxStreak, cur); }
    else { cur = 0; }
  });
  return { played, won: wonList.length, winPct: played ? Math.round((wonList.length / played) * 100) : 0, dist, streak, maxStreak };
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
// Struttura: { sessions: { "DD/MM/YYYY": { guesses, status } }, ... }

function loadStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function saveStorage(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }
function loadTheme() { try { return localStorage.getItem(THEME_KEY) || "dark"; } catch { return "dark"; } }
function saveTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch {} }

function getSession(storage, dateStr) {
  return storage.sessions?.[dateStr] || { guesses: [], status: "playing" };
}

// ─── TEMA ─────────────────────────────────────────────────────────────────────

function getTheme(mode) {
  const d = {
    bg: "#0d0f0c", surface: "#141710", cell: "#1a1e18", border: "#2a3028",
    green: "#4ade80", greenDim: "#1a3d27", yellow: "#fbbf24", yellowDim: "#3d3010",
    gray: "#4b5563", grayDim: "#1f2320", text: "#d1fae5", textMuted: "#6b7280",
    accent: "#34d399", eqBorder: "#2a3a50", eqColor: "#6baed6", eqBg: "#0d1a2a",
    btnHoverBg: "#34d399", btnHoverColor: "#0d0f0c",
    inputBorder: "#3a4a38", red: "#f87171", sectionBorder: "#1a1e18",
    modalBg: "rgba(0,0,0,0.8)", modalCard: "#141710",
    absentKey: "#111", absentKeyColor: "#333", absentKeyBorder: "#222",
    archiveItemBg: "#1a1e18", archiveItemBorder: "#2a3028",
    archivePastBg: "#141710", archivePastBorder: "#2a3028",
    pillBg: "#1a1e18",
  };
  const l = {
    bg: "#f5f5f0", surface: "#ffffff", cell: "#f0f0ea", border: "#d0d5cc",
    green: "#16a34a", greenDim: "#dcfce7", yellow: "#d97706", yellowDim: "#fef9c3",
    gray: "#9ca3af", grayDim: "#f3f4f6", text: "#1a1a1a", textMuted: "#6b7280",
    accent: "#059669", eqBorder: "#93c5fd", eqColor: "#1d4ed8", eqBg: "#eff6ff",
    btnHoverBg: "#059669", btnHoverColor: "#ffffff",
    inputBorder: "#86efac", red: "#dc2626", sectionBorder: "#e5e7eb",
    modalBg: "rgba(0,0,0,0.5)", modalCard: "#ffffff",
    absentKey: "#e5e7eb", absentKeyColor: "#9ca3af", absentKeyBorder: "#d1d5db",
    archiveItemBg: "#f0f0ea", archiveItemBorder: "#d0d5cc",
    archivePastBg: "#f9f9f6", archivePastBorder: "#e5e7eb",
    pillBg: "#f0f0ea",
  };
  return mode === "dark" ? d : l;
}

// ─── MODALE ───────────────────────────────────────────────────────────────────

function Modal({ title, onClose, T, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: T.modalBg, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.modalCard, border: `1px solid ${T.border}`, borderRadius: 10, width: "100%", maxWidth: 440, maxHeight: "88vh", overflowY: "auto", padding: 24, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 13, color: T.accent, letterSpacing: 2 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 22, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPALE ────────────────────────────────────────────────────

export default function NerdleIT() {
  const TODAY = getItalianDate(0);
  const [theme, setTheme] = useState(loadTheme);
  const T = getTheme(theme);

  // Storage multi-sessione
  const [storage, setStorage] = useState(() => {
    const s = loadStorage();
    if (!s.sessions) s.sessions = {};
    return s;
  });

  // Data attualmente in gioco (default: oggi)
  const [activeDate, setActiveDate] = useState(TODAY);

  const TARGET = getTargetForDate(activeDate);
  const LEN = TARGET.length;
  const isToday = activeDate === TODAY;
  const session = getSession(storage, activeDate);

  const [input, setInput] = useState([]);
  const [message, setMessage] = useState("");
  const [animating, setAnimating] = useState(false);
  const [shakeRow, setShakeRow] = useState(false);
  const [flippingRow, setFlippingRow] = useState(null);
  const [bouncingRow, setBouncingRow] = useState(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(getMidnightCountdown());
  const [modal, setModal] = useState(null);
  const msgTimeout = useRef(null);

  // Reset input quando cambia la data attiva
  useEffect(() => { setInput([]); setMessage(""); }, [activeDate]);

  useEffect(() => { saveStorage(storage); }, [storage]);
  useEffect(() => { saveTheme(theme); }, [theme]);
  useEffect(() => {
    const id = setInterval(() => setCountdown(getMidnightCountdown()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const send = () => window.parent?.postMessage({ type: "nerdle-height", height: document.body.scrollHeight }, "*");
    send();
    const ro = new ResizeObserver(send);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const handler = (e) => {
      if (modal) { if (e.key === "Escape") setModal(null); return; }
      if (session.status !== "playing" || animating) return;
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

  const saveSession = useCallback((dateStr, newSession) => {
    setStorage((prev) => {
      const next = { ...prev, sessions: { ...prev.sessions, [dateStr]: newSession } };
      return next;
    });
  }, []);

  const showMessage = useCallback((txt, duration = 2000) => {
    setMessage(txt);
    clearTimeout(msgTimeout.current);
    if (duration > 0) msgTimeout.current = setTimeout(() => setMessage(""), duration);
  }, []);

  const handleKey = useCallback((k) => {
    if (session.status !== "playing" || animating) return;
    if (k === "DEL") { setInput((p) => p.slice(0, -1)); return; }
    if (k === "INVIO") { submitGuess(); return; }
    setInput((p) => p.length < LEN ? [...p, k] : p);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status, animating, input, LEN]);

  const submitGuess = () => {
    const guess = input.join("");
    if (guess.length < LEN) { shake(); showMessage(`Troppo corta (${guess.length}/${LEN})`); return; }
    if (!guess.includes("=")) { shake(); showMessage("Manca il simbolo ="); return; }
    if (!validateEquation(guess)) { shake(); showMessage("Equazione matematicamente errata"); return; }

    const rowIdx = session.guesses.length;
    setAnimating(true); setFlippingRow(rowIdx); setInput([]);
    const won = guess === TARGET;
    const newGuesses = [...session.guesses, guess];
    const lost = !won && newGuesses.length >= MAX_TENTATIVI;

    setTimeout(() => {
      setFlippingRow(null); setAnimating(false);
      const newSession = { guesses: newGuesses, status: won ? "won" : lost ? "lost" : "playing" };
      saveSession(activeDate, newSession);
      if (won) {
        setBouncingRow(rowIdx);
        setTimeout(() => setBouncingRow(null), 600);
        showMessage("🎯 Esatto!", 0);
        setTimeout(() => setModal("stats"), 1800);
      } else if (lost) {
        showMessage("Soluzione: " + TARGET, 0);
      }
    }, LEN * FLIP_DELAY + 500);
  };

  const shake = () => { setShakeRow(true); setTimeout(() => setShakeRow(false), 400); };

  // Stati tastiera per sessione attiva
  const keyStates = {};
  session.guesses.forEach((g) => {
    computeFeedback(g, TARGET).forEach((fb, i) => {
      const ch = g[i], cur = keyStates[ch];
      if (!cur) keyStates[ch] = fb;
      else if (cur !== "correct" && fb === "correct") keyStates[ch] = "correct";
      else if (cur === "absent" && fb === "present") keyStates[ch] = "present";
    });
  });

  const handleShare = async () => {
    const text = buildShareText(TARGET, session.guesses, session.status, activeDate);
    try { await navigator.clipboard.writeText(text); }
    catch { const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  // ─── STILI ────────────────────────────────────────────────────────────────

  const mono = { fontFamily: "'Share Tech Mono',monospace" };

  const cellStyle = (state) => ({
    width: 46, height: 46, borderRadius: 4,
    border: `1px solid ${state === "correct" ? T.green : state === "present" ? T.yellow : state === "absent" ? T.gray : state === "active" ? T.inputBorder : state === "filled" ? T.accent : state === "eqfix" ? T.eqBorder : T.border}`,
    background: state === "correct" ? T.greenDim : state === "present" ? T.yellowDim : state === "absent" ? T.grayDim : state === "eqfix" ? T.eqBg : T.cell,
    color: state === "correct" ? T.green : state === "present" ? T.yellow : state === "absent" ? T.gray : state === "eqfix" ? T.eqColor : T.text,
    display: "flex", alignItems: "center", justifyContent: "center",
    ...mono, fontSize: 21,
    transform: state === "filled" ? "scale(1.05)" : "scale(1)",
    transition: "transform 0.08s, border-color 0.15s", userSelect: "none",
  });

  const keyStyle = (ks) => ({
    height: 44, minWidth: 38, padding: "0 8px",
    border: `1px solid ${ks === "correct" ? T.green : ks === "present" ? T.yellow : ks === "absent" ? T.absentKeyBorder : T.border}`,
    borderRadius: 4,
    background: ks === "correct" ? T.greenDim : ks === "present" ? T.yellowDim : ks === "absent" ? T.absentKey : T.surface,
    color: ks === "correct" ? T.green : ks === "present" ? T.yellow : ks === "absent" ? T.absentKeyColor : T.text,
    ...mono, fontSize: 16, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.1s", userSelect: "none", WebkitUserSelect: "none",
  });

  const iconBtn = () => ({
    background: "none", border: `1px solid ${T.border}`, borderRadius: 4,
    padding: "4px 8px", cursor: "pointer", color: T.textMuted,
    fontSize: 14, lineHeight: 1, transition: "opacity 0.15s",
  });

  // ─── GRIGLIA ──────────────────────────────────────────────────────────────

  const renderGrid = () => {
    const rows = [];
    for (let r = 0; r < MAX_TENTATIVI; r++) {
      const isCurrentRow = r === session.guesses.length && session.status === "playing";
      const isFlipping = flippingRow === r;
      const isBouncing = bouncingRow === r;
      const isShaking = shakeRow && isCurrentRow;
      const guess = session.guesses[r];
      const feedback = guess ? computeFeedback(guess, TARGET) : null;
      const cells = [];
      for (let c = 0; c < LEN; c++) {
        let state = "empty", char = "";
        if (guess) {
          char = guess[c];
          state = isFlipping ? "filled" : feedback[c];
          if (!isFlipping && feedback[c] === "correct" && TARGET[c] === "=") state = "correct";
        } else if (isCurrentRow) {
          char = input[c] || ""; state = char ? "filled" : "active";
        }
        cells.push(
          <div key={c} className={isFlipping ? "n-flip" : isBouncing ? "n-bounce" : isShaking ? "n-shake" : ""} style={{
            ...cellStyle(state),
            animationDelay: isFlipping ? `${c * FLIP_DELAY}ms` : isBouncing ? `${c * 80}ms` : "0ms",
          }}>{char}</div>
        );
      }
      rows.push(<div key={r} style={{ display: "flex", gap: 5, justifyContent: "center" }}>{cells}</div>);
    }
    return rows;
  };

  const KBD = [["7","8","9","+","-"],["4","5","6","×","÷"],["1","2","3","0","="],["DEL","INVIO"]];
  const renderKbd = () => KBD.map((row, ri) => (
    <div key={ri} style={{ display: "flex", gap: 5, justifyContent: "center" }}>
      {row.map((k) => (
        <button key={k} onPointerDown={(e) => { e.preventDefault(); handleKey(k); }}
          style={{ ...keyStyle(keyStates[k]), ...(k === "DEL" || k === "INVIO" ? { minWidth: 60, fontSize: 12 } : {}) }}>
          {k}
        </button>
      ))}
    </div>
  ));

  // ─── MODALI ───────────────────────────────────────────────────────────────

  const stats = computeStats(storage.sessions || {});

  const renderHelp = () => (
    <Modal title="COME SI GIOCA" onClose={() => setModal(null)} T={T}>
      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 14 }}>
        <p>Indovina l'equazione matematica in <strong>6 tentativi</strong>. L'equazione è di <strong>7 o 8 caratteri</strong> e deve essere <strong>matematicamente corretta</strong>.</p>
        <div>
          <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: 1, marginBottom: 6 }}>🟩 VERDE — nel posto giusto</div>
          <div style={{ display: "flex", gap: 4 }}>
            {["3","×","4","=","1","2"].map((ch, i) => (
              <div key={i} style={{ ...cellStyle(i === 1 ? "absent" : "correct"), width: 36, height: 36, fontSize: 16 }}>{ch}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: 1, marginBottom: 6 }}>🟨 GIALLO — presente ma posizione sbagliata</div>
          <div style={{ display: "flex", gap: 4 }}>
            {["5","+","3","=","8"].map((ch, i) => (
              <div key={i} style={{ ...cellStyle(i === 0 ? "present" : "absent"), width: 36, height: 36, fontSize: 16 }}>{ch}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: 1, marginBottom: 6 }}>⬛ GRIGIO — non presente</div>
          <div style={{ display: "flex", gap: 4 }}>
            {["9","-","2","=","7"].map((ch, i) => (
              <div key={i} style={{ ...cellStyle("absent"), width: 36, height: 36, fontSize: 16 }}>{ch}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, fontSize: 12, color: T.textMuted }}>
          <p>⚠️ Il tentativo viene rifiutato se l'equazione è matematicamente errata.</p>
          <p style={{ marginTop: 6 }}>🗂 Dall'archivio puoi giocare le equazioni degli ultimi 7 giorni.</p>
          <p style={{ marginTop: 6 }}>🔁 Nuova equazione ogni giorno a mezzanotte (ora italiana).</p>
        </div>
      </div>
    </Modal>
  );

  const renderStats = () => {
    const maxDist = Math.max(...stats.dist, 1);
    return (
      <Modal title="STATISTICHE" onClose={() => setModal(null)} T={T}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["Giocate", stats.played], ["Vinte %", stats.winPct], ["Streak", stats.streak], ["Max", stats.maxStreak]].map(([label, val]) => (
            <div key={label} style={{ flex: 1, background: T.pillBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 6px", textAlign: "center" }}>
              <div style={{ ...mono, fontSize: 24, color: T.accent, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 5, letterSpacing: 0.5 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...mono, fontSize: 10, color: T.textMuted, letterSpacing: 2, marginBottom: 10 }}>DISTRIBUZIONE TENTATIVI</div>
          {stats.dist.map((count, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <div style={{ ...mono, fontSize: 12, color: T.textMuted, minWidth: 14, textAlign: "right" }}>{i + 1}</div>
              <div style={{ flex: 1, background: T.cell, borderRadius: 3, height: 20, overflow: "hidden" }}>
                <div style={{ width: `${Math.max((count / maxDist) * 100, count > 0 ? 6 : 0)}%`, background: T.green, height: "100%", display: "flex", alignItems: "center", paddingLeft: 6, borderRadius: 3, transition: "width 0.4s" }}>
                  {count > 0 && <span style={{ ...mono, fontSize: 11, color: T.bg }}>{count}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {session.status !== "playing" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
            <div style={{ ...mono, fontSize: 14, color: session.status === "won" ? T.green : T.red, letterSpacing: 2 }}>{TARGET}</div>
            <button className="n-btn" onClick={handleShare} style={{ height: 36, padding: "0 16px", border: `1px solid ${T.accent}`, borderRadius: 4, background: "transparent", color: T.accent, ...mono, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
              📋 COPIA RISULTATO
            </button>
            {copied && <div style={{ ...mono, fontSize: 11, color: T.textMuted }}>Copiato!</div>}
            {isToday && <div style={{ ...mono, fontSize: 11, color: T.textMuted }}>Prossima: {countdown}</div>}
          </div>
        )}
      </Modal>
    );
  };

  const renderArchive = () => {
    const dates = getAvailableDates();
    const pastDates = dates.slice(1); // escludi oggi

    return (
      <Modal title="ARCHIVIO" onClose={() => setModal(null)} T={T}>
        <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
          Gioca le equazioni dei <strong style={{ color: T.text }}>7 giorni precedenti</strong>. Le partite contano nelle statistiche.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pastDates.map((date) => {
            const target = getTargetForDate(date);
            const sess = getSession(storage, date);
            const done = sess.status !== "playing";
            const isActive = activeDate === date;

            return (
              <div key={date} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px",
                background: isActive ? T.greenDim : done ? T.archivePastBg : T.archiveItemBg,
                border: `1px solid ${isActive ? T.green : done ? T.archivePastBorder : T.archiveItemBorder}`,
                borderRadius: 8, cursor: done ? "default" : "pointer",
                transition: "border-color 0.15s",
              }}
                onClick={() => {
                  if (!done) { setActiveDate(date); setModal(null); }
                }}
              >
                {/* Data */}
                <div style={{ ...mono, fontSize: 12, color: T.textMuted, minWidth: 50 }}>
                  {date.slice(0, 5)}
                </div>

                {/* Equazione: nascosta se non ancora giocata */}
                <div style={{ ...mono, fontSize: 13, flex: 1, letterSpacing: 1, color: done ? T.text : T.textMuted }}>
                  {done ? target : "? ? ? ? ? ? ?"}
                </div>

                {/* Stato */}
                {done ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ ...mono, fontSize: 12, color: sess.status === "won" ? T.green : T.red }}>
                      {sess.status === "won" ? `${sess.guesses.length}/6` : "✗"}
                    </div>
                    <div style={{ fontSize: 10 }}>
                      {sess.status === "won"
                        ? Array.from({ length: 6 }).map((_, j) => j < sess.guesses.length ? "🟩" : "⬜").join("")
                        : "⬛⬛⬛⬛⬛⬛"}
                    </div>
                  </div>
                ) : (
                  <div style={{ ...mono, fontSize: 11, color: T.accent, letterSpacing: 1 }}>
                    {isActive ? "▶ IN CORSO" : "GIOCA →"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Modal>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  const isDone = session.status !== "playing";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Outfit:wght@400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:${T.bg}; }
        @keyframes n-flip { 0%{transform:scaleY(1)} 50%{transform:scaleY(0)} 100%{transform:scaleY(1)} }
        @keyframes n-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes n-bounce { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-10px) scale(1.1)} 70%{transform:translateY(-4px) scale(1.05)} }
        .n-flip { animation: n-flip ${FLIP_DELAY * 2}ms ease forwards; }
        .n-shake { animation: n-shake 0.4s ease; }
        .n-bounce { animation: n-bounce 0.35s ease; }
        .n-btn:hover { background:${T.btnHoverBg}!important; color:${T.btnHoverColor}!important; }
        .n-ico:hover { opacity:0.7; }
      `}</style>

      <div style={{ fontFamily: "'Outfit',sans-serif", background: T.bg, color: T.text, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 8px 32px" }}>
        {theme === "dark" && <div style={{ position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)", pointerEvents: "none", zIndex: 0 }} />}

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* ── HEADER ── */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.border}`, paddingBottom: 10, marginBottom: 12 }}>
            <button className="n-ico" onClick={() => setModal("help")} style={iconBtn()} title="Come si gioca">?</button>
            <div style={{ textAlign: "center" }}>
              <div style={{ ...mono, fontSize: 20, color: T.green, letterSpacing: 2 }}>
                NERD<span style={{ color: T.yellow }}>LE</span>·IT
              </div>
              <div style={{ ...mono, fontSize: 10, color: isToday ? T.textMuted : T.yellow, letterSpacing: 1, marginTop: 2 }}>
                {isToday ? TODAY : `◀ ${activeDate}`}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="n-ico" onClick={() => setModal("stats")} style={iconBtn()} title="Statistiche">📊</button>
              <button className="n-ico" onClick={() => setModal("archive")} style={iconBtn()} title="Archivio">🗂</button>
              <button className="n-ico" onClick={() => setTheme((t) => t === "dark" ? "light" : "dark")} style={iconBtn()}>
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>
          </div>

          {/* Banner giorno precedente */}
          {!isToday && (
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: T.yellowDim, border: `1px solid ${T.yellow}`, borderRadius: 6, padding: "8px 12px", marginBottom: 10 }}>
              <div style={{ ...mono, fontSize: 11, color: T.yellow, letterSpacing: 1 }}>◀ EQUAZIONE DEL {activeDate.slice(0, 5)}</div>
              <button onClick={() => setActiveDate(TODAY)} style={{ background: "none", border: `1px solid ${T.yellow}`, borderRadius: 4, padding: "3px 10px", cursor: "pointer", color: T.yellow, ...mono, fontSize: 11 }}>
                OGGI →
              </button>
            </div>
          )}

          {/* Timer (solo oggi) */}
          {isToday && (
            <div style={{ ...mono, fontSize: 11, color: T.textMuted, marginBottom: 10, textAlign: "center" }}>
              <span style={{ color: T.accent, fontSize: 14, letterSpacing: 2 }}>{countdown}</span>
              <span style={{ marginLeft: 6, fontSize: 9, letterSpacing: 1 }}>ALLA PROSSIMA</span>
            </div>
          )}

          {/* Badge */}
          <div style={{ ...mono, fontSize: 10, color: T.textMuted, letterSpacing: 1, marginBottom: 8 }}>
            {LEN} CARATTERI PER EQUAZIONE
          </div>

          {/* ── GRIGLIA ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14, width: "100%" }}>
            {renderGrid()}
          </div>

          {/* Messaggio */}
          <div style={{ height: 28, display: "flex", alignItems: "center", justifyContent: "center", ...mono, fontSize: 13, color: T.yellow, letterSpacing: 1, marginBottom: 8, textAlign: "center", width: "100%" }}>
            {message}
          </div>

          {/* ── TASTIERA ── */}
          {!isDone && (
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
              {renderKbd()}
            </div>
          )}

          {/* ── ENDGAME ── */}
          {isDone && (() => {
            const pastDates = getAvailableDates().slice(1);
            const unplayed = pastDates.filter((d) => getSession(storage, d).status === "playing");
            const nextUnplayed = unplayed[0] || null;
            return (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 16, width: "100%" }}>
                <div style={{ ...mono, fontSize: 20, color: session.status === "won" ? T.green : T.red, letterSpacing: 3 }}>
                  {TARGET}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="n-btn" onClick={handleShare} style={{ height: 38, padding: "0 16px", border: `1px solid ${T.accent}`, borderRadius: 4, background: "transparent", color: T.accent, ...mono, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
                    📋 COPIA
                  </button>
                  <button className="n-btn" onClick={() => setModal("stats")} style={{ height: 38, padding: "0 16px", border: `1px solid ${T.accent}`, borderRadius: 4, background: "transparent", color: T.accent, ...mono, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
                    📊 STATS
                  </button>
                </div>
                {copied && <div style={{ ...mono, fontSize: 11, color: T.textMuted }}>Copiato negli appunti!</div>}

                {/* Suggerimento archivio — solo se siamo su oggi e ci sono giorni non giocati */}
                {isToday && nextUnplayed && (
                  <div style={{ width: "100%", marginTop: 6, background: T.greenDim, border: `1px solid ${T.green}`, borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ ...mono, fontSize: 11, color: T.green, letterSpacing: 1, marginBottom: 3 }}>
                        🗂 HAI EQUAZIONI DA GIOCARE
                      </div>
                      <div style={{ fontSize: 12, color: T.textMuted }}>
                        {unplayed.length === 1
                          ? `Il giorno ${nextUnplayed.slice(0, 5)} non è ancora stato giocato.`
                          : `${unplayed.length} giorni dell'archivio non ancora giocati.`}
                      </div>
                    </div>
                    <button
                      onClick={() => { setActiveDate(nextUnplayed); setModal(null); }}
                      style={{ flexShrink: 0, height: 36, padding: "0 14px", border: `1px solid ${T.green}`, borderRadius: 4, background: "transparent", color: T.green, ...mono, fontSize: 12, cursor: "pointer", letterSpacing: 1, whiteSpace: "nowrap" }}>
                      GIOCA →
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Footer */}
          <div style={{ marginTop: 24, paddingTop: 12, borderTop: `1px solid ${T.sectionBorder}`, width: "100%", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, color: T.textMuted, letterSpacing: 1 }}>UNIVERSOSPORTIVO.COM</span>
            <span style={{ fontSize: 9, color: T.textMuted, letterSpacing: 1 }}>NERDLE·IT · 473 GIORNI</span>
          </div>
        </div>
      </div>

      {modal === "help" && renderHelp()}
      {modal === "stats" && renderStats()}
      {modal === "archive" && renderArchive()}
    </>
  );
}

