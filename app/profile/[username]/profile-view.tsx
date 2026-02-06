"use client";

import Link from "next/link";
import { Settings, Calendar, ChefHat } from "lucide-react";
import { Button, Avatar, Card, CardContent, EmptyState } from "@/components/ui";
import { RecipeGrid } from "@/components/recipes/recipe-grid";
import { useAuth } from "@/contexts/auth-context";
import { formatDate } from "@/lib/utils";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: { name: string; amount: string; unit?: string }[];
  steps: string;
  cooking_time: number | null;
  difficulty: "easy" | "medium" | "hard";
  category: string | null;
  tags: string[] | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  profiles: Profile | null;
  likes_count: number;
  comments_count: number;
}

interface ProfileViewProps {
  profile: Profile;
  recipes: Recipe[];
  stats: {
    recipesCount: number;
    likesReceived: number;
  };
}

export function ProfileView({ profile, recipes, stats }: ProfileViewProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Avatar
              src={profile.avatar_url}
              fallback={profile.full_name || profile.username || "U"}
              size="xl"
              className="h-24 w-24"
            />

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {profile.full_name || profile.username}
                  </h1>
                  <p className="text-stone-500">@{profile.username}</p>
                </div>

                {isOwnProfile && (
                  <Link href="/profile/edit">
                    <Button variant="outline" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </div>

              {profile.bio && (
                <p className="mt-4 text-stone-600 dark:text-stone-400">
                  {profile.bio}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-stone-500 sm:justify-start">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(profile.created_at)}
                </span>
              </div>

              {/* Stats */}
              <div className="mt-6 flex justify-center gap-8 border-t border-stone-100 pt-6 dark:border-stone-800 sm:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {stats.recipesCount}
                  </p>
                  <p className="text-sm text-stone-500">Recipes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {stats.likesReceived}
                  </p>
                  <p className="text-sm text-stone-500">Likes Received</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipes */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-stone-900 dark:text-stone-100">
          {isOwnProfile ? "Your Recipes" : `Recipes by ${profile.full_name || profile.username}`}
        </h2>

        {recipes.length > 0 ? (
          <RecipeGrid recipes={recipes} />
        ) : (
          <EmptyState
            icon={ChefHat}
            title={isOwnProfile ? "No recipes yet" : "No recipes"}
            description={
              isOwnProfile
                ? "Start sharing your culinary creations with the world!"
                : "This user hasn't shared any recipes yet."
            }
            action={
              isOwnProfile && (
                <Link href="/recipes/new">
                  <Button>Create Your First Recipe</Button>
                </Link>
              )
            }
          />
        )}
      </div>
    </div>
  );
}
