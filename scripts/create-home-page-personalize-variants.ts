/**
 * Create Personalize Variants for Home Page Entry
 * 
 * This script adds 'ind' and 'usa' variants to the main Home Page entry
 * using Contentstack's variant API for Personalize.
 * 
 * Run with: npx ts-node scripts/create-home-page-personalize-variants.ts
 */

import contentstack from "@contentstack/management";

const API_KEY = "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = "cs4b3b60b8ac28532fc37fbe37";
const ENVIRONMENT = "development";
const HOME_PAGE_UID = "bltd30052da58732341"; // Main Home Page entry UID
const PERSONALIZE_PROJECT_UID = "66aa1f8c2014e3e2e703b985";

const client = contentstack.client();
const stack = client.stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN });

// India variant data
const indiaVariantData = {
  page_title: "Discover Authentic Indian Recipes | Recipe Hub",
  seo_meta_title: "Best Indian Recipes - Traditional & Modern | Recipe Hub",
  seo_meta_description: "Explore delicious Indian recipes from butter chicken to biryani. Authentic flavors, easy instructions, and home cooking tips from India.",
  hero_badge_text: "🇮🇳 Namaste, Food Lover!",
  hero_headline: "Discover the Rich Flavors of",
  hero_highlight_text: "Indian Cuisine",
  hero_description: "From aromatic biryanis to creamy butter chicken, explore authentic recipes that bring the taste of India to your kitchen. Spices, love, and tradition in every dish.",
  hero_primary_btn_label: "Explore Indian Recipes",
  hero_primary_btn_url: "/categories/indian-cuisine",
  hero_secondary_btn_label: "Popular Dishes",
  hero_secondary_btn_url: "/recipes?category=indian",
  stats: [
    { value: "500+", label: "Indian Recipes", icon: "book-open" },
    { value: "50K+", label: "Happy Cooks", icon: "users" },
    { value: "100+", label: "Regional Cuisines", icon: "map-pin" },
  ],
  categories_section_title: "Explore Indian Cuisines",
  categories_section_subtitle: "From North to South, discover the diverse flavors of India",
  recipes_section_title: "Popular Indian Recipes",
  recipes_section_subtitle: "Most loved dishes from Indian kitchens",
  features_section_title: "Why Cook Indian?",
  features_section_subtitle: "The magic of Indian cooking",
  features: [
    { title: "Rich in Spices", description: "Authentic spice blends that create unforgettable flavors", icon: "sparkles" },
    { title: "Healthy & Nutritious", description: "Traditional recipes with natural ingredients and Ayurvedic benefits", icon: "heart" },
    { title: "Family Recipes", description: "Passed down through generations, made with love", icon: "users" },
  ],
  cta_headline: "Ready to Cook Indian Tonight?",
  cta_description: "Join thousands of home cooks creating authentic Indian dishes. Get started with our beginner-friendly recipes.",
  cta_primary_btn_label: "Start Cooking",
  cta_primary_btn_url: "/recipes?difficulty=easy&category=indian",
  cta_secondary_btn_label: "Watch Tutorials",
  cta_secondary_btn_url: "/tutorials",
};

// USA variant data
const usaVariantData = {
  page_title: "American Comfort Food Recipes | Recipe Hub",
  seo_meta_title: "Best American Recipes - Classic & Modern | Recipe Hub",
  seo_meta_description: "Discover classic American recipes from burgers to BBQ. Easy comfort food, family favorites, and modern twists on traditional dishes.",
  hero_badge_text: "🇺🇸 Hey there, Chef!",
  hero_headline: "Classic American",
  hero_highlight_text: "Comfort Food",
  hero_description: "From juicy burgers to smoky BBQ ribs, discover recipes that define American cuisine. Simple ingredients, bold flavors, and dishes the whole family will love.",
  hero_primary_btn_label: "Explore American Recipes",
  hero_primary_btn_url: "/categories/american-cuisine",
  hero_secondary_btn_label: "BBQ Favorites",
  hero_secondary_btn_url: "/recipes?category=american",
  stats: [
    { value: "400+", label: "American Classics", icon: "book-open" },
    { value: "75K+", label: "Home Cooks", icon: "users" },
    { value: "50+", label: "Regional Styles", icon: "map-pin" },
  ],
  categories_section_title: "American Favorites",
  categories_section_subtitle: "From coast to coast, the best of American cooking",
  recipes_section_title: "Trending American Recipes",
  recipes_section_subtitle: "What America is cooking right now",
  features_section_title: "Why American Classics?",
  features_section_subtitle: "The heart of comfort food",
  features: [
    { title: "Simple & Satisfying", description: "Easy recipes with ingredients you already have", icon: "sparkles" },
    { title: "Family Approved", description: "Kid-friendly dishes everyone will enjoy", icon: "heart" },
    { title: "Grill Masters", description: "BBQ tips and tricks for the perfect cookout", icon: "flame" },
  ],
  cta_headline: "Ready for Some Comfort Food?",
  cta_description: "Join millions of Americans cooking at home. Find your new favorite recipe today.",
  cta_primary_btn_label: "Get Cooking",
  cta_primary_btn_url: "/recipes?difficulty=easy&category=american",
  cta_secondary_btn_label: "Meal Planning",
  cta_secondary_btn_url: "/meal-plans",
};

async function createVariant(variantUid: string, variantData: any, name: string) {
  console.log(`\n📝 Creating variant: ${name} (${variantUid})...`);
  
  try {
    // Get the entry
    const entry = await stack
      .contentType("home_page")
      .entry(HOME_PAGE_UID)
      .fetch();
    
    // Create variant using the variants API
    const variantEntry = await (entry as any).variants().create({
      variant: {
        uid: variantUid,
        ...variantData,
      }
    });
    
    console.log(`   ✓ Created variant: ${variantUid}`);
    
    // Publish the variant
    await variantEntry.publish({
      publishDetails: {
        environments: [ENVIRONMENT],
        locales: ["en-us"],
      },
    });
    console.log(`   ✓ Published!`);
    
    return variantEntry;
  } catch (error: any) {
    // Try alternative approach using direct API
    console.log(`   Trying alternative approach...`);
    
    try {
      const response = await fetch(
        `https://api.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_UID}/variants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api_key": API_KEY,
            "authorization": MANAGEMENT_TOKEN,
          },
          body: JSON.stringify({
            variant: {
              _variant: {
                uid: variantUid,
                _change_set: Object.keys(variantData),
              },
              ...variantData,
            },
          }),
        }
      );
      
      const result = await response.json();
      
      if (response.ok) {
        console.log(`   ✓ Created variant via API: ${variantUid}`);
        
        // Publish the variant
        const publishResponse = await fetch(
          `https://api.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_UID}/variants/${variantUid}/publish`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api_key": API_KEY,
              "authorization": MANAGEMENT_TOKEN,
            },
            body: JSON.stringify({
              entry: {
                environments: [ENVIRONMENT],
                locales: ["en-us"],
              },
            }),
          }
        );
        
        if (publishResponse.ok) {
          console.log(`   ✓ Published!`);
        }
        
        return result;
      } else {
        console.error(`   ✗ API Error:`, result);
        return null;
      }
    } catch (apiError: any) {
      console.error(`   ✗ Failed:`, apiError.message || apiError);
      return null;
    }
  }
}

async function main() {
  console.log("🚀 Creating Personalize Variants for Home Page\n");
  console.log("=".repeat(50));
  console.log(`API Key: ${API_KEY}`);
  console.log(`Home Page UID: ${HOME_PAGE_UID}`);
  console.log(`Personalize Project: ${PERSONALIZE_PROJECT_UID}`);
  console.log(`Environment: ${ENVIRONMENT}`);
  console.log("=".repeat(50));

  // Create India variant (ind)
  await createVariant("ind", indiaVariantData, "India");
  
  // Create USA variant (usa)
  await createVariant("usa", usaVariantData, "USA");

  console.log("\n" + "=".repeat(50));
  console.log("✅ Variants creation complete!");
  console.log("\n📋 Summary:");
  console.log("- ind: Indian content with Namaste greeting, spices focus");
  console.log("- usa: American content with comfort food, BBQ focus");
  console.log("=".repeat(50));
}

main().catch(console.error);
