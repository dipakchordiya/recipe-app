"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Clock, ChefHat, MessageCircle, Bookmark } from "lucide-react";
import { Badge, Avatar } from "@/components/ui";
import { cn, formatTimeAgo } from "@/lib/utils";
import type { RecipeWithAuthor } from "@/types/database";
import { detectCuisineFromCategory, detectCuisineFromTags, setStoredPreference } from "@/lib/personalization";
import { trackRecipeClick, trackRecipeLike, trackRecipeSave, trackCuisinePreference } from "@/lib/lytics";

interface RecipeCardProps {
  recipe: RecipeWithAuthor;
  onLike?: () => void;
  onSave?: () => void;
}

const difficultyColors = {
  easy: "success",
  medium: "warning",
  hard: "danger",
} as const;

export function RecipeCard({ recipe, onLike, onSave }: RecipeCardProps) {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Track like in Lytics
    trackRecipeLike(recipe.id, recipe.title, !recipe.is_liked);
    
    onLike?.();
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Track save in Lytics
    trackRecipeSave(recipe.id, recipe.title, !recipe.is_saved);
    
    onSave?.();
  };

  // Track cuisine preference based on recipe category/tags
  const handleRecipeClick = () => {
    // Track recipe click in Lytics
    trackRecipeClick(recipe.id, recipe.title, recipe.category || undefined, "recipe_card");
    
    const cuisineFromCategory = detectCuisineFromCategory(recipe.category);
    const cuisineFromTags = detectCuisineFromTags(recipe.tags as string[] | null);
    const detectedCuisine = cuisineFromCategory || cuisineFromTags;
    
    if (detectedCuisine) {
      // Track cuisine preference in Lytics
      trackCuisinePreference(detectedCuisine, "recipe_click");
      
      // Store in localStorage for click-based personalization
      const key = "recipe_click_history";
      try {
        const history = JSON.parse(localStorage.getItem(key) || '{"indian":0,"american":0}');
        history[detectedCuisine]++;
        localStorage.setItem(key, JSON.stringify(history));
        
        // If clear preference (3+ clicks), set it directly
        if (history[detectedCuisine] >= 2) {
          setStoredPreference(detectedCuisine);
          console.log(`📊 Set preference to ${detectedCuisine} based on clicks`);
        }
      } catch {
        // Silently fail
      }
    }
  };

  return (
    <Link href={`/recipes/${recipe.id}`} onClick={handleRecipeClick}>
      <article className="group relative overflow-hidden rounded-2xl border-2 border-stone-100 bg-white transition-all duration-300 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/10 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-700">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ChefHat className="h-12 w-12 text-stone-300 dark:text-stone-600" />
            </div>
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Action Buttons */}
          <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <button
              onClick={handleSaveClick}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white transition-all hover:bg-black/60 hover:scale-110",
                recipe.is_saved && "bg-amber-500 hover:bg-amber-600"
              )}
            >
              <Bookmark
                className={cn("h-4 w-4", recipe.is_saved && "fill-current")}
              />
            </button>
            <button
              onClick={handleLikeClick}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white transition-all hover:bg-black/60 hover:scale-110",
                recipe.is_liked && "bg-red-500 hover:bg-red-600"
              )}
            >
              <Heart
                className={cn("h-4 w-4", recipe.is_liked && "fill-current")}
              />
            </button>
          </div>

          {/* Category Badge */}
          {recipe.category && (
            <div className="absolute left-3 top-3">
              <Badge variant="default" className="bg-black/40 backdrop-blur-md text-white border-0">
                {recipe.category}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-stone-900 line-clamp-1 group-hover:text-amber-600 transition-colors dark:text-stone-100 dark:group-hover:text-amber-400">
            {recipe.title}
          </h3>

          {/* Description */}
          {recipe.description && (
            <p className="mt-1 text-sm text-stone-500 line-clamp-2 dark:text-stone-400">
              {recipe.description}
            </p>
          )}

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-400">
            {recipe.cooking_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {recipe.cooking_time} min
              </span>
            )}
            <Badge variant={difficultyColors[recipe.difficulty]} className="text-xs py-0.5">
              {recipe.difficulty}
            </Badge>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar
                src={recipe.profiles?.avatar_url}
                fallback={recipe.profiles?.full_name || recipe.profiles?.username || "U"}
                size="sm"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  {recipe.profiles?.full_name || recipe.profiles?.username}
                </span>
                <span className="text-xs text-stone-400">
                  {formatTimeAgo(recipe.created_at)}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-stone-400">
              <span className="flex items-center gap-1 text-xs">
                <Heart className={cn("h-3.5 w-3.5", recipe.is_liked && "fill-red-500 text-red-500")} />
                {recipe.likes_count || 0}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <MessageCircle className="h-3.5 w-3.5" />
                {recipe.comments_count || 0}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
