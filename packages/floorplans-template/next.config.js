/** @type {import('next').NextConfig} */
const fs = require("fs");
const path = require("path");

function getDefaultSiteConfig() {
  try {
    const configPath = path.join(__dirname, "..", "..", "sites.config.json");
    const raw = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.sites) && parsed.sites.length > 0) {
      return parsed.sites[0];
    }
  } catch (error) {
    // Fallback to env values only if config file isn't available.
  }
  return null;
}

const defaultSite = getDefaultSiteConfig();
const siteId = process.env.SITE_ID || defaultSite?.id || "";
const siteName = process.env.SITE_NAME || defaultSite?.name || "";
const siteBasePath = process.env.SITE_BASE_PATH || defaultSite?.basePath || "";
const strapiApiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  process.env.STRAPI_API_URL ||
  defaultSite?.strapiEndpoint ||
  "";
// In development mode (when SITE_BASE_PATH is not set), don't use basePath
// In production builds, use the configured basePath
const isDev = process.env.NODE_ENV !== "production" && !siteBasePath;
const basePath = isDev
  ? ""
  : siteBasePath
  ? `${siteBasePath}/floorplans`
  : "/floorplans";

const nextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    SITE_ID: siteId,
    SITE_NAME: siteName,
    SITE_BASE_PATH: siteBasePath,
    WEBSITE_URL: siteBasePath || "/",
    FLOORPLANS_DATA: process.env.FLOORPLANS_DATA || "",
    UNITS_SITE_ID:
      process.env.UNITS_SITE_ID || defaultSite?.unitsSiteId || "p1526057",
    NEXT_PUBLIC_STRAPI_API_URL: strapiApiUrl,
    STRAPI_API_URL: strapiApiUrl,
    // Brand tokens
    BRAND_PRIMARY_COLOR:
      process.env.BRAND_PRIMARY_COLOR ||
      defaultSite?.brand?.primaryColor ||
      "#667eea",
    BRAND_SECONDARY_COLOR:
      process.env.BRAND_SECONDARY_COLOR ||
      defaultSite?.brand?.secondaryColor ||
      "#764ba2",
    BRAND_ACCENT_COLOR:
      process.env.BRAND_ACCENT_COLOR || defaultSite?.brand?.accentColor || "#f093fb",
    BRAND_HEADER_BG:
      process.env.BRAND_HEADER_BG || defaultSite?.brand?.headerBg || "#ffffff",
    BRAND_HEADER_TEXT:
      process.env.BRAND_HEADER_TEXT || defaultSite?.brand?.headerText || "#333333",
    BRAND_FONT_FAMILY:
      process.env.BRAND_FONT_FAMILY ||
      defaultSite?.brand?.fontFamily ||
      "system-ui, -apple-system, sans-serif",
  },
};

module.exports = nextConfig;
