/**
 * Debug script to check category data in recipes
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "";
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || "";

async function main() {
  console.log("=============================================");
  console.log("  Debugging Category Data");
  console.log("=============================================\n");
  
  // Fetch recipes with category reference
  const recipesResponse = await fetch(
    `https://cdn.contentstack.io/v3/content_types/recipe/entries?environment=development&include[]=category&limit=10`,
    {
      headers: {
        "api_key": API_KEY,
        "access_token": DELIVERY_TOKEN,
      },
    }
  );
  
  const recipesData = await recipesResponse.json();
  
  console.log("Sample Recipes with Category Data:\n");
  
  for (const recipe of recipesData.entries || []) {
    console.log(`📝 ${recipe.title}:`);
    console.log(`   Category field:`, JSON.stringify(recipe.category, null, 2));
    console.log(`   Category name:`, recipe.category?.[0]?.name || "NOT FOUND");
    console.log("");
  }
  
  // Fetch categories
  console.log("\n--- All Categories ---\n");
  const categoriesResponse = await fetch(
    `https://cdn.contentstack.io/v3/content_types/category/entries?environment=development`,
    {
      headers: {
        "api_key": API_KEY,
        "access_token": DELIVERY_TOKEN,
      },
    }
  );
  
  const categoriesData = await categoriesResponse.json();
  
  for (const cat of categoriesData.entries || []) {
    console.log(`🏷️  ${cat.title || cat.name}:`);
    console.log(`   uid: ${cat.uid}`);
    console.log(`   name field: "${cat.name}"`);
    console.log(`   title field: "${cat.title}"`);
    console.log("");
  }
}

main().catch(console.error);
