"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { detectCuisineFromCategory, setStoredPreference } from "@/lib/personalization";
import { trackCategoryClick, trackCuisinePreference } from "@/lib/lytics";

interface CategoryCardProps {
  name: string;
  emoji: string;
  description?: string;
  color: string;
  recipeCount: number;
}

export function CategoryCard({ name, emoji, description, color, recipeCount }: CategoryCardProps) {
  // Track cuisine preference based on category
  const handleCategoryClick = () => {
    // Track category click in Lytics
    trackCategoryClick(name, "category_list");
    
    const cuisine = detectCuisineFromCategory(name);
    
    if (cuisine) {
      // Track cuisine preference in Lytics
      trackCuisinePreference(cuisine, "category_click");
      
      // Store in localStorage for click-based personalization
      const key = "recipe_click_history";
      try {
        const history = JSON.parse(localStorage.getItem(key) || '{"indian":0,"american":0}');
        history[cuisine] += 3; // Category clicks count more
        localStorage.setItem(key, JSON.stringify(history));
        
        // Set preference immediately for category clicks
        setStoredPreference(cuisine);
        console.log(`📊 Set preference to ${cuisine} from category click`);
      } catch {
        // Silently fail
      }
    }
  };

  return (
    <Link
      href={`/recipes?category=${name}`}
      onClick={handleCategoryClick}
    >
      <Card className="group h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
        <CardContent className="p-0">
          <div
            className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${color}`}
          >
            <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
              {emoji}
            </span>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-stone-900 group-hover:text-amber-600 dark:text-stone-100 dark:group-hover:text-amber-400">
              {name}
            </h3>
            <p className="mt-1 text-sm text-stone-500 line-clamp-2">
              {description || `Delicious ${name.toLowerCase()} recipes`}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                {recipeCount} recipe{recipeCount !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                Browse
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
