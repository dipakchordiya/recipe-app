// Database types and extended recipe types
import type { Recipe, Profile } from "@/lib/contentstack/types";

// Extended recipe type with user interaction data
export interface RecipeWithAuthor extends Recipe {
  is_liked?: boolean;
  is_saved?: boolean;
}

// Comment type
export interface Comment {
  id: string;
  user_id: string;
  recipe_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: Profile | null;
}

// Re-export base types for convenience
export type { Recipe, Profile };
