import React from "react";
import { Hero } from "./hero/hero";
import { TextBlock } from "./textblock/textblock";
import { TwoColumnContent } from "./twocolumncontent/twocolumncontent";
import { TextBlockWithBackgroundImage } from "./textblockWithBackgroundImage/textblockWithBackgroundImage";

interface DynamicZoneComponent {
  id: number;
  __component: string;
  [key: string]: any;
}

interface Props {
  dynamicZone: DynamicZoneComponent[];
}

const componentMapping: Record<string, React.ComponentType<any>> = {
  "block.hero": Hero,
  "block.textblock": TextBlock,
  "block.twocoloumncontent": TwoColumnContent,
  "block.textblockwithbackgroundimage": TextBlockWithBackgroundImage,
};

const DynamicZoneManager: React.FC<Props> = ({ dynamicZone }) => {
  return (
    <>
      {dynamicZone.map((componentData, index) => {
        const Component = componentMapping[componentData.__component];
        if (!Component) {
          console.warn(`No component found for: ${componentData.__component}`);
          return null;
        }

        if (
          componentData?.appearance &&
          componentData.appearance?.isVisible === false
        ) {
          return null;
        }

        return <Component key={componentData.id || index} {...componentData} />;
      })}
    </>
  );
};

export default DynamicZoneManager;
