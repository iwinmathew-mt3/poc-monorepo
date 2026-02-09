"use client";

import React from "react";
import styles from "./twocolumncontent.module.scss";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { getStrapiImageUrl, normalizeStrapiMedia } from "../strapi-media";

interface TwoColumnImage {
  src: string;
  alt?: string;
}

interface TwoColumnContentProps {
  preTitle?: React.ReactNode;
  title: string;
  description?: string | any;
  image?: TwoColumnImage;
  media?: unknown;
  className?: string;
}

export const TwoColumnContent: React.FC<TwoColumnContentProps> = ({
  preTitle,
  title,
  description,
  image: imageProp,
  media,
  className = "",
}: TwoColumnContentProps) => {
  const firstMedia = normalizeStrapiMedia(media)[0];
  const image =
    imageProp ??
    (firstMedia?.url
      ? {
          src: getStrapiImageUrl(firstMedia.url),
          alt: firstMedia.alternativeText ?? undefined,
        }
      : null);

  return (
    <section className={`${styles.section} ${className}`.trim()}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.text}>
            {preTitle && <div className={styles.eyebrow}>{preTitle}</div>}
            <h2
              className={styles.heading}
              dangerouslySetInnerHTML={{ __html: title }}
            />
            {description && (
              <div className={styles.body}>
                {typeof description === "string" ? (
                  <p>{description}</p>
                ) : (
                  <BlocksRenderer content={description} />
                )}
              </div>
            )}
          </div>
          <div className={styles.media}>
            {image && (
              <img
                className={styles.image}
                src={image.src}
                alt={image.alt ?? ""}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
