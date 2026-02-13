import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "@repo/shared/components";
import type { FooterData, HeaderData } from "@repo/shared/components";
import fetchContentType, { StrapiData } from "./lib/fetchContentType";

export const metadata: Metadata = {
  title: process.env.SITE_NAME || "Property Website",
  description: `Welcome to ${process.env.SITE_NAME || "our property"}`,
};

// Inject brand CSS variables as inline styles
function getBrandStyles(): React.CSSProperties {
  return {
    "--brand-primary": process.env.BRAND_PRIMARY_COLOR || "#667eea",
    "--brand-secondary": process.env.BRAND_SECONDARY_COLOR || "#764ba2",
    "--brand-accent": process.env.BRAND_ACCENT_COLOR || "#f093fb",
    "--brand-header-bg": process.env.BRAND_HEADER_BG || "#ffffff",
    "--brand-header-text": process.env.BRAND_HEADER_TEXT || "#333333",
    "--brand-header-button-bg": process.env.BRAND_HEADER_BUTTON_BG || "#000000",
    "--brand-header-button-text":
      process.env.BRAND_HEADER_BUTTON_TEXT || "#ffffff",
    "--brand-font-family":
      process.env.BRAND_FONT_FAMILY || "system-ui, -apple-system, sans-serif",
  } as React.CSSProperties;
}

const siteName = process.env.SITE_NAME || "Property Website";
const floorplansUrl = process.env.FLOORPLANS_URL || "/floorplans";
const basePath = process.env.SITE_BASE_PATH || "http://localhost:3000";

type GlobalData = {
  footer?: FooterData | null;
  header?: HeaderData | null;
};

async function getGlobalData(): Promise<GlobalData | null> {
  const response = (await fetchContentType(
    "global",
    {
      populate: {
        header: {
          populate: ["cta", "logo", "menuList"],
        },
        footer: {
          populate: [
            "cta",
            "propertyLogo",
            "bozzutoLogo",
            "address",
            "officeHours",
            "retailLeasingOpportunities",
          ],
        },
      },
    },
    true,
    false,
  )) as StrapiData | null;

  return (response as GlobalData | null) ?? null;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalData = await getGlobalData();

  return (
    <html lang="en" style={getBrandStyles()}>
      <body>
        <Header
          siteName={siteName}
          websiteUrl={basePath || "/"}
          header={globalData?.header}
        />
        {children}
        <Footer footer={globalData?.footer} />
      </body>
    </html>
  );
}
