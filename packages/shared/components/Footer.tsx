import React from "react";
import { getStrapiImageUrl } from "./blocks/strapi-media";

type FooterLogo = {
  url?: string;
  alternativeText?: string | null;
};

type FooterCta = {
  id?: number;
  text?: string;
  href?: string;
  target?: string;
};

type FooterAddress = {
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
};

type FooterHours = {
  id?: number;
  day?: string;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
};

type FooterRetail = {
  text?: string;
  phone?: string;
};

export type FooterData = {
  officePhone?: string;
  additionalText?: string;
  propertyLogo?: FooterLogo | null;
  bozzutoLogo?: FooterLogo | null;
  cta?: FooterCta[] | null;
  address?: FooterAddress | null;
  officeHours?: FooterHours[] | null;
  retailLeasingOpportunities?: FooterRetail | null;
};

export function Footer({ footer }: { footer?: FooterData | null }) {
  if (!footer) return null;
  const propertyLogoUrl = getStrapiImageUrl(footer.propertyLogo?.url);
  const bozzutoLogoUrl = getStrapiImageUrl(footer.bozzutoLogo?.url);

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          {propertyLogoUrl && (
            <img
              src={propertyLogoUrl}
              alt={footer.propertyLogo?.alternativeText || "Property logo"}
              className="footer-property-logo"
            />
          )}
          {footer.cta && footer.cta.length > 0 && (
            <div className="footer-cta">
              {footer.cta.map((cta, index) => (
                <a
                  key={cta.id ?? `${cta.text}-${index}`}
                  href={cta.href || "#"}
                  target={cta.target || "_self"}
                  rel={cta.target === "_blank" ? "noreferrer" : undefined}
                  className={`footer-cta-button ${
                    index === 0 ? "is-primary" : "is-secondary"
                  }`}
                >
                  {cta.text}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4>Address</h4>
            {footer.address?.addressLine1 && (
              <p>{footer.address.addressLine1},</p>
            )}
            {(footer.address?.city ||
              footer.address?.state ||
              footer.address?.zip) && (
              <p>
                {[
                  footer.address?.city,
                  footer.address?.state,
                  footer.address?.zip,
                ]
                  .map((value) => value?.trim())
                  .filter(Boolean)
                  .join(",")}
              </p>
            )}
          </div>
          <div className="footer-column">
            <h4>Hours</h4>
            {footer.officeHours?.length ? (
              <ul>
                {footer.officeHours.map((entry) => (
                  <li key={entry.id ?? entry.day}>
                    {entry.day}
                    {entry.isClosed
                      ? ": Closed"
                      : `: ${entry.openTime || ""} to ${entry.closeTime || ""}`.trim()}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="footer-column">
            <h4>Retail Leasing Opportunities</h4>
            {footer.retailLeasingOpportunities?.text && (
              <p>{footer.retailLeasingOpportunities.text}</p>
            )}
            {footer.retailLeasingOpportunities?.phone && (
              <p>{footer.retailLeasingOpportunities.phone}</p>
            )}
          </div>
        </div>
      </div>

      {footer.additionalText && (
        <div className="footer-additional">{footer.additionalText}</div>
      )}

      <div className="footer-bottom">
        {bozzutoLogoUrl && (
          <img
            src={bozzutoLogoUrl}
            alt={footer.bozzutoLogo?.alternativeText || "Bozzuto logo"}
            className="footer-bozzuto-logo"
          />
        )}
      </div>
    </footer>
  );
}
