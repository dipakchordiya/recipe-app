"use client";

import { Suspense, useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ChefHat,
  Search,
  Users,
  Heart,
  ArrowRight,
  Sparkles,
  TrendingUp,
  BookOpen,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { RecipeGrid } from "@/components/recipes/recipe-grid";
import {
  useLivePreviewUpdate,
  LivePreviewIndicator,
  getEditableProps,
} from "@/lib/contentstack";
import type { HomePage, Recipe, Category } from "@/lib/contentstack";
import { useUserCuisinePreference, type CuisinePreference, setStoredPreference } from "@/lib/personalization";
import { trackRegionSelection, trackCuisinePreference } from "@/lib/lytics";

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Search,
  Heart,
  Users,
  ChefHat,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Globe,
};

// Region display info - matches Personalize variant short IDs
const regionInfo = {
  ind: { 
    flag: "🇮🇳", 
    name: "India", 
    color: "from-orange-500 to-green-500",
    cuisinePreference: "indian" as CuisinePreference,
    categoryKeywords: ["indian", "india"],
    recipeKeywords: ["indian", "curry", "biryani", "masala", "paneer", "dosa", "naan", "tikka", "tandoori"],
  },
  usa: { 
    flag: "🇺🇸", 
    name: "America", 
    color: "from-blue-500 to-red-500",
    cuisinePreference: "american" as CuisinePreference,
    categoryKeywords: ["american", "america", "usa"],
    recipeKeywords: ["american", "burger", "bbq", "mac", "cheese", "pie", "steak", "hot dog", "pulled pork"],
  },
  default: { 
    flag: "🌍", 
    name: "Global", 
    color: "from-amber-500 to-orange-500",
    cuisinePreference: "default" as CuisinePreference,
    categoryKeywords: [],
    recipeKeywords: [],
  },
};

type RegionKey = keyof typeof regionInfo;

// Banner styling config (gradients and overlays for different cuisines)
// Images now come from Contentstack variants
const bannerStyleConfig: Record<CuisinePreference, {
  fallbackImage: string;
  gradient: string;
  overlay: string;
  pattern: string;
}> = {
  indian: {
    fallbackImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1920&q=80",
    gradient: "from-orange-900/90 via-red-900/70 to-amber-900/80",
    overlay: "bg-gradient-to-r from-orange-500/20 to-red-500/20",
    pattern: "🍛",
  },
  american: {
    fallbackImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1920&q=80",
    gradient: "from-blue-900/90 via-slate-900/70 to-red-900/80",
    overlay: "bg-gradient-to-r from-blue-500/20 to-red-500/20",
    pattern: "🍔",
  },
  default: {
    fallbackImage: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1920&q=80",
    gradient: "from-stone-900/90 via-amber-900/70 to-orange-900/80",
    overlay: "bg-gradient-to-r from-amber-500/20 to-orange-500/20",
    pattern: "🍽️",
  },
};

interface HomeContentProps {
  initialHomePage: HomePage | null;
  initialRecipes: Recipe[];
  initialCategories: Category[];
  fetchHomePage: () => Promise<HomePage | null>;
  detectedRegion?: "ind" | "usa" | "default";
  homePageVariants?: {
    default: HomePage | null;
    ind: HomePage | null;
    usa: HomePage | null;
  };
}

function HomeContentInner({
  initialHomePage,
  initialRecipes,
  initialCategories,
  fetchHomePage,
  detectedRegion = "default",
  homePageVariants,
}: HomeContentProps) {
  // Use live preview hook for real-time updates
  const livePreviewHomePage = useLivePreviewUpdate(initialHomePage, fetchHomePage);
  const [currentRegion, setCurrentRegion] = useState<RegionKey>(detectedRegion);
  
  // Click-based cuisine preference
  const { preference: cuisinePreference, resetPreference } = useUserCuisinePreference();
  
  // Get current region info
  const currentRegionInfo = regionInfo[currentRegion];

  // Handle region change - updates everything: banner, text, recipes
  const handleRegionChange = useCallback((region: RegionKey) => {
    setCurrentRegion(region);
    
    // Track in Lytics
    trackRegionSelection(region, "region_switcher");
    
    // Update cuisine preference for click-based personalization
    const cuisinePref = regionInfo[region].cuisinePreference;
    if (cuisinePref !== "default") {
      trackCuisinePreference(cuisinePref as "indian" | "american", "region_switcher");
      setStoredPreference(cuisinePref as "indian" | "american");
    } else {
      resetPreference();
    }
    
    console.log(`🌍 Region changed to: ${region}`, regionInfo[region]);
  }, [resetPreference]);

  // Determine which home page to display based on region
  const displayedHomePage = useMemo(() => {
    // If we have variants and user selected a region, use that variant
    if (homePageVariants && currentRegion !== "default") {
      const variant = homePageVariants[currentRegion];
      if (variant) {
        console.log("📄 Using home page variant for region:", currentRegion, variant.hero?.badgeText);
        return variant;
      }
    }
    // Otherwise use the live preview or initial home page
    return livePreviewHomePage || initialHomePage;
  }, [currentRegion, homePageVariants, livePreviewHomePage, initialHomePage]);
  
  // Determine banner styling based on current region
  const bannerStyle = useMemo(() => {
    return bannerStyleConfig[currentRegionInfo.cuisinePreference];
  }, [currentRegionInfo.cuisinePreference]);
  
  // Get the banner image from Contentstack (from displayed home page) or fallback to style config
  const bannerImage = displayedHomePage?.hero?.bannerImage || bannerStyle.fallbackImage;

  // Filter recipes based on selected region
  const filteredRecipes = useMemo(() => {
    if (currentRegion === "default") {
      // Show all recipes for global/default
      return initialRecipes;
    }
    
    const regionData = regionInfo[currentRegion];
    const categoryKeywords = regionData.categoryKeywords;
    const recipeKeywords = regionData.recipeKeywords;
    
    // Filter recipes by category or tags/title matching region
    const filtered = initialRecipes.filter((recipe) => {
      // Check category
      const categoryLower = (recipe.category || "").toLowerCase();
      if (categoryKeywords.some(kw => categoryLower.includes(kw))) {
        return true;
      }
      
      // Check recipe title
      const titleLower = recipe.title.toLowerCase();
      if (recipeKeywords.some(kw => titleLower.includes(kw))) {
        return true;
      }
      
      // Check tags
      const tags = recipe.tags || [];
      if (tags.some(tag => recipeKeywords.some(kw => tag.toLowerCase().includes(kw)))) {
        return true;
      }
      
      return false;
    });
    
    console.log(`🍽️ Filtered recipes for ${currentRegion}:`, filtered.length, "of", initialRecipes.length);
    return filtered;
  }, [currentRegion, initialRecipes]);

  // Sort by created_at and get latest 6 (from filtered recipes)
  const latestRecipes = useMemo(() => {
    return [...filteredRecipes]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
  }, [filteredRecipes]);
  
  // Filter categories based on selected region
  const filteredCategories = useMemo(() => {
    if (currentRegion === "default") {
      return initialCategories;
    }
    
    const regionData = regionInfo[currentRegion];
    const categoryKeywords = regionData.categoryKeywords;
    
    // For regional view, prioritize regional category but show others too
    const regionalCategories = initialCategories.filter((cat) => {
      const nameLower = cat.name.toLowerCase();
      return categoryKeywords.some(kw => nameLower.includes(kw));
    });
    
    // If we have regional categories, show them first, then others
    if (regionalCategories.length > 0) {
      const otherCategories = initialCategories.filter(cat => !regionalCategories.includes(cat));
      return [...regionalCategories, ...otherCategories];
    }
    
    return initialCategories;
  }, [currentRegion, initialCategories]);

  const categories = filteredCategories;

  // Map categories for display - show recipe counts based on filtered recipes
  const displayCategories = categories.length > 0
    ? categories.map((cat) => ({
        name: cat.name,
        emoji: cat.emoji || "🍽️",
        count: filteredRecipes.filter((r) => r.category === cat.name).length,
      }))
    : [];

  // Use Contentstack data or fallbacks
  const hero = displayedHomePage?.hero || {
    badgeText: "Discover Amazing Recipes",
    headline: "Cook, Share &",
    highlightText: "Connect",
    description: "Join thousands of home cooks sharing their favorite recipes.",
    primaryButton: { label: "Explore Recipes", url: "/recipes" },
    secondaryButton: { label: "Start Cooking", url: "/signup" },
    stats: [
      { value: `${filteredRecipes.length}+`, label: "Recipes" },
      { value: "100+", label: "Home Cooks" },
      { value: "500+", label: "Saves" },
    ],
  };

  const categoriesSection = displayedHomePage?.categoriesSection || {
    title: "Browse by Category",
    subtitle: "Find recipes for every meal and occasion",
  };

  const recipesSection = displayedHomePage?.recipesSection || {
    title: "Latest Recipes",
    subtitle: "Fresh from our community",
  };

  const featuresSection = displayedHomePage?.featuresSection || {
    title: "Everything You Need to Cook Amazing Food",
    subtitle: "RecipeHub makes it easy to discover, save, and share recipes with a community of food lovers.",
    features: [
      { icon: "BookOpen", title: "Share Your Recipes", description: "Upload your favorite recipes with photos, ingredients, and step-by-step instructions." },
      { icon: "Search", title: "Discover New Dishes", description: "Browse thousands of recipes from home cooks around the world." },
      { icon: "Heart", title: "Save & Organize", description: "Save recipes you love and build your personal cookbook." },
      { icon: "Users", title: "Join the Community", description: "Connect with fellow food enthusiasts, leave comments, and share tips." },
    ],
  };

  const ctaSection = displayedHomePage?.ctaSection || {
    headline: "Ready to Share Your Recipes?",
    description: "Join our community of passionate home cooks and share your culinary creations with the world.",
    primaryButton: { label: "Get Started Free", url: "/signup" },
    secondaryButton: { label: "Browse Recipes", url: "/recipes" },
  };

  // Update stats with dynamic recipe count based on filtered recipes
  const stats = hero.stats.length > 0 ? hero.stats.map((stat, idx) => {
    if (idx === 0 && stat.label.toLowerCase().includes("recipe")) {
      return { ...stat, value: `${latestRecipes.length}+` };
    }
    return stat;
  }) : [
    { value: `${latestRecipes.length}+`, label: "Recipes" },
    { value: "100+", label: "Home Cooks" },
    { value: "500+", label: "Saves" },
  ];

  return (
    <div className="flex flex-col">
      {/* Live Preview Indicator */}
      <LivePreviewIndicator />

      {/* Region Switcher - Controls banner, text, and recipes */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-sm border border-stone-200 dark:bg-stone-900/95 dark:border-stone-700">
        <div className="flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400">
          <Globe className="h-4 w-4" />
          <span>Region</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentRegionInfo.flag}</span>
          <div className="flex flex-col">
            <span className="font-semibold text-stone-900 dark:text-stone-100">{currentRegionInfo.name}</span>
            <span className="text-xs text-stone-500">
              {latestRecipes.length} recipes
            </span>
          </div>
        </div>
        <div className="flex gap-1.5 mt-1">
          {(Object.keys(regionInfo) as RegionKey[]).map((region) => (
            <button
              key={region}
              onClick={() => handleRegionChange(region)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                currentRegion === region
                  ? `bg-gradient-to-r ${regionInfo[region].color} text-white shadow-md`
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
              }`}
              title={`Switch to ${regionInfo[region].name} content`}
            >
              {regionInfo[region].flag} {regionInfo[region].name}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section with Personalized Banner */}
      <section 
        className="relative overflow-hidden min-h-[70vh] flex items-center"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dynamic gradient overlay based on cuisine preference */}
        <div className={`absolute inset-0 bg-gradient-to-br ${bannerStyle.gradient}`} />
        <div className={`absolute inset-0 ${bannerStyle.overlay}`} />
        <div className="absolute inset-0 pattern-dots opacity-30" />
        
        {/* Current Region Badge */}
        {currentRegion !== "default" && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <span className="text-2xl">{currentRegionInfo.flag}</span>
            <span className="text-sm font-medium text-white">
              {currentRegionInfo.name} Edition
            </span>
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {hero.badgeText && (
              <Badge 
                variant="default" 
                className="mb-6 gap-2"
                {...getEditableProps("home_page", "bltd30052da58732341", "hero_badge_text")}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {hero.badgeText}
              </Badge>
            )}
            <h1 
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg"
              {...getEditableProps("home_page", "bltd30052da58732341", "hero_headline")}
            >
              {hero.headline}{" "}
              {hero.highlightText && (
                <span 
                  className="text-amber-300"
                  {...getEditableProps("home_page", "bltd30052da58732341", "hero_highlight_text")}
                >
                  {hero.highlightText}
                </span>
              )}
            </h1>
            {hero.description && (
              <p 
                className="mt-6 text-lg leading-8 text-white/90 drop-shadow-md"
                {...getEditableProps("home_page", "bltd30052da58732341", "hero_description")}
              >
                {hero.description}
              </p>
            )}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {hero.primaryButton && (
                <Link href={hero.primaryButton.url}>
                  <Button size="lg" className="gap-2">
                    <Search className="h-5 w-5" />
                    {hero.primaryButton.label}
                  </Button>
                </Link>
              )}
              {hero.secondaryButton && (
                <Link href={hero.secondaryButton.url}>
                  <Button variant="outline" size="lg" className="gap-2">
                    {hero.secondaryButton.label}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-stone-200 pt-10 dark:border-stone-800">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <p className="text-3xl font-bold text-amber-500">{stat.value}</p>
                    <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {displayCategories.length > 0 && (
        <section className="border-y-2 border-stone-100 bg-white py-16 dark:border-stone-800 dark:bg-stone-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 
                  className="text-2xl font-bold text-stone-900 dark:text-stone-100"
                  {...getEditableProps("home_page", "bltd30052da58732341", "categories_section_title")}
                >
                  {categoriesSection.title}
                </h2>
                {categoriesSection.subtitle && (
                  <p 
                    className="mt-1 text-stone-500"
                    {...getEditableProps("home_page", "bltd30052da58732341", "categories_section_subtitle")}
                  >
                    {categoriesSection.subtitle}
                  </p>
                )}
              </div>
              <Link href="/categories">
                <Button variant="ghost" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {displayCategories.slice(0, 6).map((category) => (
                <Link
                  key={category.name}
                  href={`/recipes?category=${category.name}`}
                  className="group flex flex-col items-center rounded-2xl border-2 border-stone-100 bg-stone-50 p-6 transition-all hover:border-amber-200 hover:bg-amber-50 dark:border-stone-800 dark:bg-stone-800 dark:hover:border-amber-700 dark:hover:bg-amber-900/20"
                >
                  <span className="text-4xl">{category.emoji}</span>
                  <span className="mt-3 font-semibold text-stone-900 dark:text-stone-100">
                    {category.name}
                  </span>
                  <span className="mt-1 text-xs text-stone-400">
                    {category.count} recipes
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Recipes */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 
                  className="text-2xl font-bold text-stone-900 dark:text-stone-100"
                  {...getEditableProps("home_page", "bltd30052da58732341", "recipes_section_title")}
                >
                  {recipesSection.title}
                </h2>
                {recipesSection.subtitle && (
                  <p 
                    className="text-stone-500"
                    {...getEditableProps("home_page", "bltd30052da58732341", "recipes_section_subtitle")}
                  >
                    {recipesSection.subtitle}
                  </p>
                )}
              </div>
            </div>
            <Link href="/recipes">
              <Button variant="outline" className="gap-2">
                See All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-10">
            {latestRecipes.length > 0 ? (
              <RecipeGrid recipes={latestRecipes} />
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-16 text-center dark:border-stone-800 dark:bg-stone-900">
                <span className="text-6xl mb-4 block">{currentRegionInfo.flag}</span>
                <h3 className="mt-4 font-semibold text-stone-900 dark:text-stone-100">
                  {currentRegion === "default" 
                    ? "No recipes yet" 
                    : `No ${currentRegionInfo.name} recipes yet`}
                </h3>
                <p className="mt-1 text-stone-500">
                  {currentRegion === "default"
                    ? "Be the first to share a delicious recipe!"
                    : `Try switching to Global to see all recipes, or add some ${currentRegionInfo.name} recipes!`}
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  {currentRegion !== "default" && (
                    <Button variant="outline" onClick={() => handleRegionChange("default")}>
                      View All Recipes
                    </Button>
                  )}
                  <Link href="/recipes/new">
                    <Button>Share Your Recipe</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {featuresSection.features.length > 0 && (
        <section className="bg-stone-50 py-20 dark:bg-stone-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 
                className="text-3xl font-bold text-stone-900 dark:text-stone-100"
                {...getEditableProps("home_page", "bltd30052da58732341", "features_section_title")}
              >
                {featuresSection.title}
              </h2>
              {featuresSection.subtitle && (
                <p 
                  className="mt-4 text-stone-500"
                  {...getEditableProps("home_page", "bltd30052da58732341", "features_section_subtitle")}
                >
                  {featuresSection.subtitle}
                </p>
              )}
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuresSection.features.map((feature, idx) => {
                const IconComponent = iconMap[feature.icon || ""] || BookOpen;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border-2 border-stone-100 bg-white p-6 transition-all hover:border-amber-200 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-700"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 font-bold text-stone-900 dark:text-stone-100">
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="mt-2 text-sm text-stone-500">
                        {feature.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {ctaSection.headline && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 px-8 py-16 text-center shadow-2xl shadow-amber-500/25 sm:px-16">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
              <div className="relative">
                <h2 
                  className="text-3xl font-bold text-white sm:text-4xl"
                  {...getEditableProps("home_page", "bltd30052da58732341", "cta_headline")}
                >
                  {ctaSection.headline}
                </h2>
                {ctaSection.description && (
                  <p 
                    className="mx-auto mt-4 max-w-xl text-lg text-amber-100"
                    {...getEditableProps("home_page", "bltd30052da58732341", "cta_description")}
                  >
                    {ctaSection.description}
                  </p>
                )}
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  {ctaSection.primaryButton && (
                    <Link href={ctaSection.primaryButton.url}>
                      <Button
                        size="lg"
                        className="bg-white text-amber-600 hover:bg-amber-50 shadow-xl"
                      >
                        {ctaSection.primaryButton.label}
                      </Button>
                    </Link>
                  )}
                  {ctaSection.secondaryButton && (
                    <Link href={ctaSection.secondaryButton.url}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        {ctaSection.secondaryButton.label}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export function HomeContent(props: HomeContentProps) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomeContentInner {...props} />
    </Suspense>
  );
}
