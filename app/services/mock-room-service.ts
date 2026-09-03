import { ChatMessage, Room } from "@/app/types/room";
import { mockMessages, mockRooms } from "@/app/lib/mock-data";

export function getMockRooms(): Room[] {
  return [...mockRooms];
}

export function getMockMessages(): ChatMessage[] {
  return [...mockMessages];
}

export function createMockMessage(text: string, name = "you"): ChatMessage {
  return {
    id: `message-${Date.now()}`,
    name,
    text,
    time: "now",
    avatar: "#ed7c5d",
    own: true,
  };
}

export function toggleMockMembership(isJoined: boolean): boolean {
  return !isJoined;
}
