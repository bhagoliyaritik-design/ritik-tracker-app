"use client";
import { useState, useEffect } from "react";
import { db } from "../src/firebaseConfig";
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "firebase/firestore";

export function AdminChat({ chatId }:{chatId:string}) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => d.data()));
    });
    return () => unsub();
  }, [chatId]);
  async function sendAdminMsg(e:any) {
    e.preventDefault();
    if(msg.trim().length<1) return;
    await addDoc(collection(db,"chats",chatId,"messages"), {
      from: "admin",
      text: msg,
      createdAt: serverTimestamp()
    });
    setMsg("");
  }
  return (
    <div className="max-w-lg mx-auto p-4 bg-black/30 rounded-xl">
      <div className="text-xl font-bold mb-1">Chat with: {chatId}</div>
      <div className="h-60 overflow-auto bg-zinc-900 rounded-lg mb-4 p-2">
        {messages.map((m,i) =>
          <div key={i} className={"mb-2 "+(m.from==="admin"?"text-green-400 text-right":"text-blue-300")}>
            {m.from==="admin"?"👨‍💼 Admin:":"👤 User:"} {m.text}
          </div>
        )}
      </div>
      <form onSubmit={sendAdminMsg} className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-lg"
          placeholder="Type admin reply..."
          value={msg}
          onChange={e=>setMsg(e.target.value)}
        />
        <button className="bg-green-600 px-4 py-2 text-white font-bold rounded-lg" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}