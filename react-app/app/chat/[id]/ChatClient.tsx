"use client";

import { useEffect, useState } from "react";

export function ChatClient({
  chatId,
  initialData,
}: {
  chatId: string;
  initialData: any;
}) {
  // We'll store the chat history in state
  const [chatHistory, setChatHistory] = useState(initialData.chatHistory || []);
  const [userMessage, setUserMessage] = useState("");

  // Utility to re-fetch updated chat data from the server
  const refreshChat = async () => {
    try {
      const res = await fetch(`http://localhost:3001/chat/${chatId}`, {
        headers: {
          // If needed, provide authorization or other headers here:
          // Authorization: "Bearer <token>",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to refresh chat");
      }
      const updatedData = await res.json();
      setChatHistory(updatedData?.chatHistory || []);
    } catch (err) {
      console.error(err);
      // You may want to avoid repeated alerts here if it's polling
      // alert("Could not refresh chat. Check console for details.");
    }
  };

  // Handler for sending user reply
  const handleSend = async () => {
    if (!userMessage.trim()) return;

    try {
      const res = await fetch(`http://localhost:3001/chat/${chatId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer <token>",
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      // Clear input
      setUserMessage("");

      // Re-fetch the chat messages from the server
      await refreshChat();
    } catch (error) {
      console.error(error);
      alert("Error sending message. Check console for details.");
    }
  };

  // --- POLLING: Refresh chat every 2 seconds ---
  useEffect(() => {
    console.log("Starting interval...");
    const intervalId = setInterval(() => {
      console.log("Interval triggered -> calling refreshChat()");
      refreshChat();
    }, 2000);
  
    return () => {
      console.log("Clearing interval...");
      clearInterval(intervalId);
    };
  }, []);

  return (
    <main className="p-4 max-w-2xl mx-auto flex flex-col h-screen">
      {/* Chat Header */}
      <h1 className="text-2xl font-bold mb-4">
        Chat <span className="text-gray-500">{chatId}</span>
      </h1>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto border rounded-md p-4 space-y-4 bg-white shadow">
        {chatHistory.map((msg: any) => {
          const isUser = msg.isUserMessage;
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg p-3 max-w-[70%] ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm mb-1 whitespace-pre-wrap">{msg.message}</p>
                {msg.suggestedProduct && (
                  <div className="mt-2 border-t border-black/10 pt-2 text-xs">
                    <a
                      href={msg.suggestedProduct.weburl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {msg.suggestedProduct.product_name}
                    </a>
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Box + Send Button */}
      <div className="flex mt-4">
        <input
          className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none"
          type="text"
          placeholder="Type your reply..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </main>
  );
}