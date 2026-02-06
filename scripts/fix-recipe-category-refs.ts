/**
 * Script to fix category references in all recipes
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";

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

// Map recipe titles to categories
const recipeToCategoryMap: Record<string, string> = {
  // Indian recipes
  "Butter Chicken": "Indian Cuisine",
  "Palak Paneer": "Indian Cuisine",
  "Masala Dosa": "Indian Cuisine",
  "Paneer Tikka Masala": "Indian Cuisine",
  "Pav Bhaji": "Indian Cuisine",
  "Chole Bhature": "Indian Cuisine",
  "Dal Makhani": "Indian Cuisine",
  "Hyderabadi Chicken Biryani": "Indian Cuisine",
  
  // American recipes
  "Classic American Cheeseburger": "American Cuisine",
  "Southern BBQ Ribs": "American Cuisine",
  "Creamy Mac and Cheese": "American Cuisine",
  "Classic American Apple Pie": "American Cuisine",
  "Southern Fried Chicken": "American Cuisine",
  "New York Cheesecake": "American Cuisine",
  "Philly Cheesesteak": "American Cuisine",
  
  // Italian
  "Spaghetti Carbonara": "Italian",
  "Margherita Pizza": "Italian",
  
  // Mexican
  "Chicken Tacos Al Pastor": "Mexican",
  "Guacamole": "Mexican",
  
  // Desserts
  "Tiramisu": "Desserts",
  
  // Salads
  "Caesar Salad": "Salads",
  "Greek Salad": "Salads",
  
  // Soups
  "Tomato Basil Soup": "Soups",
  "Chicken Noodle Soup": "Soups",
  "Minestrone Soup": "Soups",
  
  // Breakfast
  "Fluffy Pancakes": "Breakfast",
  "Avocado Toast": "Breakfast",
  
  // Seafood
  "Garlic Butter Shrimp": "Seafood",
  "Grilled Salmon": "Seafood",
  
  // Appetizers
  "Bruschetta": "Appetizers",
  "Spinach Artichoke Dip": "Appetizers",
};

async function main() {
  console.log("=============================================");
  console.log("  Fixing Recipe Category References");
  console.log("=============================================\n");
  
  // Get all categories
  const categories = await getAllCategories();
  const categoryMap: Record<string, string> = {};
  categories.forEach((cat: { title: string; uid: string }) => {
    categoryMap[cat.title] = cat.uid;
  });
  
  console.log("Categories found:");
  categories.forEach((cat: { name: string; title?: string; uid: string }) => {
    const catName = cat.name || cat.title;
    if (catName) {
      categoryMap[catName] = cat.uid;
      console.log(`  - ${catName}: ${cat.uid}`);
    }
  });
  console.log("");
  
  // Get all recipes
  const recipes = await getAllRecipes();
  console.log(`Found ${recipes.length} recipes\n`);
  
  // Update each recipe's category
  let updated = 0;
  let skipped = 0;
  
  for (const recipe of recipes) {
    let expectedCategory = recipeToCategoryMap[recipe.title];
    
    // Try alternate names if not found
    if (!expectedCategory) {
      // Check partial matches
      for (const [recipeName, catName] of Object.entries(recipeToCategoryMap)) {
        if (recipe.title.toLowerCase().includes(recipeName.toLowerCase().split(' ')[0]) &&
            recipe.title.toLowerCase().includes(recipeName.toLowerCase().split(' ').slice(-1)[0])) {
          expectedCategory = catName;
          break;
        }
      }
    }
    
    // Infer from tags if still not found
    if (!expectedCategory && recipe.tags) {
      if (recipe.tags.some((t: string) => t.toLowerCase().includes('indian'))) {
        expectedCategory = "Indian Cuisine";
      } else if (recipe.tags.some((t: string) => t.toLowerCase().includes('american'))) {
        expectedCategory = "American Cuisine";
      } else if (recipe.tags.some((t: string) => t.toLowerCase().includes('italian'))) {
        expectedCategory = "Italian";
      } else if (recipe.tags.some((t: string) => t.toLowerCase().includes('mexican'))) {
        expectedCategory = "Mexican";
      } else if (recipe.tags.some((t: string) => t.toLowerCase().includes('dessert') || t.toLowerCase().includes('sweet'))) {
        expectedCategory = "Desserts";
      } else if (recipe.tags.some((t: string) => t.toLowerCase().includes('salad'))) {
        expectedCategory = "Salads";
      } else if (recipe.tags.some((t: string) => t.toLowerCase().includes('soup'))) {
        expectedCategory = "Soups";
      } else if (recipe.tags.some((t: string) => t.toLowerCase().includes('breakfast'))) {
        expectedCategory = "Breakfast";
      } else if (recipe.tags.some((t: string) => t.toLowerCase().includes('seafood') || t.toLowerCase().includes('fish') || t.toLowerCase().includes('shrimp'))) {
        expectedCategory = "Seafood";
      } else if (recipe.tags.some((t: string) => t.toLowerCase().includes('appetizer'))) {
        expectedCategory = "Appetizers";
      }
    }
    
    const currentCategoryUid = recipe.category?.[0]?.uid;
    const expectedCategoryUid = expectedCategory ? categoryMap[expectedCategory] : null;
    
    // Check if category needs updating
    if (!expectedCategoryUid) {
      console.log(`⚠️  ${recipe.title}: No expected category found, skipping`);
      skipped++;
      continue;
    }
    
    if (currentCategoryUid === expectedCategoryUid) {
      console.log(`✓ ${recipe.title}: Already has correct category (${expectedCategory})`);
      skipped++;
      continue;
    }
    
    console.log(`Updating ${recipe.title}: ${expectedCategory}...`);
    const success = await updateRecipeCategory(recipe.uid, expectedCategoryUid);
    
    if (success) {
      await publishRecipe(recipe.uid);
      console.log(`  ✓ Updated and published`);
      updated++;
    } else {
      console.log(`  ✗ Failed to update`);
    }
  }
  
  console.log("\n=============================================");
  console.log(`  Done! Updated: ${updated}, Skipped: ${skipped}`);
  console.log("=============================================");
}

main().catch(console.error);
