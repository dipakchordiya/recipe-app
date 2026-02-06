import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { ProfileView } from "./profile-view";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = db.profiles.getByUsername(username);

  if (!profile) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: profile.full_name || profile.username || "Profile",
    description: profile.bio || `Check out ${profile.full_name || profile.username}'s recipes`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = db.profiles.getByUsername(username);

  if (!profile) {
    notFound();
  }

  // Fetch user's recipes
  const recipes = db.recipes
    .getByUserId(profile.id)
    .filter((r) => r.is_published)
    .map((recipe) => ({
      ...recipe,
      profiles: profile,
      likes_count: db.likes.countByRecipeId(recipe.id),
      comments_count: db.comments.countByRecipeId(recipe.id),
    }));

  // Get total likes received
  let totalLikes = 0;
  recipes.forEach((recipe) => {
    totalLikes += recipe.likes_count;
  });

  return (
    <ProfileView
      profile={profile}
      recipes={recipes}
      stats={{
        recipesCount: recipes.length,
        likesReceived: totalLikes,
      }}
    />
  );
}
