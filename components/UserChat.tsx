'use client';
import { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";

export default function UserChat({ user }: { user: any }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  
  useEffect(() => {
    // Realtime Firestore listener
    const q = query(collection(db, "chats", user.uid, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => d.data()));
    });
    return () => unsub();
  }, [user.uid]);
  
  async function sendMessage(e: any) {
    e.preventDefault();
    if(msg.trim().length<1) return;
    await addDoc(collection(db,"chats",user.uid,"messages"), {
      from: "user",
      text: msg,
      createdAt: serverTimestamp()
    });
    setMsg("");
  }
  
  return (
    <div className="max-w-md mx-auto p-4 bg-slate-800 rounded-xl">
      <h2 className="font-bold text-xl mb-2">💬 Live Chat with Support</h2>
      <div className="h-56 overflow-auto mb-3 bg-black/40 rounded-lg p-2 flex flex-col">
        {messages.map((m,i) =>
          <div key={i} className={"mb-2 " + (m.from==="admin" ? "text-green-400 text-right" : "text-blue-300")}>
            <span>{m.from==="admin"?"👨‍💼 Admin:":"🧑 You:"}</span> {m.text}
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-lg"
          placeholder="Type your message..."
          value={msg} onChange={e=>setMsg(e.target.value)}
        />
        <button
          className="bg-blue-600 px-4 py-2 text-white font-bold rounded-lg"
          type="submit"
        >Send</button>
      </form>
    </div>
  );
}