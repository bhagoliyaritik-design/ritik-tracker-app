'use client';

import { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { auth } from "../src/firebaseConfig";
import { AnimatePresence, motion } from "framer-motion";

export default function MaintenanceBanner() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "config"), (snap) => {
      setIsMaintenance(snap.exists() ? !!snap.data()?.maintenance : false);
      setLoading(false);
    });
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setIsAdmin(user?.email === "bhagoliyaritik@gmail.com");
    });
    return () => {
      unsub();
      unsubscribeAuth();
    };
  }, []);

  if (loading || !isMaintenance || isAdmin) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, type: "spring", damping: 24, stiffness: 270 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      >
        <div className="bg-yellow-200 rounded-2xl shadow-lg p-10 text-2xl text-black font-bold border-2 border-yellow-400">
          🚧 Website Under Maintenance <br />
          Please check back later.
        </div>
      </motion.div>
    </AnimatePresence>
  );
}