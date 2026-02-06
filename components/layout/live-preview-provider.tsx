"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { 
  initLivePreview, 
  debugLivePreview,
  ContentstackLivePreview,
} from "@/lib/contentstack/client";

function LivePreviewInit() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  const livePreviewHash = searchParams.get("live_preview");
  const contentTypeUid = searchParams.get("content_type_uid");
  const entryUid = searchParams.get("entry_uid");

  // Initialize Live Preview SDK
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    initLivePreview();
    setIsInitialized(true);

    // Debug in development
    if (process.env.NODE_ENV === "development" && livePreviewHash) {
      debugLivePreview();
    }
  }, [livePreviewHash]);

  // Handle live preview content changes
  useEffect(() => {
    if (!isInitialized || !livePreviewHash) return;

    console.log("🔴 Live Preview Mode Active:", {
      hash: livePreviewHash,
      contentType: contentTypeUid,
      entry: entryUid,
      path: pathname,
    });

    // Subscribe to entry changes
    const handleEntryChange = () => {
      console.log("📝 Content changed in Contentstack, refreshing page...");
      // Use router.refresh() to re-fetch server components with new data
      router.refresh();
    };

    // Set up the listener
    ContentstackLivePreview.onEntryChange(handleEntryChange);

    return () => {
      // Cleanup handled by the SDK
    };
  }, [isInitialized, livePreviewHash, contentTypeUid, entryUid, pathname, router]);

  return null;
}

function LivePreviewBadge() {
  const searchParams = useSearchParams();
  const livePreviewHash = searchParams.get("live_preview");

  if (!livePreviewHash) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-xl">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
      </span>
      Live Preview
    </div>
  );
}

export function LivePreviewProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <LivePreviewInit />
        <LivePreviewBadge />
      </Suspense>
      {children}
    </>
  );
}
