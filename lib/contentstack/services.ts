import { getStack, CONTENT_TYPES } from "./server";
import type {
  RecipeEntry,
  AuthorEntry,
  CategoryEntry,
  HeaderEntry,
  FooterEntry,
  HomePageEntry,
  Recipe,
  Profile,
  Category,
  Header,
  Footer,
  HomePage,
} from "./types";

// Transform Contentstack RecipeEntry to UI Recipe format
function transformRecipe(entry: RecipeEntry): Recipe {
  const author = entry.author?.[0];
  
  return {
    id: entry.uid,
    user_id: author?.uid || "",
    title: entry.title,
    description: entry.description || null,
    ingredients: entry.ingredients || [],
    steps: entry.steps,
    cooking_time: entry.cooking_time || null,
    difficulty: entry.difficulty,
    category: entry.category?.[0]?.name || null,
    tags: entry.recipe_tags || null,
    image_url: entry.featured_image?.url || null,
    is_published: entry.is_published ?? true,
    created_at: entry.created_at,
    updated_at: entry.updated_at,
    profiles: author
      ? {
          id: author.uid,
          username: author.username || null,
          full_name: author.full_name || null,
          avatar_url: author.avatar?.url || null,
          bio: author.bio || null,
        }
      : null,
    likes_count: 0,
    comments_count: 0,
  };
}

// Transform AuthorEntry to Profile format
function transformAuthor(entry: AuthorEntry): Profile {
  return {
    id: entry.uid,
    username: entry.username || null,
    full_name: entry.full_name || null,
    avatar_url: entry.avatar?.url || null,
    bio: entry.bio || null,
    created_at: entry.created_at,
    updated_at: entry.updated_at,
  };
}

// Transform CategoryEntry to Category format
function transformCategory(entry: CategoryEntry): Category {
  return {
    id: entry.uid,
    name: entry.name,
    emoji: entry.emoji,
    description: entry.description,
    color_gradient: entry.color_gradient,
    image_url: entry.image?.url || null,
  };
}

// ============ RECIPE SERVICES ============

export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.RECIPE).Query();
    const result = await query
      .includeReference(["author", "category"])
      .toJSON()
      .find();
    
    const entries = (result[0] || []) as RecipeEntry[];
    return entries.map(transformRecipe);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export async function getPublishedRecipes(): Promise<Recipe[]> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.RECIPE).Query();
    const result = await query
      .where("is_published", true)
      .includeReference(["author", "category"])
      .toJSON()
      .find();
    
    const entries = (result[0] || []) as RecipeEntry[];
    return entries.map(transformRecipe);
  } catch (error) {
    console.error("Error fetching published recipes:", error);
    return [];
  }
}

export async function getRecipeByUid(uid: string): Promise<Recipe | null> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.RECIPE).Entry(uid);
    const result = await query
      .includeReference(["author", "category"])
      .toJSON()
      .fetch();
    
    return transformRecipe(result as unknown as RecipeEntry);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
}

export async function getRecipesByCategory(categoryName: string): Promise<Recipe[]> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.RECIPE).Query();
    const result = await query
      .includeReference(["author", "category"])
      .toJSON()
      .find();
    
    const entries = (result[0] || []) as RecipeEntry[];
    return entries
      .filter((entry) => entry.category?.[0]?.name === categoryName)
      .map(transformRecipe);
  } catch (error) {
    console.error("Error fetching recipes by category:", error);
    return [];
  }
}

export async function searchRecipes(searchTerm: string): Promise<Recipe[]> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.RECIPE).Query();
    const result = await query
      .regex("title", searchTerm, "i")
      .includeReference(["author", "category"])
      .toJSON()
      .find();
    
    const entries = (result[0] || []) as RecipeEntry[];
    return entries.map(transformRecipe);
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
  }
}

// ============ REGIONAL RECIPE SERVICES ============

export async function getIndianRecipes(): Promise<Recipe[]> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.RECIPE).Query();
    const result = await query
      .where("is_published", true)
      .includeReference(["author", "category"])
      .toJSON()
      .find();
    
    const entries = (result[0] || []) as RecipeEntry[];
    return entries
      .filter((entry) => 
        entry.category?.[0]?.name === "Indian Cuisine" ||
        entry.recipe_tags?.some(tag => tag.toLowerCase().includes("indian"))
      )
      .map(transformRecipe);
  } catch (error) {
    console.error("Error fetching Indian recipes:", error);
    return [];
  }
}

export async function getAmericanRecipes(): Promise<Recipe[]> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.RECIPE).Query();
    const result = await query
      .where("is_published", true)
      .includeReference(["author", "category"])
      .toJSON()
      .find();
    
    const entries = (result[0] || []) as RecipeEntry[];
    return entries
      .filter((entry) => 
        entry.category?.[0]?.name === "American Cuisine" ||
        entry.recipe_tags?.some(tag => tag.toLowerCase().includes("american"))
      )
      .map(transformRecipe);
  } catch (error) {
    console.error("Error fetching American recipes:", error);
    return [];
  }
}

// ============ AUTHOR SERVICES ============

export async function getAllAuthors(): Promise<Profile[]> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.AUTHOR).Query();
    const result = await query.toJSON().find();
    
    const entries = (result[0] || []) as AuthorEntry[];
    return entries.map(transformAuthor);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

export async function getAuthorByUid(uid: string): Promise<Profile | null> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.AUTHOR).Entry(uid);
    const result = await query.toJSON().fetch();
    
    return transformAuthor(result as unknown as AuthorEntry);
  } catch (error) {
    console.error("Error fetching author:", error);
    return null;
  }
}

export async function getAuthorByUsername(username: string): Promise<Profile | null> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.AUTHOR).Query();
    const result = await query
      .where("username", username)
      .toJSON()
      .findOne();
    
    if (!result) return null;
    return transformAuthor(result as unknown as AuthorEntry);
  } catch (error) {
    console.error("Error fetching author by username:", error);
    return null;
  }
}

export async function getRecipesByAuthor(authorUid: string): Promise<Recipe[]> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.RECIPE).Query();
    const result = await query
      .includeReference(["author", "category"])
      .toJSON()
      .find();
    
    const entries = (result[0] || []) as RecipeEntry[];
    return entries
      .filter((entry) => entry.author?.[0]?.uid === authorUid)
      .map(transformRecipe);
  } catch (error) {
    console.error("Error fetching recipes by author:", error);
    return [];
  }
}

// ============ CATEGORY SERVICES ============

export async function getAllCategories(): Promise<Category[]> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.CATEGORY).Query();
    const result = await query.toJSON().find();
    
    const entries = (result[0] || []) as CategoryEntry[];
    return entries.map(transformCategory);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryByUid(uid: string): Promise<Category | null> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.CATEGORY).Entry(uid);
    const result = await query.toJSON().fetch();
    
    return transformCategory(result as unknown as CategoryEntry);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getCategoryByName(name: string): Promise<Category | null> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.CATEGORY).Query();
    const result = await query
      .where("name", name)
      .toJSON()
      .findOne();
    
    if (!result) return null;
    return transformCategory(result as unknown as CategoryEntry);
  } catch (error) {
    console.error("Error fetching category by name:", error);
    return null;
  }
}

// ============ HEADER SERVICES ============

function transformHeader(entry: HeaderEntry): Header {
  return {
    siteName: entry.site_name,
    logoUrl: entry.logo?.url || null,
    navigationLinks: entry.navigation_links || [],
    showSearch: entry.show_search ?? true,
    ctaButton: entry.cta_button,
  };
}

export async function getHeader(): Promise<Header | null> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.HEADER).Query();
    const result = await query.toJSON().findOne();
    
    if (!result) return null;
    return transformHeader(result as unknown as HeaderEntry);
  } catch (error) {
    console.error("Error fetching header:", error);
    return null;
  }
}

// ============ FOOTER SERVICES ============

function transformFooter(entry: FooterEntry): Footer {
  return {
    brandDescription: entry.brand_description || "",
    linkSections: entry.link_sections || [],
    socialLinks: entry.social_links || [],
    copyrightText: entry.copyright_text?.replace("{year}", new Date().getFullYear().toString()) || "",
  };
}

export async function getFooter(): Promise<Footer | null> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.FOOTER).Query();
    const result = await query.toJSON().findOne();
    
    if (!result) return null;
    return transformFooter(result as unknown as FooterEntry);
  } catch (error) {
    console.error("Error fetching footer:", error);
    return null;
  }
}

// ============ HOME PAGE SERVICES ============

function transformHomePage(entry: HomePageEntry): HomePage {
  return {
    seo: {
      title: entry.seo_meta_title || entry.page_title,
      description: entry.seo_meta_description || "",
    },
    hero: {
      badgeText: entry.hero_badge_text || "",
      headline: entry.hero_headline,
      highlightText: entry.hero_highlight_text || "",
      description: entry.hero_description || "",
      primaryButton: entry.hero_primary_btn_label && entry.hero_primary_btn_url
        ? { label: entry.hero_primary_btn_label, url: entry.hero_primary_btn_url }
        : null,
      secondaryButton: entry.hero_secondary_btn_label && entry.hero_secondary_btn_url
        ? { label: entry.hero_secondary_btn_label, url: entry.hero_secondary_btn_url }
        : null,
      stats: entry.stats || [],
    },
    categoriesSection: {
      title: entry.categories_section_title || "Browse by Category",
      subtitle: entry.categories_section_subtitle || "",
    },
    recipesSection: {
      title: entry.recipes_section_title || "Latest Recipes",
      subtitle: entry.recipes_section_subtitle || "",
    },
    featuresSection: {
      title: entry.features_section_title || "",
      subtitle: entry.features_section_subtitle || "",
      features: entry.features || [],
    },
    ctaSection: {
      headline: entry.cta_headline || "",
      description: entry.cta_description || "",
      primaryButton: entry.cta_primary_btn_label && entry.cta_primary_btn_url
        ? { label: entry.cta_primary_btn_label, url: entry.cta_primary_btn_url }
        : null,
      secondaryButton: entry.cta_secondary_btn_label && entry.cta_secondary_btn_url
        ? { label: entry.cta_secondary_btn_label, url: entry.cta_secondary_btn_url }
        : null,
    },
  };
}

export async function getHomePage(): Promise<HomePage | null> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.HOME_PAGE).Query();
    const result = await query.toJSON().findOne();
    
    if (!result) return null;
    return transformHomePage(result as unknown as HomePageEntry);
  } catch (error) {
    console.error("Error fetching home page:", error);
    return null;
  }
}

// Get Home Page by title (for regional variants)
export async function getHomePageByTitle(title: string): Promise<HomePage | null> {
  try {
    const Stack = await getStack();
    const query = Stack.ContentType(CONTENT_TYPES.HOME_PAGE).Query();
    const result = await query
      .where("title", title)
      .toJSON()
      .findOne();
    
    if (!result) return null;
    return transformHomePage(result as unknown as HomePageEntry);
  } catch {
    // Silently return null for missing regional variants - this is expected
    return null;
  }
}

// Get Home Page variant based on region
export async function getHomePageForRegion(region: "india" | "usa" | "default"): Promise<HomePage | null> {
  const titleMap = {
    india: "Home Page - India",
    usa: "Home Page - USA",
    default: "Home Page",
  };
  
  const homePage = await getHomePageByTitle(titleMap[region]);
  
  // Fallback to default if regional variant not found
  if (!homePage && region !== "default") {
    return getHomePage();
  }
  
  return homePage;
}

// Get all Home Page variants
export async function getAllHomePageVariants(): Promise<{
  default: HomePage | null;
  india: HomePage | null;
  usa: HomePage | null;
}> {
  const [defaultPage, indiaPage, usaPage] = await Promise.all([
    getHomePage(),
    getHomePageByTitle("Home Page - India"),
    getHomePageByTitle("Home Page - USA"),
  ]);
  
  return {
    default: defaultPage,
    india: indiaPage,
    usa: usaPage,
  };
}

// ============ COMBINED SERVICES ============

export async function getHomePageData() {
  const [recipes, categories] = await Promise.all([
    getPublishedRecipes(),
    getAllCategories(),
  ]);
  
  return {
    recipes: recipes.slice(0, 6),
    categories,
  };
}

// Get personalized home page data based on region
export async function getPersonalizedHomePageData(region: "india" | "usa" | "default" = "default") {
  const [homePage, allRecipes, regionalRecipes, categories] = await Promise.all([
    getHomePageForRegion(region),
    getPublishedRecipes(),
    region === "india" ? getIndianRecipes() : 
    region === "usa" ? getAmericanRecipes() : 
    getPublishedRecipes(),
    getAllCategories(),
  ]);
  
  // Prioritize regional recipes, then fill with general recipes
  const recipes = regionalRecipes.length > 0 
    ? [...regionalRecipes, ...allRecipes.filter(r => !regionalRecipes.find(rr => rr.id === r.id))].slice(0, 6)
    : allRecipes.slice(0, 6);
  
  return {
    homePage,
    recipes,
    categories,
  };
}

export async function getRecipePageData(uid: string) {
  const recipe = await getRecipeByUid(uid);
  return { recipe };
}

export async function getLayoutData() {
  const [header, footer] = await Promise.all([
    getHeader(),
    getFooter(),
  ]);
  
  return { header, footer };
}
