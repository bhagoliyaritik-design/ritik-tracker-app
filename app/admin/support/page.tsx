"use client";
import { useState } from "react";
import { ChatUsersList } from "../../../components/ChatUsersList";
import { AdminChat } from "../../../components/AdminChat";

export default function AdminSupportPage() {
  const [selectedId, setSelectedId] = useState<string|null>(null);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-3">💬 Support Chats</h1>
      <ChatUsersList onSelect={setSelectedId} />
      {selectedId && <AdminChat chatId={selectedId} />}
      {!selectedId && <div className="text-gray-400 mt-5">Select a user chat to reply.</div>}
    </div>
  );
}