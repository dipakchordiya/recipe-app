import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";

const fixImages = [
  { title: "Banana Bread", url: "https://images.unsplash.com/photo-1558401546-5e6c3c3e3b9c?w=800&q=80" },
  { title: "Gulab Jamun", url: "https://images.unsplash.com/photo-1605197161470-5d10246e4b41?w=800&q=80" },
];

async function main() {
  const res = await fetch("https://api.contentstack.io/v3/content_types/recipe/entries?limit=100", {
    headers: { "api_key": API_KEY, "authorization": MANAGEMENT_TOKEN }
  });
  const data = await res.json();
  
  for (const fix of fixImages) {
    const recipe = data.entries?.find((r: { title: string }) => r.title === fix.title);
    if (!recipe) { console.log(fix.title + " not found"); continue; }
    
    console.log("Fixing " + fix.title + "...");
    
    const imgRes = await fetch(fix.url);
    const buffer = await imgRes.arrayBuffer();
    const blob = new Blob([buffer], { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("asset[upload]", blob, fix.title.toLowerCase().replace(/ /g, "-") + ".jpg");
    formData.append("asset[title]", fix.title);
    
    const uploadRes = await fetch("https://api.contentstack.io/v3/assets", {
      method: "POST",
      headers: { "api_key": API_KEY, "authorization": MANAGEMENT_TOKEN },
      body: formData
    });
    const uploadData = await uploadRes.json();
    
    if (!uploadData.asset) { console.log("  Upload failed"); continue; }
    
    await fetch("https://api.contentstack.io/v3/assets/" + uploadData.asset.uid + "/publish", {
      method: "POST",
      headers: { "api_key": API_KEY, "authorization": MANAGEMENT_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ asset: { environments: ["development"], locales: ["en-us"] } })
    });
    
    await fetch("https://api.contentstack.io/v3/content_types/recipe/entries/" + recipe.uid, {
      method: "PUT",
      headers: { "api_key": API_KEY, "authorization": MANAGEMENT_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ entry: { featured_image: uploadData.asset.uid } })
    });
    
    await fetch("https://api.contentstack.io/v3/content_types/recipe/entries/" + recipe.uid + "/publish", {
      method: "POST",
      headers: { "api_key": API_KEY, "authorization": MANAGEMENT_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ entry: { environments: ["development"], locales: ["en-us"] } })
    });
    
    console.log("  ✓ Fixed");
  }
}

main();
