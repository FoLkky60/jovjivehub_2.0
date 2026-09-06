import { NextResponse } from "next/server";
import { deleteRoom } from "@/app/services/room-service";

type RouteContext = { params: Promise<{ roomId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { roomId } = await context.params;
  const id = Number(roomId);
  if (!Number.isSafeInteger(id)) return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  const deleted = await deleteRoom(id);
  return deleted ? NextResponse.json({ source: "mongodb" }) : NextResponse.json({ error: "Room not found" }, { status: 404 });
}