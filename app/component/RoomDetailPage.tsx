"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatPanel } from "@/app/component/ChatPanel";
import { LiveStage } from "@/app/component/LiveStage";
import { MessageItem } from "@/app/component/MessageItem";
import { PeopleRow } from "@/app/component/PeopleRow";
import { Sidebar } from "@/app/component/Sidebar";
import { TopBar } from "@/app/component/TopBar";
import { createMockMessage, getMockMessages, getMockRooms } from "@/app/services/mock-room-service";
import { Room } from "@/app/types/room";

export function RoomDetailPage({ roomId }: { roomId: number }) {
  const router = useRouter();
  const rooms = getMockRooms();
  const activeRoom = rooms.find((room) => room.id === roomId) ?? rooms[0];
  const [messages, setMessages] = useState(getMockMessages);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  function sendMessage(text: string) {
    setMessages((currentMessages) => [...currentMessages, createMockMessage(text)]);
  }

  function selectRoom(room: Room) {
    router.push(`/roomPage/${room.id}`);
  }

  return (
    <div className="app-shell">
      <TopBar activePath="/roomPage" />
      <div className="workspace">
        <Sidebar rooms={rooms} activeRoomId={activeRoom.id} onSelect={selectRoom} />
        <main className="main-content">
          <div className="content-header">
            <div>
              <div className="eyebrow"><span className="pulse" /> LIVE ROOM <span>/</span> {activeRoom.topic}</div>
              <h1>{activeRoom.title}</h1>
              <p>Hosted by <strong>@{activeRoom.host}</strong> <span className="verified">✓</span></p>
            </div>
            <div className="room-options-wrap">
              <button className="more-button" aria-label="More options" onClick={() => setIsOptionsOpen(!isOptionsOpen)}>•••</button>
              {isOptionsOpen && <div className="room-options"><button onClick={() => setIsOptionsOpen(false)}>♡ Save room</button><button onClick={() => navigator.clipboard?.writeText(window.location.href)}>↗ Copy room link</button><button onClick={() => setIsOptionsOpen(false)}>⚑ Report room</button></div>}
            </div>
          </div>
          <LiveStage room={activeRoom} />
          <PeopleRow />
          <div className="conversation-heading"><h2>Conversation</h2><span>Newest first</span></div>
          <div className="mobile-chat">{messages.slice(-3).map((item) => <MessageItem key={item.id} message={item} />)}</div>
        </main>
        <ChatPanel messages={messages} onSend={sendMessage} />
      </div>
    </div>
  );
}
