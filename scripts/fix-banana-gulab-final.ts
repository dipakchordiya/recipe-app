import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";

// Using Pexels and other reliable sources
const fixImages = [
  { 
    title: "Banana Bread", 
    urls: [
      "https://images.pexels.com/photos/830894/pexels-photo-830894.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3872433/pexels-photo-3872433.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://cdn.pixabay.com/photo/2016/06/11/04/09/banana-bread-1449325_1280.jpg",
    ],
  },
  { 
    title: "Gulab Jamun", 
    urls: [
      "https://images.pexels.com/photos/14477877/pexels-photo-14477877.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/9609838/pexels-photo-9609838.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://cdn.pixabay.com/photo/2020/10/05/12/21/gulab-jamun-5628947_1280.jpg",
    ],
  },
];

async function main() {
  console.log("Fixing images with reliable sources...\n");
  
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
    
    console.log(`🍞 ${fix.title}:`);
    
    let success = false;
    for (let i = 0; i < fix.urls.length; i++) {
      const url = fix.urls[i];
      console.log(`  Attempt ${i + 1}: ${url.substring(0, 60)}...`);
      
      try {
        const imgRes = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        });
        
        if (!imgRes.ok) {
          console.log(`    ✗ Download failed (${imgRes.status})`);
          continue;
        }
        
        const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
        const buffer = await imgRes.arrayBuffer();
        
        if (buffer.byteLength < 1000) {
          console.log(`    ✗ Image too small`);
          continue;
        }
        
        console.log(`    Downloaded ${Math.round(buffer.byteLength / 1024)}KB`);
        
        const blob = new Blob([buffer], { type: contentType });
        const formData = new FormData();
        const fileName = fix.title.toLowerCase().replace(/\s+/g, "-") + "-new";
        formData.append("asset[upload]", blob, `${fileName}.jpg`);
        formData.append("asset[title]", fix.title);
        
        const uploadRes = await fetch("https://api.contentstack.io/v3/assets", {
          method: "POST",
          headers: { "api_key": API_KEY, "authorization": MANAGEMENT_TOKEN },
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        
        if (!uploadData.asset) { 
          console.log(`    ✗ Upload failed:`, JSON.stringify(uploadData).substring(0, 100));
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
        console.log(`    ✓ Asset published`);
        
        // Update recipe
        await fetch(`https://api.contentstack.io/v3/content_types/recipe/entries/${recipe.uid}`, {
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
        console.log(`    ✓ Recipe updated`);
        
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
        console.log(`    ✓ Recipe published\n`);
        
        success = true;
        break;
        
      } catch (error) {
        console.log(`    ✗ Error: ${error}`);
      }
    }
    
    if (!success) {
      console.log(`  ❌ All URLs failed for ${fix.title}\n`);
    }
  }
  
  console.log("Done!");
}

main();
