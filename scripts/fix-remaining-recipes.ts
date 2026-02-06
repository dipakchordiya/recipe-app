/**
 * Script to fix remaining recipe categories
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";

// Manual mappings for remaining recipes
const manualMappings: Record<string, string> = {
  "Spaghetti Carbonara": "Italian",
  "Margherita Pizza": "Italian",
  "Classic Spaghetti Carbonara": "Italian",
  "Chicken Tacos Al Pastor": "Mexican",
  "Guacamole": "Mexican",
  "Tiramisu": "Desserts",
  "Apple Pie": "Desserts",
  "Chocolate Lava Cake": "Desserts",
  "Mac and Cheese": "American Cuisine",
  "BBQ Pulled Pork": "American Cuisine",
  "Chicken Biryani": "Indian Cuisine",
  "Fresh Garden Salad": "Salads",
};

async function getAllCategories() {
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/category/entries`,
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
    `https://api.contentstack.io/v3/content_types/recipe/entries?include[]=category`,
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

async function createCategory(name: string, emoji: string) {
  console.log(`  Creating category: ${name}...`);
  
  try {
    const response = await fetch(
      `https://api.contentstack.io/v3/content_types/category/entries`,
      {
        method: "POST",
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry: {
            title: name,
            name: name,
            url: `/categories/${name.toLowerCase().replace(/\s+/g, '-')}`,
            description: `Delicious ${name.toLowerCase()} recipes`,
            emoji: emoji,
          },
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`    ✗ Failed: ${error}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`    ✓ Created: ${data.entry.uid}`);
    
    // Publish
    await fetch(
      `https://api.contentstack.io/v3/content_types/category/entries/${data.entry.uid}/publish`,
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
    
    return data.entry.uid;
  } catch (error) {
    console.log(`    ✗ Error: ${error}`);
    return null;
  }
}

async function updateRecipeCategory(recipeUid: string, categoryUid: string) {
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/recipe/entries/${recipeUid}`,
    {
      method: "PUT",
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry: {
          category: [{ uid: categoryUid, _content_type_uid: "category" }],
        },
      }),
    }
  );
  return response.ok;
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
  console.log("  Fixing Remaining Recipe Categories");
  console.log("=============================================\n");
  
  // Get all categories
  const categories = await getAllCategories();
  const categoryMap: Record<string, string> = {};
  
  categories.forEach((cat: { name?: string; title?: string; uid: string }) => {
    const catName = cat.name || cat.title;
    if (catName) {
      categoryMap[catName] = cat.uid;
    }
  });
  
  // Create missing categories
  const requiredCategories: Record<string, string> = {
    "Italian": "🇮🇹",
    "Mexican": "🇲🇽",
    "Desserts": "🍰",
  };
  
  console.log("Checking required categories...");
  for (const [catName, emoji] of Object.entries(requiredCategories)) {
    if (!categoryMap[catName]) {
      const uid = await createCategory(catName, emoji);
      if (uid) categoryMap[catName] = uid;
    } else {
      console.log(`  ✓ ${catName} exists`);
    }
  }
  
  console.log("\nCategories:");
  Object.entries(categoryMap).forEach(([name, uid]) => {
    console.log(`  - ${name}: ${uid}`);
  });
  
  // Get all recipes
  const recipes = await getAllRecipes();
  console.log(`\nFound ${recipes.length} recipes\n`);
  
  // Fix remaining recipes
  let updated = 0;
  
  for (const recipe of recipes) {
    const currentCategoryUid = recipe.category?.[0]?.uid;
    
    // Skip if already has a valid category
    if (currentCategoryUid) continue;
    
    // Look up manual mapping
    const expectedCategory = manualMappings[recipe.title];
    if (!expectedCategory) {
      console.log(`⚠️  ${recipe.title}: No mapping found`);
      continue;
    }
    
    const categoryUid = categoryMap[expectedCategory];
    if (!categoryUid) {
      console.log(`⚠️  ${recipe.title}: Category "${expectedCategory}" not found`);
      continue;
    }
    
    console.log(`Updating ${recipe.title} → ${expectedCategory}...`);
    const success = await updateRecipeCategory(recipe.uid, categoryUid);
    
    if (success) {
      await publishRecipe(recipe.uid);
      console.log(`  ✓ Updated and published`);
      updated++;
    } else {
      console.log(`  ✗ Failed to update`);
    }
  }
  
  console.log("\n=============================================");
  console.log(`  Done! Updated: ${updated} recipes`);
  console.log("=============================================");
}

main().catch(console.error);
