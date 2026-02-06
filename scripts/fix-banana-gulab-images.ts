import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";

// Using different, more reliable image URLs
const fixImages = [
  { 
    title: "Banana Bread", 
    urls: [
      "https://images.unsplash.com/photo-1432457990754-c8b5f21448de?w=800&q=80",
      "https://images.unsplash.com/photo-1584226761916-3fd67ab5ac3a?w=800&q=80",
      "https://images.pexels.com/photos/830894/pexels-photo-830894.jpeg?w=800",
    ],
    description: "Moist banana bread loaf"
  },
];

async function main() {
  console.log("Fixing Banana Bread and Gulab Jamun images...\n");
  
  const res = await fetch("https://api.contentstack.io/v3/content_types/recipe/entries?limit=100", {
    headers: { "api_key": API_KEY, "authorization": MANAGEMENT_TOKEN }
  });
  const data = await res.json();
  
  for (const fix of fixImages) {
    const recipe = data.entries?.find((r: { title: string }) => r.title === fix.title);
    if (!recipe) { 
      console.log(`${fix.title}: Recipe not found`); 
      continue; 
    }
    
    console.log(`${fix.title}:`);
    
    let success = false;
    for (const url of fix.urls) {
      console.log(`  Trying: ${url.substring(0, 50)}...`);
      
      try {
        const imgRes = await fetch(url);
        if (!imgRes.ok) {
          console.log(`    ✗ Failed to download (${imgRes.status})`);
          continue;
        }
        
        const buffer = await imgRes.arrayBuffer();
        const blob = new Blob([buffer], { type: "image/jpeg" });
        
        const formData = new FormData();
        const fileName = fix.title.toLowerCase().replace(/\s+/g, "-") + "-final";
        formData.append("asset[upload]", blob, `${fileName}.jpg`);
        formData.append("asset[title]", fix.title + " Image");
        formData.append("asset[description]", fix.description);
        
        const uploadRes = await fetch("https://api.contentstack.io/v3/assets", {
          method: "POST",
          headers: { "api_key": API_KEY, "authorization": MANAGEMENT_TOKEN },
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        
        if (!uploadData.asset) { 
          console.log(`    ✗ Upload failed`);
          continue; 
        }
        
        console.log(`    ✓ Uploaded: ${uploadData.asset.uid}`);
        
        // Publish asset
        await fetch(`https://api.contentstack.io/v3/assets/${uploadData.asset.uid}/publish`, {
          method: "POST",
          headers: { 
            "api_key": API_KEY, 
            "authorization": MANAGEMENT_TOKEN, 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ 
            asset: { environments: ["development"], locales: ["en-us"] } 
          })
        });
        
        // Update recipe
        const updateRes = await fetch(`https://api.contentstack.io/v3/content_types/recipe/entries/${recipe.uid}`, {
          method: "PUT",
          headers: { 
            "api_key": API_KEY, 
            "authorization": MANAGEMENT_TOKEN, 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ 
            entry: { featured_image: uploadData.asset.uid } 
          })
        });
        
        if (!updateRes.ok) {
          console.log(`    ✗ Update failed`);
          continue;
        }
        
        // Publish recipe
        await fetch(`https://api.contentstack.io/v3/content_types/recipe/entries/${recipe.uid}/publish`, {
          method: "POST",
          headers: { 
            "api_key": API_KEY, 
            "authorization": MANAGEMENT_TOKEN, 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ 
            entry: { environments: ["development"], locales: ["en-us"] } 
          })
        });
        
        console.log(`    ✓ Done!\n`);
        success = true;
        break;
        
      } catch (error) {
        console.log(`    ✗ Error:`, error);
      }
    }
    
    if (!success) {
      console.log(`  ✗ All URLs failed for ${fix.title}\n`);
    }
  }
  
  console.log("Complete!");
}

main();
