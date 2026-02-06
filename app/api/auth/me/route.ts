import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null, profile: null });
    }

    const profile = db.profiles.getById(session.userId);
    return NextResponse.json({
      user: { id: session.userId, email: session.email },
      profile,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null, profile: null });
  }
}
