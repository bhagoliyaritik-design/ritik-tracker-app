"use client";

import { useState, useEffect } from "react";
import { db } from "../src/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export function AdminChat({ chatId }: { chatId: string }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
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
  }, [chatId]);

  async function sendAdminMsg(e: any) {
    e.preventDefault();

    if (!msg.trim()) return;

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        from: "admin",
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
      "Are you sure?\n\nThis will permanently delete this entire chat."
    );

    if (!ok) return;

    setDeleting(true);

    try {
      const snap = await getDocs(
        collection(db, "chats", chatId, "messages")
      );

      await Promise.all(
        snap.docs.map((d) => deleteDoc(d.ref))
      );

      await deleteDoc(doc(db, "chats", chatId));

      alert("Chat deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete chat.");
    }

    setDeleting(false);
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-black/30 rounded-xl border border-zinc-700">

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">
          💬 Chat with: {chatId}
        </h2>

        <button
          type="button"
          onClick={clearChat}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold"
        >
          {deleting ? "Deleting..." : "🗑 Clear Chat"}
        </button>
      </div>

      <div className="h-72 overflow-auto bg-zinc-900 rounded-lg mb-4 p-3 flex flex-col gap-2">

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
                ? "text-right text-green-400"
                : "text-left text-blue-300"
            }
          >
            <span className="font-semibold">
              {m.from === "admin"
                ? "👨‍💼 Admin:"
                : "👤 User:"}
            </span>{" "}
            {m.text}
          </div>
        ))}

      </div>

      <form onSubmit={sendAdminMsg} className="flex gap-2">

        <input
          className="flex-1 px-3 py-2 rounded-lg text-black"
          placeholder="Type admin reply..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <button
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-bold"
          type="submit"
        >
          Send
        </button>

      </form>

    </div>
  );
}