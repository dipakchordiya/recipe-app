/**
 * Create Home Page Variants for Location-Based Personalization
 * 
 * This script creates:
 * 1. Home Page - India (for Indian users)
 * 2. Home Page - USA (for American users)
 * 
 * Run with: npx ts-node scripts/create-home-page-variants.ts
 */

import contentstack from "@contentstack/management";

// Configuration
const API_KEY = process.env.CONTENTSTACK_API_KEY || "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "cs4b3b60b8ac28532fc37fbe37";
const ENVIRONMENT = "development";

// Initialize the client
const client = contentstack.client();
const stack = client.stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN });

// Home Page - India variant
const homePageIndia = {
  title: "Home Page - India",
  url: "/home-india",
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

// Home Page - USA variant
const homePageUSA = {
  title: "Home Page - USA",
  url: "/home-usa",
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

async function createEntry(entryData: typeof homePageIndia, name: string) {
  try {
    console.log(`\n📝 Creating ${name}...`);
    
    const entry = await stack
      .contentType("home_page")
      .entry()
      .create({ entry: entryData as any });
    
    console.log(`   ✓ Created: ${name} (UID: ${entry.uid})`);
    
    // Publish the entry
    console.log(`   📤 Publishing to ${ENVIRONMENT}...`);
    await entry.publish({
      publishDetails: {
        environments: [ENVIRONMENT],
        locales: ["en-us"],
      },
    });
    console.log(`   ✓ Published!`);
    
    return entry;
  } catch (error: any) {
    console.error(`   ✗ Error creating ${name}:`);
    console.error(`     Code: ${error.errorCode}`);
    console.error(`     Message: ${error.message}`);
    console.error(`     Details: ${JSON.stringify(error.errors || {})}`);
    return null;
  }
}

async function main() {
  console.log("🚀 Creating Home Page Variants for Personalization\n");
  console.log("=".repeat(50));
  console.log(`API Key: ${API_KEY}`);
  console.log(`Environment: ${ENVIRONMENT}`);
  console.log("=".repeat(50));

  // Create India variant
  await createEntry(homePageIndia, "Home Page - India");
  
  // Create USA variant
  await createEntry(homePageUSA, "Home Page - USA");

  console.log("\n" + "=".repeat(50));
  console.log("✅ Home Page variants created successfully!");
  console.log("\n📋 Next Steps:");
  console.log("1. Go to Contentstack Personalize dashboard");
  console.log("2. Open 'location_segment' experience");
  console.log("3. Map 'ind' variant to 'Home Page - India' entry");
  console.log("4. Map 'usa' variant to 'Home Page - USA' entry");
  console.log("=".repeat(50));
}

main().catch(console.error);
