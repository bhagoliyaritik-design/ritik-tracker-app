'use client';

import { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default function UserChat({ user }: { user: any }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "chats", user.uid, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [user?.uid]);

  async function sendMessage(e: any) {
    e.preventDefault();

    if (!msg.trim()) return;

    try {
      await setDoc(
        doc(db, "chats", user.uid),
        {
          uid: user.uid,
          email: user.email || "",
          lastMessage: msg,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(db, "chats", user.uid, "messages"), {
        from: "user",
        text: msg,
        createdAt: serverTimestamp(),
      });

      setMsg("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  }

  async function clearChat() {
    const ok = window.confirm(
      "Are you sure?\n\nThis will permanently delete your chat history."
    );

    if (!ok) return;

    setDeleting(true);

    try {
      const snap = await getDocs(
        collection(db, "chats", user.uid, "messages")
      );

      await Promise.all(
        snap.docs.map((d) => deleteDoc(d.ref))
      );

      await deleteDoc(doc(db, "chats", user.uid));

      alert("Chat cleared successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to clear chat.");
    }

    setDeleting(false);
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-slate-800 rounded-xl border border-slate-700">

      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-xl">
          💬 Live Chat with Support
        </h2>

        <button
          type="button"
          onClick={clearChat}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-3 py-2 rounded-lg text-white font-bold"
        >
          {deleting ? "Deleting..." : "🗑 Clear Chat"}
        </button>
      </div>

      <div className="h-60 overflow-auto mb-3 bg-black/40 rounded-lg p-3 flex flex-col gap-2">

        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-5">
            No messages yet.
          </div>
        )}

        {messages.map((m: any) => (
          <div
            key={m.id}
            className={
              m.from === "admin"
                ? "text-green-400 text-right"
                : "text-blue-300 text-left"
            }
          >
            <span className="font-semibold">
              {m.from === "admin"
                ? "👨‍💼 Admin:"
                : "🧑 You:"}
            </span>{" "}
            {m.text}
          </div>
        ))}

      </div>

      <form onSubmit={sendMessage} className="flex gap-2">

        <input
          className="flex-1 px-3 py-2 rounded-lg text-black"
          placeholder="Type your message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-bold"
          type="submit"
        >
          Send
        </button>

      </form>

    </div>
  );
}