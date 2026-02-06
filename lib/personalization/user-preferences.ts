"use client";

import { useState, useEffect, useCallback } from "react";

export type CuisinePreference = "indian" | "american" | "default";

const PREFERENCE_KEY = "recipe_cuisine_preference";
const CLICK_HISTORY_KEY = "recipe_click_history";

interface ClickHistory {
  indian: number;
  american: number;
  lastUpdated: number;
}

// Get stored preference
export function getStoredPreference(): CuisinePreference {
  if (typeof window === "undefined") return "default";
  return (localStorage.getItem(PREFERENCE_KEY) as CuisinePreference) || "default";
}

// Set preference
export function setStoredPreference(preference: CuisinePreference) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFERENCE_KEY, preference);
}

// Get click history
function getClickHistory(): ClickHistory {
  if (typeof window === "undefined") return { indian: 0, american: 0, lastUpdated: 0 };
  try {
    const stored = localStorage.getItem(CLICK_HISTORY_KEY);
    return stored ? JSON.parse(stored) : { indian: 0, american: 0, lastUpdated: 0 };
  } catch {
    return { indian: 0, american: 0, lastUpdated: 0 };
  }
}

// Update click history
function updateClickHistory(cuisine: "indian" | "american") {
  if (typeof window === "undefined") return;
  const history = getClickHistory();
  history[cuisine]++;
  history.lastUpdated = Date.now();
  localStorage.setItem(CLICK_HISTORY_KEY, JSON.stringify(history));
}

// Determine preference based on click history
function determinePreference(): CuisinePreference {
  const history = getClickHistory();
  const threshold = 2; // Minimum clicks to establish preference
  
  if (history.indian >= threshold && history.indian > history.american) {
    return "indian";
  }
  if (history.american >= threshold && history.american > history.indian) {
    return "american";
  }
  return "default";
}

// Hook for user cuisine preferences
export function useUserCuisinePreference() {
  const [preference, setPreference] = useState<CuisinePreference>("default");
  const [clickHistory, setClickHistory] = useState<ClickHistory>({ indian: 0, american: 0, lastUpdated: 0 });

  // Load preference on mount
  useEffect(() => {
    const stored = getStoredPreference();
    const history = getClickHistory();
    const determined = determinePreference();
    
    // Use stored preference if set, otherwise use determined
    setPreference(stored !== "default" ? stored : determined);
    setClickHistory(history);
  }, []);

  // Track a click on a cuisine type
  const trackClick = useCallback((cuisine: "indian" | "american") => {
    updateClickHistory(cuisine);
    const newHistory = getClickHistory();
    setClickHistory(newHistory);
    
    // Update preference based on new history
    const newPreference = determinePreference();
    if (newPreference !== "default") {
      setPreference(newPreference);
      setStoredPreference(newPreference);
    }
    
    console.log(`📊 Tracked ${cuisine} click. History:`, newHistory);
  }, []);

  // Manually set preference
  const setManualPreference = useCallback((pref: CuisinePreference) => {
    setPreference(pref);
    setStoredPreference(pref);
  }, []);

  // Reset preferences
  const resetPreference = useCallback(() => {
    setPreference("default");
    setStoredPreference("default");
    if (typeof window !== "undefined") {
      localStorage.removeItem(CLICK_HISTORY_KEY);
    }
    setClickHistory({ indian: 0, american: 0, lastUpdated: 0 });
  }, []);

  return {
    preference,
    clickHistory,
    trackClick,
    setManualPreference,
    resetPreference,
  };
}

// Helper to detect cuisine from recipe/category
export function detectCuisineFromTags(tags: string[] | null): "indian" | "american" | null {
  if (!tags) return null;
  const lowerTags = tags.map(t => t.toLowerCase());
  
  if (lowerTags.some(t => ["indian", "curry", "biryani", "masala", "paneer", "naan", "dosa"].includes(t))) {
    return "indian";
  }
  if (lowerTags.some(t => ["american", "burger", "bbq", "comfort-food", "pie", "mac"].includes(t))) {
    return "american";
  }
  return null;
}

export function detectCuisineFromCategory(category: string | null): "indian" | "american" | null {
  if (!category) return null;
  const lower = category.toLowerCase();
  
  if (lower.includes("indian")) return "indian";
  if (lower.includes("american")) return "american";
  return null;
}
