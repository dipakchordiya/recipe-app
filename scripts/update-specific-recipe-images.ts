/**
 * Script to upload proper images for specific recipes
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";

// High-quality food images from Unsplash
const recipeImages: Record<string, { searchTitle: string; imageUrl: string; description: string }> = {
  "Tiramisu": {
    searchTitle: "tiramisu",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    description: "Classic Italian tiramisu dessert with cocoa powder dusting"
  },
  "Guacamole": {
    searchTitle: "guacamole",
    imageUrl: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=800&q=80",
    description: "Fresh homemade guacamole with avocado and lime"
  },
  "Chicken Tacos Al Pastor": {
    searchTitle: "tacos-al-pastor",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    description: "Authentic Mexican tacos al pastor with pineapple"
  },
  "Margherita Pizza": {
    searchTitle: "margherita-pizza",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    description: "Classic Neapolitan margherita pizza with fresh basil"
  },
  "Pav Bhaji": {
    searchTitle: "pav-bhaji",
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
    description: "Mumbai street food pav bhaji with buttery pav"
  },
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

async function uploadImageFromUrl(imageUrl: string, fileName: string, description: string): Promise<string | null> {
  console.log(`    Downloading image...`);
  
  try {
    // Download image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.log(`    ✗ Failed to download image`);
      return null;
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    
    // Create form data
    const formData = new FormData();
    formData.append('asset[upload]', blob, `${fileName}.jpg`);
    formData.append('asset[title]', fileName);
    formData.append('asset[description]', description);
    
    // Upload to Contentstack
    console.log(`    Uploading to Contentstack...`);
    const uploadResponse = await fetch(
      `https://api.contentstack.io/v3/assets`,
      {
        method: 'POST',
        headers: {
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN,
        },
        body: formData,
      }
    );
    
    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.log(`    ✗ Upload failed: ${error}`);
      return null;
    }
    
    const data = await uploadResponse.json();
    console.log(`    ✓ Uploaded: ${data.asset.uid}`);
    
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
          asset: {
            environments: ["development"],
            locales: ["en-us"],
          },
        }),
      }
    );
    console.log(`    ✓ Published asset`);
    
    return data.asset.uid;
  } catch (error) {
    console.log(`    ✗ Error: ${error}`);
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
        entry: {
          featured_image: imageUid,
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
  console.log("  Updating Specific Recipe Images");
  console.log("=============================================\n");
  
  if (!API_KEY || !MANAGEMENT_TOKEN) {
    console.error("❌ Missing API credentials!");
    return;
  }
  
  // Get all recipes
  const recipes = await getAllRecipes();
  console.log(`Found ${recipes.length} recipes\n`);
  
  // Find and update each specific recipe
  for (const [recipeName, imageInfo] of Object.entries(recipeImages)) {
    console.log(`\n🍽️  ${recipeName}:`);
    
    // Find the recipe
    const recipe = recipes.find((r: { title: string }) => 
      r.title.toLowerCase() === recipeName.toLowerCase() ||
      r.title.toLowerCase().includes(recipeName.toLowerCase().split(' ')[0])
    );
    
    if (!recipe) {
      console.log(`  ✗ Recipe not found`);
      continue;
    }
    
    console.log(`  Found: ${recipe.title} (${recipe.uid})`);
    
    // Upload new image
    const imageUid = await uploadImageFromUrl(
      imageInfo.imageUrl,
      imageInfo.searchTitle,
      imageInfo.description
    );
    
    if (!imageUid) {
      console.log(`  ✗ Failed to upload image`);
      continue;
    }
    
    // Update recipe with new image
    console.log(`    Updating recipe...`);
    const updated = await updateRecipeImage(recipe.uid, imageUid);
    
    if (updated) {
      await publishRecipe(recipe.uid);
      console.log(`    ✓ Recipe updated and published!`);
    } else {
      console.log(`    ✗ Failed to update recipe`);
    }
  }
  
  console.log("\n=============================================");
  console.log("  Done! Recipe images updated.");
  console.log("=============================================");
}

main().catch(console.error);
