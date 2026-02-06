"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  initPersonalizationWithLocation,
  getExperienceVariant,
  getAllVariants,
  EXPERIENCES,
  VARIANTS,
} from "@/lib/contentstack/personalize";

interface PersonalizeContextType {
  isInitialized: boolean;
  location: {
    country: string;
    countryCode: string;
    region: string;
    city: string;
  } | null;
  variants: Record<string, string>;
  getVariant: (experienceId: string) => string | null;
  isIndianUser: boolean;
  isAmericanUser: boolean;
}

const PersonalizeContext = createContext<PersonalizeContextType>({
  isInitialized: false,
  location: null,
  variants: {},
  getVariant: () => null,
  isIndianUser: false,
  isAmericanUser: false,
});

export function usePersonalize() {
  return useContext(PersonalizeContext);
}

interface PersonalizeProviderProps {
  children: ReactNode;
}

export function PersonalizeProvider({ children }: PersonalizeProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [location, setLocation] = useState<PersonalizeContextType["location"]>(null);
  const [variants, setVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    async function init() {
      try {
        // Initialize Personalize with location detection
        const detectedLocation = await initPersonalizationWithLocation();
        
        if (detectedLocation) {
          setLocation(detectedLocation);
        }

        // Get all variants for experiences
        const allVariants = await getAllVariants();
        setVariants(allVariants);

        setIsInitialized(true);
        console.log("✓ Personalize Provider initialized");
      } catch (error) {
        console.error("Personalize initialization error:", error);
        setIsInitialized(true); // Still mark as initialized to not block rendering
      }
    }

    init();
  }, []);

  const getVariant = (experienceId: string): string | null => {
    return variants[experienceId] || null;
  };

  // Helper flags for location-based logic
  const isIndianUser = location?.countryCode === "IN";
  const isAmericanUser = location?.countryCode === "US";

  return (
    <PersonalizeContext.Provider
      value={{
        isInitialized,
        location,
        variants,
        getVariant,
        isIndianUser,
        isAmericanUser,
      }}
    >
      {children}
    </PersonalizeContext.Provider>
  );
}

// Hook to get personalized content based on location
export function useLocationBasedContent<T>(
  defaultContent: T,
  indianContent: T,
  americanContent: T
): T {
  const { isIndianUser, isAmericanUser, isInitialized } = usePersonalize();

  if (!isInitialized) {
    return defaultContent;
  }

  if (isIndianUser) {
    return indianContent;
  }

  if (isAmericanUser) {
    return americanContent;
  }

  return defaultContent;
}

// Export experience and variant constants
export { EXPERIENCES, VARIANTS };
