/**
 * Update Home Page variants with banner images
 * Run with: npx ts-node scripts/update-variant-banners.ts
 */

const API_KEY = "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = "cs4b3b60b8ac28532fc37fbe37";
const ENVIRONMENT = "development";
const HOME_PAGE_UID = "bltd30052da58732341";

// Asset UIDs from previous upload
const BANNER_ASSETS = {
  default: "blta23a6304d8c4c5b1",
  indian: "blt0c6edefa49fae56c",
  american: "blt15b010e37bbfa762",
};

// Variant UIDs from Personalize
const VARIANT_UIDS = {
  ind: "cs32b45e98dce08645",
  usa: "csc983d9bc8d2be49f",
};

async function updateVariant(variantUid: string, assetUid: string, variantName: string) {
  console.log(`📝 Updating ${variantName} variant...`);
  
  const url = `https://api.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_UID}`;
  
  const body = {
    entry: {
      hero_banner_image: assetUid,
      _variant: {
        _uid: variantUid,
      },
    },
  };
  
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json() as any;
    
    if (!response.ok) {
      console.error(`  ✗ Failed:`, data.error_message || data);
      return false;
    }
    
    console.log(`  ✓ Updated ${variantName} variant`);
    
    // Publish the variant
    await publishVariant(variantUid, variantName);
    
    return true;
  } catch (error: any) {
    console.error(`  ✗ Error:`, error.message);
    return false;
  }
}

async function publishVariant(variantUid: string, variantName: string) {
  console.log(`  📤 Publishing ${variantName} variant...`);
  
  const url = `https://api.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_UID}/publish`;
  
  const body = {
    entry: {
      environments: [ENVIRONMENT],
      locales: ["en-us"],
    },
    locale: "en-us",
    _variant: {
      _uid: variantUid,
    },
  };
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json() as any;
    
    if (!response.ok) {
      console.error(`    ✗ Publish failed:`, data.error_message || data);
      return false;
    }
    
    console.log(`    ✓ Published ${variantName} variant`);
    return true;
  } catch (error: any) {
    console.error(`    ✗ Publish error:`, error.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Updating Home Page Variants with Banner Images\n");
  console.log("=".repeat(50));
  console.log(`  Home Page UID: ${HOME_PAGE_UID}`);
  console.log(`  Default Banner: ${BANNER_ASSETS.default}`);
  console.log(`  Indian Banner: ${BANNER_ASSETS.indian}`);
  console.log(`  American Banner: ${BANNER_ASSETS.american}`);
  console.log("=".repeat(50) + "\n");
  
  // Update Indian variant
  await updateVariant(VARIANT_UIDS.ind, BANNER_ASSETS.indian, "India");
  
  // Small delay between API calls
  await new Promise((r) => setTimeout(r, 1000));
  
  // Update American variant
  await updateVariant(VARIANT_UIDS.usa, BANNER_ASSETS.american, "USA");
  
  console.log("\n" + "=".repeat(50));
  console.log("✅ Variant updates complete!");
}

main().catch(console.error);
