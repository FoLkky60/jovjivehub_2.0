import { getDatabase } from "@/app/lib/mongodb";
import { ChatMessage, Room } from "@/app/types/room";

type RoomDocument = Room & { _id?: string; createdAt: Date };
type MessageDocument = ChatMessage & { _id?: string; roomId: number; createdAt: Date };

export async function listRooms(): Promise<Room[]> {
  const rooms = (await getDatabase()).collection<RoomDocument>("rooms");
  return rooms.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}

export async function createRoom(room: Omit<Room, "id">): Promise<Room> {
  const database = await getDatabase();
  const createdRoom: RoomDocument = { ...room, id: Date.now(), createdAt: new Date() };
  await database.collection<RoomDocument>("rooms").insertOne(createdRoom);
  const { createdAt, ...result } = createdRoom;
  void createdAt;
  return result;
}

export async function deleteRoom(roomId: number): Promise<boolean> {
  const database = await getDatabase();
  const result = await database.collection<RoomDocument>("rooms").deleteOne({ id: roomId });
  if (result.deletedCount > 0) {
    await database.collection<MessageDocument>("messages").deleteMany({ roomId });
  }
  return result.deletedCount > 0;
}

export async function listMessages(roomId: number): Promise<ChatMessage[]> {
  const messages = (await getDatabase()).collection<MessageDocument>("messages");
  return messages.find({ roomId }, { projection: { _id: 0, roomId: 0, createdAt: 0 } }).sort({ createdAt: 1 }).toArray();
}

export async function createMessage(roomId: number, text: string): Promise<ChatMessage> {
  const database = await getDatabase();
  const message: MessageDocument = {
    id: `message-${Date.now()}`,
    roomId,
    name: "you",
    text,
    time: "now",
    avatar: "#ed7c5d",
    own: true,
    createdAt: new Date(),
  };
  await database.collection<MessageDocument>("messages").insertOne(message);
  const { roomId: storedRoomId, createdAt, ...result } = message;
  void storedRoomId;
  void createdAt;
  return result;
}