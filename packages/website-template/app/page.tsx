import PageContent from "./lib/PageContent";
import fetchContentType, { StrapiData } from "./lib/fetchContentType";

export const revalidate = 3600;
export const dynamic = "force-static";

export default async function Home() {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || process.env.STRAPI_API_URL || "";
  const isFullApiEndpoint =
    /\/api\/.+/.test(rawBaseUrl) && !/\/api\/?$/.test(rawBaseUrl);
  const pageData = (await fetchContentType(
    "pages",
    isFullApiEndpoint
      ? {}
      : {
          filters: {
            Title: { $eq: "HomePage" },
          },
        },
    true,
    false,
  )) as StrapiData;

  if (!pageData) {
    return (
      <main className="mainContainer">
        <h1>Page not found</h1>
      </main>
    );
  }

  return (
    <main className="mainContainer">
      <PageContent pageData={pageData} />
    </main>
  );
}
