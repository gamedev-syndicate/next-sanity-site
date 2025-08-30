// Sanity content types
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

export interface SanityColor {
  hex: string;
  alpha?: number;
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
  solidColor?: SanityColor;
  gradientFrom?: SanityColor;
  gradientTo?: SanityColor;
  gradientDirection?: 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl';
  gradientStartPosition?: number;
  gradientEndPosition?: number;
  backgroundImage?: SanityImage;
  customCSS?: string;
}

export interface SiteConfig {
  _id: string;
  _type: 'siteConfig';
  menuColor?: SanityColor;
  pageBackground?: PageBackground;
  navigationItems?: NavigationItem[];
}

export interface Page {
  _id: string;
  _type: 'page';
  title: string;
  slug: SanitySlug;
  showInNavigation?: boolean;
  navigationOrder?: number;
  backgroundColor?: SanityColor;
  content?: (any | ContentBlock)[];
}

export interface SectionBackground {
  type: 'none' | 'solid' | 'gradient' | 'image';
  solidColor?: SanityColor;
  gradientFrom?: SanityColor;
  gradientTo?: SanityColor;
  gradientDirection?: 'to-b' | 'to-r' | 'to-br';
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
  backgroundColor?: SanityColor;
}
