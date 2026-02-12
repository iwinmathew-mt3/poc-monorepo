import { notFound } from "next/navigation";
import PageContent from "../lib/PageContent";
import fetchContentType, { StrapiData } from "../lib/fetchContentType";

export const revalidate = 3600;
export const dynamic = "force-static";

type PageParams = {
  slug?: string[];
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toSlugSegments(title: string): string[] {
  return title
    .split("/")
    .map((segment) => slugify(segment))
    .filter(Boolean);
}

function toTitleCase(value: string): string {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const response = (await fetchContentType(
    "pages",
    {
      fields: ["Title"],
      pagination: { pageSize: 100 },
    },
    false,
    false,
  )) as { data?: StrapiData[] } | null;

  if (!response?.data || !Array.isArray(response.data)) {
    return [];
  }

  const excludedTitles = new Set(["floorplans"]);

  return response.data
    .map((page) => {
      const record = page as {
        Title?: string;
        attributes?: { Title?: string };
      };
      return String(record?.Title ?? record?.attributes?.Title ?? "");
    })
    .filter((title) => title && !excludedTitles.has(title.toLowerCase()))
    .map((title) => ({
      slug: toSlugSegments(title),
    }))
    .filter((item) => item.slug.length > 0);
}

export default async function DynamicPage({ params }: { params: PageParams }) {
  const segments = (params.slug ?? []).map((segment) =>
    decodeURIComponent(segment),
  );
  const slug = segments.join("/");
  const title = toTitleCase(slug);

  const pageData = (await fetchContentType(
    "pages",
    {
      filters: {
        Title: { $eqi: title },
      },
    },
    true,
    false,
  )) as StrapiData;

  if (!pageData) {
    notFound();
  }

  return (
    <main className="mainContainer">
      <PageContent pageData={pageData} />
    </main>
  );
}
