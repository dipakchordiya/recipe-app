// Lytics CDP Client Integration
// This connects Lytics user data to Contentstack Personalize

declare global {
  interface Window {
    jstag: {
      send: (event: string, data?: Record<string, unknown>) => void;
      mock?: boolean;
      pageView?: () => void;
      getid?: () => string | null;
      config?: Record<string, unknown>;
    };
    lyticsReady?: boolean;
  }
}

// Environment variables
const LYTICS_ACCOUNT_ID = process.env.NEXT_PUBLIC_LYTICS_ACCOUNT_ID || "1748c1c6477f791602278b9737df4f9f";
const LYTICS_STREAM = process.env.NEXT_PUBLIC_LYTICS_STREAM || "web";

// Check if Lytics is loaded
export function isLyticsLoaded(): boolean {
  return typeof window !== "undefined" && !!window.jstag && !window.jstag.mock;
}

// Initialize Lytics SDK
export function initLytics(accountId?: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    const aid = accountId || LYTICS_ACCOUNT_ID;
    if (!aid) {
      console.warn("Lytics Account ID not configured");
      resolve();
      return;
    }

    // Check if already loaded
    if (isLyticsLoaded()) {
      console.log("✓ Lytics already loaded");
      resolve();
      return;
    }

    // Initialize jstag
    const jstag = window.jstag || (window.jstag = {} as Window["jstag"]);
    const queue: Array<[string, Record<string, unknown>?]> = [];
    
    jstag.send = (event: string, data?: Record<string, unknown>) => {
      queue.push([event, data]);
    };
    jstag.mock = true;

    // Load Lytics script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://c.lytics.io/api/tag/${aid}/lio.js`;
    
    script.onload = () => {
      window.lyticsReady = true;
      console.log("✓ Lytics SDK loaded");
      
      // Process queued events
      queue.forEach(([event, data]) => {
        if (window.jstag && !window.jstag.mock) {
          window.jstag.send(event, data);
        }
      });
      
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load Lytics SDK");
      resolve();
    };

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  });
}

// Send event to Lytics
export function trackEvent(eventName: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.jstag) return;
  
  window.jstag.send(eventName, {
    ...data,
    _ts: Date.now(),
  });
  
  console.log(`📊 Lytics event: ${eventName}`, data);
}

// Track page view
export function trackPageView(pageData?: Record<string, unknown>): void {
  trackEvent("pageview", {
    url: typeof window !== "undefined" ? window.location.href : "",
    path: typeof window !== "undefined" ? window.location.pathname : "",
    title: typeof document !== "undefined" ? document.title : "",
    ...pageData,
  });
}

// Identify user
export function identifyUser(userData: {
  email?: string;
  userId?: string;
  name?: string;
  [key: string]: unknown;
}): void {
  trackEvent("identify", userData);
}

// Get Lytics user ID
export function getLyticsUserId(): string | null {
  if (typeof window === "undefined" || !window.jstag?.getid) return null;
  return window.jstag.getid();
}

// Track recipe interactions
export function trackRecipeView(recipeId: string, recipeName: string, category?: string): void {
  trackEvent("recipe_view", {
    recipe_id: recipeId,
    recipe_name: recipeName,
    category,
  });
}

export function trackRecipeLike(recipeId: string, recipeName: string): void {
  trackEvent("recipe_like", {
    recipe_id: recipeId,
    recipe_name: recipeName,
  });
}

export function trackRecipeSave(recipeId: string, recipeName: string): void {
  trackEvent("recipe_save", {
    recipe_id: recipeId,
    recipe_name: recipeName,
  });
}

export function trackSearch(query: string, resultsCount: number): void {
  trackEvent("search", {
    query,
    results_count: resultsCount,
  });
}

export function trackCategoryView(categoryName: string): void {
  trackEvent("category_view", {
    category: categoryName,
  });
}
