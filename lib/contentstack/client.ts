// Client-side Contentstack utilities
// This file can be safely imported in both client and server components

import Contentstack from "contentstack";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

// Environment variables
const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "blt837255d7d0d157c5";
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || "csa52919b532dbef272dbc1ecb";
const PREVIEW_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN || "csa579886b7d276434aea1cb92";
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || "development";
const LIVE_PREVIEW_ENABLED = process.env.NEXT_PUBLIC_CONTENTSTACK_LIVE_PREVIEW !== "false";

// Stack configuration
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

// Initialize Contentstack SDK
const Stack = Contentstack.Stack(stackConfig);

// Track initialization
let isLivePreviewInitialized = false;

// Initialize Live Preview SDK (client-side only)
export function initLivePreview() {
  if (typeof window === "undefined" || isLivePreviewInitialized) {
    return;
  }

  try {
    // Get live preview params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const livePreviewHash = urlParams.get("live_preview");
    const contentTypeUid = urlParams.get("content_type_uid");
    const entryUid = urlParams.get("entry_uid");

    // Configure stack for live preview if hash is present
    if (livePreviewHash) {
      Stack.livePreviewQuery({
        live_preview: livePreviewHash,
        content_type_uid: contentTypeUid || "",
        preview_timestamp: "",
        release_id: "",
      });
      console.log("✓ [Client] Live Preview Query configured");
    }

    // Initialize the Live Preview SDK
    ContentstackLivePreview.init({
      ssr: true, // Enable SSR mode - triggers page refresh on changes
      enable: LIVE_PREVIEW_ENABLED,
      stackSdk: Stack,
      stackDetails: {
        apiKey: API_KEY,
        environment: ENVIRONMENT,
      },
      clientUrlParams: {
        protocol: "https",
        host: "app.contentstack.com",
        port: 443,
      },
      editButton: {
        enable: true,
      },
    });
    
    isLivePreviewInitialized = true;
    console.log("✓ [Client] Contentstack Live Preview SDK initialized");
  } catch (error) {
    console.error("[Client] Failed to initialize Live Preview:", error);
  }
}

// Subscribe to live preview changes
export function onLivePreviewChange(callback: () => void): void {
  if (typeof window === "undefined") return;
  ContentstackLivePreview.onEntryChange(callback);
}

// Get live preview hash from URL
export function getLivePreviewHash(): string | null {
  if (typeof window === "undefined") return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("live_preview");
}

// Check if in live preview mode
export function isInLivePreviewMode(): boolean {
  return !!getLivePreviewHash();
}

// Debug helper
export function debugLivePreview() {
  if (typeof window === "undefined") return;
  const urlParams = new URLSearchParams(window.location.search);
  console.log("=== Live Preview Debug ===");
  console.log("API Key:", API_KEY);
  console.log("Preview Token:", PREVIEW_TOKEN ? "✓ Set" : "✗ Missing");
  console.log("Hash:", urlParams.get("live_preview") || "N/A");
  console.log("Content Type:", urlParams.get("content_type_uid") || "N/A");
  console.log("Entry UID:", urlParams.get("entry_uid") || "N/A");
  console.log("URL:", window.location.href);
  console.log("==========================");
}

// Content Type UIDs
export const CONTENT_TYPES = {
  RECIPE: "recipe",
  AUTHOR: "author",
  CATEGORY: "category",
  HEADER: "header",
  FOOTER: "footer",
  HOME_PAGE: "home_page",
} as const;

export default Stack;
export { ContentstackLivePreview };
