/**
 * Update Home Page content type with banner image field and update entries
 * Run with: npx ts-node scripts/update-home-page-with-banners.ts
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

// Banner image URLs (high quality Unsplash images)
const BANNER_IMAGES = {
  default: {
    url: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1920&q=80",
    title: "Default Banner - General Cooking",
  },
  indian: {
    url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1920&q=80",
    title: "Indian Cuisine Banner",
  },
  american: {
    url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1920&q=80",
    title: "American Cuisine Banner",
  },
};

// Variant UIDs from Personalize
const VARIANT_UIDS = {
  ind: "cs32b45e98dce08645",
  usa: "csc983d9bc8d2be49f",
};

const HOME_PAGE_UID = "bltd30052da58732341";

async function addBannerFieldToContentType() {
  console.log("📝 Adding hero_banner_image field to Home Page content type...");
  
  try {
    const contentType = await stack.contentType("home_page").fetch();
    const schema = contentType.schema as any[];
    
    // Check if field already exists
    const existingField = schema.find((field: any) => field.uid === "hero_banner_image");
    if (existingField) {
      console.log("  ⚠ hero_banner_image field already exists");
      return true;
    }
    
    // Add the file field for banner image
    schema.push({
      display_name: "Hero Banner Image",
      uid: "hero_banner_image",
      data_type: "file",
      mandatory: false,
      unique: false,
      field_metadata: {
        description: "Background image for the hero section",
        rich_text_type: "standard",
      },
    });
    
    contentType.schema = schema;
    await contentType.update();
    
    console.log("  ✓ Added hero_banner_image field");
    return true;
  } catch (error: any) {
    console.error("  ✗ Failed to update content type:", error.message || error);
    return false;
  }
}

function downloadImage(imageUrl: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      // Handle redirects
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
    // Download the image
    const buffer = await downloadImage(imageUrl);
    const tempPath = path.join(process.cwd(), `temp_${Date.now()}.jpg`);
    fs.writeFileSync(tempPath, buffer);
    
    // Upload to Contentstack
    const asset = await stack.asset().create({
      upload: tempPath,
      title: title,
      description: `Banner image: ${title}`,
      tags: ["banner", "hero"],
    } as any);
    
    // Clean up temp file
    fs.unlinkSync(tempPath);
    
    // Publish the asset
    await asset.publish({ publishDetails: { environments: [ENVIRONMENT], locales: ["en-us"] } });
    
    console.log(`    ✓ Uploaded: ${asset.uid}`);
    return asset.uid;
  } catch (error: any) {
    console.error(`    ✗ Failed to upload ${title}:`, error.message || error);
    return null;
  }
}

async function checkExistingAssets() {
  console.log("🔍 Checking for existing banner assets...");
  
  try {
    const assets = await stack.asset().query({ query: { tags: "banner" } }).find();
    
    if (assets.items && assets.items.length > 0) {
      console.log("  Found existing banner assets:");
      const assetMap: Record<string, string> = {};
      
      for (const asset of assets.items) {
        console.log(`    - ${asset.title}: ${asset.uid}`);
        if (asset.title?.toLowerCase().includes("default")) assetMap.default = asset.uid;
        if (asset.title?.toLowerCase().includes("indian")) assetMap.indian = asset.uid;
        if (asset.title?.toLowerCase().includes("american")) assetMap.american = asset.uid;
      }
      
      return assetMap;
    }
    
    return {};
  } catch (error: any) {
    console.error("  Error checking assets:", error.message);
    return {};
  }
}

async function updateHomePageEntry(assetUid: string) {
  console.log("📝 Updating base Home Page entry with default banner...");
  
  try {
    const entry = await stack.contentType("home_page").entry(HOME_PAGE_UID).fetch();
    
    (entry as any).hero_banner_image = assetUid;
    await entry.update();
    
    await entry.publish({
      publishDetails: { environments: [ENVIRONMENT], locales: ["en-us"] },
    });
    
    console.log("  ✓ Updated base entry with default banner");
    return true;
  } catch (error: any) {
    console.error("  ✗ Failed to update base entry:", error.message || error);
    return false;
  }
}

async function updateVariantWithBanner(variantUid: string, assetUid: string, variantName: string) {
  console.log(`📝 Updating ${variantName} variant with banner...`);
  
  try {
    // Fetch the entry with variant
    const entry = await stack.contentType("home_page").entry(HOME_PAGE_UID).fetch();
    
    // Update with variant-specific data
    const updateData = {
      hero_banner_image: assetUid,
      _variant: {
        _uid: variantUid,
      },
    };
    
    Object.assign(entry, updateData);
    await entry.update();
    
    // Publish the variant
    await entry.publish({
      publishDetails: { 
        environments: [ENVIRONMENT], 
        locales: ["en-us"],
      },
    });
    
    console.log(`  ✓ Updated ${variantName} variant`);
    return true;
  } catch (error: any) {
    console.error(`  ✗ Failed to update ${variantName} variant:`, error.message || error);
    return false;
  }
}

async function main() {
  console.log("🚀 Setting up Home Page Banner Images\n");
  console.log("=".repeat(50));
  
  // Step 1: Add banner field to content type
  const fieldAdded = await addBannerFieldToContentType();
  if (!fieldAdded) {
    console.log("\n⚠ Continuing anyway - field might already exist...");
  }
  
  // Step 2: Check for existing assets
  const existingAssets = await checkExistingAssets();
  
  // Step 3: Upload banner images if not already uploaded
  console.log("\n📤 Uploading Banner Images...");
  
  let defaultAssetUid = existingAssets.default;
  let indianAssetUid = existingAssets.indian;
  let americanAssetUid = existingAssets.american;
  
  if (!defaultAssetUid) {
    defaultAssetUid = await uploadAsset(BANNER_IMAGES.default.url, BANNER_IMAGES.default.title) || "";
  } else {
    console.log("  ⚠ Using existing default banner asset");
  }
  
  if (!indianAssetUid) {
    indianAssetUid = await uploadAsset(BANNER_IMAGES.indian.url, BANNER_IMAGES.indian.title) || "";
  } else {
    console.log("  ⚠ Using existing Indian banner asset");
  }
  
  if (!americanAssetUid) {
    americanAssetUid = await uploadAsset(BANNER_IMAGES.american.url, BANNER_IMAGES.american.title) || "";
  } else {
    console.log("  ⚠ Using existing American banner asset");
  }
  
  // Step 4: Update Home Page entries with banners
  console.log("\n📝 Updating Home Page Entries...");
  
  if (defaultAssetUid) {
    await updateHomePageEntry(defaultAssetUid);
  }
  
  // Note: Updating variants via Management API is complex
  // For now, we'll output instructions for manual update
  console.log("\n" + "=".repeat(50));
  console.log("✅ Banner images uploaded!");
  console.log("\n📋 Asset UIDs for manual variant update:");
  console.log(`  - Default Banner: ${defaultAssetUid}`);
  console.log(`  - Indian Banner: ${indianAssetUid}`);
  console.log(`  - American Banner: ${americanAssetUid}`);
  console.log("\n⚠ Please manually update the variants in Contentstack:");
  console.log("  1. Go to Home Page entry");
  console.log("  2. Select 'ind' variant → Set hero_banner_image to Indian Banner");
  console.log("  3. Select 'usa' variant → Set hero_banner_image to American Banner");
  console.log("  4. Publish both variants");
}

main().catch(console.error);
