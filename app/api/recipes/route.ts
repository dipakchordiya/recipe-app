import { NextRequest, NextResponse } from "next/server";
import { getAllRecipes, getPublishedRecipes } from "@/lib/contentstack/services";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/recipes - Get all recipes with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const sort = searchParams.get("sort") || "recent";
    const userId = searchParams.get("userId");

    // Fetch recipes from Contentstack
    let recipes = await getPublishedRecipes();

    // Filter by user
    if (userId) {
      recipes = recipes.filter((r) => r.user_id === userId);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      recipes = recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.description?.toLowerCase().includes(searchLower) ||
          r.tags?.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (category && category !== "All") {
      recipes = recipes.filter((r) => r.category === category);
    }

    // Filter by difficulty
    if (difficulty && difficulty !== "All") {
      recipes = recipes.filter((r) => r.difficulty === difficulty);
    }

    // Sort
    if (sort === "recent") {
      recipes.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sort === "cooking_time") {
      recipes.sort((a, b) => (a.cooking_time || 0) - (b.cooking_time || 0));
    } else if (sort === "popular") {
      recipes.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    }

    // Add interaction info from local db (likes, saves)
    const session = await getSession();
    const recipesWithDetails = recipes.map((recipe) => {
      const isLiked = session
        ? db.likes.exists(session.userId, recipe.id)
        : false;
      const isSaved = session
        ? db.saves.exists(session.userId, recipe.id)
        : false;

      return {
        ...recipe,
        is_liked: isLiked,
        is_saved: isSaved,
      };
    });

    return NextResponse.json(recipesWithDetails);
  } catch (error) {
    console.error("Get recipes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

// POST /api/recipes - Create a new recipe
// Note: For now, this creates in local db. In production, you'd use Contentstack Management API
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const recipe = db.recipes.create({
      user_id: session.userId,
      title: data.title,
      description: data.description || null,
      ingredients: data.ingredients,
      steps: data.steps,
      cooking_time: data.cooking_time || null,
      difficulty: data.difficulty || "easy",
      category: data.category || null,
      tags: data.tags || null,
      image_url: data.image_url || null,
      is_published: true,
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Create recipe error:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
