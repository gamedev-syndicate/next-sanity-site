'use client'

import { urlFor } from '../lib/sanity-image';
import { PortableText } from '@portabletext/react';
import { ImageBlock as ImageBlockType, TextBlock as TextBlockType, ButtonBlock as ButtonBlockType } from '../types/sanity';
import { CompanyBlock, CompanyListBlock } from './CompanyBlocks';
import ContentSeparatorBlock from './blocks/ContentSeparatorBlock';
import { useDesignSystem } from '../hooks/useDesignSystem';
import { designSystemColorToCSS } from '../lib/background-utils';

interface ImageBlockProps {
  value: ImageBlockType;
}

interface TextBlockProps {
  value: TextBlockType;
}

interface ButtonBlockProps {
  value: ButtonBlockType;
}

interface CalloutProps {
  value: {
    type: 'info' | 'warning' | 'success' | 'error';
    title?: string;
    content: string;
  };
}

interface InlineImageProps {
  value: {
    asset: any;
    alt?: string;
    caption?: string;
    position?: 'center' | 'left' | 'right';
  };
}

// Enhanced callout component
export function Callout({ value }: CalloutProps) {
  const { designSystem } = useDesignSystem();
  
  // Default to design system colors, fallback to hardcoded colors
  const getTypeColors = (type: string) => {
    if (designSystem?.colors) {
      switch (type) {
        case 'info':
          return {
            bg: designSystemColorToCSS(designSystem.colors.primary) + '30', // 30% opacity
            border: designSystemColorToCSS(designSystem.colors.primary),
            text: 'text-white'
          };
        case 'warning':
          return {
            bg: designSystemColorToCSS(designSystem.colors.buttonPrimary) + '30',
            border: designSystemColorToCSS(designSystem.colors.buttonPrimary),
            text: 'text-white'
          };
        case 'success':
          return {
            bg: designSystemColorToCSS(designSystem.colors.buttonSecondary) + '30',
            border: designSystemColorToCSS(designSystem.colors.buttonSecondary),
            text: 'text-white'
          };
        case 'error':
          return {
            bg: designSystemColorToCSS(designSystem.colors.tertiary) + '30',
            border: designSystemColorToCSS(designSystem.colors.tertiary),
            text: 'text-white'
          };
      }
    }
    
    // Fallback to original hardcoded colors
    const fallbackStyles = {
      info: { bg: 'rgba(30, 58, 138, 0.3)', border: '#60a5fa', text: 'text-blue-100' },
      warning: { bg: 'rgba(133, 77, 14, 0.3)', border: '#fbbf24', text: 'text-yellow-100' },
      success: { bg: 'rgba(20, 83, 45, 0.3)', border: '#34d399', text: 'text-green-100' },
      error: { bg: 'rgba(153, 27, 27, 0.3)', border: '#f87171', text: 'text-red-100' },
    };
    
    return fallbackStyles[type as keyof typeof fallbackStyles] || fallbackStyles.info;
  };

  const colors = getTypeColors(value.type);
  const iconMap = {
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
    error: '❌',
  };

  const calloutStyle: React.CSSProperties = {
    backgroundColor: colors.bg,
    borderLeftColor: colors.border,
  };

  return (
    <div 
      className={`my-6 p-4 rounded-lg border-l-4 ${colors.text}`}
      style={calloutStyle}
    >
      <div className="flex items-start space-x-3">
        <span className="text-xl">{iconMap[value.type]}</span>
        <div className="flex-1">
          {value.title && (
            <h4 className="font-semibold mb-2">{value.title}</h4>
          )}
          <p className="leading-relaxed">{value.content}</p>
        </div>
      </div>
    </div>
  );
}

// Enhanced inline image component
export function InlineImage({ value }: InlineImageProps) {
  const positionClasses = {
    center: 'mx-auto',
    left: 'mr-auto',
    right: 'ml-auto',
  };

  // Create SanityImage structure for urlFor
  const sanityImage = {
    _type: 'image' as const,
    asset: value.asset,
  };

  return (
    <figure className={`my-6 ${positionClasses[value.position || 'center']}`}>
      <img
        src={urlFor(sanityImage).url()}
        alt={value.alt || ''}
        className="max-w-full h-auto rounded-lg shadow-lg"
      />
      {value.caption && (
        <figcaption className="text-center text-gray-300 text-sm mt-2 italic">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function ImageBlock({ value }: ImageBlockProps) {
  const widthClasses = {
    small: 'w-1/4',
    medium: 'w-1/2',
    large: 'w-3/4',
    full: 'w-full',
  };

  return (
    <div className={`mx-auto ${widthClasses[value.width]}`}>
      <img
        src={urlFor(value.image).url()}
        alt={value.alt}
        className="w-full h-auto rounded-lg shadow-lg"
      />
      {value.caption && (
        <p className="text-center text-gray-300 text-sm mt-2 italic">
          {value.caption}
        </p>
      )}
    </div>
  );
}

export function TextBlock({ value }: TextBlockProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const renderHeading = () => {
    const className = "text-white font-bold mb-4";
    switch (value.headingLevel) {
      case 'h1': return <h1 className={className}>{value.heading}</h1>;
      case 'h2': return <h2 className={className}>{value.heading}</h2>;
      case 'h3': return <h3 className={className}>{value.heading}</h3>;
      case 'h4': return <h4 className={className}>{value.heading}</h4>;
      default: return <h2 className={className}>{value.heading}</h2>;
    }
  };

  return (
    <div className={`${alignClasses[value.textAlign]}`}>
      {value.heading && renderHeading()}
      <div className="prose prose-invert max-w-none">
        <PortableText value={value.text} />
      </div>
    </div>
  );
}

export function ButtonBlock({ value, siteConfig }: { value: any; siteConfig?: any }) {
  const { designSystem } = useDesignSystem();
  
  let backgroundColor = '';
  let textColor = '';
  
  // Try design system colors first
  if (value.backgroundColorSelection) {
    if (value.backgroundColorSelection === 'custom' && value.customBackgroundColor) {
      backgroundColor = value.customBackgroundColor.alpha 
        ? `rgba(${parseInt(value.customBackgroundColor.hex.slice(1, 3), 16)}, ${parseInt(value.customBackgroundColor.hex.slice(3, 5), 16)}, ${parseInt(value.customBackgroundColor.hex.slice(5, 7), 16)}, ${value.customBackgroundColor.alpha})`
        : value.customBackgroundColor.hex;
    } else if (value.backgroundColorSelection !== 'custom' && designSystem?.colors) {
      const colorValue = designSystem.colors[value.backgroundColorSelection as keyof typeof designSystem.colors];
      if (colorValue) {
        backgroundColor = designSystemColorToCSS(colorValue);
      }
    }
  }
  
  if (value.textColorSelection) {
    if (value.textColorSelection === 'custom' && value.customTextColor) {
      textColor = value.customTextColor.alpha 
        ? `rgba(${parseInt(value.customTextColor.hex.slice(1, 3), 16)}, ${parseInt(value.customTextColor.hex.slice(3, 5), 16)}, ${parseInt(value.customTextColor.hex.slice(5, 7), 16)}, ${value.customTextColor.alpha})`
        : value.customTextColor.hex;
    } else if (value.textColorSelection !== 'custom' && designSystem?.colors) {
      const colorValue = designSystem.colors[value.textColorSelection as keyof typeof designSystem.colors];
      if (colorValue) {
        textColor = designSystemColorToCSS(colorValue);
      }
    }
  }
  
  // Fallback to legacy brand colors if design system colors not set
  if (!backgroundColor && value.useBrandColor && siteConfig?.brandColors) {
    const brandColor = value.brandColorType === 'secondary' 
      ? siteConfig.brandColors.buttonSecondaryColor 
      : siteConfig.brandColors.buttonPrimaryColor;
    
    if (brandColor) {
      backgroundColor = brandColor.alpha 
        ? `rgba(${parseInt(brandColor.hex.slice(1, 3), 16)}, ${parseInt(brandColor.hex.slice(3, 5), 16)}, ${parseInt(brandColor.hex.slice(5, 7), 16)}, ${brandColor.alpha})` 
        : brandColor.hex;
    }
  }
  
  const baseClasses = 'inline-block rounded-lg font-semibold transition-colors px-6 py-3 text-base';
  
  // Build style classes based on available colors
  let styleClasses = '';
  if (backgroundColor && textColor) {
    styleClasses = `hover:opacity-90`;
  } else if (backgroundColor) {
    styleClasses = `text-white hover:opacity-90`;
  } else if (textColor) {
    // Use default background with custom text color
    styleClasses = value.style === 'secondary' ? 'bg-gray-600 hover:bg-gray-700'
      : 'bg-orange-600 hover:bg-orange-700';
  } else {
    // Fallback to style-based colors
    styleClasses = value.style === 'secondary' ? 'bg-gray-600 hover:bg-gray-700 text-white'
      : 'bg-orange-600 hover:bg-orange-700 text-white';
  }

  // Use flexbox for proper button alignment
  const alignmentClasses = {
    left: 'flex justify-start',
    center: 'flex justify-center', 
    right: 'flex justify-end',
  };
  const containerAlignment = alignmentClasses[value.alignment as keyof typeof alignmentClasses] || alignmentClasses.left;

  const buttonStyle: React.CSSProperties = {};
  if (backgroundColor) buttonStyle.backgroundColor = backgroundColor;
  if (textColor) buttonStyle.color = textColor;

  return (
    <div className={`my-6 ${containerAlignment}`}>
      <a
        href={value.url}
        target={value.openInNewTab ? '_blank' : '_self'}
        rel={value.openInNewTab ? 'noopener noreferrer' : undefined}
        className={`${baseClasses} ${styleClasses}`}
        style={buttonStyle}
      >
        {value.text}
      </a>
    </div>
  );
}


export const customComponents = {
  types: {
    imageBlock: ImageBlock,
    textBlock: TextBlock,
    buttonBlock: ButtonBlock,
    companyBlock: ({ value }: { value: any }) => <CompanyBlock {...value} />,
    companyListBlock: ({ value }: { value: any }) => <CompanyListBlock value={value} />,
    callout: Callout,
    image: InlineImage,
    contentSeparator: ({ value }: { value: any }) => {
      console.log('ContentSeparator value from Sanity:', JSON.stringify(value, null, 2));
      return (
        <ContentSeparatorBlock
          lineColorSelection={value.lineColorSelection}
          customLineColor={value.customLineColor}
          diamondColorSelection={value.diamondColorSelection}
          customDiamondColor={value.customDiamondColor}
          lineColor={value.lineColor} // Legacy fallback
          diamondColor={value.diamondColor} // Legacy fallback
          strokeWidth={value.strokeWidth}
          height={value.height}
          margin={value.margin}
        />
      );
    },
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href: string; blank?: boolean } }) => {
      if (!value?.href) return <>{children}</>;
      return (
        <a
          href={value.href}
          target={value.blank ? '_blank' : '_self'}
          rel={value.blank ? 'noopener noreferrer' : undefined}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {children}
        </a>
      );
    },
    textSize: ({ children, value }: { children: React.ReactNode; value?: { size: string } }) => {
      const sizeClasses = {
        'xs': 'text-xs',
        'sm': 'text-sm',
        'base': 'text-base',
        'lg': 'text-lg',
        'xl': 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
      };
      if (!value?.size) return <>{children}</>;
      return (
        <span className={sizeClasses[value.size as keyof typeof sizeClasses] || 'text-base'}>
          {children}
        </span>
      );
    },
    textAlign: ({ children, value }: { children: React.ReactNode; value?: { align: string } }) => {
      const alignClasses = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right',
        'justify': 'text-justify',
      };
      if (!value?.align) return <>{children}</>;
      return (
        <span className={`block ${alignClasses[value.align as keyof typeof alignClasses] || 'text-left'}`}>
          {children}
        </span>
      );
    },
    fontWeight: ({ children, value }: { children: React.ReactNode; value?: { weight: string } }) => {
      const weightClasses = {
        'light': 'font-light',
        'normal': 'font-normal',
        'medium': 'font-medium',
        'semibold': 'font-semibold',
        'bold': 'font-bold',
        'extrabold': 'font-extrabold',
      };
      if (!value?.weight) return <>{children}</>;
      return (
        <span className={weightClasses[value.weight as keyof typeof weightClasses] || 'font-normal'}>
          {children}
        </span>
      );
    },
    highlight: ({ children, value }: { children: React.ReactNode; value?: { color: { hex: string; alpha?: number } } }) => {
      const { designSystem } = useDesignSystem();
      
      if (!value?.color?.hex) return <>{children}</>;
      
      const backgroundColor = value.color.alpha 
        ? `rgba(${parseInt(value.color.hex.slice(1, 3), 16)}, ${parseInt(value.color.hex.slice(3, 5), 16)}, ${parseInt(value.color.hex.slice(5, 7), 16)}, ${value.color.alpha})`
        : value.color.hex;
        
      return (
        <span
          style={{
            backgroundColor,
            padding: '2px 4px',
            borderRadius: '3px',
          }}
        >
          {children}
        </span>
      );
    },
    textColor: ({ children, value }: { children: React.ReactNode; value?: { color: { hex: string; alpha?: number } } }) => {
      const { designSystem } = useDesignSystem();
      
      if (!value?.color?.hex) return <>{children}</>;
      
      const textColor = value.color.alpha 
        ? `rgba(${parseInt(value.color.hex.slice(1, 3), 16)}, ${parseInt(value.color.hex.slice(3, 5), 16)}, ${parseInt(value.color.hex.slice(5, 7), 16)}, ${value.color.alpha})`
        : value.color.hex;
        
      return (
        <span
          style={{
            color: textColor,
          }}
        >
          {children}
        </span>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-4xl font-bold text-white mb-6">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-3xl font-bold text-white mb-5">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-2xl font-bold text-white mb-4">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-xl font-bold text-white mb-3">{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-blue-400 pl-4 py-2 my-4 italic text-gray-300 bg-gray-800/30 rounded-r">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-white leading-relaxed mb-4">{children}</p>
    ),
  },
};

export default function CustomBlocks({ blocks, siteConfig }: { blocks: any[]; siteConfig?: any }) {
  return (
    <div className="custom-blocks">
      {blocks.map((block) => {
        switch (block._type) {
          case 'imageBlock':
            return <ImageBlock key={block._key} {...block} />;
          case 'textBlock':
            return <TextBlock key={block._key} {...block} />;
          case 'buttonBlock':
            return <ButtonBlock key={block._key} value={block} siteConfig={siteConfig} />;
          case 'companyBlock':
            return <CompanyBlock key={block._key} {...block} />;
          case 'companyListBlock':
            return <CompanyListBlock key={block._key} {...block} />;
          default:
            console.warn(`Unknown block type: ${block._type}`);
            return null;
        }
      })}
    </div>
  );
}
