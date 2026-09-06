import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { hashPassword, verifyPassword } from "@/app/lib/auth";
import { getDatabase } from "@/app/lib/mongodb";

export const runtime = "nodejs";

type UserDocument = { email: string; name: string; username: string; bio: string; avatar: string; passwordHash: string; createdAt: Date };

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const mode = body.mode === "register" ? "register" : "login";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!email || password.length < 8 || (mode === "register" && !name)) {
    return NextResponse.json({ error: "Valid account details are required" }, { status: 400 });
  }

  const users = (await getDatabase()).collection<UserDocument>("users");
  let user: UserDocument | null = await users.findOne({ email });
  if (mode === "register") {
    if (user) return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    const username = name.toLowerCase().replace(/[^a-z0-9ก-๙]+/g, "").slice(0, 24) || `user${Date.now()}`;
    const newUser: UserDocument = { email, name, username, bio: "", avatar: "#d9795f", passwordHash: await hashPassword(password), createdAt: new Date() };
    await users.insertOne(newUser);
    user = newUser;
  } else if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (!user) return NextResponse.json({ error: "Unable to create session" }, { status: 500 });

  const sessionId = randomUUID();
  await (await getDatabase()).collection("sessions").insertOne({ sessionId, email: user.email, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  const response = NextResponse.json({ user: { email: user.email, name: user.name, username: user.username, bio: user.bio, avatar: user.avatar } });
  response.cookies.set("jovjive_session", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("jovjive_session");
  return response;
}