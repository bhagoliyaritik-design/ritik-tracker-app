"use client";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/firebaseConfig";
import { useEffect, useState } from "react";

export function ChatUsersList({ onSelect }:{onSelect:(id:string)=>void}) {
  const [chatIds, setChatIds] = useState<string[]>([]);
  useEffect(()=>{
    getDocs(collection(db,"chats")).then(snap=>{
      setChatIds(snap.docs.map(d=>d.id));
    });
  },[]);
  return (
    <ul className="mb-3 space-y-2">
      {chatIds.length === 0 && <li className="text-gray-400">No chats started yet.</li>}
      {chatIds.map(id=>
        <li key={id}>
          <button className="underline text-blue-400" onClick={()=>onSelect(id)}>
            {id}
          </button>
        </li>
      )}
    </ul>
  );
}