/**
 * Upload images for recipes that are missing them
 * Run with: npx ts-node scripts/upload-recipe-images.ts
 */

import contentstack from "@contentstack/management";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const API_KEY = "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = "cs4b3b60b8ac28532fc37fbe37";
const ENVIRONMENT = "development";

const client = contentstack.client();
const stack = client.stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN });

// Recipe image URLs from Unsplash
const RECIPE_IMAGES: Record<string, { url: string; title: string }> = {
  "Butter Chicken": {
    url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
    title: "Butter Chicken",
  },
  "Chicken Biryani": {
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
    title: "Chicken Biryani",
  },
  "Palak Paneer": {
    url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    title: "Palak Paneer",
  },
  "Masala Dosa": {
    url: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
    title: "Masala Dosa",
  },
  "Classic Cheeseburger": {
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    title: "Classic Cheeseburger",
  },
  "BBQ Pulled Pork": {
    url: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80",
    title: "BBQ Pulled Pork",
  },
  "Mac and Cheese": {
    url: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=800&q=80",
    title: "Mac and Cheese",
  },
  "Apple Pie": {
    url: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=800&q=80",
    title: "Apple Pie",
  },
};

function downloadImage(imageUrl: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const chunks: Buffer[] = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(Buffer.concat(chunks)));
      response.on("error", reject);
    }).on("error", reject);
  });
}

async function uploadAsset(imageUrl: string, title: string): Promise<string | null> {
  console.log(`  📤 Uploading: ${title}...`);
  
  try {
    const buffer = await downloadImage(imageUrl);
    const tempPath = path.join(process.cwd(), `temp_${Date.now()}.jpg`);
    fs.writeFileSync(tempPath, buffer);
    
    const asset = await stack.asset().create({
      upload: tempPath,
      title: title,
      description: `Recipe image for ${title}`,
      tags: ["recipe", "food"],
    } as any);
    
    fs.unlinkSync(tempPath);
    
    await asset.publish({ publishDetails: { environments: [ENVIRONMENT], locales: ["en-us"] } });
    
    console.log(`    ✓ Uploaded: ${asset.uid}`);
    return asset.uid;
  } catch (error: any) {
    console.error(`    ✗ Failed to upload ${title}:`, error.message || error);
    return null;
  }
}

async function findRecipeByTitle(title: string): Promise<any | null> {
  try {
    const result = await stack
      .contentType("recipe")
      .entry()
      .query({ query: { title: title } })
      .find();
    
    if (result.items && result.items.length > 0) {
      return result.items[0];
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function updateRecipeImage(recipeUid: string, assetUid: string, recipeTitle: string) {
  console.log(`  📝 Updating ${recipeTitle} with image...`);
  
  try {
    const entry = await stack.contentType("recipe").entry(recipeUid).fetch();
    (entry as any).featured_image = assetUid;
    await entry.update();
    await entry.publish({ publishDetails: { environments: [ENVIRONMENT], locales: ["en-us"] } });
    console.log(`    ✓ Updated: ${recipeTitle}`);
    return true;
  } catch (error: any) {
    console.error(`    ✗ Failed to update ${recipeTitle}:`, error.message || error);
    return false;
  }
}

async function createMissingRecipes() {
  console.log("\n🍳 Checking for missing Indian recipes...\n");
  
  const indianRecipes = [
    {
      title: "Butter Chicken",
      description: "Creamy, aromatic butter chicken - a beloved North Indian classic with tender chicken in rich tomato-based gravy",
      cooking_time: 45,
      difficulty: "medium",
      is_published: true,
      ingredients: [
        { name: "Chicken thighs", quantity: "500", unit: "grams" },
        { name: "Yogurt", quantity: "1", unit: "cup" },
        { name: "Tomato puree", quantity: "2", unit: "cups" },
        { name: "Heavy cream", quantity: "1", unit: "cup" },
        { name: "Butter", quantity: "4", unit: "tbsp" },
        { name: "Garam masala", quantity: "2", unit: "tsp" },
      ],
      steps: "1. Marinate chicken in yogurt and spices for 2 hours\n2. Grill or pan-fry the chicken until charred\n3. Make the gravy with tomatoes, cream, and butter\n4. Simmer chicken in the gravy\n5. Garnish with cream and serve with naan",
      recipe_tags: ["indian", "curry", "chicken", "creamy"],
    },
    {
      title: "Palak Paneer",
      description: "Creamy spinach curry with soft paneer cubes - a nutritious and delicious vegetarian North Indian favorite",
      cooking_time: 35,
      difficulty: "easy",
      is_published: true,
      ingredients: [
        { name: "Spinach", quantity: "500", unit: "grams" },
        { name: "Paneer", quantity: "250", unit: "grams" },
        { name: "Onion", quantity: "1", unit: "large" },
        { name: "Tomatoes", quantity: "2", unit: "medium" },
        { name: "Cream", quantity: "2", unit: "tbsp" },
        { name: "Cumin seeds", quantity: "1", unit: "tsp" },
      ],
      steps: "1. Blanch spinach and blend to a smooth puree\n2. Sauté onions, tomatoes, and spices\n3. Add spinach puree and simmer\n4. Pan-fry paneer cubes until golden\n5. Add paneer to the gravy and serve hot",
      recipe_tags: ["indian", "vegetarian", "paneer", "healthy"],
    },
    {
      title: "Masala Dosa",
      description: "Crispy South Indian crepe filled with spiced potato filling - a popular breakfast across India",
      cooking_time: 30,
      difficulty: "medium",
      is_published: true,
      ingredients: [
        { name: "Dosa batter", quantity: "2", unit: "cups" },
        { name: "Potatoes", quantity: "4", unit: "large" },
        { name: "Onions", quantity: "2", unit: "medium" },
        { name: "Mustard seeds", quantity: "1", unit: "tsp" },
        { name: "Turmeric", quantity: "0.5", unit: "tsp" },
        { name: "Curry leaves", quantity: "10", unit: "pieces" },
      ],
      steps: "1. Prepare potato masala with spices\n2. Heat a dosa pan and spread batter thin\n3. Drizzle oil and cook until crispy\n4. Add potato filling and fold\n5. Serve with coconut chutney and sambar",
      recipe_tags: ["indian", "south-indian", "breakfast", "vegetarian"],
    },
  ];
  
  // Get Indian Cuisine category
  const categoryResult = await stack
    .contentType("category")
    .entry()
    .query({ query: { name: "Indian Cuisine" } })
    .find();
  
  const indianCategoryUid = categoryResult.items?.[0]?.uid;
  
  if (!indianCategoryUid) {
    console.log("  ⚠ Indian Cuisine category not found");
    return;
  }
  
  for (const recipe of indianRecipes) {
    const existing = await findRecipeByTitle(recipe.title);
    if (!existing) {
      console.log(`  📝 Creating ${recipe.title}...`);
      try {
        const entry = await stack.contentType("recipe").entry().create({
          entry: {
            ...recipe,
            category: [{ uid: indianCategoryUid, _content_type_uid: "category" }],
            url: `/recipes/${recipe.title.toLowerCase().replace(/\s+/g, "-")}`,
          } as any,
        });
        console.log(`    ✓ Created: ${entry.uid}`);
        await entry.publish({ publishDetails: { environments: [ENVIRONMENT], locales: ["en-us"] } });
      } catch (error: any) {
        console.error(`    ✗ Failed to create ${recipe.title}:`, error.message || error);
      }
    } else {
      console.log(`  ⚠ ${recipe.title} already exists`);
    }
  }
}

async function main() {
  console.log("🚀 Uploading Recipe Images\n");
  console.log("=".repeat(50));
  
  // First, create missing Indian recipes
  await createMissingRecipes();
  
  // Now upload images for all recipes that need them
  console.log("\n📸 Uploading images for recipes...\n");
  
  for (const [recipeName, imageInfo] of Object.entries(RECIPE_IMAGES)) {
    const recipe = await findRecipeByTitle(recipeName);
    
    if (!recipe) {
      console.log(`  ⚠ Recipe not found: ${recipeName}`);
      continue;
    }
    
    // Check if recipe already has an image
    if (recipe.featured_image) {
      console.log(`  ⚠ ${recipeName} already has an image`);
      continue;
    }
    
    // Upload image
    const assetUid = await uploadAsset(imageInfo.url, imageInfo.title);
    
    if (assetUid) {
      // Update recipe with image
      await updateRecipeImage(recipe.uid, assetUid, recipeName);
    }
    
    // Small delay between API calls
    await new Promise((r) => setTimeout(r, 500));
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("✅ Recipe images uploaded!");
}

main().catch(console.error);
