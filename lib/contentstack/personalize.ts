// Contentstack Personalize SDK integration
// For location-based content personalization with Lytics CDP

import Personalize from "@contentstack/personalize-edge-sdk";

// Environment variables for Personalize
const PERSONALIZE_PROJECT_UID = process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID || "";

// Initialize Personalize SDK
let personalizeInstance: typeof Personalize | null = null;
let isInitialized = false;

export async function initPersonalize(): Promise<typeof Personalize | null> {
  if (typeof window === "undefined") return null;
  
  if (isInitialized && personalizeInstance) {
    return personalizeInstance;
  }

  if (!PERSONALIZE_PROJECT_UID) {
    console.warn("Personalize project UID not configured");
    return null;
  }

  try {
    // The SDK expects just the project UID as a string
    await Personalize.init(PERSONALIZE_PROJECT_UID);
    
    personalizeInstance = Personalize;
    isInitialized = true;
    console.log("✓ Contentstack Personalize initialized");
    return Personalize;
  } catch (error) {
    console.error("Failed to initialize Personalize:", error);
    return null;
  }
}

// Set user attributes from Lytics
export async function setUserAttributes(attributes: Record<string, unknown>) {
  const personalize = await initPersonalize();
  if (!personalize) return;
  
  try {
    await personalize.set(attributes);
    console.log("✓ User attributes set:", attributes);
  } catch (error) {
    console.error("Failed to set user attributes:", error);
  }
}

// Set location-based attributes
export async function setLocationAttributes(location: {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
}) {
  return setUserAttributes({
    country: location.country,
    country_code: location.countryCode,
    region: location.region,
    city: location.city,
    // Lytics standard attributes
    user_country: location.country,
    geo_country: location.countryCode,
  });
}

// Get variant for an experience
export async function getExperienceVariant(experienceShortId: string): Promise<string | null> {
  const personalize = await initPersonalize();
  if (!personalize) return null;
  
  try {
    const variants = await personalize.getVariants();
    const variant = variants[experienceShortId] || null;
    console.log(`✓ Variant for ${experienceShortId}:`, variant);
    return variant;
  } catch (error) {
    console.error("Failed to get variant:", error);
    return null;
  }
}

// Get all active variants
export async function getAllVariants(): Promise<Record<string, string>> {
  const personalize = await initPersonalize();
  if (!personalize) return {};
  
  try {
    const variants = await personalize.getVariants();
    console.log("✓ All variants:", variants);
    return variants;
  } catch (error) {
    console.error("Failed to get variants:", error);
    return {};
  }
}

// Experience Short IDs (configure in Contentstack Personalize dashboard)
export const EXPERIENCES = {
  HOME_PAGE_HERO: "home_hero_location",
  HOME_PAGE_RECIPES: "home_recipes_location",
  FEATURED_RECIPES: "featured_recipes_location",
} as const;

// Variant names
export const VARIANTS = {
  DEFAULT: "default",
  INDIA: "india",
  USA: "usa",
  EUROPE: "europe",
} as const;

// Helper to detect user location (using IP-based geolocation)
export async function detectUserLocation(): Promise<{
  country: string;
  countryCode: string;
  region: string;
  city: string;
} | null> {
  try {
    // Use a free geolocation API
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    
    return {
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "XX",
      region: data.region || "Unknown",
      city: data.city || "Unknown",
    };
  } catch (error) {
    console.error("Failed to detect location:", error);
    return null;
  }
}

// Main initialization function for the app
export async function initPersonalizationWithLocation() {
  const location = await detectUserLocation();
  
  if (location) {
    await setLocationAttributes(location);
    console.log(`✓ User location detected: ${location.city}, ${location.country}`);
  }
  
  return location;
}
