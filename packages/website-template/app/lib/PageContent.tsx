import { DynamicZoneManager } from "@repo/shared/components";

interface DynamicZoneComponent {
  id: number;
  __component: string;
  [key: string]: unknown;
}

interface PageData {
  id: number;
  attributes?: {
    dynamicZone?: DynamicZoneComponent[];
    blocks?: DynamicZoneComponent[];
    page?: DynamicZoneComponent[];
    [key: string]: unknown;
  };
  dynamicZone?: DynamicZoneComponent[];
  blocks?: DynamicZoneComponent[];
  page?: DynamicZoneComponent[];
  [key: string]: unknown;
}

export default function PageContent({
  pageData,
}: {
  pageData: PageData | null | undefined;
}) {
  const dynamicZone =
    pageData?.attributes?.dynamicZone ??
    pageData?.attributes?.blocks ??
    pageData?.attributes?.page ??
    pageData?.dynamicZone ??
    pageData?.blocks ??
    pageData?.page;
  return <>{dynamicZone && <DynamicZoneManager dynamicZone={dynamicZone} />}</>;
}
