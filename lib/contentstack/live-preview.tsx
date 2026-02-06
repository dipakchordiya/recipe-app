"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ContentstackLivePreview, onLivePreviewChange } from "./client";

// Hook to handle Live Preview updates with real-time refresh
export function useLivePreviewUpdate<T>(
  initialData: T,
  fetchFn: () => Promise<T>
): T {
  const [data, setData] = useState<T>(initialData);
  const searchParams = useSearchParams();
  const livePreviewHash = searchParams.get("live_preview");
  const isFirstRender = useRef(true);

  // Update data when initial data changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setData(initialData);
  }, [initialData]);

  // Subscribe to live preview changes
  useEffect(() => {
    if (!livePreviewHash || typeof window === "undefined") return;

    console.log("🔄 Setting up Live Preview listener...");

    // Fetch fresh data on entry change
    const handleChange = async () => {
      console.log("📝 Content changed, fetching updated data...");
      try {
        const newData = await fetchFn();
        if (newData) {
          setData(newData);
          console.log("✓ Data updated successfully");
        }
      } catch (error) {
        console.error("Failed to fetch updated data:", error);
      }
    };

    // Subscribe to changes
    const unsubscribe = onLivePreviewChange(handleChange);

    // Initial fetch for live preview
    handleChange();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [livePreviewHash, fetchFn]);

  return data;
}

// Hook for Live Preview state
export function useLivePreview() {
  const searchParams = useSearchParams();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    const hash = searchParams.get("live_preview");
    setIsPreviewMode(!!hash);
  }, [searchParams]);

  return { isPreviewMode };
}

// Live Preview Indicator Component
export function LivePreviewIndicator() {
  const { isPreviewMode } = useLivePreview();

  if (!isPreviewMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      Live Preview Active
    </div>
  );
}

// Wrapper component with data-cslp attribute for edit buttons
interface LivePreviewWrapperProps {
  children: React.ReactNode;
  contentTypeUid: string;
  entryUid: string;
}

export function LivePreviewWrapper({
  children,
  contentTypeUid,
  entryUid,
}: LivePreviewWrapperProps) {
  return (
    <div data-cslp={`${contentTypeUid}.${entryUid}`} className="contents">
      {children}
    </div>
  );
}

// Helper to add editable data attributes
export function getEditableProps(
  contentTypeUid: string,
  entryUid: string,
  fieldPath: string
) {
  return {
    "data-cslp": `${contentTypeUid}.${entryUid}.${fieldPath}`,
  };
}

// Helper to create CSLP path
export function cslp(contentTypeUid: string, entryUid: string, fieldPath: string) {
  return `${contentTypeUid}.${entryUid}.${fieldPath}`;
}
