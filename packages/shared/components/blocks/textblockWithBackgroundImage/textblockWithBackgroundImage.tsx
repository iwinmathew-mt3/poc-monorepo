"use client";
import styles from "./textblockWithBackgroundImage.module.scss";
import { CtaData } from "../../../types/cta";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { getStrapiImageUrl, normalizeStrapiMedia } from "../strapi-media";

interface imageBlock {
  src: string;
  alt?: string;
}

interface TextBlockWithBackgroundImageProps {
  preTitle?: React.ReactNode;
  title: string;
  description?: string | any[] | null;
  anchor?: string | null;
  cta?: CtaData | null;
  image?: imageBlock | unknown;
  className?: string;
}

export const TextBlockWithBackgroundImage = ({
  preTitle,
  title,
  description,
  cta,
  image,
  className = "",
}: TextBlockWithBackgroundImageProps) => {
  const normalizedImage = normalizeStrapiMedia(image)[0];
  const resolvedImage =
    image && typeof image === "object" && "src" in image
      ? (image as imageBlock)
      : normalizedImage?.url
        ? {
            src: getStrapiImageUrl(normalizedImage.url),
            alt: normalizedImage.alternativeText ?? undefined,
          }
        : null;

  return (
    <section
      data-container="textBlockWithBackgroundImage"
      className={`${styles.block} ${className}`.trim()}
    >
      <div className={styles.imageWrapper}>
        {resolvedImage && (
          <img
            className={styles.image}
            src={resolvedImage.src}
            alt={resolvedImage.alt ?? ""}
          />
        )}
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          {preTitle && (
            <div className={styles.eyebrow}>{preTitle}</div>
          )}
          <h2 className={styles.heading}>{title}</h2>
          {description && (
            <div className={styles.body}>
              {typeof description === "string" ? (
                <p>{description}</p>
              ) : (
                <BlocksRenderer content={description || []} />
              )}
            </div>
          )}
          {cta && <button>{cta.text}</button>}
        </div>
      </div>
    </section>
  );
};
