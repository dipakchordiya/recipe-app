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
    async function init() {
      try {
        // Initialize Personalize
        await initPersonalize();
        console.log("✓ Personalize initialized");

        // Detect and sync location
        const detectedLocation = await detectAndSyncLocation();
        if (detectedLocation) {
          setLocation(detectedLocation);
        }

        // Sync Lytics data to Personalize (Lytics script handles its own init)
        // Wait a bit for Lytics to be ready
        setTimeout(async () => {
          if (isLyticsLoaded()) {
            await syncLyticsToPersonalize();
            console.log("✓ Lytics synced to Personalize");
          }
        }, 2000);

        setIsReady(true);
        console.log("✓ Personalize ready");
      } catch (error) {
        console.error("Initialization error:", error);
        setIsReady(true); // Still mark as ready to not block UI
      }
    }

    init();
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

// Helper to detect and sync location
async function detectAndSyncLocation(): Promise<{
  country: string;
  countryCode: string;
  city: string;
} | null> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) return null;
    
    const data = await response.json();
    
    const location = {
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "XX",
      city: data.city || "",
    };

    // Send to Personalize
    await setUserAttributes({
      country: location.country,
      country_code: location.countryCode,
      city: location.city,
      geo_country: location.countryCode,
    });

    return location;
  } catch (error) {
    console.error("Location detection failed:", error);
    return null;
  }
}
