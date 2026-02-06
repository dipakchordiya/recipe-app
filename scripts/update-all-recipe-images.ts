/**
 * Script to upload proper images for ALL recipes based on their details
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";

// High-quality food images from Unsplash mapped to recipe names
const recipeImageMap: Record<string, { url: string; description: string }> = {
  // Indian Cuisine
  "Butter Chicken": {
    url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
    description: "Creamy butter chicken curry with rich tomato gravy"
  },
  "Chicken Biryani": {
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
    description: "Aromatic chicken biryani with saffron rice"
  },
  "Hyderabadi Chicken Biryani": {
    url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80",
    description: "Traditional Hyderabadi dum biryani"
  },
  "Palak Paneer": {
    url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    description: "Creamy spinach curry with paneer cubes"
  },
  "Masala Dosa": {
    url: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
    description: "Crispy South Indian masala dosa with sambar"
  },
  "Paneer Tikka Masala": {
    url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
    description: "Grilled paneer in creamy tikka masala sauce"
  },
  "Pav Bhaji": {
    url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
    description: "Mumbai street food pav bhaji"
  },
  "Chole Bhature": {
    url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&q=80",
    description: "Spicy chickpea curry with fried bread"
  },
  "Dal Makhani": {
    url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    description: "Creamy black lentil dal makhani"
  },
  
  // American Cuisine
  "Classic Cheeseburger": {
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    description: "Juicy American cheeseburger with all the fixings"
  },
  "Classic American Cheeseburger": {
    url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    description: "Classic American beef cheeseburger"
  },
  "Southern Fried Chicken": {
    url: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80",
    description: "Crispy Southern-style fried chicken"
  },
  "BBQ Pulled Pork": {
    url: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80",
    description: "Slow-cooked BBQ pulled pork"
  },
  "Southern BBQ Ribs": {
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    description: "Smoky BBQ ribs with glaze"
  },
  "Mac and Cheese": {
    url: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=800&q=80",
    description: "Creamy mac and cheese"
  },
  "Creamy Mac and Cheese": {
    url: "https://images.unsplash.com/photo-1612152605347-f93296cb657d?w=800&q=80",
    description: "Homemade creamy macaroni and cheese"
  },
  "Apple Pie": {
    url: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=800&q=80",
    description: "Classic American apple pie"
  },
  "Classic American Apple Pie": {
    url: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800&q=80",
    description: "Homemade apple pie with lattice crust"
  },
  "New York Cheesecake": {
    url: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&q=80",
    description: "Creamy New York style cheesecake"
  },
  "Philly Cheesesteak": {
    url: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80",
    description: "Authentic Philadelphia cheesesteak sandwich"
  },
  
  // Italian
  "Spaghetti Carbonara": {
    url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
    description: "Classic Italian spaghetti carbonara"
  },
  "Classic Spaghetti Carbonara": {
    url: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=800&q=80",
    description: "Traditional Roman carbonara pasta"
  },
  "Margherita Pizza": {
    url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    description: "Authentic Neapolitan margherita pizza"
  },
  "Tiramisu": {
    url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    description: "Classic Italian tiramisu dessert"
  },
  
  // Mexican
  "Chicken Tacos Al Pastor": {
    url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    description: "Authentic tacos al pastor with pineapple"
  },
  "Guacamole": {
    url: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=800&q=80",
    description: "Fresh homemade guacamole"
  },
  
  // Salads
  "Caesar Salad": {
    url: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80",
    description: "Classic Caesar salad with parmesan"
  },
  "Greek Salad": {
    url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    description: "Fresh Greek salad with feta cheese"
  },
  "Fresh Garden Salad": {
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    description: "Fresh garden vegetable salad"
  },
  
  // Soups
  "Tomato Basil Soup": {
    url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    description: "Creamy tomato basil soup"
  },
  "Creamy Tomato Soup": {
    url: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800&q=80",
    description: "Rich and creamy tomato soup"
  },
  "Chicken Noodle Soup": {
    url: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800&q=80",
    description: "Homemade chicken noodle soup"
  },
  "Minestrone Soup": {
    url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    description: "Hearty Italian minestrone soup"
  },
  
  // Breakfast
  "Fluffy Pancakes": {
    url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
    description: "Fluffy buttermilk pancakes with maple syrup"
  },
  "Avocado Toast": {
    url: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&q=80",
    description: "Trendy avocado toast with poached egg"
  },
  
  // Seafood
  "Garlic Butter Shrimp": {
    url: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80",
    description: "Succulent garlic butter shrimp"
  },
  "Grilled Salmon": {
    url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
    description: "Perfectly grilled salmon fillet"
  },
  
  // Appetizers
  "Bruschetta": {
    url: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&q=80",
    description: "Fresh tomato bruschetta on crispy bread"
  },
  "Spinach Artichoke Dip": {
    url: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=800&q=80",
    description: "Creamy spinach artichoke dip"
  },
  
  // Desserts
  "Chocolate Lava Cake": {
    url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
    description: "Decadent chocolate lava cake"
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
  try {
    // Download image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
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
      return null;
    }
    
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
          asset: {
            environments: ["development"],
            locales: ["en-us"],
          },
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
  console.log("  Updating ALL Recipe Images");
  console.log("=============================================\n");
  
  if (!API_KEY || !MANAGEMENT_TOKEN) {
    console.error("❌ Missing API credentials!");
    return;
  }
  
  // Get all recipes
  const recipes = await getAllRecipes();
  console.log(`Found ${recipes.length} recipes\n`);
  
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const recipe of recipes) {
    const imageInfo = recipeImageMap[recipe.title];
    
    if (!imageInfo) {
      console.log(`⚠️  ${recipe.title}: No image mapping found`);
      skipped++;
      continue;
    }
    
    console.log(`🍽️  ${recipe.title}...`);
    
    // Upload new image
    const fileName = recipe.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const imageUid = await uploadImageFromUrl(imageInfo.url, fileName, imageInfo.description);
    
    if (!imageUid) {
      console.log(`   ✗ Failed to upload image`);
      failed++;
      continue;
    }
    
    // Update recipe
    const success = await updateRecipeImage(recipe.uid, imageUid);
    
    if (success) {
      await publishRecipe(recipe.uid);
      console.log(`   ✓ Updated and published`);
      updated++;
    } else {
      console.log(`   ✗ Failed to update`);
      failed++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("\n=============================================");
  console.log(`  Summary:`);
  console.log(`    ✓ Updated: ${updated}`);
  console.log(`    ⚠ Skipped: ${skipped}`);
  console.log(`    ✗ Failed: ${failed}`);
  console.log("=============================================");
}

main().catch(console.error);
