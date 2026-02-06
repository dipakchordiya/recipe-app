import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getRecipeByUid } from "@/lib/contentstack/services";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/recipes/[id] - Get a single recipe
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Fetch from Contentstack
    const recipe = await getRecipeByUid(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Get like/save status from local db
    const session = await getSession();
    const isLiked = session ? db.likes.exists(session.userId, recipe.id) : false;
    const isSaved = session ? db.saves.exists(session.userId, recipe.id) : false;

    return NextResponse.json({
      ...recipe,
      is_liked: isLiked,
      is_saved: isSaved,
    });
  } catch (error) {
    console.error("Get recipe error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

// PUT /api/recipes/[id] - Update a recipe (still uses local db for now)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // For Contentstack recipes, we'd need to use the Management API
    // For now, check if it exists in local db
    const recipe = db.recipes.getById(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found or editing not supported for this recipe" }, { status: 404 });
    }

    if (recipe.user_id !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const updated = db.recipes.update(id, {
      title: data.title,
      description: data.description,
      ingredients: data.ingredients,
      steps: data.steps,
      cooking_time: data.cooking_time,
      difficulty: data.difficulty,
      category: data.category,
      tags: data.tags,
      image_url: data.image_url,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update recipe error:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/[id] - Delete a recipe (still uses local db for now)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const recipe = db.recipes.getById(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found or deletion not supported for this recipe" }, { status: 404 });
    }

    if (recipe.user_id !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    db.recipes.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete recipe error:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
