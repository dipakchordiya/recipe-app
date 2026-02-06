import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ username: string }>;
}

// GET /api/profiles/[username] - Get profile by username
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = await params;
    const profile = db.profiles.getByUsername(username);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get user's recipes
    const recipes = db.recipes
      .getByUserId(profile.id)
      .filter((r) => r.is_published);

    // Calculate total likes received
    let totalLikes = 0;
    recipes.forEach((recipe) => {
      totalLikes += db.likes.countByRecipeId(recipe.id);
    });

    // Add counts to recipes
    const recipesWithCounts = recipes.map((recipe) => ({
      ...recipe,
      profiles: profile,
      likes_count: db.likes.countByRecipeId(recipe.id),
      comments_count: db.comments.countByRecipeId(recipe.id),
    }));

    return NextResponse.json({
      profile,
      recipes: recipesWithCounts,
      stats: {
        recipesCount: recipes.length,
        likesReceived: totalLikes,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
