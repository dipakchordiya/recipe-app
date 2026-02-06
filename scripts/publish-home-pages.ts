/**
 * Publish Home Page variants
 */

import contentstack from "@contentstack/management";

const API_KEY = "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = "cs4b3b60b8ac28532fc37fbe37";
const ENVIRONMENT = "development";

const client = contentstack.client();
const stack = client.stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN });

async function publishAllHomePages() {
  console.log("🔍 Finding Home Page entries...\n");

  try {
    const entries = await stack
      .contentType("home_page")
      .entry()
      .query()
      .find();

    console.log(`Found ${entries.items.length} Home Page entries:\n`);

    for (const entry of entries.items) {
      console.log(`📝 ${entry.title} (UID: ${entry.uid})`);
      
      try {
        // Get the entry and publish it
        const entryToPublish = await stack
          .contentType("home_page")
          .entry(entry.uid)
          .fetch();
        
        await entryToPublish.publish({
          publishDetails: {
            environments: [ENVIRONMENT],
            locales: ["en-us"],
          },
        });
        console.log(`   ✓ Published to ${ENVIRONMENT}`);
      } catch (pubError: any) {
        if (pubError.message?.includes("already published")) {
          console.log(`   ✓ Already published`);
        } else {
          console.log(`   ⚠ ${pubError.message || pubError}`);
        }
      }
    }

    console.log("\n✅ All Home Page entries processed!");
  } catch (error: any) {
    console.error("Error:", error.message || error);
  }
}

publishAllHomePages();
