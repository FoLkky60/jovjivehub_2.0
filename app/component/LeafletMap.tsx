"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { PresencePerson } from "@/app/types/presence";
import { Room } from "@/app/types/room";

export function LeafletMap({ room, people }: { room: Room; people: PresencePerson[] }) {
  return (
    <MapContainer center={[room.location.latitude, room.location.longitude]} zoom={12} scrollWheelZoom className="leaflet-room-map">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <CircleMarker center={[room.location.latitude, room.location.longitude]} pathOptions={{ color: "#ec765a", fillColor: room.avatar, fillOpacity: 1 }} radius={13}>
        <Popup>Host @{room.host}</Popup>
      </CircleMarker>
      {people.map((person, index) => (
        <CircleMarker key={`${person.sessionId}-${index}`} center={[room.location.latitude + ((index % 3) - 1) * 0.006, room.location.longitude + ((index % 4) - 1.5) * 0.008]} pathOptions={{ color: "#ffffff", fillColor: person.avatar, fillOpacity: 1 }} radius={8}>
          <Popup>{person.name} is listening</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
