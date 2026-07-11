'use client';

import { useEffect, useState } from "react";
import { auth, db } from "../../src/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const ADMIN_EMAIL = "bhagoliyaritik@gmail.com";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      setAllowed(true);

      const snap = await getDocs(collection(db, "users"));
      const list: any[] = [];

      snap.forEach((doc) => {
        list.push(doc.data());
      });

      setUsers(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center text-3xl font-bold">
        ❌ Access Denied
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        👑 Ritik Tracker Admin Panel
      </h1>

      <div className="bg-zinc-900 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold">
          Total Users : {users.length}
        </h2>
      </div>

      <div className="bg-zinc-900 rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-5">
          Registered Users
        </h2>

        {users.map((user, index) => (

          <div
            key={index}
            className="border-b border-zinc-700 py-3"
          >

            <p>
              📧 {user.email}
            </p>

            <p className="text-sm text-zinc-400">
              UID : {user.uid}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}