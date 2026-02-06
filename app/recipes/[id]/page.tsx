import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getRecipeByUid } from "@/lib/contentstack/services";
import { RecipeDetail } from "./recipe-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipeByUid(id);

  if (!recipe) {
    return {
      title: "Recipe Not Found",
    };
  }

  return {
    title: recipe.title,
    description: recipe.description || `Check out this delicious recipe: ${recipe.title}`,
    openGraph: {
      title: recipe.title,
      description: recipe.description || `Check out this delicious recipe: ${recipe.title}`,
      images: recipe.image_url ? [recipe.image_url] : [],
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipeByUid(id);

  if (!recipe) {
    notFound();
  }

  // For now, comments are empty since they're not in Contentstack yet
  const comments: Array<{
    id: string;
    user_id: string;
    recipe_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    profiles: { id: string; username: string | null; full_name: string | null; avatar_url: string | null; bio: string | null } | null;
  }> = [];

  return <RecipeDetail recipe={recipe} comments={comments} />;
}
