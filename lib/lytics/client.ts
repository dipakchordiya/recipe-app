// Lytics CDP Client Integration
// This connects Lytics user data to Contentstack Personalize

declare global {
  interface Window {
    jstag: {
      send: (data: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
      page: (data?: Record<string, unknown>) => void;
      track: (eventName: string, data?: Record<string, unknown>) => void;
      getid?: () => string | null;
      config?: Record<string, unknown>;
      _q?: Array<[string, unknown[]]>;
      _c?: Record<string, unknown>;
      init?: (config: Record<string, unknown>) => void;
    };
    lyticsReady?: boolean;
  }
}

// Environment variables
const LYTICS_ACCOUNT_ID = process.env.NEXT_PUBLIC_LYTICS_ACCOUNT_ID || "1748c1c6477f791602278b9737df4f9f";
const LYTICS_STREAM = process.env.NEXT_PUBLIC_LYTICS_STREAM || "default";

// Check if Lytics is loaded
export function isLyticsLoaded(): boolean {
  return typeof window !== "undefined" && !!window.jstag && !!window.lyticsReady;
}

// Initialize Lytics SDK using the official Lytics snippet
export function initLytics(accountId?: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    const aid = accountId || LYTICS_ACCOUNT_ID;
    if (!aid) {
      console.warn("⚠ Lytics Account ID not configured");
      resolve();
      return;
    }

    // Check if already loaded
    if (isLyticsLoaded()) {
      console.log("✓ Lytics already loaded");
      resolve();
      return;
    }

    // Official Lytics initialization snippet
    (function(w: Window) {
      const d = document;
      const t = "script";
      
      // Create jstag object with queue
      w.jstag = w.jstag || {
        _q: [],
        _c: { account: aid, stream: LYTICS_STREAM },
        send: function(data: Record<string, unknown>) {
          this._q?.push(["send", [data]]);
        },
        identify: function(data: Record<string, unknown>) {
          this._q?.push(["identify", [data]]);
        },
        page: function(data?: Record<string, unknown>) {
          this._q?.push(["page", [data]]);
        },
        track: function(eventName: string, data?: Record<string, unknown>) {
          this._q?.push(["track", [eventName, data]]);
        },
      } as Window["jstag"];

      // Load the Lytics SDK
      const loadScript = () => {
        const s = d.createElement(t) as HTMLScriptElement;
        s.async = true;
        s.src = `https://c.lytics.io/api/tag/${aid}/lio.js`;
        
        s.onload = () => {
          window.lyticsReady = true;
          console.log("✓ Lytics SDK loaded successfully");
          console.log(`  Account: ${aid}`);
          console.log(`  Stream: ${LYTICS_STREAM}`);
          
          // Process any queued events
          if (window.jstag._q && window.jstag._q.length > 0) {
            console.log(`  Processing ${window.jstag._q.length} queued events`);
          }
          
          resolve();
        };
        
        s.onerror = () => {
          console.error("✗ Failed to load Lytics SDK");
          resolve();
        };

        const firstScript = d.getElementsByTagName(t)[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(s, firstScript);
        } else {
          d.head.appendChild(s);
        }
      };

      // Load script when DOM is ready
      if (d.readyState === "loading") {
        d.addEventListener("DOMContentLoaded", loadScript);
      } else {
        loadScript();
      }
    })(window);
  });
}

// Send raw event to Lytics
export function sendEvent(data: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.jstag) {
    console.warn("Lytics not available");
    return;
  }

  // Add stream name and timestamp
  const eventData = {
    _stream: LYTICS_STREAM,
    _ts: Date.now(),
    ...data,
  };

  window.jstag.send(eventData);
  console.log(`📊 Lytics event sent:`, eventData);
}

// Track page view - this is the most important event for streams
export function trackPageView(pageData?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.jstag) return;

  const data = {
    _e: "pageview",
    _stream: LYTICS_STREAM,
    url: window.location.href,
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
    ...pageData,
  };

  window.jstag.send(data);
  console.log(`📄 Lytics pageview:`, data);
}

// Identify user
export function identifyUser(userData: {
  email?: string;
  userId?: string;
  name?: string;
  [key: string]: unknown;
}): void {
  if (typeof window === "undefined" || !window.jstag) return;

  const data = {
    _e: "identify",
    _stream: LYTICS_STREAM,
    ...userData,
  };

  window.jstag.send(data);
  console.log(`👤 Lytics identify:`, userData);
}

// Get Lytics user ID
export function getLyticsUserId(): string | null {
  if (typeof window === "undefined" || !window.jstag?.getid) return null;
  return window.jstag.getid();
}

// ============================================
// Recipe Event Tracking
// ============================================

// Track recipe view
export function trackRecipeView(recipeId: string, recipeName: string, category?: string, cuisine?: string): void {
  sendEvent({
    _e: "recipe_view",
    recipe_id: recipeId,
    recipe_name: recipeName,
    category: category || "uncategorized",
    cuisine: cuisine || "general",
    action: "view",
  });
}

// Track recipe click (from list)
export function trackRecipeClick(recipeId: string, recipeName: string, category?: string, source?: string): void {
  sendEvent({
    _e: "recipe_click",
    recipe_id: recipeId,
    recipe_name: recipeName,
    category: category || "uncategorized",
    source: source || "list",
    action: "click",
  });
}

// Track recipe like
export function trackRecipeLike(recipeId: string, recipeName: string, liked: boolean): void {
  sendEvent({
    _e: "recipe_like",
    recipe_id: recipeId,
    recipe_name: recipeName,
    liked: liked,
    action: liked ? "like" : "unlike",
  });
}

// Track recipe save/bookmark
export function trackRecipeSave(recipeId: string, recipeName: string, saved: boolean): void {
  sendEvent({
    _e: "recipe_save",
    recipe_id: recipeId,
    recipe_name: recipeName,
    saved: saved,
    action: saved ? "save" : "unsave",
  });
}

// Track recipe share
export function trackRecipeShare(recipeId: string, recipeName: string, platform?: string): void {
  sendEvent({
    _e: "recipe_share",
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
  sendEvent({
    _e: "category_view",
    category_name: categoryName,
    category_id: categoryId || categoryName.toLowerCase().replace(/\s+/g, "-"),
    action: "view",
  });
}

// Track category click
export function trackCategoryClick(categoryName: string, source?: string): void {
  sendEvent({
    _e: "category_click",
    category_name: categoryName,
    source: source || "list",
    action: "click",
  });
}

// Track search
export function trackSearch(query: string, resultsCount: number, filters?: Record<string, unknown>): void {
  sendEvent({
    _e: "search",
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
  sendEvent({
    _e: "cuisine_preference",
    cuisine: cuisine,
    source: source,
    action: "preference",
  });
}

// Track region/banner interaction
export function trackRegionSelection(region: string, source: string): void {
  sendEvent({
    _e: "region_select",
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
  sendEvent({
    _e: "signup_start",
    source: source || "unknown",
    action: "start",
  });
}

// Track signup complete
export function trackSignupComplete(method?: string): void {
  sendEvent({
    _e: "signup_complete",
    method: method || "email",
    action: "complete",
  });
}

// Track login
export function trackLogin(method?: string): void {
  sendEvent({
    _e: "login",
    method: method || "email",
    action: "login",
  });
}

// Track recipe creation
export function trackRecipeCreate(recipeId: string, recipeName: string, category?: string): void {
  sendEvent({
    _e: "recipe_create",
    recipe_id: recipeId,
    recipe_name: recipeName,
    category: category || "uncategorized",
    action: "create",
  });
}

// Track comment
export function trackComment(recipeId: string, recipeName: string): void {
  sendEvent({
    _e: "recipe_comment",
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
  sendEvent({
    _e: "engagement",
    page_type: pageType,
    duration_seconds: duration,
    scroll_depth: scrollDepth || 0,
    action: "engage",
  });
}

// Track filter usage
export function trackFilterUsage(filterType: string, filterValue: string): void {
  sendEvent({
    _e: "filter_use",
    filter_type: filterType,
    filter_value: filterValue,
    action: "filter",
  });
}

// Debug helper - logs current Lytics state
export function debugLytics(): void {
  console.log("=== Lytics Debug Info ===");
  console.log("Account ID:", LYTICS_ACCOUNT_ID);
  console.log("Stream:", LYTICS_STREAM);
  console.log("Is Loaded:", isLyticsLoaded());
  console.log("User ID:", getLyticsUserId());
  console.log("jstag object:", window.jstag);
  console.log("Queued events:", window.jstag?._q?.length || 0);
  console.log("=========================");
}
