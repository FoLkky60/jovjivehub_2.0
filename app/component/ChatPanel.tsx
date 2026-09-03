"use client";

import { SubmitEvent, useState } from "react";
import { ChatMessage } from "@/app/types/room";
import { MessageItem } from "@/app/component/MessageItem";

export function ChatPanel({
  messages,
  onSend,
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
}) {
  const [message, setMessage] = useState("");
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    onSend(text);
    setMessage("");
  }
  return (
    <aside className="chat-panel">
      <div className="chat-heading">
        <h2>Chat</h2>
        <span className="chat-online">
          <span className="status-dot"></span> 1,284
        </span>
      </div>
      <div className="chat-messages">
        {messages.map((item) => (
          <MessageItem key={item.id} message={item} />
        ))}
      </div>
      <form className="chat-composer" onSubmit={submit}>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Say something..."
          aria-label="Message"
        />
        <button
          type="button"
          aria-label="Add reaction"
          onClick={() => setMessage((currentMessage) => `${currentMessage}☺`)}
        >
          ☺
        </button>
        <button className="send-button" type="submit" aria-label="Send message">
          ↑
        </button>
      </form>
      <p className="chat-tip">Be kind. Make room for every voice.</p>
    </aside>
  );
}
