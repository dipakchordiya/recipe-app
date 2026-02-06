import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { getAllCategories, getPublishedRecipes } from "@/lib/contentstack/services";

// Fallback categories with colors for styling
const categoryColors: Record<string, string> = {
  Breakfast: "from-yellow-400 to-orange-400",
  Lunch: "from-green-400 to-emerald-500",
  Dinner: "from-red-400 to-rose-500",
  Dessert: "from-pink-400 to-purple-500",
  Snack: "from-amber-400 to-yellow-500",
  Appetizer: "from-orange-400 to-red-400",
  Soup: "from-teal-400 to-cyan-500",
  Salad: "from-lime-400 to-green-500",
  "Main Course": "from-rose-400 to-pink-500",
  "Side Dish": "from-yellow-400 to-amber-500",
  Beverage: "from-blue-400 to-indigo-500",
  Baking: "from-amber-300 to-orange-400",
};

export default async function CategoriesPage() {
  // Fetch categories and recipes from Contentstack
  const [categories, recipes] = await Promise.all([
    getAllCategories(),
    getPublishedRecipes(),
  ]);

  // Map categories with recipe counts
  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    color: category.color_gradient || categoryColors[category.name] || "from-stone-400 to-stone-500",
    recipeCount: recipes.filter((r) => r.category === category.name).length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl">
          Browse by Category
        </h1>
        <p className="mt-3 text-lg text-stone-500">
          Find the perfect recipe for any occasion
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoriesWithCounts.map((category) => (
          <Link
            key={category.id}
            href={`/recipes?category=${category.name}`}
          >
            <Card className="group h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-0">
                <div
                  className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${category.color}`}
                >
                  <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
                    {category.emoji || "🍽️"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-stone-900 group-hover:text-amber-600 dark:text-stone-100 dark:group-hover:text-amber-400">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500 line-clamp-2">
                    {category.description || `Delicious ${category.name.toLowerCase()} recipes`}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-stone-400">
                      {category.recipeCount} recipe{category.recipeCount !== 1 ? "s" : ""}
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
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-stone-500">
          Can&apos;t find what you&apos;re looking for?
        </p>
        <Link href="/recipes" className="mt-4 inline-block">
          <Button variant="outline" className="gap-2">
            Browse All Recipes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
