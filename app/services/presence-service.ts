import { getDatabase } from "@/app/lib/mongodb";
import { UserProfile } from "@/app/types/user";
type PresenceDocument = Pick<UserProfile, "name" | "username" | "avatar"> & { sessionId: string; roomId: number; joinedAt: Date; lastSeen: Date };

const ACTIVE_WINDOW_MS = 30_000;

function activeSince() {
  return new Date(Date.now() - ACTIVE_WINDOW_MS);
}

export async function joinRoom(roomId: number, sessionId: string, user: UserProfile) {
  const collection = (await getDatabase()).collection<PresenceDocument>("roomPresence");
  await collection.updateOne(
    { roomId, sessionId },
    { $set: { roomId, sessionId, name: user.name, username: user.username, avatar: user.avatar, lastSeen: new Date() }, $setOnInsert: { joinedAt: new Date() } },
    { upsert: true },
  );
}

export async function leaveRoom(roomId: number, sessionId: string) {
  await (await getDatabase()).collection<PresenceDocument>("roomPresence").deleteOne({ roomId, sessionId });
}

export async function listRoomPresence(roomId: number) {
  const collection = (await getDatabase()).collection<PresenceDocument>("roomPresence");
  await collection.deleteMany({ roomId, lastSeen: { $lt: activeSince() } });
  return collection.find({ roomId, lastSeen: { $gte: activeSince() } }, { projection: { _id: 0, roomId: 0, lastSeen: 0 } }).sort({ joinedAt: 1 }).toArray();
}