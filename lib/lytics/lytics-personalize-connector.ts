// Lytics to Contentstack Personalize Connector
// This syncs Lytics user attributes to Contentstack Personalize

import { setUserAttributes, setLocationAttributes } from "../contentstack/personalize";
import { isLyticsLoaded, getLyticsUserId } from "./client";

// Fetch user profile from Lytics
async function fetchLyticsProfile(accountId: string): Promise<Record<string, unknown> | null> {
  try {
    const userId = getLyticsUserId();
    if (!userId) return null;

    // Lytics profile API endpoint
    const response = await fetch(
      `https://api.lytics.io/api/entity/user/_uids/${userId}?key=${accountId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) return null;
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Failed to fetch Lytics profile:", error);
    return null;
  }
}

// Sync Lytics segments to Personalize
export async function syncLyticsToPersonalize(): Promise<void> {
  if (typeof window === "undefined") return;
  
  // Wait for Lytics to be ready
  if (!isLyticsLoaded()) {
    console.log("Lytics not loaded yet, skipping sync");
    return;
  }

  try {
    // Get location from Lytics or detect it
    const locationData = await detectLocation();
    
    if (locationData) {
      // Send location to Contentstack Personalize
      await setLocationAttributes({
        country: locationData.country,
        countryCode: locationData.countryCode,
        region: locationData.region,
        city: locationData.city,
      });

      console.log("✓ Synced location to Personalize:", locationData);
    }

    // Get Lytics user ID and sync
    const userId = getLyticsUserId();
    if (userId) {
      await setUserAttributes({
        lytics_user_id: userId,
      });
    }

  } catch (error) {
    console.error("Failed to sync Lytics to Personalize:", error);
  }
}

// Detect user location using IP geolocation
async function detectLocation(): Promise<{
  country: string;
  countryCode: string;
  region: string;
  city: string;
} | null> {
  try {
    // Try multiple geolocation services
    const services = [
      "https://ipapi.co/json/",
      "https://ip-api.com/json/",
    ];

    for (const service of services) {
      try {
        const response = await fetch(service);
        if (!response.ok) continue;
        
        const data = await response.json();
        
        // Handle ipapi.co format
        if (data.country_name) {
          return {
            country: data.country_name,
            countryCode: data.country_code || data.country,
            region: data.region || "",
            city: data.city || "",
          };
        }
        
        // Handle ip-api.com format
        if (data.country) {
          return {
            country: data.country,
            countryCode: data.countryCode,
            region: data.regionName || "",
            city: data.city || "",
          };
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to detect location:", error);
    return null;
  }
}

// Listen for Lytics segment changes
export function onLyticsSegmentChange(callback: (segments: string[]) => void): void {
  if (typeof window === "undefined") return;

  // Poll for segment changes (Lytics doesn't have real-time events)
  let lastSegments: string[] = [];
  
  const checkSegments = async () => {
    try {
      const userId = getLyticsUserId();
      if (!userId) return;

      // Get current segments from Lytics cookie or API
      const segments = getLyticsSegments();
      
      if (JSON.stringify(segments) !== JSON.stringify(lastSegments)) {
        lastSegments = segments;
        callback(segments);
      }
    } catch (error) {
      console.error("Error checking segments:", error);
    }
  };

  // Check every 5 seconds
  setInterval(checkSegments, 5000);
  checkSegments(); // Initial check
}

// Get Lytics segments from cookie
function getLyticsSegments(): string[] {
  if (typeof document === "undefined") return [];
  
  try {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "seerid" || name === "_lc") {
        // Parse Lytics cookie for segment info
        const decoded = decodeURIComponent(value);
        // Extract segments if available
        return [];
      }
    }
  } catch {
    return [];
  }
  
  return [];
}
