/**
 * Update Home Page Content Type to allow multiple entries
 */

import contentstack from "@contentstack/management";

const API_KEY = "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = "cs4b3b60b8ac28532fc37fbe37";

const client = contentstack.client();
const stack = client.stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN });

async function updateContentType() {
  console.log("🔧 Updating Home Page content type...\n");

  try {
    const contentType = await stack.contentType("home_page").fetch();
    
    console.log(`Current settings:`);
    console.log(`  - Title: ${contentType.title}`);
    console.log(`  - Singleton: ${contentType.options?.singleton || false}`);
    
    // Update to allow multiple entries
    contentType.options = {
      ...contentType.options,
      singleton: false,
    };
    
    await contentType.update();
    
    console.log(`\n✅ Content type updated!`);
    console.log(`  - Singleton: false (now allows multiple entries)`);
    
  } catch (error: any) {
    console.error("Error:", error.message || error);
  }
}

updateContentType();
