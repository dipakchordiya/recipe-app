/**
 * Verify Home Page entries in Contentstack
 */

import contentstack from "@contentstack/management";

const API_KEY = "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = "cs4b3b60b8ac28532fc37fbe37";

const client = contentstack.client();
const stack = client.stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN });

async function verify() {
  console.log("🔍 Checking Home Page entries...\n");

  try {
    const entries = await stack
      .contentType("home_page")
      .entry()
      .query()
      .find();

    console.log(`Found ${entries.items.length} Home Page entries:\n`);

    for (const entry of entries.items) {
      console.log(`📄 ${entry.title || "(no title)"}`);
      console.log(`   UID: ${entry.uid}`);
      console.log(`   Hero: ${entry.hero_headline || "(not set)"} ${entry.hero_highlight_text || ""}`);
      console.log(`   Badge: ${entry.hero_badge_text || "(not set)"}`);
      console.log("");
    }

  } catch (error: any) {
    console.error("Error:", error.message || error);
  }
}

verify();
