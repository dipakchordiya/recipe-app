// Lytics CDP Integration
export {
  // Core
  initLytics,
  isLyticsLoaded,
  sendEvent,
  getLyticsUserId,
  debugLytics,
  
  // Page tracking
  trackPageView,
  
  // User tracking
  identifyUser,
  
  // Recipe events
  trackRecipeView,
  trackRecipeClick,
  trackRecipeLike,
  trackRecipeSave,
  trackRecipeShare,
  trackRecipeCreate,
  trackComment,
  
  // Category & Search
  trackCategoryView,
  trackCategoryClick,
  trackSearch,
  
  // Personalization
  trackCuisinePreference,
  trackRegionSelection,
  
  // User actions
  trackSignupStart,
  trackSignupComplete,
  trackLogin,
  
  // Engagement
  trackEngagement,
  trackFilterUsage,
} from "./client";

// Lytics-Personalize connector
export { syncLyticsToPersonalize, onLyticsSegmentChange } from "./lytics-personalize-connector";
