import { NextResponse } from "next/server";
import { createMessage, listMessages } from "@/app/services/room-service";

type RouteContext = { params: Promise<{ roomId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { roomId } = await context.params;
  const id = Number(roomId);
  if (!Number.isSafeInteger(id)) return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  return NextResponse.json({ messages: await listMessages(id), source: "mongodb" });
}

export async function POST(request: Request, context: RouteContext) {
  const { roomId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!text)
    return NextResponse.json(
      { error: "Message text is required" },
      { status: 400 },
    );
  const id = Number(roomId);
  if (!Number.isSafeInteger(id)) return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  return NextResponse.json({ roomId, message: await createMessage(id, text), source: "mongodb" }, { status: 201 });
}
