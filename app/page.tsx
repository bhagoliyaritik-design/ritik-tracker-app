'use client'
import { useState, useEffect, useMemo, useCallback } from "react";
import { auth, db } from "../src/firebaseConfig";
import {
  onAuthStateChanged, signOut,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, User
} from "firebase/auth";
import {
  doc, setDoc, getDoc, serverTimestamp,
  collection, getDocs, addDoc, deleteDoc
} from "firebase/firestore";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth } from "date-fns";
import AnnouncementBanner from "../components/AnnouncementBanner";
import MaintenanceBanner from "../components/MaintenanceBanner";
import UserChat from "../components/UserChat";

// Sidebar Tabs Configuration
const TABS = [
  { key: "dashboard", label: "Dashboard", icon: "🏡" },
  { key: "features", label: "Main Features", icon: "⭐" },
  { key: "analytics", label: "Analytics", icon: "📈" },
  { key: "calendar", label: "Calendar", icon: "📅" },
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "chat", label: "Live Chat", icon: "💬" },
  { key: "settings", label: "Settings", icon: "⚙️" },
  { key: "info", label: "Info", icon: "ℹ️" }
];

// Utility: For date keys (YYYY-MM-DD)
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
}

// Yes/No Button Group Component
function YesNo({ value, onChange }: { value: boolean | null, onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3 mt-2">
      <button className={`px-5 py-1 rounded-full font-bold transition ${value === true ? "bg-green-500 text-white" : "bg-white/10 text-zinc-200 hover:bg-green-500/80 hover:text-white"}`} onClick={() => onChange(true)} type="button">Yes</button>
      <button className={`px-5 py-1 rounded-full font-bold transition ${value === false ? "bg-red-500 text-white" : "bg-white/10 text-zinc-200 hover:bg-red-500/80 hover:text-white"}`} onClick={() => onChange(false)} type="button">No</button>
    </div>
  );
}

// Card Wrapper UI Component
function Card({ title, icon, children }: { title: string, icon: string, children: any }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-lg shadow-lg flex flex-col gap-2 min-h-[95px] mb-2">
      <div className="flex items-center gap-2 mb-1 text-lg font-semibold text-white">
        <span>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

// Profile Tab Fallback Layout
function ProfileTab({ user }: { user: User }) {
  return (
    <div className="max-w-xl mx-auto pt-10 text-white animate-fadein">
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">👤 Personal Account Profile</h2>
        <div className="space-y-3">
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-xs text-zinc-400 block">Registered Email</span>
            <span className="text-md font-mono text-white">{user.email}</span>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-xs text-zinc-400 block">User Unique ID (UID)</span>
            <span className="text-xs font-mono text-zinc-300 break-all">{user.uid}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// AUTHENTICATION COMPONENT
function AuthPage({ onLogIn }: { onLogIn: (user: User) => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault(); setLoading(true); setError(''); setInfo('');
    try {
      if (isNew) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          createdAt: serverTimestamp(),
          totalXp: 0,
          currentStreak: 0
        });
        setInfo("Account created! Logging in...");
        onLogIn(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        onLogIn(userCredential.user);
      }
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", "").replace(".", ""));
    }
    setLoading(false);
  };

  const handleReset = async (e: any) => {
    e.preventDefault(); setLoading(true); setError(''); setInfo('');
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo('Reset link sent! Please check your email inbox.'); setIsReset(false);
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", "").replace(".", ""));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1026] via-[#151636] to-[#0A0B1A] px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />
      
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl px-8 py-12 shadow-2xl w-full max-w-md transform transition-all hover:border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tighter bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">RITIK TRACKER</h1>
          <p className="text-zinc-400 text-xs uppercase tracking-widest mt-1 font-semibold">Track Your Progress</p>
        </div>
        <p className="text-zinc-300 mb-6 text-sm text-center">
          {isReset ? "Reset your password" : isNew ? "Create your new account" : "Login with your account"}
        </p>
        <form className="flex flex-col gap-4" onSubmit={isReset ? handleReset : handleSubmit}>
          <input type="email" className="bg-white/5 rounded-xl px-5 py-3.5 text-white outline-none border border-white/10 focus:border-indigo-500 transition-all placeholder:text-zinc-500 text-sm"
            placeholder="Email address" value={email} onChange={e => { setError(""); setInfo(""); setEmail(e.target.value) }} required autoFocus />
          {!isReset && (
            <input type="password" className="bg-white/5 rounded-xl px-5 py-3.5 text-white outline-none border border-white/10 focus:border-indigo-500 transition-all placeholder:text-zinc-500 text-sm"
              placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required minLength={6} />
          )}
          {error && <div className="text-rose-400 text-center text-xs font-semibold bg-rose-500/10 py-2.5 rounded-xl border border-rose-500/20">{error}</div>}
          {info && <div className="text-emerald-400 text-center text-xs font-semibold bg-emerald-500/10 py-2.5 rounded-xl border border-emerald-500/20">{info}</div>}
          <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white rounded-xl font-bold tracking-wide shadow-xl shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 cursor-pointer text-sm" disabled={loading}>
            {loading ? (isReset ? "Sending..." : isNew ? "Signing up..." : "Logging in...") : isReset ? "Send Reset Link" : isNew ? "Sign Up" : "Login"}
          </button>
          <div className="text-zinc-400 mt-4 text-center text-xs flex flex-col gap-2 font-medium">
            <span>
              {isReset ? (
                <span className="underline text-indigo-400 cursor-pointer ml-1" onClick={() => setIsReset(false)}>Back to Login</span>
              ) : (
                <>
                  <span className="underline text-indigo-400 cursor-pointer mr-3" onClick={() => setIsReset(true)}>Forgot Password?</span>
                  {isNew ? "Already have an account?" : "Don't have an account?"}
                  <span className="text-indigo-400 underline cursor-pointer ml-1 font-bold" onClick={() => { setIsNew(x => !x); setError(""); setInfo(""); }}>
                    {isNew ? "Login" : "Sign Up"}
                  </span>
                </>
              )}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==== Main Features Component ====
function FeaturesTabMain({ user }: { user: User }) {
  const [data, setData] = useState({
    date: todayKey(), water: 0, study: 0, fit: null as boolean|null, yoga: null as boolean|null,
    mastu: null as boolean|null, momos: null as boolean|null, sleep: "", wake: "",
  });
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchTodayRecord = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "trackers", user.uid, "days", data.date);
        const snap = await getDoc(ref);
        if (snap.exists()) { 
          setData(snap.data() as typeof data); 
          setHasSaved(true); 
        } else {
          setHasSaved(false);
        }
      } catch {
        setHasSaved(false);
      }
      setLoading(false);
    }; 
    fetchTodayRecord();
  }, [user, data.date]);

  async function saveAll() {
    if (!user) return;
    setLoading(true); setInfo('');
    try {
      const ref = doc(db, "trackers", user.uid, "days", data.date);
      await setDoc(ref, { ...data, savedAt: serverTimestamp(), alreadySaved: true });
      setInfo("Already saved for today. Come back tomorrow 🌟");
      setHasSaved(true);
    } catch (err: any) { 
      setInfo("Failed to save"); 
    }
    setLoading(false); setTimeout(() => setInfo(''), 4000);
  }
  const update = (field: keyof typeof data, value: any) => setData(d => ({ ...d, [field]: value }));

  return (
    <div className="w-full max-w-2xl px-2 py-1 flex flex-col gap-7 animate-fadein">
      <div className="grid sm:grid-cols-2 gap-7">
        <Card title="Water Intake" icon="💧">
          <div className="flex items-center gap-2">
            <button onClick={() => update("water", Math.max(data.water - 250, 0))} className="font-bold text-xl px-3 py-1 bg-sky-500/50 rounded hover:bg-sky-400 text-white cursor-pointer">-</button>
            <span className="text-lg font-mono text-white">{data.water} ml</span>
            <button onClick={() => update("water", data.water + 250)} className="font-bold text-xl px-3 py-1 bg-blue-500/80 rounded hover:bg-blue-600 text-white cursor-pointer">+</button>
          </div>
        </Card>
        <Card title="Fitness (Workout)" icon="🏋️">
          <YesNo value={data.fit} onChange={v => update("fit", v)} />
        </Card>
        <Card title="Yoga" icon="🧘‍♂️">
          <YesNo value={data.yoga} onChange={v => update("yoga", v)} />
        </Card>
        <Card title="Momos Eaten" icon="🥟">
          <YesNo value={data.momos} onChange={v => update("momos", v)} />
        </Card>
        <Card title="Masturbation" icon="🙈">
          <YesNo value={data.mastu} onChange={v => update("mastu", v)} />
          <span className="block text-xs text-white/50 mt-1">Private 🛡️</span>
        </Card>
        <Card title="Study (Lectures)" icon="📚">
          <div className="flex items-center gap-2">
            <button onClick={() => update("study", Math.max(data.study - 1, 0))} className="font-bold text-xl px-3 py-1 bg-blue-900/80 rounded hover:bg-blue-600 text-white cursor-pointer">-</button>
            <span className="text-lg font-mono text-white">{data.study}</span>
            <button onClick={() => update("study", data.study + 1)} className="font-bold text-xl px-3 py-1 bg-blue-900/80 rounded hover:bg-blue-600 text-white cursor-pointer">+</button>
          </div>
        </Card>
        <Card title="Wake Up Time" icon="⏰">
          <input type="time" className="rounded bg-white/10 text-white border border-white/10 px-3 py-1 outline-none" value={data.wake} onChange={e => update("wake", e.target.value)} />
        </Card>
        <Card title="Sleep Time" icon="🌙">
          <input type="time" className="rounded bg-white/10 text-white border border-white/10 px-3 py-1 outline-none" value={data.sleep} onChange={e => update("sleep", e.target.value)} />
        </Card>
      </div>
      
      {/* RESTORED: Exactly matches layout button text parameters from image inputs */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center">
        <button
          onClick={saveAll}
          disabled={loading || hasSaved}
          className={`rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-xl font-bold text-white px-8 py-4 shadow-2xl
          hover:scale-105 hover:from-indigo-700 hover:to-blue-400 transition-all ring-2 ring-blue-300/30 ${hasSaved ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
          {hasSaved ? "Already Saved for Today" : loading ? "Saving..." : "Save Today's Data"}
        </button>
        {hasSaved && <div className="text-[#3b82f6] mt-2 text-center text-sm font-semibold">Come back tomorrow to track again! 😇</div>}
        {info && <div className="text-green-400 font-bold mt-2 text-center text-lg">{info}</div>}
      </div>
    </div>
  );
}

// ==== ANALYTICS TAB ====
function AnalyticsTab({ user }: { user: User }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAll() {
      if (!user) return;
      setLoading(true);
      try {
        const q = collection(db, "trackers", user.uid, "days");
        const querySnapshot = await getDocs(q);
        let arr: any[] = [];
        querySnapshot.forEach(doc => arr.push({id: doc.id, ...doc.data()}));
        arr = arr.sort((a, b) => a.id.localeCompare(b.id));
        setHistory(arr);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    getAll();
  }, [user]);

  let streak = 0;
  history.slice().reverse().forEach((day) => {
    if ((day.study || 0) > 0) streak++;
    else return;
  });

  const today = new Date();
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - 6 + i);
    const id = format(d, "yyyy-MM-dd");
    const entry = history.find(e=>e.id===id);
    return ({
      date: id,
      study: entry?.study ?? 0,
      utha: entry?.wake || '--',
      mood: entry?.mood || '--'
    });
  });

  return (
    <div className="max-w-2xl mx-auto pt-6 pb-16 px-2 animate-fadein">
      <div className="rounded-xl bg-[#2c284c] mb-4 px-5 py-4 text-white shadow">
        <div className="mb-1"><span className="text-2xl align-middle">🔥</span> <b>Streak: {streak} Day{streak !== 1 ? 's' : ''}</b></div>
        <ul className="mb-1 text-zinc-200 text-sm space-y-1">
          {chartData.slice().reverse().map((e, i) => (
            <li key={i}>{e.date} | Uthna: <b>{e.utha}</b> | Lectures: <b>{e.study}</b> | Mood: <b>{e.mood}</b></li>
          ))}
        </ul>
      </div>
      <div className="bg-[#252245] rounded-lg p-5 shadow-lg mb-5">
        <div className="text-white/90 font-bold mb-1 text-[17px]">
          Last 7 Days <span className="text-blue-300">Progress</span> (Lectures)
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 7" stroke="#444466" />
            <XAxis dataKey="date" tickFormatter={d => d.slice(5)} axisLine={false} tickLine={false} fontSize={12} />
            <YAxis tickCount={3} width={20} fontSize={13} />
            <Tooltip />
            <Bar dataKey="study" fill="#64f3bd" radius={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ==== CALENDAR TAB COMPONENT ====
function CalendarTab({ user }: { user: User }) {
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showRecord, setShowRecord] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date());
  
  const currentTodayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }, []);

  const [selected, setSelected] = useState(currentTodayKey);

  useEffect(() => {
    async function getMonthRecords() {
      if (!user) return;
      setLoading(true);
      try {
        const startStr = format(startOfMonth(month), "yyyy-MM-dd");
        const endStr = format(endOfMonth(month), "yyyy-MM-dd");
        
        const q = collection(db, "trackers", user.uid, "days");
        const querySnapshot = await getDocs(q);
        const arr: any[] = [];
        
        querySnapshot.forEach(doc => {
          const id = doc.id;
          if (id >= startStr && id <= endStr) {
            arr.push({ id, ...doc.data() });
          }
        });
        setEntries(arr);
      } catch (error) {
        console.error("Error fetching month records:", error);
      } finally {
        setLoading(false);
      }
    }
    getMonthRecords();
  }, [user, month]);

  const openRecord = useCallback(async (date: string) => {
    setSelected(date);
    setLoading(true);
    try {
      const ref = doc(db, "trackers", user.uid, "days", date);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSelectedRecord({ id: snap.id, ...snap.data() });
      } else {
        setSelectedRecord(null);
      }
    } catch (error) {
      console.error("Error loading document:", error);
      setSelectedRecord(null);
    } finally {
      setLoading(false);
      setShowRecord(true);
    }
  }, [user]);

  const cols = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const days = [];
    let currentDay = startDate;
    while (currentDay <= endDate) {
      days.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    return days;
  }, [month]);

  const hasRecord = useCallback((day: Date) => {
    const id = format(day, "yyyy-MM-dd");
    return entries.some(e => e.id === id);
  }, [entries]);

  const formatSavedAt = useCallback((savedAt: any) => {
    if (!savedAt) return "--";
    try {
      if (typeof savedAt.toDate === 'function') {
        return format(savedAt.toDate(), "yyyy-MM-dd HH:mm:ss");
      }
      if (savedAt.seconds) {
        return format(new Date(savedAt.seconds * 1000), "yyyy-MM-dd HH:mm:ss");
      }
      return format(new Date(savedAt), "yyyy-MM-dd HH:mm:ss");
    } catch (e) {
      return String(savedAt);
    }
  }, []);

  const activeDayData = useMemo(() => {
    return entries.find(e => e.id === selected);
  }, [entries, selected]);

  return (
    <div className="max-w-xl mx-auto pt-8 pb-4 px-2 animate-fadein">
      <h2 className="font-bold text-xl text-white mb-4 tracking-wide">My Progress Calendar</h2>
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 mb-5 shadow-2xl">
        <div className="flex text-zinc-200 justify-between items-center mb-4 px-2">
          <button onClick={() => setMonth(subMonths(month, 1))} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all font-bold text-blue-400 cursor-pointer">&lt;&lt;</button>
          <b className="font-mono text-lg text-white tracking-wider">{format(month, "MMMM yyyy")}</b>
          <button onClick={() => setMonth(addMonths(month, 1))} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all font-bold text-blue-400 cursor-pointer">&gt;&gt;</button>
        </div>

        <div className="grid grid-cols-7 gap-3 mt-2 mb-4 justify-items-center">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d =>
            <div key={d} className="text-center text-xs text-blue-300 font-bold uppercase tracking-wider w-full py-1">{d}</div>
          )}
          {cols.map((dt, i) => {
            const dateStr = format(dt, "yyyy-MM-dd");
            const isCurrentMonth = isSameMonth(dt, month);
            const isToday = isSameDay(dateStr, currentTodayKey);
            const isSelected = isSameDay(dateStr, selected);
            const hasData = hasRecord(dt);

            return (
              <button key={i}
                type="button"
                onClick={() => openRecord(dateStr)}
                disabled={loading}
                className={[
                  "aspect-square w-9 sm:w-11 text-sm font-semibold rounded-full transition-all outline-none relative flex flex-col items-center justify-center gap-0.5 group",
                  isCurrentMonth ? "text-white hover:bg-white/10 hover:scale-110 active:scale-95 shadow-sm cursor-pointer" : "text-zinc-500 bg-transparent pointer-events-none opacity-40",
                  isSelected ? "bg-yellow-500 text-black font-bold shadow-lg hover:bg-yellow-400" : "",
                  isToday && !isSelected ? "border-2 border-blue-500" : ""
                ].join(" ")}
              >
                <span>{format(dt, "d")}</span>
                {hasData && (
                  <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 transition-colors ${isSelected ? "bg-black" : "bg-green-400 animate-pulse"}`}>●</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 bg-black/40 border border-white/5 p-4 rounded-xl text-zinc-300 text-left backdrop-blur-md">
          <div className="font-bold text-white text-md mb-2 flex items-center gap-2">
            <span>📅</span> {selected} {selected === currentTodayKey && <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full font-normal">Today</span>}
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="text-xs text-zinc-400 block">Wake Up</span>
              <span className="font-semibold text-white">{activeDayData?.wake || "--"}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="text-xs text-zinc-400 block">Lectures</span>
              <span className="font-semibold text-white">{activeDayData?.study ?? "--"}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="text-xs text-zinc-400 block">Water</span>
              <span className="font-semibold text-white">{activeDayData?.water ? `${activeDayData.water} ml` : "--"}</span>
            </div>
          </div>
        </div>
      </div>

      {showRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setShowRecord(false)} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-br from-[#26294d] to-[#1a1b36] border border-white/15 p-6 shadow-2xl backdrop-blur-2xl transition-all max-h-[90vh] flex flex-col animate-fadein">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📅</span> Details for {selected}
              </h3>
              <button onClick={() => setShowRecord(false)} className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-all active:scale-95 cursor-pointer">✕</button>
            </div>

            <div className="overflow-y-auto pr-1 flex-1 space-y-3 pb-2">
              {selectedRecord ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">💧</span>
                    <div>
                      <span className="text-xs text-zinc-400 block">Water Intake</span>
                      <span className="text-md font-bold text-white">{selectedRecord.water ?? 0} ml</span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    <div>
                      <span className="text-xs text-zinc-400 block">Study Lectures</span>
                      <span className="text-md font-bold text-white">{selectedRecord.study ?? 0} Chapters</span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🏋️</span>
                    <div>
                      <span className="text-xs text-zinc-400 block">Workout Done</span>
                      <span className={`text-md font-bold ${selectedRecord.fit === true ? "text-green-400" : selectedRecord.fit === false ? "text-red-400" : "text-zinc-400"}`}>
                        {selectedRecord.fit === true ? "Yes ✅" : selectedRecord.fit === false ? "No ❌" : "--"}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🧘</span>
                    <div>
                      <span className="text-xs text-zinc-400 block">Yoga Session</span>
                      <span className={`text-md font-bold ${selectedRecord.yoga === true ? "text-green-400" : selectedRecord.yoga === false ? "text-red-400" : "text-zinc-400"}`}>
                        {selectedRecord.yoga === true ? "Yes ✅" : selectedRecord.yoga === false ? "No ❌" : "--"}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🙈</span>
                    <div>
                      <span className="text-xs text-zinc-400 block">Masturbation</span>
                      <span className={`text-md font-bold ${selectedRecord.mastu === true ? "text-red-400" : selectedRecord.mastu === false ? "text-green-400" : "text-zinc-400"}`}>
                        {selectedRecord.mastu === true ? "Yes 💦" : selectedRecord.mastu === false ? "No 🛡️" : "--"}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🥟</span>
                    <div>
                      <span className="text-xs text-zinc-400 block">Momos Eaten</span>
                      <span className={`text-md font-bold ${selectedRecord.momos === true ? "text-yellow-400" : "text-zinc-400"}`}>
                        {selectedRecord.momos === true ? "Yes 🥟" : selectedRecord.momos === false ? "No" : "--"}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <span className="text-xs text-zinc-400 block">Wake Up Time</span>
                      <span className="text-md font-bold text-white">{selectedRecord.wake || "--:--"}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🌙</span>
                    <div>
                      <span className="text-xs text-zinc-400 block">Sleep Time</span>
                      <span className="text-md font-bold text-white">{selectedRecord.sleep || "--:--"}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3 sm:col-span-2">
                    <span className="text-2xl">🕒</span>
                    <div>
                      <span className="text-xs text-zinc-400 block">Saved Time Stamp</span>
                      <span className="text-sm font-mono text-zinc-300">{formatSavedAt(selectedRecord.savedAt)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <span className="text-5xl mb-4 animate-bounce">📂</span>
                  <h4 className="text-xl font-bold text-white mb-1">No Record Available</h4>
                  <p className="text-zinc-400 text-sm max-w-xs">No tracker data was saved for this day.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
              <button type="button" onClick={() => setShowRecord(false)} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-sm font-medium text-white shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all active:scale-95 cursor-pointer">
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==== FEEDBACK TAB ====
function FeedbackTab({ user }: { user: User }) {
  const [val, setVal] = useState(""); const [ok, setOk] = useState(false); const [err, setErr] = useState("");
  async function send(e: any) { e.preventDefault(); setErr(""); setOk(false);
    if (val.length < 5) { setErr("Too short!"); return; }
    try {
      await addDoc(collection(db, "feedback"), { user: user.email, val, time: Date.now() });
      setOk(true); setVal("");
    } catch { setErr("Network error!") }
  }
  return (
    <div className="py-14 max-w-xl mx-auto px-4 animate-fadein">
      <h2 className="text-white font-bold text-2xl mb-5">💬 Feedback</h2>
      <form onSubmit={send} className="flex flex-col gap-5">
        <textarea className="rounded-xl bg-white/5 border border-white/10 text-white px-5 py-3 outline-none focus:border-blue-400 transition min-h-[120px]"
          placeholder="Share feedback, ideas, bugs..." value={val} onChange={e => setVal(e.target.value)} minLength={5} required />
        {err && <div className="text-red-400 text-sm">{err}</div>}
        {ok && <div className="text-green-400 text-sm">Thank you for the feedback!</div>}
        <button type="submit" className="w-fit mx-auto px-8 py-2 bg-indigo-700 text-white rounded-xl font-bold hover:bg-blue-700 transition cursor-pointer">Send</button>
      </form>
    </div>
  );
}

// ==== DANGER ZONE / FACTORY RESET ====
function DangerZoneTab({ user }: { user: User }) {
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  
  async function handleDelete() {
    setDeleting(true); setErr("");
    try {
      const daysSnap = await getDocs(collection(db, "trackers", user.uid, "days"));
      await Promise.all(daysSnap.docs.map(docu => deleteDoc(docu.ref)));
      setDone(true);
      setConfirm(false);
    } catch (e) { setErr("Error! Try again or contact support."); setDone(false); }
    setDeleting(false);
  }

  return (
    <div className="py-10 flex flex-col items-center max-w-xl mx-auto px-4 animate-fadein">
      <div className="p-6 bg-red-900/20 rounded-xl mb-6 text-center w-full max-w-md shadow-lg">
        <div className="text-xl text-red-400 font-bold mb-5 text-left">Danger Zone</div>
        <div className="mb-5 text-white/80 text-center max-w-sm mx-auto">
          <b className="text-md block mb-2">Clear All Data / Factory Reset</b>
          <span className="text-sm text-zinc-300 block">
            This will <span className="font-bold text-red-400">delete all your tracker data permanently</span>. This cannot be undone!
          </span>
        </div>
        <button className="px-8 py-2 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-800 transition cursor-pointer flex items-center justify-center gap-2 mx-auto"
          onClick={() => setConfirm(true)} disabled={deleting}>
          🗑 Clear All My Data
        </button>
      </div>
      {confirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-[350px] shadow-lg border border-red-200 flex flex-col gap-5 text-center animate-fadein">
            <div className="text-xl font-bold text-red-600">Are you SURE?</div>
            <div className="text-zinc-900">This will delete <b>all</b> your data for all time, for this account. You CANNOT undo this action!</div>
            {err && <div className="text-red-700 font-bold text-xs">{err}</div>}
            <div className="flex gap-4 justify-center mt-2">
              <button className="bg-zinc-300 text-zinc-800 px-6 py-2 rounded-full font-bold hover:bg-zinc-400 cursor-pointer" onClick={() => setConfirm(false)} disabled={deleting}>Cancel</button>
              <button className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 cursor-pointer" disabled={deleting} onClick={handleDelete}>Delete Everything</button>
            </div>
            {deleting && <div className="text-zinc-700 text-xs mt-2">Deleting...</div>}
          </div>
        </div>
      )}
      {done && (
        <div className="mt-6 text-green-400 font-bold text-lg text-center">All your data deleted! You can start fresh now 🚀</div>
      )}
    </div>
  );
}

// === LOADING ANIMATION ===
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#16192c]">
      <span className="text-xl text-white/60 animate-pulse">Loading...</span>
    </div>
  );
}

// ==== MAIN APP ROUTER ====
export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState("features");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u); setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  if (!authChecked) return <LoadingScreen />;
  if (!user) return <AuthPage onLogIn={(u) => setUser(u)} />;

  return (
    <div className="min-h-screen flex flex-col bg-[#20223A]">
      <MaintenanceBanner />
      <AnnouncementBanner />
      
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-[70px] sm:w-[180px] bg-[#151727] flex flex-col py-8 shadow-xl border-r border-white/5">
          <div className="flex-1 flex flex-col gap-2">
            {TABS.map(t => (
              <button key={t.key}
                className={`flex items-center gap-3 px-2 py-3 text-lg font-bold rounded-md transition cursor-pointer
                 ${t.key === tab ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "text-zinc-400 hover:bg-[#22242d] hover:text-white"}`}
                onClick={() => setTab(t.key)}
              >
                <span className="ml-3 sm:ml-4 inline-block">{t.icon}</span>
                <span className="hidden sm:inline text-sm tracking-wide">{t.label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => signOut(auth)} className="mt-12 mb-2 mx-2 sm:mx-4 py-2 bg-red-600 rounded-xl text-white font-medium hover:bg-red-700 transition cursor-pointer text-sm">Logout</button>
        </div>

        {/* Primary Main Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {tab === "dashboard" && (
            <div className="pt-10 text-white font-bold text-2xl text-center">Welcome, {user.email}</div>
          )}
          {tab === "features" && (
            <FeaturesTabMain user={user} />
          )}
          {tab === "analytics" && (
            <AnalyticsTab user={user} />
          )}
          {tab === "calendar" && (
            <CalendarTab user={user} />
          )}
          {tab === "profile" && (
            <ProfileTab user={user} />
          )}
          {tab === "chat" && (
            <UserChat user={user} />
          )}
          {tab === "settings" && (
            <DangerZoneTab user={user} />
          )}
          {tab === "info" && (
            <div className="max-w-3xl mx-auto mt-10">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl text-white animate-fadein">
                <h1 className="text-4xl font-extrabold text-center mb-2 flex items-center justify-center gap-2">
                  🧑‍💻 Developer Information
                </h1>
                <p className="text-center text-zinc-400 text-sm mb-8">
                  Built with ❤️ using Next.js + Firebase
                </p>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner">
                    <h2 className="text-blue-400 text-lg font-bold mb-2 flex items-center gap-2">👑 Developer</h2>
                    <p className="text-base font-medium">Name: <span className="text-white font-semibold">Ritik Bhagoliya</span></p>
                    <p className="text-sm mt-3 leading-relaxed text-zinc-300">
                      <span className="font-bold text-zinc-400">Roles:</span><br />
                      • THE CEO<br />
                      • THE FOUNDER<br />
                      • THE CODER<br />
                      • THE DEVELOPER
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner">
                    <h2 className="text-green-400 text-lg font-bold mb-2 flex items-center gap-2">📧 Contact</h2>
                    <a href="mailto:bhagoliyajitendra@gmail.com" className="text-blue-400 hover:underline font-mono text-sm break-all">
                      bhagoliyajitendra@gmail.com
                    </a>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner">
                    <h2 className="text-red-400 text-lg font-bold mb-2 flex items-center gap-2">▶️ YouTube Channel</h2>
                    <a href="https://youtube.com/@minddecoded-b8v?si=dVjWKjUhZGmGPr9u" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm font-medium">
                      Mind Decoded
                    </a>
                  </div>
                </div>

                <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-zinc-500 font-mono tracking-wider">
                  <p>© {new Date().getFullYear()} Ritik Tracker</p>
                  <p className="mt-1 text-zinc-400 font-sans font-semibold">Designed & Developed by Ritik Bhagoliya</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}