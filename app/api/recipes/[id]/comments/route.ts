import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/recipes/[id]/comments - Get comments for a recipe
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const comments = db.comments.getByRecipeId(id);

    // Add profile info to each comment
    const commentsWithProfiles = comments.map((comment) => ({
      ...comment,
      profiles: db.profiles.getById(comment.user_id),
    }));

    return NextResponse.json(commentsWithProfiles);
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/recipes/[id]/comments - Add a comment
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    const recipe = db.recipes.getById(id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const comment = db.comments.create({
      user_id: session.userId,
      recipe_id: id,
      content: content.trim(),
    });

    const profile = db.profiles.getById(session.userId);

    return NextResponse.json({
      ...comment,
      profiles: profile,
    });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
