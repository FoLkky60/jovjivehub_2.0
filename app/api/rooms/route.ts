import { NextResponse } from "next/server";
import { createRoom, listRooms } from "@/app/services/room-service";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  return NextResponse.json({
    rooms: await listRooms(),
    source: "mongodb",
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const topic = typeof body.topic === "string" ? body.topic : "Life & feelings";
  if (!title) return NextResponse.json({ error: "Room title is required" }, { status: 400 });

  const room = await createRoom({
    title,
    host: user.username,
    topic,
    listeners: "1",
    color: "#f4b650",
    initials: title.charAt(0).toUpperCase(),
    avatar: user.avatar,
    location: { name: "Online", city: "Online", latitude: 0, longitude: 0 },
  });
  return NextResponse.json({ room, source: "mongodb" }, { status: 201 });
}
