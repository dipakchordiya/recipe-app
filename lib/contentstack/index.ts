// ============================================
// Client-safe exports (can be used anywhere)
// ============================================

// Client utilities
export { 
  default as Stack, 
  CONTENT_TYPES,
  ContentstackLivePreview,
  getLivePreviewHash,
  isInLivePreviewMode,
  initLivePreview,
  debugLivePreview,
  onLivePreviewChange,
} from "./client";

// Live Preview hooks and components (client-side)
export {
  useLivePreviewUpdate,
  useLivePreview,
  LivePreviewIndicator,
  LivePreviewWrapper,
  getEditableProps,
  cslp,
} from "./live-preview";

// Types (safe everywhere)
export type {
  ContentstackAsset,
  ContentstackEntry,
  AuthorEntry,
  CategoryEntry,
  RecipeEntry,
  HeaderEntry,
  FooterEntry,
  HomePageEntry,
  Ingredient,
  NavLink,
  CTAButton,
  FooterLinkSection,
  SocialLink,
  StatItem,
  FeatureItem,
  Recipe,
  Profile,
  Category,
  Header,
  Footer,
  HomePage,
} from "./types";

// ============================================
// Server-only exports
// Import these directly from "./services" in server components
// ============================================
// 
// Services (server-only - use direct import from "./services"):
// - getAllRecipes, getPublishedRecipes, getRecipeByUid, etc.
// - getAllAuthors, getAuthorByUid, getAuthorByUsername, etc.
// - getAllCategories, getCategoryByUid, getCategoryByName
// - getHeader, getFooter, getHomePage
// - getHomePageData, getRecipePageData, getLayoutData
// 
// Example: import { getHomePage } from "@/lib/contentstack/services";
// ============================================
