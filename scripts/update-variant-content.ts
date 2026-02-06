/**
 * Script to update Home Page variant content for India and USA
 * Run with: npx ts-node scripts/update-variant-content.ts
 */

import * as dotenv from "dotenv";
// Load from both env files
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";
const HOME_PAGE_ENTRY_UID = "bltd30052da58732341";

// Variant UIDs from Contentstack Personalize
const VARIANT_UIDS = {
  ind: "cs32b45e98dce08645",
  usa: "csc983d9bc8d2be49f",
};

// Content for each variant
const variantContent = {
  ind: {
    hero_badge_text: "🇮🇳 Namaste, Food Lover!",
    hero_headline: "Discover Authentic Indian",
    hero_highlight_text: "Recipes",
    hero_description: "Explore the rich flavors of India with our curated collection of traditional and modern Indian recipes. From aromatic biryanis to creamy curries.",
    seo_meta_title: "RecipeHub India - Authentic Indian Recipes",
    seo_meta_description: "Discover authentic Indian recipes - from traditional curries to modern fusion dishes. Join our community of Indian food enthusiasts.",
    categories_section_title: "Popular Indian Categories",
    categories_section_subtitle: "Explore dishes from different regions of India",
    recipes_section_title: "Trending Indian Recipes",
    recipes_section_subtitle: "Most loved recipes from our Indian community",
    cta_headline: "Start Your Indian Culinary Journey",
    cta_description: "Join thousands of home cooks exploring Indian cuisine",
  },
  usa: {
    hero_badge_text: "🇺🇸 Hey There, Chef!",
    hero_headline: "Classic American",
    hero_highlight_text: "Comfort Food",
    hero_description: "From BBQ to burgers, discover the best of American cuisine. Hearty, delicious recipes that bring families together.",
    seo_meta_title: "RecipeHub USA - American Comfort Food Recipes",
    seo_meta_description: "Discover classic American recipes - from BBQ to apple pie. Join our community of American food enthusiasts.",
    categories_section_title: "American Favorites",
    categories_section_subtitle: "Classic dishes loved across America",
    recipes_section_title: "Popular American Recipes",
    recipes_section_subtitle: "Top-rated recipes from our American community",
    cta_headline: "Cook Like a True American",
    cta_description: "Join thousands of home cooks mastering American classics",
  },
};

async function updateVariant(region: "ind" | "usa") {
  const variantUid = VARIANT_UIDS[region];
  const content = variantContent[region];

  console.log(`\n📝 Updating ${region.toUpperCase()} variant (${variantUid})...`);

  try {
    // First, get the current entry to get the version
    const getResponse = await fetch(
      `https://api.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_ENTRY_UID}`,
      {
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    if (!getResponse.ok) {
      const error = await getResponse.text();
      console.error(`Failed to get entry: ${error}`);
      return false;
    }

    const entryData = await getResponse.json();
    const currentVersion = entryData.entry._version;
    console.log(`   Current version: ${currentVersion}`);

    // Update the variant
    const updateResponse = await fetch(
      `https://api.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_ENTRY_UID}/variants/${variantUid}`,
      {
        method: "PUT",
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry: {
            ...content,
            _version: currentVersion,
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      console.error(`Failed to update variant: ${error}`);
      
      // Try alternative approach - PATCH
      console.log("   Trying PATCH method...");
      const patchResponse = await fetch(
        `https://api.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_ENTRY_UID}/variants/${variantUid}`,
        {
          method: "PATCH",
          headers: {
            "api_key": API_KEY,
            "authorization": MANAGEMENT_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entry: content,
          }),
        }
      );

      if (!patchResponse.ok) {
        const patchError = await patchResponse.text();
        console.error(`PATCH also failed: ${patchError}`);
        return false;
      }
    }

    console.log(`   ✓ Updated ${region.toUpperCase()} variant successfully!`);
    return true;
  } catch (error) {
    console.error(`Error updating ${region} variant:`, error);
    return false;
  }
}

async function publishVariant(region: "ind" | "usa") {
  const variantUid = VARIANT_UIDS[region];
  
  console.log(`\n📤 Publishing ${region.toUpperCase()} variant...`);

  try {
    const response = await fetch(
      `https://api.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_ENTRY_UID}/variants/${variantUid}/publish`,
      {
        method: "POST",
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry: {
            environments: ["development"],
            locales: ["en-us"],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`Failed to publish: ${error}`);
      return false;
    }

    console.log(`   ✓ Published ${region.toUpperCase()} variant!`);
    return true;
  } catch (error) {
    console.error(`Error publishing ${region} variant:`, error);
    return false;
  }
}

async function main() {
  console.log("===========================================");
  console.log("  Updating Home Page Variants for Personalize");
  console.log("===========================================");
  
  if (!API_KEY || !MANAGEMENT_TOKEN) {
    console.error("\n❌ Missing environment variables!");
    console.log("Required:");
    console.log("  - NEXT_PUBLIC_CONTENTSTACK_API_KEY");
    console.log("  - CONTENTSTACK_MANAGEMENT_TOKEN");
    return;
  }

  console.log("\n📋 Configuration:");
  console.log(`   API Key: ${API_KEY.slice(0, 10)}...`);
  console.log(`   Entry UID: ${HOME_PAGE_ENTRY_UID}`);
  console.log(`   India Variant: ${VARIANT_UIDS.ind}`);
  console.log(`   USA Variant: ${VARIANT_UIDS.usa}`);

  // Update variants
  const indUpdated = await updateVariant("ind");
  const usaUpdated = await updateVariant("usa");

  if (indUpdated && usaUpdated) {
    console.log("\n✓ Both variants updated!");
    
    // Publish variants
    console.log("\n📤 Publishing variants to development environment...");
    await publishVariant("ind");
    await publishVariant("usa");
  } else {
    console.log("\n⚠️ Some variants failed to update. Please update manually in Contentstack.");
    console.log("\nManual steps:");
    console.log("1. Go to Contentstack > Home Page entry");
    console.log("2. Open Personalize panel > Select 'ind' variant");
    console.log("3. Update hero_badge_text to: 🇮🇳 Namaste, Food Lover!");
    console.log("4. Update hero_headline to: Discover Authentic Indian");
    console.log("5. Repeat for 'usa' variant with American content");
    console.log("6. Publish both variants");
  }

  console.log("\n===========================================");
  console.log("  Done!");
  console.log("===========================================");
}

main().catch(console.error);
