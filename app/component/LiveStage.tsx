"use client";

import dynamic from "next/dynamic";
import { Room } from "@/app/types/room";
import { PresencePerson } from "@/app/types/presence";

const LeafletMap = dynamic(() => import("@/app/component/LeafletMap").then((module) => module.LeafletMap), { ssr: false });

export function LiveStage({ room, people, isJoined, onToggleJoin }: { room: Room; people: PresencePerson[]; isJoined: boolean; onToggleJoin: () => void }) {
  return (
    <section className="live-stage location-stage">
      <div className="location-map" aria-label={`Live OpenStreetMap showing ${room.location.city}`}>
        <LeafletMap room={room} people={people} />
        <span className="map-status"><span className="status-dot" /> OpenStreetMap · {people.length} active</span>
      </div>
      <div className="location-bottom">
        <div className="location-info">
          <span className="host-label">HOSTING FROM</span>
          <h2>{room.location.name}, {room.location.city}</h2>
          <p>People shown here are currently listening in this room.</p>
          <div className="location-coordinates"><span>LAT {room.location.latitude.toFixed(4)}</span><span>LNG {room.location.longitude.toFixed(4)}</span></div>
          <div className="stage-meta"><span>◉ {people.length} listening</span><span>⌖ {isJoined ? "You are in" : "You left"}</span></div>
        </div>
        <div className="stage-actions"><button className={`join-button ${isJoined ? "joined" : ""}`} onClick={onToggleJoin}>{isJoined ? "✓ Leave room" : "＋ Join room"}</button></div>
      </div>
    </section>
  );
}
