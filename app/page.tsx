import { headers } from "next/headers";
import {
  getPublishedRecipes, 
  getAllCategories, 
  getHomePage,
  getPersonalizedHomePageData,
  getAllHomePageVariants,
} from "@/lib/contentstack/services";
import { HomeContent } from "./home-content";

// Server action to fetch home page data
async function fetchHomePage() {
  "use server";
  return await getHomePage();
}

// Server action to fetch personalized data
async function fetchPersonalizedData(region: "ind" | "usa" | "default") {
  "use server";
  return await getPersonalizedHomePageData(region);
}

// Detect region from request headers (Cloudflare, Vercel, etc.)
async function detectRegion(): Promise<"ind" | "usa" | "default"> {
  try {
    const headersList = await headers();
    
    // Try various geo headers
    const country = 
      headersList.get("cf-ipcountry") || // Cloudflare
      headersList.get("x-vercel-ip-country") || // Vercel
      headersList.get("x-country-code") || // Custom
      headersList.get("x-geo-country") || // Generic
      "";
    
    const countryCode = country.toUpperCase();
    
    if (countryCode === "IN") return "ind";
    if (countryCode === "US") return "usa";
    
    return "default";
  } catch {
    return "default";
  }
}

export default async function HomePage() {
  // Detect user's region from headers
  const region = await detectRegion();
  
  // Fetch personalized data based on region
  const { homePage, recipes, categories } = await getPersonalizedHomePageData(region);
  
  // Also fetch all variants for client-side switching (optional)
  const allVariants = await getAllHomePageVariants();

  return (
    <HomeContent
      initialHomePage={homePage}
      initialRecipes={recipes}
      initialCategories={categories}
      fetchHomePage={fetchHomePage}
      detectedRegion={region}
      homePageVariants={allVariants}
    />
  );
}
