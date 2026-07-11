'use client'
import { useState, useEffect } from "react";
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
import PushNotificationButton from "../components/PushNotificationButton";

// Sidebar Tabs
const TABS = [
  { key: "dashboard", label: "Dashboard", icon: "🏡" },
  { key: "features", label: "Main Features", icon: "⭐" },
  { key: "analytics", label: "Analytics", icon: "📈" },
  { key: "calendar", label: "Calendar", icon: "📅" },
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "feedback", label: "Feedback", icon: "💬" },
  { key: "settings", label: "Settings", icon: "⚙️" },
  { key: "info", label: "Info", icon: "ℹ️" }
];

// Util: For date keys (YYYY-MM-DD)
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
}

// Yes/No Button Group
function YesNo({ value, onChange }: { value: boolean | null, onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3 mt-2">
      <button className={`px-5 py-1 rounded-full font-bold ${value === true ? "bg-green-500 text-white" : "bg-white/10 text-zinc-200 hover:bg-green-500/80 hover:text-white"}`} onClick={() => onChange(true)} type="button">Yes</button>
      <button className={`px-5 py-1 rounded-full font-bold ${value === false ? "bg-red-500 text-white" : "bg-white/10 text-zinc-200 hover:bg-red-500/80 hover:text-white"}`} onClick={() => onChange(false)} type="button">No</button>
    </div>
  );
}

// Card UI
function Card({ title, icon, children }: { title: string, icon: string, children: any }) {
  return (
    <div className="card-fadein bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-lg shadow-lg flex flex-col gap-2 min-h-[95px] mb-2">
      <div className="flex items-center gap-2 mb-1 text-lg font-semibold text-white">
        <span>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

// AUTH PAGE
function AuthPage({ onLogIn }: { onLogIn: () => void }) {
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
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    pass
  );

  await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    createdAt: serverTimestamp(),
  });

  setInfo("Account created! Login now.");
  setIsNew(false);
} else {
  await signInWithEmailAndPassword(auth, email, pass);
  onLogIn();
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
      setInfo('Reset link sent! Check email inbox/spam.'); setIsReset(false);
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", "").replace(".", ""));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#22244d] to-[#1C1C21]">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-10 py-12 shadow-2xl w-full max-w-md animate-fadein">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Ritik Tracker</h1>
        <p className="text-zinc-300 mb-5">
          {isReset ? "Reset your password" : isNew ? "Create new account" : "Login with your account"}
        </p>
        <form className="flex flex-col gap-5" onSubmit={isReset ? handleReset : handleSubmit}>
          <input type="email" className="bg-white/10 rounded-xl px-5 py-3 text-white outline-none border border-white/10 focus:border-blue-400 transition placeholder:text-zinc-400"
            placeholder="Email address" value={email} onChange={e => { setError(""); setInfo(""); setEmail(e.target.value) }} required autoFocus />
          {!isReset && (
            <input type="password" className="bg-white/10 rounded-xl px-5 py-3 text-white outline-none border border-white/10 focus:border-blue-400 transition placeholder:text-zinc-400"
              placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required minLength={6} />
          )}
          {error && <div className="text-red-400 text-center text-sm">{error}</div>}
          {info && <div className="text-green-400 text-center text-sm">{info}</div>}
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:scale-[1.04] transition-transform mb-2" disabled={loading}>
            {loading ? (isReset ? "Sending..." : isNew ? "Signing up..." : "Logging in...") : isReset ? "Send Reset Link" : isNew ? "Sign Up" : "Login"}
          </button>
          <div className="text-zinc-300 mt-2 text-center flex flex-col gap-2">
            <span>
              {isReset ? (
                <span className="underline text-blue-400 cursor-pointer ml-1" onClick={() => setIsReset(false)}>
                  Back to Login
                </span>
              ) : (
                <>
                  <span className="underline text-blue-400 cursor-pointer mr-2"
                    onClick={() => setIsReset(true)}>
                    Forgot Password?
                  </span>
                  {isNew ? "Already have an account?" : "Don't have an account?"}
                  <span className="text-blue-400 underline cursor-pointer ml-1" onClick={() => { setIsNew(x => !x); setError(""); setInfo(""); }}>
                    {isNew ? "Login" : "Sign Up"}
                  </span>
                </>
              )}
            </span>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fadein { from { opacity:0; transform: scale(0.97) translateY(24px);} to { opacity:1; transform: scale(1) translateY(0);}}
        .animate-fadein { animation: fadein 0.7s cubic-bezier(.22,1,.36,1);}
      `}</style>
    </div>
  );
}

// ==== Main Features (ALL trackers, save lock, real) ====
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
    const fetch= async()=>{
      setLoading(true);
      try {
        const ref = doc(db, "trackers", user.uid, "days", data.date);
        const snap = await getDoc(ref);
        if (snap.exists()) { setData(snap.data() as typeof data); setHasSaved(true); }
        else setHasSaved(false);
      } catch{setHasSaved(false);}
      setLoading(false);
    }; fetch();
    // eslint-disable-next-line
  }, [user, data.date]);

  async function saveAll() {
    if (!user) return;
    setLoading(true); setInfo('');
    try {
      const ref = doc(db, "trackers", user.uid, "days", data.date);
      await setDoc(ref, { ...data, savedAt: serverTimestamp(), alreadySaved: true });
      setInfo("Already saved for today. Come back tomorrow 🌟");
      setHasSaved(true);
    } catch (err: any) { setInfo("Failed to save"); }
    setLoading(false); setTimeout(() => setInfo(''), 4000);
  }
  const update = (field: keyof typeof data, value: any) => setData(d => ({ ...d, [field]: value }));

  return (
    <div className="w-full max-w-2xl px-2 py-1 flex flex-col gap-7">
      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-7">
        <Card title="Water Intake" icon="💧">
          <div className="flex items-center gap-2">
            <button onClick={() => update("water", Math.max(data.water - 250, 0))} className="font-bold text-xl px-3 py-1 bg-sky-500/50 rounded hover:bg-sky-400">-</button>
            <span className="text-lg font-mono text-white">{data.water} ml</span>
            <button onClick={() => update("water", data.water + 250)} className="font-bold text-xl px-3 py-1 bg-blue-500/80 rounded hover:bg-blue-600">+</button>
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
            <button onClick={() => update("study", Math.max(data.study - 1, 0))} className="font-bold text-xl px-3 py-1 bg-blue-900/80 rounded hover:bg-blue-600">-</button>
            <span className="text-lg font-mono text-white">{data.study}</span>
            <button onClick={() => update("study", data.study + 1)} className="font-bold text-xl px-3 py-1 bg-blue-900/80 rounded hover:bg-blue-600">+</button>
          </div>
        </Card>
        <Card title="Wake Up Time" icon="⏰">
          <input type="time" className="rounded bg-white/10 text-white border px-3 py-1" value={data.wake} onChange={e => update("wake", e.target.value)} />
        </Card>
        <Card title="Sleep Time" icon="🌙">
          <input type="time" className="rounded bg-white/10 text-white border px-3 py-1" value={data.sleep} onChange={e => update("sleep", e.target.value)} />
        </Card>
      </div>
      {/* Save Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={saveAll}
          disabled={loading || hasSaved}
          className={`rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-xl font-bold text-white px-8 py-4 shadow-2xl
         hover:scale-105 hover:from-indigo-700 hover:to-blue-400 transition-all ring-2 ring-blue-300/30 opacity-${hasSaved ? "60" : "100"}`}>
          {hasSaved ? "Already Saved for Today" : loading ? "Saving..." : "Save Today's Data"}
        </button>
        {hasSaved && <div className="text-blue-400 mt-2 text-center">Come back tomorrow to track again! 😇</div>}
        {info && <div className="text-green-400 font-semibold mt-2 text-center text-lg">{info}</div>}
      </div>
    </div>
  );
}

// ==== ANALYTICS TAB (REAL FIRESTORE + CHARTS) ====
function AnalyticsTab({ user }: { user: User }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAll() {
      if (!user) return;
      setLoading(true);
      const q = collection(db, "trackers", user.uid, "days");
      const querySnapshot = await getDocs(q);
      let arr: any[] = [];
      querySnapshot.forEach(doc => arr.push({id: doc.id, ...doc.data()}));
      arr = arr.sort((a, b) => a.id.localeCompare(b.id));
      setHistory(arr);
      setLoading(false);
    }
    getAll();
  }, [user]);

  // Calculate streak
  let streak = 0;
  history.slice().reverse().forEach((day) => {
    if ((day.study || 0) > 0) streak++;
    else return;
  });

  // Last 7 days for chart (blank fill)
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
    <div className="max-w-2xl mx-auto pt-6 pb-16">
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

// ==== CALENDAR TAB (REAL DATA) ====
function CalendarTab({ user }: { user: User }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    async function getAll() {
      if (!user) return;
      setLoading(true);
      const q = collection(db, "trackers", user.uid, "days");
      const querySnapshot = await getDocs(q);
      let arr: any[] = [];
      querySnapshot.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
      setEntries(arr);
      setLoading(false);
    }
    getAll();
  }, [user]);

  const monthStart = startOfMonth(month); const monthEnd = endOfMonth(month);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const cols = []; let day = startDate; while (day <= endDate) {
    cols.push(day); day = addDays(day, 1);
  }
  function dayStatus(day: Date) {
    const id = format(day, "yyyy-MM-dd");
    const entry = entries.find(e => e.id === id);
    if ((entry?.water || 0) >= 1000 || entry?.fit || entry?.yoga) return "done";
    if (entry) return "notdone";
    return "";
  }
  const sel = entries.find(e => e.id === selected);

  return (
    <div className="max-w-xl mx-auto pt-8 pb-4">
      <h2 className="font-bold text-lg text-white mb-3">My Progress Calendar</h2>
      <div className="bg-[#261e3f] rounded-xl p-3 mb-5 shadow-lg">
        {/* Month switcher */}
        <div className="flex text-zinc-200 justify-between items-center mb-2 px-3">
          <button onClick={() => setMonth(subMonths(month, 1))}>&lt;&lt;</button>
          <b className="font-mono">{format(month, "MMMM yyyy")}</b>
          <button onClick={() => setMonth(addMonths(month, 1))}>&gt;&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 mt-2 mb-3">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d =>
            <div key={d} className="text-center text-xs text-blue-200 font-bold">{d}</div>
          )}
          {cols.map((dt, i) =>
            <button key={i}
              onClick={() => { setSelected(format(dt, "yyyy-MM-dd")) }}
              className={[
                "aspect-[1/1] w-7 sm:w-9 text-sm font-semibold rounded-full transition-all outline-none",
                isSameMonth(dt, month) ? "text-white" : "text-zinc-400 bg-transparent",
                isSameDay(format(dt, "yyyy-MM-dd"), selected) ? "bg-yellow-500 text-black scale-105 ring-2 ring-blue-300" : "",
                dayStatus(dt) === "done" ? "bg-green-500/70" : ""
              ].join(" ")}>{format(dt, "d")}
            </button>
          )}
        </div>
        {/* Day Details */}
        <div className="mt-0 bg-black/30 p-3 rounded-lg mb-2 text-zinc-300 text-left">
          <div className="font-bold mb-1">{selected}</div>
          <div>
            Uthna: <b>{sel?.wake || "--"}</b><br />
            Lectures: <b>{sel?.study ?? "--"}</b><br />
            Mood: <b>{sel?.mood || "--"}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==== PROFILE TAB ====
function ProfileTab({ user }: { user: User }) {
  return (
    <div className="flex flex-col items-center py-10 gap-5">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-3xl text-white grid place-items-center font-bold uppercase shadow-xl">{user?.email?.[0]}</div>
      <div className="text-white font-bold text-xl">{user?.email}</div>
      <div className="text-zinc-300 text-lg">Premium Member 🚀</div>
    </div>
  );
}

// ==== FEEDBACK FORM ====
function FeedbackTab({ user }: { user: User }) {
  const [val, setVal] = useState(""); const [ok, setOk] = useState(false); const [err, setErr] = useState("");
  async function send(e: any) { e.preventDefault(); setErr(""); setOk(false);
    if (val.length < 5) { setErr("Too short!"); return; }
    try {
      await addDoc(collection(db, "feedback"), { user: user.email, val, time: Date.now() });
      setOk(true); setVal("");
    } catch { setErr("Network error!") }
  }
  return <div className="py-14 max-w-xl mx-auto">
    <h2 className="text-white font-bold text-2xl mb-5">💬 Feedback</h2>
    <form onSubmit={send} className="flex flex-col gap-5">
      <textarea className="rounded-xl bg-white/5 border border-white/10 text-white px-5 py-3"
        placeholder="Share feedback, ideas, bugs..." value={val} onChange={e => setVal(e.target.value)}
        minLength={5} required
      />
      {err && <div className="text-red-400 text-sm">{err}</div>}
      {ok && <div className="text-green-400 text-sm">Thank you for the feedback!</div>}
      <button type="submit" className="w-fit mx-auto px-8 py-2 bg-indigo-700 text-white rounded-xl font-bold hover:bg-blue-700">Send</button>
    </form>
  </div>
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
    } catch (e) { setErr("Error! Try again or contact support."); setDone(false); }
    setDeleting(false);
  }
  return (
    <div className="py-10 flex flex-col items-center max-w-xl mx-auto">
      <div className="p-6 bg-red-900/20 rounded-xl mb-6">
        <div className="text-xl text-red-400 font-bold mb-5">Danger Zone</div>
        <div className="mb-5 text-white/80 text-center max-w-sm">
          <b>Clear All Data / Factory Reset</b>
          <div><span className="text-sm text-red-300 block mt-2">This will <b>delete all your tracker data permanently</b>. This cannot be undone!</span></div>
        </div>
        <button className="px-8 py-2 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-800 transition"
          onClick={() => setConfirm(true)} disabled={deleting}>
          🗑 Clear All My Data
        </button>
      </div>
      {confirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
          <div className="bg-white/80 rounded-xl p-8 w-[350px] shadow-lg border border-red-200 flex flex-col gap-5 text-center">
            <div className="text-xl font-bold text-red-600">Are you SURE?</div>
            <div className="text-zinc-900">This will delete <b>all</b> your data for all time, for this account. You CANNOT undo this action!</div>
            {err && <div className="text-red-700 font-bold">{err}</div>}
            <div className="flex gap-4 justify-center">
              <button className="bg-zinc-300 px-6 py-2 rounded-full font-bold" onClick={() => setConfirm(false)} disabled={deleting}>Cancel</button>
              <button className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700" disabled={deleting} onClick={handleDelete}>Delete Everything</button>
            </div>
            {deleting && <div className="text-zinc-700 text-sm">Deleting...</div>}
          </div>
        </div>
      )}
      {done && (
        <div className="mt-6 text-green-400 font-bold text-xl">All your data deleted! You can start fresh now 🚀</div>
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

// ==== MAIN APP ====
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
  if (!user) return <AuthPage onLogIn={() => setUser(auth.currentUser)} />;

  // Sidebar/tabs layout + active tab renderer
  return (
    <div className="min-h-screen flex bg-[#20223A]">
        <MaintenanceBanner />

        <AnnouncementBanner /> {/* ⬅️ YAHAN ADD KARO */}
        <PushNotificationButton />

      {/* Sidebar */}
      <div className="min-h-screen w-[70px] sm:w-[180px] bg-[#151727] flex flex-col py-8 shadow-xl">
        <div className="flex-1 flex flex-col gap-2">
          {TABS.map(t => (
            <button key={t.key}
              className={`flex items-center gap-3 px-2 py-3 text-lg font-bold rounded-md transition
               ${t.key === tab ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "text-zinc-400 hover:bg-[#22242d] hover:text-white"}`}
              onClick={() => setTab(t.key)}
            >
              <span className={"ml-3 sm:ml-0 inline-block"}>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => signOut(auth)} className="mt-12 mb-2 px-4 py-2 bg-red-600 rounded-full text-white">Logout</button>
      </div>
      {/* Main Content */}
      <div className="flex-1 min-h-screen overflow-y-auto p-4">
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
        {tab === "feedback" && (
          <FeedbackTab user={user} />
        )}
        {tab === "settings" && (
          <DangerZoneTab user={user} />
        )}
        {tab === "info" && (
  <div className="max-w-3xl mx-auto mt-10">
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-white">

      <h1 className="text-4xl font-extrabold text-center mb-2">
        👨‍💻 Developer Information
      </h1>

      <p className="text-center text-zinc-300 mb-8">
        Built with ❤️ using Next.js + Firebase
      </p>

      <div className="space-y-6">

        <div className="bg-white/5 rounded-2xl p-5">
          <h2 className="text-blue-400 text-xl font-bold mb-2">
            👑 Developer
          </h2>

          <p className="text-lg">
            <span className="font-bold">Name:</span> Ritik Bhagoliya
          </p>

          <p className="text-lg mt-2">
            <span className="font-bold">Roles:</span><br />
            • THE CEO<br />
            • THE FOUNDER<br />
            • THE CODER<br />
            • THE DEVELOPER
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-5">
          <h2 className="text-green-400 text-xl font-bold mb-2">
            📧 Contact
          </h2>

          <a
            href="mailto:bhagoliyajitendra@gmail.com"
            className="text-blue-400 hover:underline break-all"
          >
            bhagoliyajitendra@gmail.com
          </a>
        </div>

        <div className="bg-white/5 rounded-2xl p-5">
          <h2 className="text-red-400 text-xl font-bold mb-2">
            ▶️ YouTube Channel
          </h2>

          <a
            href="https://youtube.com/@minddecoded-b8v?si=dVjWKjUhZGmGPr9u"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline break-all"
          >
            Mind Decoded
          </a>
        </div>

      </div>

      <div className="mt-10 border-t border-white/10 pt-6 text-center text-zinc-400">
        <p>© {new Date().getFullYear()} Ritik Tracker</p>
        <p className="mt-2">
          Designed & Developed by <span className="font-bold text-white">Ritik Bhagoliya</span>
        </p>
      </div>

    </div>
  </div>
)}
      </div>
    </div>
  );
}