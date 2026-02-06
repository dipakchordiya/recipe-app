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
  const [isAutoPersonalized, setIsAutoPersonalized] = useState(false);
  
  // Click-based cuisine preference
  const { preference: cuisinePreference, resetPreference } = useUserCuisinePreference();
  
  // Get current region info
  const currentRegionInfo = regionInfo[currentRegion];

  // Auto-personalize based on click history when returning to home page
  useEffect(() => {
    if (cuisinePreference !== "default" && homePageVariants) {
      // Map cuisine preference to region
      const preferenceToRegion: Record<CuisinePreference, RegionKey> = {
        indian: "ind",
        american: "usa",
        default: "default",
      };
      
      const targetRegion = preferenceToRegion[cuisinePreference];
      
      // Only auto-switch if we have the variant and it's different from current
      if (targetRegion !== currentRegion && homePageVariants[targetRegion]) {
        console.log(`🎯 Auto-personalizing to ${targetRegion} based on click history (${cuisinePreference})`);
        setCurrentRegion(targetRegion);
        setIsAutoPersonalized(true);
        
        // Clear the auto-personalized flag after a short delay
        setTimeout(() => setIsAutoPersonalized(false), 3000);
      }
    }
  }, [cuisinePreference, homePageVariants]); // Only run when preference changes

  // Handle region change - updates everything: banner, text, recipes
  const handleRegionChange = useCallback((region: RegionKey) => {
    setCurrentRegion(region);
    setIsAutoPersonalized(false); // Manual change clears auto flag
    
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

      {/* Auto-Personalization Notification */}
      {isAutoPersonalized && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top fade-in duration-300">
          <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">
              Personalized for you! Showing {currentRegionInfo.name} content based on your interests.
            </span>
            <button
              onClick={() => handleRegionChange("default")}
              className="ml-2 rounded-full bg-white/20 px-3 py-1 text-sm hover:bg-white/30 transition-colors"
            >
              Show All
            </button>
          </div>
        </div>
      )}

      {/* Region Switcher - Controls banner, text, and recipes */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-sm border border-stone-200 dark:bg-stone-900/95 dark:border-stone-700">
        <div className="flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400">
          <Globe className="h-4 w-4" />
          <span>Region</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentRegionInfo.flag}</span>
          <div className="flex flex-col">
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              {currentRegionInfo.name}
              {isAutoPersonalized && (
                <span className="ml-1 text-amber-500">✨</span>
              )}
            </span>
            <span className="text-xs text-stone-500">
              {latestRecipes.length} recipes
              {isAutoPersonalized && " • Auto"}
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
        {/* Debug info - shows variant status (temporarily enabled for debugging on Launch) */}
        <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-700 text-xs text-stone-500">
          <div>Badge: {displayedHomePage?.hero?.badgeText || "none"}</div>
          <div>Variants: {homePageVariants ? "✓" : "✗"}</div>
          {homePageVariants && (
            <div className="text-[10px] mt-1 space-y-0.5">
              <div>• def: {homePageVariants.default?.hero?.badgeText?.slice(0,15) || "null"}</div>
              <div>• ind: {homePageVariants.ind?.hero?.badgeText?.slice(0,15) || "null"}</div>
              <div>• usa: {homePageVariants.usa?.hero?.badgeText?.slice(0,15) || "null"}</div>
            </div>
          )}
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
        <div className={`absolute inset-0 bg-gradient-to-br ${bannerStyle.gradient} animate-gradient`} />
        <div className={`absolute inset-0 ${bannerStyle.overlay}`} />
        <div className="absolute inset-0 pattern-dots opacity-30" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float-slow pointer-events-none hidden lg:block">
          🍳
        </div>
        <div className="absolute bottom-32 right-16 text-5xl opacity-20 animate-float pointer-events-none hidden lg:block" style={{ animationDelay: '1s' }}>
          🥗
        </div>
        <div className="absolute top-1/3 right-1/4 text-4xl opacity-15 animate-float-slow pointer-events-none hidden xl:block" style={{ animationDelay: '2s' }}>
          🍰
        </div>
        
        {/* Current Region Badge */}
        {currentRegion !== "default" && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm animate-slide-up">
            <span className="text-2xl animate-bounce-subtle">{currentRegionInfo.flag}</span>
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
                className="mb-6 gap-2 animate-slide-up animate-pulse-glow"
                {...getEditableProps("home_page", "bltd30052da58732341", "hero_badge_text")}
              >
                <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
                {hero.badgeText}
              </Badge>
            )}
            <h1 
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg animate-slide-up opacity-0 delay-100"
              style={{ animationFillMode: 'forwards' }}
              {...getEditableProps("home_page", "bltd30052da58732341", "hero_headline")}
            >
              {hero.headline}{" "}
              {hero.highlightText && (
                <span 
                  className="text-gradient-animated"
                  {...getEditableProps("home_page", "bltd30052da58732341", "hero_highlight_text")}
                >
                  {hero.highlightText}
                </span>
              )}
            </h1>
            {hero.description && (
              <p 
                className="mt-6 text-lg leading-8 text-white/90 drop-shadow-md animate-slide-up opacity-0 delay-200"
                style={{ animationFillMode: 'forwards' }}
                {...getEditableProps("home_page", "bltd30052da58732341", "hero_description")}
              >
                {hero.description}
              </p>
            )}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up opacity-0 delay-300" style={{ animationFillMode: 'forwards' }}>
              {hero.primaryButton && (
                <Link href={hero.primaryButton.url}>
                  <Button size="lg" className="gap-2 glow-hover transition-transform hover:scale-105">
                    <Search className="h-5 w-5" />
                    {hero.primaryButton.label}
                  </Button>
                </Link>
              )}
              {hero.secondaryButton && (
                <Link href={hero.secondaryButton.url}>
                  <Button variant="outline" size="lg" className="gap-2 transition-transform hover:scale-105 hover:bg-white/10">
                    {hero.secondaryButton.label}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats with counter animation */}
            {stats.length > 0 && (
              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/20 pt-10 animate-slide-up opacity-0 delay-400" style={{ animationFillMode: 'forwards' }}>
                {stats.map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="text-center transform hover:scale-110 transition-transform duration-300"
                    style={{ animationDelay: `${500 + idx * 100}ms` }}
                  >
                    <p className="text-3xl font-bold text-amber-400 counter-animate drop-shadow-lg">{stat.value}</p>
                    <p className="mt-1 text-sm text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {displayCategories.length > 0 && (
        <section className="border-y-2 border-stone-100 bg-white py-16 dark:border-stone-800 dark:bg-stone-900 overflow-hidden">
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
                <Button variant="ghost" className="gap-2 underline-animate">
                  View All
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {displayCategories.slice(0, 6).map((category, idx) => (
                <Link
                  key={category.name}
                  href={`/recipes?category=${category.name}`}
                  className="group flex flex-col items-center rounded-2xl border-2 border-stone-100 bg-stone-50 p-6 transition-all hover:border-amber-200 hover:bg-amber-50 dark:border-stone-800 dark:bg-stone-800 dark:hover:border-amber-700 dark:hover:bg-amber-900/20 hover-lift animate-scale-in opacity-0"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <span className="text-4xl transition-transform duration-300 group-hover:scale-125 group-hover-wiggle">{category.emoji}</span>
                  <span className="mt-3 font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
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
      <section className="py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 animate-pulse-glow">
                <TrendingUp className="h-5 w-5 text-amber-600 animate-bounce-subtle" />
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
        <section className="bg-stone-50 py-20 dark:bg-stone-900/50 overflow-hidden">
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
                    className="group rounded-2xl border-2 border-stone-100 bg-white p-6 transition-all hover:border-amber-200 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-700 hover-lift animate-slide-up opacity-0"
                    style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
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
        <section className="py-20 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 px-8 py-16 text-center shadow-2xl shadow-amber-500/25 sm:px-16 animate-gradient">
              <div className="absolute inset-0 pattern-dots opacity-10" />
              {/* Floating emojis in CTA */}
              <div className="absolute top-8 left-8 text-4xl opacity-30 animate-float hidden sm:block">🍳</div>
              <div className="absolute bottom-8 right-8 text-4xl opacity-30 animate-float-slow hidden sm:block">🥘</div>
              <div className="relative">
                <h2 
                  className="text-3xl font-bold text-white sm:text-4xl animate-slide-up"
                  {...getEditableProps("home_page", "bltd30052da58732341", "cta_headline")}
                >
                  {ctaSection.headline}
                </h2>
                {ctaSection.description && (
                  <p 
                    className="mx-auto mt-4 max-w-xl text-lg text-amber-100 animate-slide-up opacity-0 delay-100"
                    style={{ animationFillMode: 'forwards' }}
                    {...getEditableProps("home_page", "bltd30052da58732341", "cta_description")}
                  >
                    {ctaSection.description}
                  </p>
                )}
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up opacity-0 delay-200" style={{ animationFillMode: 'forwards' }}>
                  {ctaSection.primaryButton && (
                    <Link href={ctaSection.primaryButton.url}>
                      <Button
                        size="lg"
                        className="bg-white text-amber-600 hover:bg-amber-50 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
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
                        className="border-white/30 text-white hover:bg-white/10 transition-all hover:scale-105"
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
