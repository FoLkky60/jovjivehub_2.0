import { NextResponse } from "next/server";
import { getCurrentUser, getSessionId } from "@/app/lib/auth";
import { joinRoom, leaveRoom, listRoomPresence } from "@/app/services/presence-service";

type RouteContext = { params: Promise<{ roomId: string }> };

async function roomParams(context: RouteContext) {
  const { roomId } = await context.params;
  const id = Number(roomId);
  return Number.isSafeInteger(id) ? id : null;
}

export async function GET(_request: Request, context: RouteContext) {
  const id = await roomParams(context);
  if (id === null) return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  return NextResponse.json({ people: await listRoomPresence(id) });
}

export async function POST(request: Request, context: RouteContext) {
  const id = await roomParams(context);
  const user = await getCurrentUser(request);
  const sessionId = getSessionId(request);
  if (id === null) return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  if (!user || !sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await joinRoom(id, sessionId, user);
  return NextResponse.json({ people: await listRoomPresence(id) });
}

export async function DELETE(request: Request, context: RouteContext) {
  const id = await roomParams(context);
  const sessionId = getSessionId(request);
  if (id === null) return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  if (sessionId) await leaveRoom(id, sessionId);
  return NextResponse.json({ ok: true });
}