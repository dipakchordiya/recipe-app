/**
 * Script to fix category references - publish all categories and republish recipes
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";

async function getAllCategories() {
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/category/entries?limit=100`,
    {
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
      },
    }
  );
  const data = await response.json();
  return data.entries || [];
}

async function getAllRecipes() {
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/recipe/entries?limit=100`,
    {
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
      },
    }
  );
  const data = await response.json();
  return data.entries || [];
}

async function publishCategory(uid: string) {
  await fetch(
    `https://api.contentstack.io/v3/content_types/category/entries/${uid}/publish`,
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
}

async function publishRecipe(uid: string) {
  await fetch(
    `https://api.contentstack.io/v3/content_types/recipe/entries/${uid}/publish`,
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
}

async function main() {
  console.log("=============================================");
  console.log("  Fixing Category References");
  console.log("=============================================\n");
  
  // Step 1: Get and publish all categories
  console.log("Step 1: Publishing all categories...\n");
  const categories = await getAllCategories();
  
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    categoryMap[cat.uid] = cat.name;
    console.log(`  Publishing: ${cat.name} (${cat.uid})...`);
    await publishCategory(cat.uid);
    console.log(`    ✓ Published`);
  }
  
  console.log(`\n  Total categories: ${categories.length}\n`);
  
  // Step 2: Republish all recipes to refresh references
  console.log("Step 2: Republishing all recipes...\n");
  const recipes = await getAllRecipes();
  
  let count = 0;
  for (const recipe of recipes) {
    const categoryUid = recipe.category?.[0]?.uid;
    const categoryName = categoryUid ? categoryMap[categoryUid] : "None";
    
    console.log(`  ${recipe.title} → ${categoryName}...`);
    await publishRecipe(recipe.uid);
    console.log(`    ✓ Published`);
    count++;
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log("\n=============================================");
  console.log(`  Done! Published ${categories.length} categories and ${count} recipes.`);
  console.log("=============================================");
}

main().catch(console.error);
