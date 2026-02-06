// Server-only utilities for Contentstack
// This file should only be imported in Server Components

import "server-only";
import { headers } from "next/headers";
import Contentstack from "contentstack";

// Environment variables
const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "blt837255d7d0d157c5";
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || "csa52919b532dbef272dbc1ecb";
const PREVIEW_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN || "csa579886b7d276434aea1cb92";
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || "development";

// Content Type UIDs
export const CONTENT_TYPES = {
  RECIPE: "recipe",
  AUTHOR: "author",
  CATEGORY: "category",
  HEADER: "header",
  FOOTER: "footer",
  HOME_PAGE: "home_page",
} as const;

// Create a Stack configured for the current request
export async function getStack() {
  // Stack configuration with live preview
  const stackConfig: Contentstack.Config = {
    api_key: API_KEY,
    delivery_token: DELIVERY_TOKEN,
    environment: ENVIRONMENT,
    region: Contentstack.Region.US,
    live_preview: {
      enable: true,
      preview_token: PREVIEW_TOKEN,
      host: "rest-preview.contentstack.com",
    },
  };

  const Stack = Contentstack.Stack(stackConfig);

  // Configure for Live Preview if hash is present in request
  try {
    const headersList = await headers();
    const fullUrl = headersList.get("x-url") || headersList.get("referer") || "";
    
    let livePreviewHash: string | null = null;
    let contentTypeUid: string | null = null;
    let entryUid: string | null = null;

    if (fullUrl) {
      try {
        const url = new URL(fullUrl);
        livePreviewHash = url.searchParams.get("live_preview");
        contentTypeUid = url.searchParams.get("content_type_uid");
        entryUid = url.searchParams.get("entry_uid");
      } catch {
        // Invalid URL, skip
      }
    }

    if (livePreviewHash) {
      Stack.livePreviewQuery({
        live_preview: livePreviewHash,
        content_type_uid: contentTypeUid || "",
        preview_timestamp: "",
        release_id: "",
      });
      console.log("🔴 [Server] Live Preview Query configured:", { 
        hash: livePreviewHash.substring(0, 10) + "...",
        contentType: contentTypeUid,
        entry: entryUid 
      });
    }
  } catch (error) {
    // Not in a request context, that's OK
    console.log("📦 [Server] Static rendering (no request context)");
  }

  return Stack;
}
