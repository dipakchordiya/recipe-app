"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChefHat } from "lucide-react";
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
  CardContent,
  EmptyState,
} from "@/components/ui";
import { RecipeGrid } from "@/components/recipes/recipe-grid";
import { useAuth } from "@/contexts/auth-context";
import type { RecipeWithAuthor } from "@/types/database";

const categories = [
  "All",
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

const difficulties = ["All", "easy", "medium", "hard"];
const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "cooking_time", label: "Cooking Time" },
];

function RecipesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [recipes, setRecipes] = useState<RecipeWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "All");
  const [sort, setSort] = useState(searchParams.get("sort") || "recent");

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "All") params.set("category", category);
    if (difficulty !== "All") params.set("difficulty", difficulty);
    if (sort) params.set("sort", sort);

    try {
      const res = await fetch(`/api/recipes?${params.toString()}`);
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [search, category, difficulty, sort]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Update URL params
  const updateFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "All") params.set("category", category);
    if (difficulty !== "All") params.set("difficulty", difficulty);
    if (sort !== "recent") params.set("sort", sort);
    router.push(`/recipes?${params.toString()}`);
  }, [router, search, category, difficulty, sort]);

  useEffect(() => {
    const timeout = setTimeout(updateFilters, 300);
    return () => clearTimeout(timeout);
  }, [updateFilters]);

  const handleLike = async (recipeId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`/api/recipes/${recipeId}/like`, {
        method: "POST",
      });
      const data = await res.json();

      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId
            ? {
                ...r,
                is_liked: data.liked,
                likes_count: data.liked
                  ? (r.likes_count || 0) + 1
                  : (r.likes_count || 1) - 1,
              }
            : r
        )
      );
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handleSave = async (recipeId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`/api/recipes/${recipeId}/save`, {
        method: "POST",
      });
      const data = await res.json();

      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId ? { ...r, is_saved: data.saved } : r
        )
      );
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setDifficulty("All");
    setSort("recent");
  };

  const hasActiveFilters =
    search || category !== "All" || difficulty !== "All" || sort !== "recent";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Browse Recipes
        </h1>
        <p className="mt-2 text-stone-500">
          Discover delicious recipes from our community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="default" className="ml-1">
                !
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="animate-in slide-in-from-top-2 duration-200">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="min-w-[150px] flex-1">
                  <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Category
                  </label>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="min-w-[150px] flex-1">
                  <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Difficulty
                  </label>
                  <Select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff === "All" ? "All Levels" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="min-w-[150px] flex-1">
                  <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Sort By
                  </label>
                  <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800">
                  <div className="flex flex-wrap gap-2">
                    {search && (
                      <Badge variant="secondary" className="gap-1">
                        Search: {search}
                        <button onClick={() => setSearch("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {category !== "All" && (
                      <Badge variant="secondary" className="gap-1">
                        {category}
                        <button onClick={() => setCategory("All")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {difficulty !== "All" && (
                      <Badge variant="secondary" className="gap-1">
                        {difficulty}
                        <button onClick={() => setDifficulty("All")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <RecipeGrid recipes={[]} isLoading />
      ) : recipes.length > 0 ? (
        <>
          <p className="mb-6 text-sm text-stone-500">
            {recipes.length} recipe{recipes.length !== 1 && "s"} found
          </p>
          <RecipeGrid
            recipes={recipes}
            onLike={handleLike}
            onSave={handleSave}
          />
        </>
      ) : (
        <EmptyState
          icon={ChefHat}
          title="No recipes found"
          description="Try adjusting your filters or search terms to find what you're looking for."
          action={
            hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )
          }
        />
      )}
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense>
      <RecipesContent />
    </Suspense>
  );
}
