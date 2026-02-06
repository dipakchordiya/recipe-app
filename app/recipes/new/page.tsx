"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui";

export default function NewRecipePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!user) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
        }),
      });

      const recipe = await res.json();

      if (!res.ok) {
        throw new Error(recipe.error || "Failed to create recipe");
      }

      addToast("Recipe published!", "success");
      router.push(`/recipes/${recipe.id}`);
    } catch (error) {
      addToast("Failed to create recipe", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/recipes"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Recipes
        </Link>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Create New Recipe
        </h1>
        <p className="mt-2 text-stone-500">
          Share your delicious creation with the community
        </p>
      </div>

      <RecipeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
