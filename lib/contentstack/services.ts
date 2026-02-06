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
      bannerImage: entry.hero_banner_image?.url || null,
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

// Variant UIDs from Personalize
const VARIANT_UIDS = {
  ind: "cs32b45e98dce08645",
  usa: "csc983d9bc8d2be49f",
} as const;

// Home Page entry UID
const HOME_PAGE_ENTRY_UID = "bltd30052da58732341";

// Get Home Page variant based on region (uses Entry Variants API with x-cs-variant-uid header)
export async function getHomePageForRegion(region: "ind" | "usa" | "default"): Promise<HomePage | null> {
  if (region === "default") {
    console.log("[Variants] Fetching default home page");
    return getHomePage();
  }

  const variantUid = VARIANT_UIDS[region];
  if (!variantUid) {
    console.log("[Variants] No variant UID for region:", region);
    return getHomePage();
  }

  try {
    const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "";
    const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || "";
    const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || "development";
    
    // Debug: Log environment config (without sensitive data)
    console.log(`[Variants] Fetching ${region} variant (${variantUid}) from ${ENVIRONMENT} environment`);
    console.log(`[Variants] API Key present: ${!!API_KEY}, Token present: ${!!DELIVERY_TOKEN}`);
    
    if (!API_KEY || !DELIVERY_TOKEN) {
      console.error("[Variants] Missing API credentials - falling back to default");
      return getHomePage();
    }
    
    // Add timestamp to bust any CDN caching
    const timestamp = Date.now();
    const url = `https://cdn.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_ENTRY_UID}?environment=${ENVIRONMENT}&_=${timestamp}`;
    console.log(`[Variants] Fetching: ${url}`);
    
    // Fetch the specific entry with the variant header (no caching)
    const response = await fetch(url, {
      headers: {
        "api_key": API_KEY,
        "access_token": DELIVERY_TOKEN,
        "x-cs-variant-uid": variantUid,
      },
      cache: "no-store",
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Variants] Failed to fetch variant (${response.status}):`, errorText);
      return getHomePage();
    }
    
    const data = await response.json();
    const entry = data.entry;
    
    if (!entry) {
      console.error("[Variants] No entry in response for variant:", region);
      return getHomePage();
    }
    
    console.log(`[Variants] ✓ Fetched ${region} variant - Badge: "${entry.hero_badge_text}", Headline: "${entry.hero_headline}"`);
    return transformHomePage(entry as unknown as HomePageEntry);
  } catch (error) {
    console.error("[Variants] Error fetching home page variant:", error);
    return getHomePage();
  }
}

// Get all Home Page variants
export async function getAllHomePageVariants(): Promise<{
  default: HomePage | null;
  ind: HomePage | null;
  usa: HomePage | null;
}> {
  console.log("[Variants] Fetching all home page variants...");
  
  const [defaultPage, indPage, usaPage] = await Promise.all([
    getHomePage(),
    getHomePageForRegion("ind"),
    getHomePageForRegion("usa"),
  ]);
  
  // Log what we got
  console.log("[Variants] Results:", {
    default: defaultPage?.hero?.badgeText || "null",
    ind: indPage?.hero?.badgeText || "null",
    usa: usaPage?.hero?.badgeText || "null",
  });
  
  // Check if variants are actually different
  const allSame = defaultPage?.hero?.badgeText === indPage?.hero?.badgeText && 
                  defaultPage?.hero?.badgeText === usaPage?.hero?.badgeText;
  if (allSame) {
    console.warn("[Variants] ⚠ All variants have the same content - variants may not be set up correctly in Contentstack");
  }
  
  return {
    default: defaultPage,
    ind: indPage,
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

// Get personalized home page data based on region (uses Personalize variant short IDs)
export async function getPersonalizedHomePageData(region: "ind" | "usa" | "default" = "default") {
  const [homePage, allRecipes, regionalRecipes, categories] = await Promise.all([
    getHomePageForRegion(region),
    getPublishedRecipes(),
    region === "ind" ? getIndianRecipes() :
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
