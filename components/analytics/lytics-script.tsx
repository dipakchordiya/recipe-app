"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Environment variables
const LYTICS_ACCOUNT_ID = process.env.NEXT_PUBLIC_LYTICS_ACCOUNT_ID || "1748c1c6477f791602278b9737df4f9f";

declare global {
  interface Window {
    jstag: {
      init: (config: { src: string; [key: string]: unknown }) => void;
      send: (event: string, data?: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
      pageView: (data?: Record<string, unknown>) => void;
      mock: (enabled: boolean) => void;
      getid: () => string | null;
      setid: (id: string) => void;
      loadEntity: (entity: string, callback: (data: unknown) => void) => void;
      getEntity: (entity: string) => unknown;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      once: (event: string, callback: (...args: unknown[]) => void) => void;
      call: (method: string, ...args: unknown[]) => void;
      config?: Record<string, unknown>;
    };
  }
}

export function LyticsScript() {
  const pathname = usePathname();

  // Track page views on route change
  useEffect(() => {
    if (typeof window !== "undefined" && window.jstag && window.jstag.pageView) {
      // Send page view with current path
      window.jstag.pageView({
        path: pathname,
        url: window.location.href,
        title: document.title,
      });
      console.log("📄 Lytics pageView:", pathname);
    }
  }, [pathname]);

  if (!LYTICS_ACCOUNT_ID) {
    console.warn("⚠ Lytics Account ID not configured");
    return null;
  }

  return (
    <Script
      id="lytics-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(){"use strict";var o=window.jstag||(window.jstag={}),r=[];function n(e){o[e]=function(){for(var n=arguments.length,t=new Array(n),i=0;i<n;i++)t[i]=arguments[i];r.push([e,t])}}n("send"),n("mock"),n("identify"),n("pageView"),n("unblock"),n("getid"),n("setid"),n("loadEntity"),n("getEntity"),n("on"),n("once"),n("call"),o.loadScript=function(n,t,i){var e=document.createElement("script");e.async=!0,e.src=n,e.onload=t,e.onerror=i;var o=document.getElementsByTagName("script")[0],r=o&&o.parentNode||document.head||document.body,c=o||r.lastChild;return null!=c?r.insertBefore(e,c):r.appendChild(e),this},o.init=function n(t){return this.config=t,this.loadScript(t.src,function(){if(o.init===n)throw new Error("Load error!");o.init(o.config),function(){for(var n=0;n<r.length;n++){var t=r[n][0],i=r[n][1];o[t].apply(o,i)}r=void 0}()}),this}}();
          
          // Initialize Lytics with account ID
          jstag.init({
            src: 'https://c.lytics.io/api/tag/${LYTICS_ACCOUNT_ID}/latest.min.js'
          });
          
          // Send initial page view
          jstag.pageView();
          
          console.log('✓ Lytics initialized with account: ${LYTICS_ACCOUNT_ID}');
        `,
      }}
    />
  );
}
