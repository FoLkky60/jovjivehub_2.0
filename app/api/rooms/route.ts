import { NextResponse } from "next/server";
import { getMockRooms } from "@/app/services/mock-room-service";

export async function GET() {
  return NextResponse.json({
    rooms: getMockRooms(),
    total: 12,
    source: "mock",
  });
}
