/**
 * Publish recipes that have images but are not published
 * Run with: npx ts-node scripts/publish-recipe-images.ts
 */

const API_KEY = "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = "cs4b3b60b8ac28532fc37fbe37";
const ENVIRONMENT = "development";

// Asset UIDs for recipe images
const RECIPE_ASSETS: Record<string, string> = {
  "blta484803afec7d7af": "bltad42837b5cc2f66d",  // Butter Chicken
  "bltf5f7010da2afa088": "bltec2ac6ace4678305",  // Chicken Biryani
  "bltb6fcc54f4e86b05b": "blta88addb6c9e864f1",  // Palak Paneer
  "blt5746f9ab04a31f0c": "blt0ac06a0fed6ac44b",  // Masala Dosa
  "blt84fe6fbd5e3b61d3": "blt033631e05868ae73",  // Classic Cheeseburger
  "blt93f56f3df4816874": "blt6a70779f3f915f01",  // BBQ Pulled Pork
  "blta92832504a6d8599": "blt3acec1f474a2bf10",  // Mac and Cheese
  "blt5ee572ca00d6b8d2": "blt1185cd72ae6af729",  // Apple Pie
};

async function publishAsset(assetUid: string) {
  const url = `https://api.contentstack.io/v3/assets/${assetUid}/publish`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset: {
          environments: [ENVIRONMENT],
          locales: ["en-us"],
        },
      }),
    });
    
    if (response.ok) {
      console.log(`  ✓ Published asset: ${assetUid}`);
      return true;
    } else {
      const data = await response.json();
      console.log(`  ⚠ Asset ${assetUid}: ${data.error_message || "Already published"}`);
      return true; // Might already be published
    }
  } catch (error: any) {
    console.error(`  ✗ Failed to publish asset ${assetUid}:`, error.message);
    return false;
  }
}

async function updateAndPublishRecipe(recipeUid: string, assetUid: string) {
  console.log(`📝 Updating recipe ${recipeUid}...`);
  
  // First, update the entry with the image
  const updateUrl = `https://api.contentstack.io/v3/content_types/recipe/entries/${recipeUid}`;
  
  try {
    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry: {
          featured_image: assetUid,
        },
      }),
    });
    
    if (!updateResponse.ok) {
      const data = await updateResponse.json();
      console.error(`  ✗ Update failed:`, data.error_message || data);
      return false;
    }
    
    console.log(`  ✓ Updated entry with image`);
    
    // Wait for assets to be ready
    await new Promise((r) => setTimeout(r, 2000));
    
    // Then publish the entry
    const publishUrl = `https://api.contentstack.io/v3/content_types/recipe/entries/${recipeUid}/publish`;
    
    const publishResponse = await fetch(publishUrl, {
      method: "POST",
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry: {
          environments: [ENVIRONMENT],
          locales: ["en-us"],
        },
      }),
    });
    
    if (!publishResponse.ok) {
      const data = await publishResponse.json();
      console.error(`  ✗ Publish failed:`, data.error_message || data);
      return false;
    }
    
    console.log(`  ✓ Published entry`);
    return true;
  } catch (error: any) {
    console.error(`  ✗ Error:`, error.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Publishing Recipe Images\n");
  console.log("=".repeat(50));
  
  // First, publish all assets
  console.log("\n📤 Publishing assets...\n");
  const assetUids = Object.values(RECIPE_ASSETS);
  for (const assetUid of assetUids) {
    await publishAsset(assetUid);
    await new Promise((r) => setTimeout(r, 500));
  }
  
  // Wait for assets to be fully published
  console.log("\n⏳ Waiting for assets to be ready...\n");
  await new Promise((r) => setTimeout(r, 5000));
  
  // Then update and publish each recipe
  console.log("📝 Updating and publishing recipes...\n");
  for (const [recipeUid, assetUid] of Object.entries(RECIPE_ASSETS)) {
    await updateAndPublishRecipe(recipeUid, assetUid);
    await new Promise((r) => setTimeout(r, 1000));
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("✅ Done!");
}

main().catch(console.error);
