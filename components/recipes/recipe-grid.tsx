"use client";

import { RecipeCard } from "./recipe-card";
import { Skeleton } from "@/components/ui";
import type { RecipeWithAuthor } from "@/types/database";

interface RecipeGridProps {
  recipes: RecipeWithAuthor[];
  isLoading?: boolean;
  onLike?: (recipeId: string) => void;
  onSave?: (recipeId: string) => void;
}

export function RecipeGrid({ recipes, isLoading, onLike, onSave }: RecipeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onLike={() => onLike?.(recipe.id)}
          onSave={() => onSave?.(recipe.id)}
        />
      ))}
    </div>
  );
}

function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-stone-100 bg-white dark:border-stone-800 dark:bg-stone-900">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
