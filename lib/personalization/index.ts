export {
  useUserCuisinePreference,
  getStoredPreference,
  setStoredPreference,
  detectCuisineFromTags,
  detectCuisineFromCategory,
  type CuisinePreference,
} from "./user-preferences";

// Helper function to track clicks externally (non-hook version)
export function trackClick(cuisine: "indian" | "american", source: string): void {
  if (typeof window === "undefined") return;
  
  // Import dynamically to avoid circular deps
  import("./user-preferences").then(({ setStoredPreference }) => {
    setStoredPreference(cuisine);
    console.log(`📊 Cuisine preference set to ${cuisine} from ${source}`);
  });
}
