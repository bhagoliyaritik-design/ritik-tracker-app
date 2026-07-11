// app/admin/page.tsx

"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  serverTimestamp,
  query,
  
} from "firebase/firestore";

import { auth, db } from "../../src/firebaseConfig";
import { updateDoc } from "firebase/firestore";

// ---- Config ----
const ADMIN_EMAIL = "bhagoliyaritik@gmail.com";

// ---- Hooks ----
function useAdminCheck() {
  const [admin, setAdmin] = useState<null | FirebaseUser | false>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.email === ADMIN_EMAIL) setAdmin(user);
      else setAdmin(false);
    });
    return unsub;
  }, []);
  return admin;
}

type UserRow = { uid: string; email: string; signupDate?: number | null };

// ---- Main ----
export default function AdminPanel() {
  const admin = useAdminCheck();

  // Dashboard state
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usesSignupDate, setUsesSignupDate] = useState(false); // auto-detect

  const [announcement, setAnnouncement] = useState<{ title: string; message: string; createdAt?: any } | null>(null);
  const [announcementLoading, setAnnouncementLoading] = useState(true);

  // USER TABLE SEARCH
  const [userSearch, setUserSearch] = useState("");
  const filteredUsers = users.filter(
    (u: UserRow) =>
      (u.email?.toLowerCase()?.includes(userSearch.toLowerCase()) ?? false) ||
      u.uid.includes(userSearch)
  );

  // ANNOUNCEMENT FORM
  const [aTitle, setATitle] = useState("");
  const [aMessage, setAMessage] = useState("");
  const [aLoading, setALoading] = useState(false);

  // TOAST
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    toastTimer.current && clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }
  useEffect(() => () => { toastTimer.current && clearTimeout(toastTimer.current); }, []);

  // USERS REALTIME
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    let queriedUsers: UserRow[] = [];
    // First, check if at least one user has signupDate field:
    const snap = await getDocs(collection(db, "users"));
    let foundSignUpDate = false;
    let fallbackUsers: UserRow[] = [];
    snap.forEach(d => {
      const data = d.data();
      const hasSignupDate = typeof data.signupDate === "object" || typeof data.signupDate === "number";
      fallbackUsers.push({
        uid: d.id,
        email: data.email,
        signupDate:
          hasSignupDate
            ? (data.signupDate?._seconds ? data.signupDate._seconds * 1000
                                        : typeof data.signupDate === "number"
                                          ? data.signupDate
                                          : null)
            : null
      });
      if (hasSignupDate) foundSignUpDate = true;
    });
    setUsesSignupDate(foundSignUpDate);

    // Listen with or without "orderBy":
    let unsub: (() => void) | undefined;
    if (foundSignUpDate) {
      const q = query(collection(db, "users"));
      unsub = onSnapshot(q, (snap) => {
        setUsers(snap.docs
          .map(d => {
            const data = d.data();
            return {
              uid: d.id,
              email: data.email,
              signupDate:
                typeof data.signupDate === "object"
                  ? data.signupDate._seconds * 1000
                  : typeof data.signupDate === "number"
                    ? data.signupDate
                    : null
            };
          })
          .sort((a, b) => (b.signupDate || 0) - (a.signupDate || 0)));
        setUsersLoading(false);
      }, () => setUsersLoading(false));
    } else {
      unsub = onSnapshot(collection(db, "users"), (snap) => {
        setUsers(snap.docs.map(d => {
          const data = d.data();
          return {
            uid: d.id,
            email: data.email,
            signupDate: null
          };
        }));
        setUsersLoading(false);
      }, () => setUsersLoading(false));
    }
    // If there's a previous unsub, call it before re-subscribing (prevent leaks)
    return unsub;
  }, []);

  useEffect(() => { let unsub: (() => void) | void;
    loadUsers().then(fn => { unsub = fn; });
    return () => { if (typeof unsub === "function") unsub(); };
  }, [loadUsers]);

  // ANNOUNCEMENT REALTIME
  useEffect(() => {
    setAnnouncementLoading(true);
    const unsub = onSnapshot(doc(db, "announcements", "current"), (docSnap) => {
      setAnnouncement(docSnap.exists() ? (docSnap.data() as any) : null);
      setAnnouncementLoading(false);
    }, () => setAnnouncementLoading(false));
    return unsub;
  }, []);

  // DASHBOARD STATS
  const totalUsers = users.length;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const newToday = usesSignupDate
    ? users.filter(u => u.signupDate && u.signupDate >= today.getTime()).length
    : 0;
  const totalAnnouncements = announcement?.title ? 1 : 0;
  const lastAnnDate = announcement && announcement.createdAt?.seconds
    ? new Date(announcement.createdAt.seconds * 1000).toLocaleDateString()
    : "";

  // ANNOUNCEMENT PUBLISH
  const handleAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aTitle || !aMessage) return showToast("All fields required", "error");
    setALoading(true);
    try {
      // just overwrite "current" doc
      await setDoc(doc(db, "announcements", "current"), {
        title: aTitle,
        message: aMessage,
        createdAt: serverTimestamp(),
      });
      showToast("Announcement published!", "success");
      setATitle(""); setAMessage("");
    } catch {
      showToast("Failed to publish.", "error");
    }
    setALoading(false);
  };

  // ACCESS DENIED
  if (admin === false) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black/90 text-white">
        <div className="bg-red-700/70 p-8 rounded-2xl shadow-2xl flex flex-col gap-3 items-center max-w-xs">
          <span className="text-5xl mb-1">⛔</span>
          <span className="text-2xl font-bold mb-1">Access Denied</span>
          <div>You do not have permission to access Admin Panel.</div>
          <button
            onClick={() => signOut(auth)}
            className="mt-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold"
          >Log Out</button>
        </div>
      </div>
    );
  }
  if (admin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90 text-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#171a1f] via-[#131414] to-[#090c11] px-3 sm:px-8 py-10 text-white">
      {/* Toast */}
      {toast && (
        <div className={`
          fixed top-7 right-8 z-[99] px-4 py-3 rounded-xl font-semibold flex items-center gap-2
          shadow-lg animate-fade-in-up transition
          ${toast.type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-700 text-white"}
        `}>{toast.msg}</div>
      )}
      {/* Header */}
      <div className="mb-2 flex flex-wrap gap-2 items-center">
        <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg select-none">
          Admin Dashboard
        </span>
        <span className="ml-2 px-3 py-1 rounded-xl bg-green-600/60 font-semibold text-white text-xs">
          {admin.email}
        </span>
        <button
          onClick={() => signOut(auth)}
          className="ml-2 px-4 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs"
        >Log Out</button>
      </div>
          <div className="bg-zinc-900 rounded-xl p-6 mb-7 flex flex-col sm:flex-row gap-4 items-center">
      <button
        className="px-6 py-2 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-600"
        onClick={async ()=>{
          await updateDoc(doc(db, "settings", "config"), { maintenance: true });
          alert("Maintenance Enabled! 🚧");
        }}
      >🚧 Enable Maintenance Mode</button>
      <button
        className="px-6 py-2 rounded-xl bg-green-500 text-black font-bold hover:bg-green-600"
        onClick={async ()=>{
          await updateDoc(doc(db, "settings", "config"), { maintenance: false });
          alert("Maintenance Disabled! ✅");
        }}
      >✅ Disable Maintenance Mode</button>
    </div>
      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <GlassCard loading={usersLoading} title="Total Users" value={totalUsers} icon="👥" />
        <GlassCard loading={usersLoading} title="New Users Today" value={newToday} icon="🆕" />
        <GlassCard loading={announcementLoading} title="Announcements" value={totalAnnouncements} icon="📢" />
        <GlassCard loading={announcementLoading} title="Last Announcement"
          value={lastAnnDate || "N/A"} icon="🗓️" />
      </div>
      {/* USERS TABLE */}
      <div className="bg-white/10 dark:bg-black/40 backdrop-blur border border-white/10 rounded-2xl p-5 mb-7 shadow-lg transition">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
          <div className="flex-1 flex items-center gap-2">
            <input
              type="search"
              className="w-56 px-3 py-2 rounded-lg border bg-white/50 dark:bg-black/40 border-gray-300/20 focus:outline-none text-sm"
              placeholder="Search email or UID"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              autoCorrect="off"
            />
            <button
              className="ml-2 px-2 py-2 rounded-lg bg-blue-500/80 hover:bg-blue-700 text-white transition"
              title="Refresh Users"
              onClick={loadUsers}
              disabled={usersLoading}
            >
              <span className={usersLoading ? "animate-spin" : ""}>🔄</span>
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2 sm:mt-0">{filteredUsers.length} users</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm border-collapse">
            <thead>
              <tr className="bg-white/20 dark:bg-black/40">
                <th className="p-2 text-left font-semibold">Email</th>
                <th className="p-2 text-left font-semibold">UID</th>
                <th className="p-2 text-left font-semibold">Signup Date</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {usersLoading && (
                <tr><td colSpan={4}>
                  <div className="flex justify-center my-8"><LoadingSpinner /></div>
                </td></tr>
              )}
              {!usersLoading && !filteredUsers.length && (
                <tr>
                  <td colSpan={4}><div className="text-center opacity-50 p-6">No users found.</div></td>
                </tr>
              )}
              {filteredUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-white/10 transition">
                  <td className="p-2 max-w-xs truncate">{u.email}</td>
                  <td className="p-2 font-mono text-xs">{u.uid}</td>
                  <td className="p-2">{u.signupDate ? new Date(u.signupDate).toLocaleDateString() : "n/a"}</td>
                  <td className="p-2 text-right">
                    <button
                      className="bg-gray-700/30 hover:bg-gray-800/80 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                      onClick={() => { navigator.clipboard.writeText(u.email || ""); showToast("Copied!", "success"); }}
                    >Copy Email</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ANNOUNCEMENT FORM */}
      <form onSubmit={handleAnnouncement}
        className="bg-white/10 dark:bg-black/40 backdrop-blur border border-white/10 rounded-2xl p-5 mb-10 shadow-lg transition"
        autoComplete="off"
      >
        <div className="mb-3 text-lg font-semibold flex items-center gap-2">
          📝 New Announcement
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="flex-1 px-3 py-2 rounded-lg border bg-white/50 dark:bg-black/40 border-gray-300/20 focus:outline-none text-sm"
            placeholder="Announcement Title"
            value={aTitle}
            onChange={e => setATitle(e.target.value)}
            maxLength={50}
            required
            autoFocus
          />
          <textarea
            className="flex-[2] px-3 py-2 rounded-lg border bg-white/50 dark:bg-black/40 border-gray-300/20 focus:outline-none text-sm min-h-[44px]"
            placeholder="Write your message here..."
            value={aMessage}
            onChange={e => setAMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            className="ml-0 sm:ml-2 px-5 py-2 rounded-lg bg-green-500/90 hover:bg-green-600 font-semibold text-white transition min-w-[120px] disabled:opacity-50"
            disabled={aLoading}
          >{aLoading ? "Publishing..." : "Publish"}</button>
        </div>
      </form>
      {/* Card/Glass Animations <style> */}
      <style>{`
        @keyframes fade-in-up { 0% {opacity:0; transform: translateY(30px);} 100%{opacity:1;transform:translateY(0);} }
        .animate-fade-in-up { animation: fade-in-up 0.38s cubic-bezier(.33,1,.68,1) both;}
        .glass { background: rgba(255,255,255,0.13); box-shadow: 0 6px 40px rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.06);}
      `}</style>
    </main>
  );
}

// ----- Glass Effect Card Component -----
function GlassCard({ title, value, icon, loading }: {
  title: string, value: string | number, icon: string, loading?: boolean
}) {
  return (
    <div className="glass rounded-2xl shadow-md px-6 py-5 flex flex-col gap-1 cursor-default transition-transform hover:scale-[1.027] select-none border border-white/10">
      <div className="flex gap-2 items-center text-lg font-semibold">{icon} {title}</div>
      <div className="mt-1 mb-0.5 text-3xl font-extrabold tracking-tight">
        {loading ? <span className="h-7 w-16 bg-gray-300/30 animate-pulse block rounded" /> : value}
      </div>
    </div>
  );
}

// ----- Spinner ------
function LoadingSpinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-blue-400" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}