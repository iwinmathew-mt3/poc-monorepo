export interface StrapiData {
  id: number;
  [key: string]: unknown;
}

interface StrapiResponse {
  data: StrapiData | StrapiData[];
}

export function spreadStrapiData(data: StrapiResponse): StrapiData | null {
  if (Array.isArray(data.data) && data.data.length > 0) {
    return data.data[0];
  }
  if (!Array.isArray(data.data)) {
    return data.data;
  }
  return null;
}

export default async function fetchContentType(
  contentType: string,
  params: Record<string, unknown> = {},
  spreadData?: boolean,
  isDraftMode?: boolean
): Promise<StrapiResponse | StrapiData | null | undefined> {
  try {
    const queryParams = { ...params };

    if (isDraftMode) {
      queryParams.status = 'draft';
    }

    const rawBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL ||
      process.env.STRAPI_API_URL ||
      'http://localhost:1337';
    const isFullApiEndpoint =
      /\/api\/.+/.test(rawBaseUrl) && !/\/api\/?$/.test(rawBaseUrl);
    const normalizedBaseUrl = rawBaseUrl.endsWith('/api')
      ? `${rawBaseUrl}/`
      : rawBaseUrl.endsWith('/api/')
        ? rawBaseUrl
        : `${rawBaseUrl}/api/`;
    const url = isFullApiEndpoint
      ? new URL(rawBaseUrl)
      : new URL(contentType, normalizedBaseUrl);

    if (Object.keys(queryParams).length > 0) {
      const newParams = new URLSearchParams(stringifyParams(queryParams));
      newParams.forEach((value, key) => {
        url.searchParams.append(key, value);
      });
    }

    const requestUrl = url.toString();
    const response = await fetch(requestUrl, {
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
          process.env.STRAPI_API_TOKEN ||
          ''
        }`,
      },
    });
    console.log('[fetchContentType]', requestUrl, response.status);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from Strapi (url=${requestUrl}, status=${response.status})`
      );
    }

    const jsonData: StrapiResponse = await response.json();
    return spreadData ? spreadStrapiData(jsonData) : jsonData;
  } catch (error) {
    console.error('FetchContentTypeError', error);
  }
}

function stringifyParams(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();

  const append = (key: string, value: unknown) => {
    if (value === null || value === undefined) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => append(`${key}[${index}]`, item));
      return;
    }
    if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
        append(`${key}[${childKey}]`, childValue);
      });
      return;
    }
    searchParams.append(key, String(value));
  };

  Object.entries(params).forEach(([key, value]) => append(key, value));
  return searchParams.toString();
}

