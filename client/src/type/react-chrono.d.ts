declare module 'react-chrono' {
  import {ReactNode} from 'react';

  export interface TimelineItem {
    title?: string;
    cardTitle?: string;
    cardSubtitle?: string;
    cardDetailedText?: string | string[];
    media?: {
      name?: string;
      source: {
        url: string;
      };
      type?: string;
    };
    url?: string;
  }

  export interface Theme {
    primary?: string;
    secondary?: string;
    cardBgColor?: string;
    cardForeColor?: string;
    titleColor?: string;
    titleColorActive?: string;
    cardTitleColor?: string;
    cardSubtitleColor?: string;
    cardDetailsColor?: string;
  }

  export interface FontSizes {
    title?: string;
    cardTitle?: string;
    cardSubtitle?: string;
    cardText?: string;
  }

  export interface ClassNames {
    card?: string;
    cardTitle?: string;
    cardSubTitle?: string;
    cardText?: string;
  }

  export interface ChronoProps {
    items?: TimelineItem[];
    mode?: 'VERTICAL' | 'VERTICAL_ALTERNATING' | 'HORIZONTAL';
    cardHeight?: number;
    cardWidth?: number;
    itemWidth?: number;
    scrollable?: boolean | {scrollbar: boolean};
    theme?: Theme;
    fontSizes?: FontSizes;
    classNames?: ClassNames;
    hideControls?: boolean;
    disableClickOnCircle?: boolean;
    disableNavOnKey?: boolean;
    useReadMore?: boolean;
    lineWidth?: number;
    activeItemIndex?: number;
    onScrollEnd?: () => void;
    onItemSelected?: (data: unknown) => void;
    textDensity?: 'LOW' | 'HIGH';
    enableLayoutSwitch?: boolean;
    disableToolbar?: boolean;
    showAllCardsHorizontal?: boolean;
    mediaHeight?: number;
    children?: ReactNode;
  }

  export const Chrono: React.FC<ChronoProps>;
}
