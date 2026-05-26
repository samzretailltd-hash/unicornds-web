"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * Reddit Pixel — tracks page visits + fires conversion events
 * 
 * Events fired:
 * - PageVisit: every page load (automatic)
 * - SignUp: when user lands on /dashboard (completed signup)
 * - Purchase: when user lands on /dashboard/billing (completed payment)
 * - Lead: when user lands on /download (downloaded extension)
 */
export function RedditPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).rdt) return;

    const rdt = (window as any).rdt;

    // Track page visit on every route change
    rdt("track", "PageVisit");

    // Fire conversion events based on page
    if (pathname === "/dashboard") {
      rdt("track", "SignUp");
    } else if (pathname === "/dashboard/billing") {
      rdt("track", "Purchase");
    } else if (pathname === "/download") {
      rdt("track", "Lead");
    }
  }, [pathname]);

  return (
    <Script
      id="reddit-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=a2_j2pbmldjdvwr";t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
          rdt('init','a2_j2pbmldjdvwr');
          rdt('track', 'PageVisit');
        `,
      }}
    />
  );
}
