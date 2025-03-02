// app/chat/[id]/page.tsx

import { notFound } from "next/navigation";
import React from "react";
import { ChatClient } from "./ChatClient";

// 1) A Server Component that fetches initial data.
export default async function ChatPage({ params }: { params: { id: string } }) {
  const chatId = await params.id;

  // Fetch initial chat data from your backend
  const response = await fetch(`http://backend:3000/chat/${chatId}`, {
    // Example: pass any necessary headers (e.g. Authorization) if required
    headers: {
      // Authorization: "Bearer <token>",
    },
    // Force fresh data each time (no-store) 
    // so the server component always fetches the latest on first load or refresh
    cache: "no-store",
  });

  if (!response.ok) {
    return notFound();
  }

  const data = await response.json();
  // data = { chatData: {...}, chatHistory: [...] }

  return (
    // 2) Render a Client Component for interactive UI
    <ChatClient chatId={chatId} initialData={data} />
  );
}