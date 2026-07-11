'use client';

import { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<{title?:string, message?:string}|null>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "announcements", "current"), (snap) => {
      if (snap.exists()) {
        setAnnouncement(snap.data());
        setShow(true);
      } else {
        setAnnouncement(null);
        setShow(false);
      }
    });
    return () => unsub();
  }, []);

  if (!announcement?.title || !show) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center animate-fadein">
      <div className="m-2 px-8 py-4 rounded-xl shadow-2xl bg-gradient-to-r from-blue-950 to-indigo-900 border border-blue-400 text-white flex items-center gap-6 max-w-xl w-full">
        <div className="flex-1">
          <div className="font-bold text-lg flex items-center gap-2">📢 {announcement.title}</div>
          <div className="text-sm mt-1">{announcement.message}</div>
        </div>
        <button className="text-xl ml-4 hover:text-blue-300" onClick={()=>setShow(false)}>&times;</button>
      </div>
      <style>{`
        .animate-fadein { animation: fadein 0.7s cubic-bezier(.22,1,.36,1);}
        @keyframes fadein { from { opacity:0; transform: translateY(-40px);} to { opacity:1; transform: translateY(0);}}
      `}</style>
    </div>
  );
}