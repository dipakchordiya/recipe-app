/**
 * Script to delete non-veg recipes and update images for remaining recipes
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";

// Non-veg keywords to identify recipes to delete
const nonVegKeywords = [
  "chicken", "beef", "pork", "lamb", "mutton", "fish", "shrimp", "salmon",
  "bacon", "meat", "turkey", "duck", "seafood", "clam", "crab", "lobster",
  "prawn", "sausage", "ham", "steak", "ribs", "wings", "korma", "biryani",
  "tandoori", "tikka", "kebab", "meatloaf", "burger", "cheeseburger"
];

// Proper vegetarian images
const vegRecipeImages: Record<string, string> = {
  // Indian Veg
  "Samosa": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  "Aloo Gobi": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
  "Rajma Chawal": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
  "Mutter Paneer": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
  "Idli Sambhar": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
  "Bhindi Masala": "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
  "Gulab Jamun": "https://images.unsplash.com/photo-1666190094726-ce2d08e395af?w=800&q=80",
  "Vada Pav": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
  "Palak Paneer": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  "Masala Dosa": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
  "Paneer Tikka Masala": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
  "Pav Bhaji": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
  "Chole Bhature": "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&q=80",
  "Dal Makhani": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
  
  // American Veg
  "Cornbread": "https://images.unsplash.com/photo-1597733153203-a54d0fbc47de?w=800&q=80",
  "Key Lime Pie": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
  "Banana Bread": "https://images.unsplash.com/photo-1606101273945-e9eba87e98de?w=800&q=80",
  "Mac and Cheese": "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=800&q=80",
  "Creamy Mac and Cheese": "https://images.unsplash.com/photo-1612152605347-f93296cb657d?w=800&q=80",
  "Apple Pie": "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=800&q=80",
  "Classic American Apple Pie": "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800&q=80",
  "New York Cheesecake": "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&q=80",
  
  // Italian Veg
  "Spaghetti Carbonara": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
  "Classic Spaghetti Carbonara": "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=800&q=80",
  "Margherita Pizza": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
  "Tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  
  // Mexican Veg
  "Guacamole": "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=800&q=80",
  
  // Salads
  "Caesar Salad": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80",
  "Greek Salad": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
  "Fresh Garden Salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  "Cobb Salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  
  // Soups
  "Tomato Basil Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
  "Creamy Tomato Soup": "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800&q=80",
  "Minestrone Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
  
  // Breakfast
  "Fluffy Pancakes": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
  "Avocado Toast": "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&q=80",
  
  // Appetizers
  "Bruschetta": "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&q=80",
  "Spinach Artichoke Dip": "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=800&q=80",
  
  // Desserts
  "Chocolate Lava Cake": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
};

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

async function deleteRecipe(uid: string) {
  // First unpublish
  await fetch(
    `https://api.contentstack.io/v3/content_types/recipe/entries/${uid}/unpublish`,
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
  
  // Then delete
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/recipe/entries/${uid}`,
    {
      method: "DELETE",
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
      },
    }
  );
  return response.ok;
}

async function uploadImage(url: string, name: string): Promise<string | null> {
  try {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) return null;
    
    const buffer = await imageResponse.arrayBuffer();
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('asset[upload]', blob, `${name}.jpg`);
    formData.append('asset[title]', name);
    
    const uploadResponse = await fetch(
      `https://api.contentstack.io/v3/assets`,
      {
        method: 'POST',
        headers: { 'api_key': API_KEY, 'authorization': MANAGEMENT_TOKEN },
        body: formData,
      }
    );
    
    if (!uploadResponse.ok) return null;
    const data = await uploadResponse.json();
    
    // Publish asset
    await fetch(
      `https://api.contentstack.io/v3/assets/${data.asset.uid}/publish`,
      {
        method: "POST",
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset: { environments: ["development"], locales: ["en-us"] },
        }),
      }
    );
    
    return data.asset.uid;
  } catch {
    return null;
  }
}

async function updateRecipeImage(recipeUid: string, imageUid: string) {
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
        entry: { featured_image: imageUid },
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
        entry: { environments: ["development"], locales: ["en-us"] },
      }),
    }
  );
}

function isNonVeg(recipe: { title: string; tags?: string[]; description?: string }): boolean {
  const titleLower = recipe.title.toLowerCase();
  const descLower = (recipe.description || "").toLowerCase();
  const tags = recipe.tags || [];
  
  for (const keyword of nonVegKeywords) {
    if (titleLower.includes(keyword)) return true;
    if (descLower.includes(keyword)) return true;
    if (tags.some(tag => tag.toLowerCase().includes(keyword))) return true;
  }
  return false;
}

async function main() {
  console.log("=============================================");
  console.log("  Delete Non-Veg & Update Veg Images");
  console.log("=============================================\n");
  
  const recipes = await getAllRecipes();
  console.log(`Found ${recipes.length} total recipes\n`);
  
  // Separate veg and non-veg
  const nonVegRecipes: typeof recipes = [];
  const vegRecipes: typeof recipes = [];
  
  for (const recipe of recipes) {
    if (isNonVeg(recipe)) {
      nonVegRecipes.push(recipe);
    } else {
      vegRecipes.push(recipe);
    }
  }
  
  console.log(`Non-Veg recipes to delete: ${nonVegRecipes.length}`);
  console.log(`Veg recipes to keep: ${vegRecipes.length}\n`);
  
  // Delete non-veg recipes
  console.log("🗑️  Deleting Non-Veg Recipes:\n");
  let deleted = 0;
  for (const recipe of nonVegRecipes) {
    console.log(`  Deleting: ${recipe.title}...`);
    const success = await deleteRecipe(recipe.uid);
    if (success) {
      console.log(`    ✓ Deleted`);
      deleted++;
    } else {
      console.log(`    ✗ Failed`);
    }
    await new Promise(r => setTimeout(r, 300));
  }
  
  // Update images for veg recipes
  console.log("\n🥗 Updating Veg Recipe Images:\n");
  let updated = 0;
  for (const recipe of vegRecipes) {
    const imageUrl = vegRecipeImages[recipe.title];
    if (!imageUrl) {
      console.log(`  ${recipe.title}: No image mapping, skipping`);
      continue;
    }
    
    console.log(`  ${recipe.title}...`);
    const fileName = recipe.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const imageUid = await uploadImage(imageUrl, fileName);
    
    if (imageUid) {
      const success = await updateRecipeImage(recipe.uid, imageUid);
      if (success) {
        await publishRecipe(recipe.uid);
        console.log(`    ✓ Updated and published`);
        updated++;
      } else {
        console.log(`    ✗ Failed to update`);
      }
    } else {
      console.log(`    ✗ Failed to upload image`);
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log("\n=============================================");
  console.log(`  Summary:`);
  console.log(`    🗑️  Deleted: ${deleted} non-veg recipes`);
  console.log(`    🥗 Updated: ${updated} veg recipe images`);
  console.log("=============================================");
}

main().catch(console.error);
