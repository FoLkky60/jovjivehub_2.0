import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { getDatabase } from "@/app/lib/mongodb";

type ProfileUpdate = { name?: string; username?: string; bio?: string; avatar?: string };

export async function GET(request: Request) {
    const user = await getCurrentUser(request);
    return user ? NextResponse.json({ user }) : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PATCH(request: Request) {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json().catch(() => ({})) as ProfileUpdate;
    const name = typeof body.name === "string" ? body.name.trim() : user.name;
    const username = typeof body.username === "string" ? body.username.trim().replace(/\s/g, "") : user.username;
    const bio = typeof body.bio === "string" ? body.bio.trim() : user.bio;
    const avatar = typeof body.avatar === "string" ? body.avatar : user.avatar;
    if (!name || !username) return NextResponse.json({ error: "Name and username are required" }, { status: 400 });
    const database = await getDatabase();
    const conflict = await database.collection("users").findOne({ username, email: { $ne: user.email } });
    if (conflict) return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
    await database.collection("users").updateOne({ email: user.email }, { $set: { name, username, bio, avatar } });
    return NextResponse.json({ user: { email: user.email, name, username, bio, avatar } });
}