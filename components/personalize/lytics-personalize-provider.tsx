"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { identifyUser, isLyticsLoaded } from "@/lib/lytics/client";
import { syncLyticsToPersonalize } from "@/lib/lytics/lytics-personalize-connector";
import { initPersonalize, setUserAttributes } from "@/lib/contentstack/personalize";

interface LyticsPersonalizeContextType {
  isReady: boolean;
  location: {
    country: string;
    countryCode: string;
    city: string;
  } | null;
  userId: string | null;
  identify: (userData: { email?: string; name?: string; [key: string]: unknown }) => void;
}

const LyticsPersonalizeContext = createContext<LyticsPersonalizeContextType>({
  isReady: false,
  location: null,
  userId: null,
  identify: () => {},
});

export function useLyticsPersonalize() {
  return useContext(LyticsPersonalizeContext);
}

interface ProviderProps {
  children: ReactNode;
  lyticsAccountId?: string;
}

export function LyticsPersonalizeProvider({ children, lyticsAccountId }: ProviderProps) {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [location, setLocation] = useState<LyticsPersonalizeContextType["location"]>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize Personalize on mount (Lytics is initialized via LyticsScript in layout)
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        // Initialize Personalize (wrapped in try-catch)
        try {
          await initPersonalize();
          console.log("✓ Personalize initialized");
        } catch (e) {
          console.warn("Personalize initialization failed:", e);
        }

        // Detect and sync location (non-blocking)
        detectAndSyncLocation()
          .then((detectedLocation) => {
            if (isMounted && detectedLocation) {
              setLocation(detectedLocation);
            }
          })
          .catch((e) => {
            console.warn("Location detection error:", e);
          });

        // Sync Lytics data to Personalize (Lytics script handles its own init)
        // Wait a bit for Lytics to be ready
        setTimeout(async () => {
          if (isMounted && isLyticsLoaded()) {
            try {
              await syncLyticsToPersonalize();
              console.log("✓ Lytics synced to Personalize");
            } catch (e) {
              console.warn("Lytics sync failed:", e);
            }
          }
        }, 2000);

        if (isMounted) {
          setIsReady(true);
          console.log("✓ Personalize ready");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        if (isMounted) {
          setIsReady(true); // Still mark as ready to not block UI
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Page views are now tracked automatically by LyticsScript component

  // Identify user function
  const identify = (userData: { email?: string; name?: string; [key: string]: unknown }) => {
    identifyUser(userData);
    
    // Also send to Personalize
    setUserAttributes({
      email: userData.email,
      name: userData.name,
      ...userData,
    });

    if (userData.email) {
      setUserId(userData.email);
    }
  };

  return (
    <LyticsPersonalizeContext.Provider
      value={{
        isReady,
        location,
        userId,
        identify,
      }}
    >
      {children}
      {/* Location indicator for debugging */}
      {location && process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-20 left-4 z-50 rounded-lg bg-white/90 px-3 py-2 text-xs shadow-lg backdrop-blur dark:bg-stone-900/90">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {location.countryCode === "IN" ? "🇮🇳" : 
               location.countryCode === "US" ? "🇺🇸" : "🌍"}
            </span>
            <div>
              <div className="font-medium">{location.city || location.country}</div>
              <div className="text-stone-500">{location.countryCode}</div>
            </div>
          </div>
        </div>
      )}
    </LyticsPersonalizeContext.Provider>
  );
}

// Helper to detect and sync location with timeout and fallbacks
async function detectAndSyncLocation(): Promise<{
  country: string;
  countryCode: string;
  city: string;
} | null> {
  // Skip location detection in SSR or if fetch is not available
  if (typeof window === "undefined") {
    return null;
  }

  // Try multiple geolocation APIs with fallbacks
  const geoApis = [
    { url: "https://ipapi.co/json/", parser: (data: Record<string, string>) => ({
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "XX",
      city: data.city || "",
    })},
    { url: "https://ip-api.com/json/?fields=country,countryCode,city", parser: (data: Record<string, string>) => ({
      country: data.country || "Unknown",
      countryCode: data.countryCode || "XX",
      city: data.city || "",
    })},
  ];

  for (const api of geoApis) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(api.url, { 
        signal: controller.signal,
        mode: "cors",
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;
      
      const data = await response.json();
      const location = api.parser(data);

      // Send to Personalize
      try {
        await setUserAttributes({
          country: location.country,
          country_code: location.countryCode,
          city: location.city,
          geo_country: location.countryCode,
        });
      } catch (e) {
        console.warn("Failed to set user attributes:", e);
      }

      console.log("✓ Location detected:", location);
      return location;
    } catch (error) {
      // Continue to next API on error
      console.warn(`Geo API ${api.url} failed:`, error);
      continue;
    }
  }

  // All APIs failed - return null but don't block
  console.warn("All location detection APIs failed, continuing without location");
  return null;
}
