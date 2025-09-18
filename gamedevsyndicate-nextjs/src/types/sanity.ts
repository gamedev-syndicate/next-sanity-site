// Sanity content types

// Design system color selection type
export type ColorSelection = 'primary' | 'secondary' | 'tertiary' | 'buttonPrimary' | 'buttonSecondary' | 'custom';

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanitySlug {
  current: string;
  _type: 'slug';
}

// Block types
export interface ImageBlock {
  _type: 'imageBlock';
  _key: string;
  image: SanityImage;
  alt: string;
  caption?: string;
  width: 'small' | 'medium' | 'large' | 'full';
}

export interface TextBlock {
  _type: 'textBlock';
  _key: string;
  heading?: string;
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4';
  text: any[];
  textAlign: 'left' | 'center' | 'right';
}

export interface ButtonBlock {
  _type: 'buttonBlock';
  _key: string;
  text: string;
  url: string;
  style: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  openInNewTab: boolean;
}

export type ContentBlock = ImageBlock | TextBlock | ButtonBlock;

// Document types
export interface NavigationItem {
  title: string;
  url: string;
  openInNewTab: boolean;
}

export interface PageBackground {
  type: 'solid' | 'gradient' | 'image' | 'custom';
  solidColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientFrom?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientTo?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientDirection?: 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl';
  gradientStartPosition?: number;
  gradientEndPosition?: number;
  backgroundImage?: SanityImage;
  customCSS?: string;
}

export interface OverlayTexture {
  enabled: boolean;
  svgFile?: {
    _type: 'file';
    asset: {
      _ref: string;
      _type: 'reference';
      url?: string;
    };
  };
  patternSize?: '200px' | '400px' | '600px' | '800px' | 'custom';
  customPatternSize?: string;
  tileMode?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat' | 'space' | 'round';
  colorType?: 'solid' | 'gradient';
  solidColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientFrom?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientTo?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientDirection?: 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl';
  gradientStartPosition?: number;
  gradientEndPosition?: number;
  opacity?: number;
}

export interface SiteConfig {
  _id: string;
  _type: 'siteConfig';
  menuColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  // New design system menu color fields
  menuColorSelection?: ColorSelection;
  customMenuColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  // Legacy brand colors for backward compatibility
  brandColors?: {
    primaryColor?: {
      _type: 'color';
      hex: string;
      alpha?: number;
    };
    secondaryColor?: {
      _type: 'color';
      hex: string;
      alpha?: number;
    };
    buttonPrimaryColor?: {
      _type: 'color';
      hex: string;
      alpha?: number;
    };
    buttonSecondaryColor?: {
      _type: 'color';
      hex: string;
      alpha?: number;
    };
  };
  pageBackground?: PageBackground;
  overlayTexture?: OverlayTexture;
  navigationItems?: NavigationItem[];
}

export interface Page {
  _id: string;
  _type: 'page';
  title: string;
  slug: SanitySlug;
  showInNavigation?: boolean;
  navigationOrder?: number;
  backgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  content?: (any | ContentBlock)[];
}

export interface SectionBackground {
  type: 'none' | 'solid' | 'gradient' | 'image';
  // Legacy color fields for backward compatibility
  solidColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientFrom?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientTo?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  // New design system color selection fields
  solidColorSelection?: ColorSelection;
  customSolidColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientFromSelection?: ColorSelection;
  customGradientFrom?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientToSelection?: ColorSelection;
  customGradientTo?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
  gradientDirection?: 'to-b' | 'to-r' | 'to-br';
  gradientStartPosition?: number;
  gradientEndPosition?: number;
  backgroundImage?: SanityImage;
}

export interface SectionPadding {
  top: string;
  bottom: string;
}

export interface HomepageSection {
  _key: string;
  title?: string;
  background?: SectionBackground;
  shadow?: boolean; // Add this line
  overlayTexture?: OverlayTexture;
  padding?: SectionPadding;
  content?: ContentBlock[];
}

export interface Homepage {
  _id: string;
  _type: 'homepage';
  bannerImage: SanityImage;
  bannerPosition?: {
    offsetX: number;
    offsetY: number;
    scale: number;
  };
  textArea?: any[];
  sections?: HomepageSection[];
  blockArea?: (ImageBlock | TextBlock | ButtonBlock)[];
  backgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
}

import type { SanityDocument } from '@sanity/client'

export interface Company {
  _id: string;
  _type: 'company';
  name: string;
  logo?: SanityImage;
  ceoName?: string;
  email?: string;
  description?: string;
}

export interface CompanyListBlock {
  _type: 'companyListBlock';
  title?: string;
  companies: Company[];
  backgroundColor?: {
    _type: 'color';
    hex: string;
    alpha?: number;
  };
}
