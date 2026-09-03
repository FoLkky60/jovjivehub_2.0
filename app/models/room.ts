import { ChatMessage, Room } from "@/app/types/room";

export type RoomState = {
  room: Room;
  messages: ChatMessage[];
  listenerCount: number;
  isLive: boolean;
};

export function toRoomState(room: Room, messages: ChatMessage[]): RoomState {
  return { room, messages, listenerCount: 1284, isLive: true };
}
