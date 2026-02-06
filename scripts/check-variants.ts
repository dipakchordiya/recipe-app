/**
 * Diagnostic script to check what Contentstack returns for each variant
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "";
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || "";
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || "development";

const HOME_PAGE_ENTRY_UID = "bltd30052da58732341";

const VARIANT_UIDS = {
  ind: "cs32b45e98dce08645",
  usa: "csc983d9bc8d2be49f",
};

async function fetchWithVariant(variantUid: string | null, label: string) {
  console.log(`\n📥 Fetching: ${label}`);
  console.log(`   Variant UID: ${variantUid || "none (base entry)"}`);
  
  const headers: Record<string, string> = {
    "api_key": API_KEY,
    "access_token": DELIVERY_TOKEN,
  };
  
  if (variantUid) {
    headers["x-cs-variant-uid"] = variantUid;
  }

  const url = `https://cdn.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_ENTRY_UID}?environment=${ENVIRONMENT}`;
  
  try {
    const response = await fetch(url, { headers });
    
    console.log(`   Status: ${response.status}`);
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`   Error: ${error}`);
      return null;
    }
    
    const data = await response.json();
    const entry = data.entry;
    
    if (entry) {
      console.log(`   ✓ Entry found!`);
      console.log(`   - hero_badge_text: "${entry.hero_badge_text || 'not set'}"`);
      console.log(`   - hero_headline: "${entry.hero_headline || 'not set'}"`);
      console.log(`   - hero_highlight_text: "${entry.hero_highlight_text || 'not set'}"`);
      console.log(`   - hero_description: "${(entry.hero_description || 'not set').slice(0, 50)}..."`);
      console.log(`   - _version: ${entry._version}`);
      
      // Check for variant metadata
      if (entry._variant) {
        console.log(`   - _variant: ${JSON.stringify(entry._variant)}`);
      }
    } else {
      console.log(`   ✗ No entry in response`);
    }
    
    return entry;
  } catch (error) {
    console.log(`   ✗ Error: ${error}`);
    return null;
  }
}

async function listAvailableVariants() {
  console.log("\n🔍 Checking available variants via Management API...");
  
  const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";
  
  if (!MANAGEMENT_TOKEN) {
    console.log("   ⚠️ No management token - skipping variant list");
    return;
  }
  
  try {
    const response = await fetch(
      `https://api.contentstack.io/v3/content_types/home_page/entries/${HOME_PAGE_ENTRY_UID}`,
      {
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
        },
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`   Error: ${error}`);
      return;
    }
    
    const data = await response.json();
    const entry = data.entry;
    
    console.log(`   Entry UID: ${entry.uid}`);
    console.log(`   Title: ${entry.title}`);
    console.log(`   Version: ${entry._version}`);
    
    // Check for _variants field
    if (entry._variants) {
      console.log(`   Variants: ${JSON.stringify(entry._variants, null, 2)}`);
    } else {
      console.log(`   No _variants field found in entry`);
    }
    
  } catch (error) {
    console.log(`   Error: ${error}`);
  }
}

async function main() {
  console.log("=============================================");
  console.log("  Contentstack Variant Diagnostic Tool");
  console.log("=============================================");
  
  console.log("\n📋 Configuration:");
  console.log(`   API Key: ${API_KEY.slice(0, 15)}...`);
  console.log(`   Delivery Token: ${DELIVERY_TOKEN.slice(0, 15)}...`);
  console.log(`   Environment: ${ENVIRONMENT}`);
  console.log(`   Entry UID: ${HOME_PAGE_ENTRY_UID}`);
  
  // Fetch base entry (no variant)
  const baseEntry = await fetchWithVariant(null, "BASE ENTRY (no variant header)");
  
  // Fetch India variant
  const indEntry = await fetchWithVariant(VARIANT_UIDS.ind, "INDIA VARIANT");
  
  // Fetch USA variant
  const usaEntry = await fetchWithVariant(VARIANT_UIDS.usa, "USA VARIANT");
  
  // Compare results
  console.log("\n=============================================");
  console.log("  COMPARISON");
  console.log("=============================================");
  
  if (baseEntry && indEntry && usaEntry) {
    const baseBadge = baseEntry.hero_badge_text;
    const indBadge = indEntry.hero_badge_text;
    const usaBadge = usaEntry.hero_badge_text;
    
    console.log(`\nBadge Text Comparison:`);
    console.log(`   Base: "${baseBadge}"`);
    console.log(`   India: "${indBadge}"`);
    console.log(`   USA: "${usaBadge}"`);
    
    if (baseBadge === indBadge && baseBadge === usaBadge) {
      console.log(`\n⚠️  ALL VARIANTS HAVE THE SAME CONTENT!`);
      console.log(`   This means either:`);
      console.log(`   1. Variants are not set up in Contentstack Personalize`);
      console.log(`   2. Variant UIDs are incorrect`);
      console.log(`   3. Variants have not been published`);
    } else {
      console.log(`\n✓ Variants have different content - working correctly!`);
    }
  }
  
  // List variants from Management API
  await listAvailableVariants();
  
  console.log("\n=============================================");
  console.log("  Done!");
  console.log("=============================================");
}

main().catch(console.error);
