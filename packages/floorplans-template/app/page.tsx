import { Header } from "@repo/shared/components";
import { FloorplansContent } from "./FloorplansContent";

const floorplansBaseUrl =
  "https://bozzuto-floorplans-dev.s3.us-east-1.amazonaws.com";

async function fetchFloorplansHtml(siteId: string): Promise<string> {
  const floorplansUrl = `${floorplansBaseUrl}/${siteId}/floorplans.html`;

  try {
    console.info("Fetching floorplans HTML:", floorplansUrl);
    const response = await fetch(floorplansUrl, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch floorplans: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error fetching floorplans HTML:", error);
    return `
      <div class="no-results">
        <h3>Unable to load floor plans</h3>
        <p>Please try again later or contact support if the problem persists.</p>
      </div>
    `;
  }
}

function extractContentFromHtml(html: string): string {
  const modernContainerMatch = html.match(
    /<div[^>]*class="[^"]*modern-container[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<!--\s*JavaScript\s*-->\s*)?<script[^>]*>/i
  );
  if (modernContainerMatch) {
    return modernContainerMatch[1];
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    return bodyMatch[1];
  }

  return html;
}

export default async function FloorplansPage() {
  const siteName = process.env.SITE_NAME || "Property";
  const websiteUrl = process.env.WEBSITE_URL || "/";
  const basePath = process.env.SITE_BASE_PATH || "";
  const floorplansSiteId =
    process.env.FLOORPLANS_SITE_ID || process.env.SITE_ID || "p1526057";

  let htmlContent = "";

  try {
    const fullHtml = await fetchFloorplansHtml(floorplansSiteId);
    htmlContent = extractContentFromHtml(fullHtml);
  } catch (error: any) {
    htmlContent = `
      <div class="no-results">
        <h3>Unable to load floor plans</h3>
        <p>${error?.message || "Unknown error"}</p>
      </div>
    `;
  }

  return (
    <>
      <Header
        siteName={siteName}
        websiteUrl={websiteUrl}
        floorplansUrl={basePath ? `${basePath}/floorplans` : "/floorplans"}
        currentPage="floorplans"
      />
      <main>
        <h1>Available Floorplans</h1>
        <p>Choose from our selection of thoughtfully designed floor plans.</p>

        <div className="modern-container">
          <FloorplansContent
            htmlContent={htmlContent}
            floorplansBaseUrl={floorplansBaseUrl}
          />
        </div>
      </main>
    </>
  );
}
