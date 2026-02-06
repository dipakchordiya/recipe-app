"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { useAuth } from "@/contexts/auth-context";
import { useToast, Skeleton } from "@/components/ui";

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
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditRecipePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        const data = await res.json();

        if (!res.ok) {
          addToast("Recipe not found", "error");
          router.push("/recipes");
          return;
        }

        // Check ownership
        if (data.user_id !== user?.id) {
          addToast("You can only edit your own recipes", "error");
          router.push(`/recipes/${id}`);
          return;
        }

        setRecipe(data);
      } catch (error) {
        addToast("Failed to load recipe", "error");
        router.push("/recipes");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRecipe();
    }
  }, [id, user, router, addToast]);

  const handleSubmit = async (data: {
    title: string;
    description?: string;
    ingredients: { name: string; amount: string; unit?: string }[];
    steps: string;
    cooking_time?: number;
    difficulty: "easy" | "medium" | "hard";
    category?: string;
    tags?: string;
    image_url?: string;
  }) => {
    if (!user || !recipe) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update recipe");
      }

      addToast("Recipe updated!", "success");
      router.push(`/recipes/${id}`);
    } catch (error) {
      addToast("Failed to update recipe", "error");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/recipes/${id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Recipe
        </Link>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Edit Recipe
        </h1>
        <p className="mt-2 text-stone-500">
          Update your recipe details
        </p>
      </div>

      <RecipeForm
        recipe={recipe}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
