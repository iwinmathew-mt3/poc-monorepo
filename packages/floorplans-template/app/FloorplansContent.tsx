"use client";

import { useEffect } from "react";

interface FloorplansContentProps {
  htmlContent: string;
  floorplansBaseUrl: string;
}

export function FloorplansContent({
  htmlContent,
  floorplansBaseUrl,
}: FloorplansContentProps) {
  useEffect(() => {
    const stylesheetHref = `${floorplansBaseUrl}/assets/floorplan_modern.css`;
    const existingStylesheet = document.querySelector(
      `link[href*="floorplan_modern.css"]`
    );
    if (!existingStylesheet) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = stylesheetHref;
      document.head.appendChild(link);
    }

    const scriptSrc = `${floorplansBaseUrl}/assets/script.js`;
    const existingScript = document.querySelector(
      'script[src*="assets/script.js"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      const scriptToRemove = document.querySelector(
        'script[src*="assets/script.js"]'
      );
      if (scriptToRemove && scriptToRemove !== existingScript) {
        scriptToRemove.remove();
      }
    };
  }, [floorplansBaseUrl, htmlContent]);

  return (
    <div
      id="floorplans-content"
      className="floorplans-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}



