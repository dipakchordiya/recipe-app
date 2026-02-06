"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { EmptyState, Button } from "@/components/ui";
import { RecipeGrid } from "@/components/recipes/recipe-grid";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import type { RecipeWithAuthor } from "@/types/database";

export default function SavedRecipesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [recipes, setRecipes] = useState<RecipeWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSavedRecipes = async () => {
      try {
        const res = await fetch("/api/saved");
        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch saved recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [user]);

  const handleLike = async (recipeId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/recipes/${recipeId}/like`, {
        method: "POST",
      });
      const data = await res.json();

      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId
            ? {
                ...r,
                is_liked: data.liked,
                likes_count: data.liked
                  ? (r.likes_count || 0) + 1
                  : (r.likes_count || 1) - 1,
              }
            : r
        )
      );
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handleUnsave = async (recipeId: string) => {
    if (!user) return;

    try {
      await fetch(`/api/recipes/${recipeId}/save`, { method: "POST" });
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch (error) {
      console.error("Failed to unsave:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Saved Recipes
        </h1>
        <p className="mt-2 text-stone-500">
          Your personal collection of bookmarked recipes
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <RecipeGrid recipes={[]} isLoading />
      ) : recipes.length > 0 ? (
        <>
          <p className="mb-6 text-sm text-stone-500">
            {recipes.length} saved recipe{recipes.length !== 1 && "s"}
          </p>
          <RecipeGrid
            recipes={recipes}
            onLike={handleLike}
            onSave={handleUnsave}
          />
        </>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved recipes yet"
          description="When you find recipes you love, save them here for easy access later."
          action={
            <Link href="/recipes">
              <Button>Browse Recipes</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
