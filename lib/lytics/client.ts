// Lytics CDP Client Integration
// Uses the official Lytics jstag API

declare global {
  interface Window {
    jstag: {
      init: (config: { src: string; [key: string]: unknown }) => void;
      send: (event: string, data?: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
      pageView: (data?: Record<string, unknown>) => void;
      mock: (enabled: boolean) => void;
      getid: () => string | null;
      setid: (id: string) => void;
      loadEntity: (entity: string, callback: (data: unknown) => void) => void;
      getEntity: (entity: string) => unknown;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      once: (event: string, callback: (...args: unknown[]) => void) => void;
      call: (method: string, ...args: unknown[]) => void;
      config?: Record<string, unknown>;
    };
  }
}

// Check if Lytics is loaded and ready
export function isLyticsLoaded(): boolean {
  return typeof window !== "undefined" && !!window.jstag && typeof window.jstag.send === "function";
}

// Get Lytics user ID
export function getLyticsUserId(): string | null {
  if (typeof window === "undefined" || !window.jstag?.getid) return null;
  try {
    return window.jstag.getid();
  } catch {
    return null;
  }
}

// ============================================
// Core Tracking Functions
// ============================================

// Send custom event to Lytics
export function sendEvent(eventName: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.jstag) {
    console.warn("Lytics not available");
    return;
  }

  const eventData = {
    _e: eventName,
    timestamp: new Date().toISOString(),
    ...data,
  };

  window.jstag.send(eventName, eventData);
  console.log(`📊 Lytics event [${eventName}]:`, eventData);
}

// Track page view (automatic via LyticsScript, but can be called manually)
export function trackPageView(pageData?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.jstag?.pageView) return;

  const data = {
    url: window.location.href,
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer,
    ...pageData,
  };

  window.jstag.pageView(data);
  console.log(`📄 Lytics pageView:`, data);
}

// Identify user
export function identifyUser(userData: {
  email?: string;
  userId?: string;
  name?: string;
  [key: string]: unknown;
}): void {
  if (typeof window === "undefined" || !window.jstag?.identify) return;

  window.jstag.identify(userData);
  console.log(`👤 Lytics identify:`, userData);
}

// ============================================
// Recipe Event Tracking
// ============================================

// Track recipe view
export function trackRecipeView(recipeId: string, recipeName: string, category?: string, cuisine?: string): void {
  sendEvent("recipe_view", {
    recipe_id: recipeId,
    recipe_name: recipeName,
    category: category || "uncategorized",
    cuisine: cuisine || "general",
    action: "view",
  });
}

// Track recipe click (from list)
export function trackRecipeClick(recipeId: string, recipeName: string, category?: string, source?: string): void {
  sendEvent("recipe_click", {
    recipe_id: recipeId,
    recipe_name: recipeName,
    category: category || "uncategorized",
    source: source || "list",
    action: "click",
  });
}

// Track recipe like
export function trackRecipeLike(recipeId: string, recipeName: string, liked: boolean): void {
  sendEvent("recipe_like", {
    recipe_id: recipeId,
    recipe_name: recipeName,
    liked: liked,
    action: liked ? "like" : "unlike",
  });
}

// Track recipe save/bookmark
export function trackRecipeSave(recipeId: string, recipeName: string, saved: boolean): void {
  sendEvent("recipe_save", {
    recipe_id: recipeId,
    recipe_name: recipeName,
    saved: saved,
    action: saved ? "save" : "unsave",
  });
}

// Track recipe share
export function trackRecipeShare(recipeId: string, recipeName: string, platform?: string): void {
  sendEvent("recipe_share", {
    recipe_id: recipeId,
    recipe_name: recipeName,
    platform: platform || "unknown",
    action: "share",
  });
}

// ============================================
// Category & Search Tracking
// ============================================

// Track category view
export function trackCategoryView(categoryName: string, categoryId?: string): void {
  sendEvent("category_view", {
    category_name: categoryName,
    category_id: categoryId || categoryName.toLowerCase().replace(/\s+/g, "-"),
    action: "view",
  });
}

// Track category click
export function trackCategoryClick(categoryName: string, source?: string): void {
  sendEvent("category_click", {
    category_name: categoryName,
    source: source || "list",
    action: "click",
  });
}

// Track search
export function trackSearch(query: string, resultsCount: number, filters?: Record<string, unknown>): void {
  sendEvent("search", {
    query: query,
    results_count: resultsCount,
    filters: filters || {},
    action: "search",
  });
}

// ============================================
// Cuisine Preference Tracking
// ============================================

// Track cuisine preference (for personalization)
export function trackCuisinePreference(cuisine: "indian" | "american" | "other", source: string): void {
  sendEvent("cuisine_preference", {
    cuisine: cuisine,
    source: source,
    action: "preference",
  });
}

// Track region/banner interaction
export function trackRegionSelection(region: string, source: string): void {
  sendEvent("region_select", {
    region: region,
    source: source,
    action: "select",
  });
}

// ============================================
// User Actions
// ============================================

// Track signup start
export function trackSignupStart(source?: string): void {
  sendEvent("signup_start", {
    source: source || "unknown",
    action: "start",
  });
}

// Track signup complete
export function trackSignupComplete(method?: string): void {
  sendEvent("signup_complete", {
    method: method || "email",
    action: "complete",
  });
}

// Track login
export function trackLogin(method?: string): void {
  sendEvent("login", {
    method: method || "email",
    action: "login",
  });
}

// Track recipe creation
export function trackRecipeCreate(recipeId: string, recipeName: string, category?: string): void {
  sendEvent("recipe_create", {
    recipe_id: recipeId,
    recipe_name: recipeName,
    category: category || "uncategorized",
    action: "create",
  });
}

// Track comment
export function trackComment(recipeId: string, recipeName: string): void {
  sendEvent("recipe_comment", {
    recipe_id: recipeId,
    recipe_name: recipeName,
    action: "comment",
  });
}

// ============================================
// Engagement Tracking
// ============================================

// Track time on page (call periodically or on page exit)
export function trackEngagement(pageType: string, duration: number, scrollDepth?: number): void {
  sendEvent("engagement", {
    page_type: pageType,
    duration_seconds: duration,
    scroll_depth: scrollDepth || 0,
    action: "engage",
  });
}

// Track filter usage
export function trackFilterUsage(filterType: string, filterValue: string): void {
  sendEvent("filter_use", {
    filter_type: filterType,
    filter_value: filterValue,
    action: "filter",
  });
}

// ============================================
// Entity Loading (for Personalization)
// ============================================

// Load user entity from Lytics
export function loadUserEntity(callback: (user: unknown) => void): void {
  if (typeof window === "undefined" || !window.jstag?.loadEntity) return;
  
  window.jstag.loadEntity("user", callback);
}

// Get current user entity
export function getUserEntity(): unknown {
  if (typeof window === "undefined" || !window.jstag?.getEntity) return null;
  
  return window.jstag.getEntity("user");
}

// Listen for Lytics events
export function onLyticsEvent(eventName: string, callback: (...args: unknown[]) => void): void {
  if (typeof window === "undefined" || !window.jstag?.on) return;
  
  window.jstag.on(eventName, callback);
}

// ============================================
// Debug Helper
// ============================================

export function debugLytics(): void {
  console.log("=== Lytics Debug Info ===");
  console.log("Is Loaded:", isLyticsLoaded());
  console.log("User ID:", getLyticsUserId());
  console.log("jstag object:", window.jstag);
  console.log("Config:", window.jstag?.config);
  
  // Try to get user entity
  if (window.jstag?.getEntity) {
    console.log("User Entity:", window.jstag.getEntity("user"));
  }
  
  console.log("=========================");
}

// Make debug function available globally for console access
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).debugLytics = debugLytics;
}
