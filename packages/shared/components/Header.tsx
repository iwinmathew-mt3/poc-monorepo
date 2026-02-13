import React from "react";
import { getStrapiImageUrl } from "./blocks/strapi-media";

type HeaderLogo = {
  url?: string;
  alternativeText?: string | null;
};

type HeaderCta = {
  text?: string;
  href?: string;
  target?: string;
};

type HeaderMenuItem = {
  id?: number;
  text?: string;
  href?: string;
  target?: string;
};

export type HeaderData = {
  cta?: HeaderCta | null;
  logo?: HeaderLogo | null;
  menuList?: HeaderMenuItem[] | null;
};

interface HeaderProps {
  siteName: string;
  websiteUrl?: string;
  header?: HeaderData | null;
}

export function Header({
  siteName,
  websiteUrl = "/",

  header,
}: HeaderProps) {
  let basePath = websiteUrl || "/";
  if (basePath.startsWith("http")) {
    try {
      basePath = new URL(basePath).pathname || "/";
    } catch {
      basePath = "/";
    }
  }
  const normalizeHref = (href?: string) => {
    if (!href) return "#";
    if (/^(https?:)?\/\//.test(href) || href.startsWith("#")) {
      return href;
    }
    const trimmedBase = basePath.replace(/\/$/, "");
    const normalizedHref = href.startsWith("/") ? href : `/${href}`;
    return basePath === "/" ? normalizedHref : `${trimmedBase}${normalizedHref}`;
  };

  const logoUrl = getStrapiImageUrl(header?.logo?.url);
  const menuList = header?.menuList?.filter((item) => item?.text && item?.href);

  return (
    <header className="site-header">
      <div className="header-container">
        {header?.cta?.text && (
          <a
            className="header-scheduleTour"
            href={normalizeHref(header.cta.href)}
            target={header.cta.target || "_self"}
            rel={header.cta.target === "_blank" ? "noreferrer" : undefined}
          >
            {header.cta.text}
          </a>
        )}
        <a href={basePath} className="header-logo">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={header?.logo?.alternativeText || siteName}
            />
          ) : (
            siteName
          )}
        </a>
        <nav className="header-nav">
          {menuList &&
            menuList.length > 0 &&
            menuList.map((item) => (
              <a
                key={item.id ?? `${item.text}-${item.href}`}
                href={normalizeHref(item.href)}
                target={item.target || "_self"}
                rel={item.target === "_blank" ? "noreferrer" : undefined}
              >
                {item.text}
              </a>
            ))}
        </nav>
      </div>
    </header>
  );
}
