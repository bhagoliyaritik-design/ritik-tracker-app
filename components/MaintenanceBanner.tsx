'use client';

import { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { auth } from "../src/firebaseConfig";

export default function MaintenanceBanner() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "config"), (snap) => {
      setIsMaintenance(snap.exists() ? !!snap.data()?.maintenance : false);
      setLoading(false);
    });
    // Check if admin
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setIsAdmin(user?.email === "bhagoliyaritik@gmail.com");
    });
    return () => {
      unsub();
      unsubscribeAuth();
    };
  }, []);

  if (loading) return null;
  if (!isMaintenance) return null;
  if (isAdmin) return null; // admin ko allowed

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center ">
      <div className="bg-yellow-200 rounded-2xl shadow-lg p-10 text-2xl text-black font-bold">
        🚧 Website Under Maintenance <br />
        Please check back later.
      </div>
    </div>
  );
}