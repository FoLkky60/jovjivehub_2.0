import { NextResponse } from "next/server";
import {
  createMockMessage,
  getMockMessages,
} from "@/app/services/mock-room-service";

type RouteContext = { params: Promise<{ roomId: string }> };

export async function GET() {
  return NextResponse.json({ messages: getMockMessages(), source: "mock" });
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
  return NextResponse.json(
    { roomId, message: createMockMessage(text), source: "mock" },
    { status: 201 },
  );
}
