"use client";
import React from "react";
import styles from "./textblock.module.scss";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import { CtaData } from "../../../types/cta";

interface TextBlockProps {
  preTitle?: React.ReactNode;
  title: string;
  description?: string | any; 
  cta?: CtaData;
  onButtonClick?: () => void;
  className?: string;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  preTitle,
  title,
  description,
  cta,
  onButtonClick,
  className = "",
}: TextBlockProps) => {

  return (
    <section className={styles.section}>
      <div className={styles.textBlockSection}>
        <div className="container">
          <div className={`${styles.textBlock} ${className}`.trim()}>
            {preTitle && <div className={styles.eyebrow}>{preTitle}</div>}
            <h2
              className={styles.heading}
              dangerouslySetInnerHTML={{ __html: title }}
            ></h2>
            {description && (
              <div className={styles.description}>
                {typeof description === "string" ? (
                  <p>{description}</p>
                ) : (
                  <BlocksRenderer content={description} />
                )}
              </div>
            )}
            {cta && <button>{cta.text}</button>}
          </div>
        </div>
      </div>
    </section>
  );
};
