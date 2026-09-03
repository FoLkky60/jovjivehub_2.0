"use client";

import { useState } from "react";
import { Room } from "@/app/types/room";
import { toggleMockMembership } from "@/app/services/mock-room-service";

export function LiveStage({ room }: { room: Room }) {
  const [isJoined, setIsJoined] = useState(true);
  const [reaction, setReaction] = useState("♡");
  return (
    <section className="live-stage">
      <div className="stage-art">
        <div className="stage-orbit orbit-one"></div>
        <div className="stage-orbit orbit-two"></div>
        <div className="host-portrait">{room.initials}</div>
        <div className="sound-bars">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
        <span className="on-air">ON AIR</span>
      </div>
      <div className="stage-info">
        <span className="host-label">HOSTING NOW</span>
        <h2>
          Let&apos;s talk about the things
          <br />
          we don&apos;t say out loud.
        </h2>
        <p>
          A gentle corner for late-night thoughts, quiet stories,
          <br />
          and finding someone who gets it.
        </p>
        <div className="stage-meta">
          <span>◉ {room.listeners} listening</span>
          <span>⏱ 01:24:18</span>
        </div>
      </div>
      <div className="stage-actions">
        <button
          className={`join-button ${isJoined ? "joined" : ""}`}
          onClick={() => setIsJoined(toggleMockMembership(isJoined))}
        >
          {isJoined ? "✓ Joined room" : "＋ Join room"}
        </button>
        <button
          className={`reaction-button ${reaction !== "♡" ? "reacted" : ""}`}
          onClick={() => setReaction(reaction === "♡" ? "♥" : "♡")}
          aria-label="React"
        >
          {reaction}
        </button>
      </div>
    </section>
  );
}
