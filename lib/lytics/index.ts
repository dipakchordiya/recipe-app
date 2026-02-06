// Lytics CDP Integration
// The Lytics script is loaded via LyticsScript component in layout.tsx

export {
  // Core
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
  
  // Entity loading
  loadUserEntity,
  getUserEntity,
  onLyticsEvent,
} from "./client";

// Lytics-Personalize connector
export { syncLyticsToPersonalize, onLyticsSegmentChange } from "./lytics-personalize-connector";
