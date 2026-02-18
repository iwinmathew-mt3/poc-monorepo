import { Footer, Header } from "@repo/shared/components";
import type { FooterData, HeaderData } from "@repo/shared/components";
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
    /<div[^>]*class="[^"]*modern-container[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<!--\s*JavaScript\s*-->\s*)?<script[^>]*>/i,
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

function buildGlobalUrl(): string {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || process.env.STRAPI_API_URL || "";
  const normalizedBaseUrl = rawBaseUrl.endsWith("/api")
    ? `${rawBaseUrl}/`
    : rawBaseUrl.endsWith("/api/")
      ? rawBaseUrl
      : `${rawBaseUrl}/api/`;
  const url = new URL("global", normalizedBaseUrl);
  const params = new URLSearchParams({
    "populate[header][populate][0]": "cta",
    "populate[header][populate][1]": "logo",
    "populate[header][populate][2]": "menuList",
    "populate[footer][populate][0]": "cta",
    "populate[footer][populate][1]": "propertyLogo",
    "populate[footer][populate][2]": "bozzutoLogo",
    "populate[footer][populate][3]": "address",
    "populate[footer][populate][4]": "officeHours",
    "populate[footer][populate][5]": "retailLeasingOpportunities",
  });
  url.search = params.toString();
  return url.toString();
}

type GlobalData = {
  header?: HeaderData | null;
  footer?: FooterData | null;
};

async function fetchGlobalData(): Promise<GlobalData | null> {
  try {
    const response = await fetch(buildGlobalUrl(), {
      cache: "force-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
          process.env.STRAPI_API_TOKEN ||
          ""
        }`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch global header: ${response.status}`);
    }

    const json = (await response.json()) as {
      data?: { header?: HeaderData | null; footer?: FooterData | null };
    };
    return json?.data ?? null;
  } catch (error) {
    console.error("Error fetching global header:", error);
    return null;
  }
}

export default async function FloorplansPage() {
  const siteName = process.env.SITE_NAME || "Property";
  const websiteUrl = process.env.WEBSITE_URL || "/";
  const floorplansSiteId = process.env.FLOORPLANS_SITE_ID || "";
  const globalData = await fetchGlobalData();

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
        header={globalData?.header}
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
      <Footer footer={globalData?.footer} />
    </>
  );
}
