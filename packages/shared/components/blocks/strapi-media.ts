export function getStrapiImageUrl(url?: string | null): string {
  if (!url) {
    return "";
  }
  if (url.startsWith("http")) {
    return url;
  }
  const baseUrl =
    (process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337").replace(
      /\/api\/?$/,
      ""
    );
  return `${baseUrl}${url}`;
}

export type StrapiMediaAttributes = {
  url?: string;
  alternativeText?: string | null;
};

export function normalizeStrapiMedia(media: unknown): StrapiMediaAttributes[] {
  if (!media) {
    return [];
  }

  if (Array.isArray(media)) {
    return media
      .map((item) => normalizeStrapiMedia(item))
      .flat()
      .filter(Boolean);
  }

  if (typeof media === "object") {
    const record = media as Record<string, unknown>;
    const data = record.data;

    if (Array.isArray(data)) {
      return data
        .map((item) => normalizeStrapiMedia(item))
        .flat()
        .filter(Boolean);
    }

    if (data && typeof data === "object") {
      return normalizeStrapiMedia(data);
    }

    const attributes = record.attributes;
    if (attributes && typeof attributes === "object") {
      return normalizeStrapiMedia(attributes);
    }

    return [
      {
        url: typeof record.url === "string" ? record.url : undefined,
        alternativeText:
          typeof record.alternativeText === "string" || record.alternativeText === null
            ? (record.alternativeText as string | null)
            : undefined,
      },
    ].filter((item) => item.url);
  }

  return [];
}

