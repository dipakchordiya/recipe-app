"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Upload, X, GripVertical } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Label,
  Card,
  CardContent,
} from "@/components/ui";

const recipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name is required"),
        amount: z.string().min(1, "Amount is required"),
        unit: z.string().optional(),
      })
    )
    .min(1, "At least one ingredient is required"),
  steps: z.string().min(10, "Instructions must be at least 10 characters"),
  cooking_time: z.number().min(1, "Cooking time is required").optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.string().optional(),
  tags: z.string().optional(),
  image_url: z.string().optional(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: { name: string; amount: string; unit?: string }[];
  steps: string;
  cooking_time: number | null;
  difficulty: "easy" | "medium" | "hard";
  category: string | null;
  tags: string[] | null;
  image_url: string | null;
}

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (data: RecipeFormData & { image_url?: string }) => Promise<void>;
  isSubmitting?: boolean;
}

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
  "Soup",
  "Salad",
  "Main Course",
  "Side Dish",
  "Beverage",
  "Baking",
];

const units = ["", "cup", "tbsp", "tsp", "oz", "lb", "g", "kg", "ml", "L", "piece", "slice", "clove"];

export function RecipeForm({ recipe, onSubmit, isSubmitting }: RecipeFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(recipe?.image_url || "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: recipe?.title || "",
      description: recipe?.description || "",
      ingredients: recipe?.ingredients || [
        { name: "", amount: "", unit: "" },
      ],
      steps: recipe?.steps || "",
      cooking_time: recipe?.cooking_time || undefined,
      difficulty: recipe?.difficulty || "easy",
      category: recipe?.category || "",
      tags: recipe?.tags?.join(", ") || "",
      image_url: recipe?.image_url || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const handleFormSubmit = async (data: RecipeFormData) => {
    await onSubmit({
      ...data,
      image_url: imageUrl || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Image URL */}
      <Card>
        <CardContent className="pt-6">
          <Label className="mb-3 block">Recipe Image</Label>
          <div className="space-y-4">
            <Input
              placeholder="Enter image URL (e.g., https://images.unsplash.com/...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border-2 border-stone-200 dark:border-stone-700">
                <img
                  src={imageUrl}
                  alt="Recipe preview"
                  className="h-full w-full object-cover"
                  onError={() => setImageUrl("")}
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-xs text-stone-400">
              Tip: Use image URLs from Unsplash, Pexels, or other image hosting services
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <Label htmlFor="title" required>
              Recipe Title
            </Label>
            <Input
              id="title"
              placeholder="Enter recipe title"
              {...register("title")}
              error={errors.title?.message}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your recipe..."
              {...register("description")}
              error={errors.description?.message}
              className="mt-2"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <Label htmlFor="cooking_time">Cooking Time (minutes)</Label>
              <Input
                id="cooking_time"
                type="number"
                placeholder="30"
                {...register("cooking_time", { valueAsNumber: true })}
                error={errors.cooking_time?.message}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="difficulty" required>
                Difficulty
              </Label>
              <Select
                id="difficulty"
                {...register("difficulty")}
                error={errors.difficulty?.message}
                className="mt-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                {...register("category")}
                className="mt-2"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="italian, pasta, quick"
              {...register("tags")}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Label required>Ingredients</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", amount: "", unit: "" })}
            >
              <Plus className="h-4 w-4" />
              Add Ingredient
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-start gap-3 rounded-xl border-2 border-stone-100 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-900"
              >
                <GripVertical className="mt-3 h-5 w-5 shrink-0 text-stone-300 cursor-move" />
                <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_100px_100px]">
                  <Input
                    placeholder="Ingredient name"
                    {...register(`ingredients.${index}.name`)}
                    error={errors.ingredients?.[index]?.name?.message}
                  />
                  <Input
                    placeholder="Amount"
                    {...register(`ingredients.${index}.amount`)}
                    error={errors.ingredients?.[index]?.amount?.message}
                  />
                  <Select {...register(`ingredients.${index}.unit`)}>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit || "Unit"}
                      </option>
                    ))}
                  </Select>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="shrink-0 text-stone-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors.ingredients?.message && (
            <p className="mt-2 text-sm text-red-500">{errors.ingredients.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <Label htmlFor="steps" required>
            Instructions
          </Label>
          <p className="mt-1 text-sm text-stone-500">
            Write each step on a new line
          </p>
          <Textarea
            id="steps"
            placeholder="1. Preheat oven to 350°F...&#10;2. Mix dry ingredients...&#10;3. Add wet ingredients..."
            rows={8}
            {...register("steps")}
            error={errors.steps?.message}
            className="mt-3"
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {recipe ? "Update Recipe" : "Publish Recipe"}
        </Button>
      </div>
    </form>
  );
}
