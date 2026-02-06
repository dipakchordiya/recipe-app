/**
 * Fix ingredient field names and publish recipes
 * Run with: npx ts-node scripts/fix-and-publish-recipes.ts
 */

const API_KEY = "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = "cs4b3b60b8ac28532fc37fbe37";
const ENVIRONMENT = "development";

// Recipes that need fixing (with their asset UIDs)
const RECIPES_TO_FIX = [
  { uid: "blta484803afec7d7af", title: "Butter Chicken", assetUid: "bltad42837b5cc2f66d" },
  { uid: "bltf5f7010da2afa088", title: "Chicken Biryani", assetUid: "bltec2ac6ace4678305" },
  { uid: "bltb6fcc54f4e86b05b", title: "Palak Paneer", assetUid: "blta88addb6c9e864f1" },
  { uid: "blt5746f9ab04a31f0c", title: "Masala Dosa", assetUid: "blt0ac06a0fed6ac44b" },
  { uid: "blt84fe6fbd5e3b61d3", title: "Classic Cheeseburger", assetUid: "blt033631e05868ae73" },
  { uid: "blt93f56f3df4816874", title: "BBQ Pulled Pork", assetUid: "blt6a70779f3f915f01" },
  { uid: "blta92832504a6d8599", title: "Mac and Cheese", assetUid: "blt3acec1f474a2bf10" },
  { uid: "blt5ee572ca00d6b8d2", title: "Apple Pie", assetUid: "blt1185cd72ae6af729" },
];

interface Ingredient {
  name: string;
  quantity?: string;
  amount?: string;
  unit?: string;
}

async function fetchEntry(entryUid: string) {
  const url = `https://api.contentstack.io/v3/content_types/recipe/entries/${entryUid}`;
  
  const response = await fetch(url, {
    headers: {
      "api_key": API_KEY,
      "authorization": MANAGEMENT_TOKEN,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch entry ${entryUid}`);
  }
  
  const data = await response.json() as any;
  return data.entry;
}

async function updateAndPublishEntry(entryUid: string, title: string, assetUid: string) {
  console.log(`\n📝 Processing: ${title}...`);
  
  try {
    // Fetch the current entry
    const entry = await fetchEntry(entryUid);
    
    // Fix ingredients - change quantity to amount
    let ingredients = entry.ingredients || [];
    ingredients = ingredients.map((ing: Ingredient) => ({
      name: ing.name,
      amount: ing.amount || ing.quantity || "1",  // Use amount, fallback to quantity
      unit: ing.unit || "",
    }));
    
    // Update the entry with fixed ingredients and image
    const updateUrl = `https://api.contentstack.io/v3/content_types/recipe/entries/${entryUid}`;
    
    const updateData = {
      entry: {
        ingredients,
        featured_image: assetUid,
      },
    };
    
    console.log(`  Updating ingredients...`);
    
    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json() as any;
      console.error(`  ✗ Update failed:`, errorData.error_message || JSON.stringify(errorData.errors));
      return false;
    }
    
    console.log(`  ✓ Updated`);
    
    // Wait a moment before publishing
    await new Promise((r) => setTimeout(r, 1000));
    
    // Publish the entry
    const publishUrl = `https://api.contentstack.io/v3/content_types/recipe/entries/${entryUid}/publish`;
    
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
      const errorData = await publishResponse.json() as any;
      console.error(`  ✗ Publish failed:`, errorData.error_message || JSON.stringify(errorData.errors));
      return false;
    }
    
    console.log(`  ✓ Published`);
    return true;
  } catch (error: any) {
    console.error(`  ✗ Error:`, error.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Fixing and Publishing Recipes\n");
  console.log("=".repeat(50));
  
  for (const recipe of RECIPES_TO_FIX) {
    await updateAndPublishEntry(recipe.uid, recipe.title, recipe.assetUid);
    await new Promise((r) => setTimeout(r, 1000));
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("✅ Done!");
}

main().catch(console.error);
