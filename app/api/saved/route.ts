import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/saved - Get current user's saved recipes
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saves = db.saves.getByUserId(session.userId);
    const recipeIds = saves.map((s) => s.recipe_id);

    const recipes = recipeIds
      .map((id) => db.recipes.getById(id))
      .filter((r) => r && r.is_published)
      .map((recipe) => ({
        ...recipe,
        profiles: db.profiles.getById(recipe!.user_id),
        likes_count: db.likes.countByRecipeId(recipe!.id),
        comments_count: db.comments.countByRecipeId(recipe!.id),
        is_liked: db.likes.exists(session.userId, recipe!.id),
        is_saved: true,
      }));

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Get saved recipes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved recipes" },
      { status: 500 }
    );
  }
}
