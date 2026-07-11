'use client';

import { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<{ title?: string, message?: string } | null>(null);
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
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -80, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.55, type: "spring", damping: 27, stiffness: 300 }}
        className="fixed top-0 left-0 w-full z-50 flex justify-center"
      >
        <div className="m-2 px-8 py-4 rounded-xl shadow-2xl bg-gradient-to-r from-blue-950 to-indigo-900 border border-blue-400 text-white flex items-center gap-6 max-w-xl w-full">
          <div className="flex-1">
            <div className="font-bold text-lg flex items-center gap-2">📢 {announcement.title}</div>
            <div className="text-sm mt-1">{announcement.message}</div>
          </div>
          <button className="text-xl ml-4 hover:text-blue-300" onClick={() => setShow(false)}>&times;</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}