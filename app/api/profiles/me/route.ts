import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/profiles/me - Get current user's profile
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = db.profiles.getById(session.userId);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Get my profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT /api/profiles/me - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Check if username is taken (if changed)
    if (data.username) {
      const existingProfile = db.profiles.getByUsername(data.username);
      if (existingProfile && existingProfile.id !== session.userId) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    const updated = db.profiles.update(session.userId, {
      username: data.username,
      full_name: data.full_name,
      bio: data.bio,
      avatar_url: data.avatar_url,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
