"use client";

import { useState } from "react";
import { Room } from "@/app/types/room";

type MapPerson = {
  name: string;
  initials: string;
  color: string;
  top: string;
  left: string;
};

const listeners: MapPerson[] = [
  { name: "bambam", initials: "B", color: "#ef8f68", top: "31%", left: "23%" },
  { name: "junejune", initials: "J", color: "#6b9ed9", top: "67%", left: "39%" },
  { name: "pimmy", initials: "P", color: "#b26cc4", top: "23%", left: "67%" },
  { name: "tonkla", initials: "T", color: "#78b96b", top: "71%", left: "77%" },
];

export function LiveStage({ room }: { room: Room }) {
  const [isJoined, setIsJoined] = useState(false);
  const [reaction, setReaction] = useState("♡");

  return (
    <section className="live-stage location-stage">
      <div className="location-map" aria-label={`Live map showing ${room.location.city}`}>
        <div className="map-grid" />
        <div className="map-road road-one" />
        <div className="map-road road-two" />
        <div className="map-road road-three" />
        <span className="map-area area-one">{room.location.city}</span>
        <span className="map-area area-two">LIVE ROOM</span>
        <span className="map-area area-three">{room.location.name}</span>
        <div className="map-marker host-marker" style={{ top: "48%", left: "52%" }}>
          <span className="marker-pulse" />
          <span className="marker-avatar" style={{ background: room.avatar }}>{room.initials}</span>
          <strong>@{room.host}</strong>
        </div>
        {listeners.map((person) => <div className="map-marker listener-marker" key={person.name} style={{ top: person.top, left: person.left }} title={person.name}><span className="marker-avatar" style={{ background: person.color }}>{person.initials}</span></div>)}
        {isJoined && <div className="map-marker user-marker" style={{ top: "54%", left: "35%" }}><span className="marker-avatar">J</span><strong>You</strong></div>}
        <div className="map-controls"><button aria-label="Zoom in">+</button><button aria-label="Zoom out">−</button></div>
        <span className="map-status"><span className="status-dot" /> Live location sharing</span>
      </div>
      <div className="location-bottom">
        <div className="location-info">
          <span className="host-label">HOSTING FROM</span>
          <h2>{room.location.name}, {room.location.city}</h2>
          <p>Join the room to share your approximate location<br />with everyone listening together.</p>
          <div className="location-coordinates"><span>LAT {room.location.latitude.toFixed(4)}</span><span>LNG {room.location.longitude.toFixed(4)}</span></div>
          <div className="stage-meta"><span>◉ {room.listeners} listening</span><span>⌖ {isJoined ? "Location shared" : "Location hidden"}</span></div>
        </div>
        <div className="stage-actions"><button className={`join-button ${isJoined ? "joined" : ""}`} onClick={() => setIsJoined(!isJoined)}>{isJoined ? "✓ Leave & hide location" : "＋ Join & share location"}</button><button className={`reaction-button ${reaction !== "♡" ? "reacted" : ""}`} onClick={() => setReaction(reaction === "♡" ? "♥" : "♡")} aria-label="React">{reaction}</button></div>
      </div>
    </section>
  );
}
