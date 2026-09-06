import { promisify } from "node:util";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { getDatabase } from "@/app/lib/mongodb";
import { UserProfile } from "@/app/types/user";

const scrypt = promisify(scryptCallback);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedPassword: string) {
  const [salt, storedKey] = storedPassword.split(":");
  if (!salt || !storedKey) return false;
  const derivedKey = await scrypt(password, salt, 64) as Buffer;
  const expectedKey = Buffer.from(storedKey, "hex");
  return expectedKey.length === derivedKey.length && timingSafeEqual(expectedKey, derivedKey);
}

type UserDocument = UserProfile & { passwordHash: string; createdAt: Date };

export async function getCurrentUser(request: Request): Promise<UserProfile | null> {
  const sessionId = request.headers.get("cookie")?.match(/(?:^|;\s*)jovjive_session=([^;]+)/)?.[1];
  if (!sessionId) return null;
  const database = await getDatabase();
  const session = await database.collection<{ sessionId: string; email: string; expiresAt: Date }>("sessions").findOne({ sessionId, expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await database.collection<UserDocument>("users").findOne({ email: session.email });
  if (!user) return null;
  return {
    email: user.email,
    name: user.name,
    username: user.username || user.email.split("@")[0],
    bio: user.bio || "",
    avatar: user.avatar || "#d9795f",
  };
}