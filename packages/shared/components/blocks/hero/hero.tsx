"use client";

import React, { useEffect, useState } from "react";
import styles from "./hero.module.scss";
import { getStrapiImageUrl, normalizeStrapiMedia } from "../strapi-media";

interface HeroImage {
  src: string;
  alt?: string;
}

interface HeroProps {
  title: string;
  images?: HeroImage[];
  media?: unknown;
  slideInterval?: number;
  intervalMs?: number;
  className?: string;
  description?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  images: imagesProp,
  media,
  slideInterval,
  intervalMs = 6000,
  className = "",
  description,
}: HeroProps) => {
  const images = (imagesProp?.length ? imagesProp : toImages(media)) ?? [];
  const resolvedIntervalMs =
    typeof slideInterval === "number" ? slideInterval * 1000 : intervalMs;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!images.length) {
      return;
    }

    if (activeIndex >= images.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (images.length <= 1 || resolvedIntervalMs <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, resolvedIntervalMs);

    return () => {
      window.clearInterval(timerId);
    };
  }, [images.length, resolvedIntervalMs]);

  if (!images.length) {
    return null;
  }

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentLabel = String(activeIndex + 1).padStart(2, "0");
  const totalLabel = String(images.length).padStart(2, "0");

  return (
    <section
      className={`${styles.hero} ${className}`.trim()}
      aria-roledescription="carousel"
    >
      <div className={styles.media} aria-hidden="true">
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className={`${styles.slide} ${
              index === activeIndex ? styles.active : ""
            }`.trim()}
          >
            <img
              className={styles.image}
              src={image.src}
              alt={image.alt ?? ""}
            />
          </div>
        ))}
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <h1
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {description && <p>{description}</p>}
      </div>
    </section>
  );
};

function toImages(media?: unknown) {
  return normalizeStrapiMedia(media)
    .map((item) => ({
      src: getStrapiImageUrl(item?.url),
      alt: item?.alternativeText ?? undefined,
    }))
    .filter((image) => Boolean(image.src)) as HeroImage[];
}
