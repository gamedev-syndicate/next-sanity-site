'use client'

import React from 'react';
import { getImageUrl } from '../../lib/sanity-image';
import type { SanityImage } from '../../types/sanity';
import RichTextRendererClient from '../RichTextRendererClient';
import type { PortableTextBlock } from '@portabletext/types';
import { useDesignSystem } from '../../hooks/useDesignSystem';
import { colorToCSS } from '../../lib/colorUtils';

interface Article {
  _id: string;
  title: string;
  text: unknown[];
  image?: SanityImage & { alt?: string };
}

interface ShortArticleListBlockProps {
  value: {
    _key: string;
    internalLabel?: string;
    title?: string;
    articles: Article[];
    layout?: 'vertical' | 'horizontal';
    imagePosition?: 'top' | 'left' | 'right' | 'bottom';
    imageAlignment?: boolean;
    imageSize?: 'small' | 'medium' | 'large';
    verticalAlignment?: 'start' | 'center' | 'end';
    spacing?: 'compact' | 'normal' | 'relaxed';
    backgroundColorSelection?: string;
    customBackgroundColor?: {
      hex: string;
      alpha?: number;
      rgb: { r: number; g: number; b: number; a: number };
    };
  };
}

export const ShortArticleListBlock: React.FC<ShortArticleListBlockProps> = ({ value }) => {
  const { designSystem } = useDesignSystem();
  const {
    title,
    articles,
    layout = 'vertical',
    imagePosition = 'left',
    imageAlignment = false,
    imageSize = 'medium',
    verticalAlignment = 'start',
    spacing = 'normal',
    backgroundColorSelection,
    customBackgroundColor,
  } = value;

  // Resolve background color using design system
  const resolveBackgroundColor = (): string | undefined => {
    if (backgroundColorSelection && backgroundColorSelection !== 'custom' && designSystem?.colors) {
      const colorValue = designSystem.colors[backgroundColorSelection as keyof typeof designSystem.colors];
      if (colorValue) {
        return colorToCSS(colorValue);
      }
    }
    
    if (backgroundColorSelection === 'custom' && customBackgroundColor) {
      return customBackgroundColor.hex;
    }
    
    return undefined;
  };

  const backgroundColor = resolveBackgroundColor();

  // Get image size classes - much smaller for list view (40% height reduction total)
  const getImageSizeClasses = () => {
    if (layout === 'horizontal') {
      // For horizontal layout, use fixed small sizes (reduced by 40%)
      switch (imageSize) {
        case 'small':
          return 'w-12 h-12 md:w-16 md:h-16';
        case 'medium':
          return 'w-16 h-16 md:w-20 md:h-20';
        case 'large':
          return 'w-20 h-20 md:w-24 md:h-24';
        default:
          return 'w-16 h-16 md:w-20 md:h-20';
      }
    }
    // For vertical layout
    switch (imageSize) {
      case 'small':
        return 'md:w-16'; // Fixed small width (reduced)
      case 'medium':
        return 'md:w-20'; // Fixed medium width (reduced)
      case 'large':
        return 'md:w-24'; // Fixed large width (reduced)
      default:
        return 'md:w-20';
    }
  };

  // Get content size classes (complement of image size)
  const getContentSizeClasses = () => {
    return 'flex-1'; // Let content take remaining space
  };

  // Get vertical alignment classes
  const getAlignmentClasses = () => {
    switch (verticalAlignment) {
      case 'start':
        return 'items-start';
      case 'center':
        return 'items-center';
      case 'end':
        return 'items-end';
      default:
        return 'items-start';
    }
  };

  // Get spacing classes (40% reduction total)
  const getSpacingClasses = () => {
    switch (spacing) {
      case 'compact':
        return 'gap-1.5 md:gap-2';
      case 'normal':
        return 'gap-2 md:gap-3';
      case 'relaxed':
        return 'gap-3 md:gap-4';
      default:
        return 'gap-2 md:gap-3';
    }
  };

  // Determine which side image should be on (for left/right positions)
  const getArticleImageSide = (index: number): 'left' | 'right' => {
    // For top/bottom positions, side doesn't matter
    if (imagePosition === 'top' || imagePosition === 'bottom') {
      return 'left';
    }
    
    // For right position
    if (imagePosition === 'right') {
      // If alternating is enabled, swap sides
      if (imageAlignment) {
        return index % 2 === 0 ? 'right' : 'left';
      }
      return 'right';
    }
    
    // For left position (default)
    if (imageAlignment) {
      return index % 2 === 0 ? 'left' : 'right';
    }
    return 'left';
  };

  // Render a single article
  const renderArticle = (article: Article, index: number) => {
    const imageUrl = article.image ? getImageUrl(article.image, 400, 400) : null;
    const articleImageSide = getArticleImageSide(index);
    
    const articleStyle: React.CSSProperties = backgroundColor
      ? { backgroundColor }
      : {};

    const articleClasses = `
      rounded-lg
      overflow-hidden
      ${backgroundColor ? '' : 'bg-gray-800/30 backdrop-blur-sm'}
      ${layout === 'horizontal' ? 'flex-shrink-0 w-72' : 'w-full'}
    `.trim().replace(/\s+/g, ' ');
    
    // If no image, render simple text-only layout
    if (!imageUrl) {
      return (
        <div key={article._id} className={articleClasses} style={articleStyle}>
          <div className="flex flex-col gap-1.5 p-3 md:p-4">
            <h3 className="text-xs md:text-sm font-bold text-white line-clamp-2">
              {article.title}
            </h3>
            {article.text && article.text.length > 0 && (
              <div className="prose prose-sm max-w-none text-gray-300 line-clamp-2 text-xs leading-tight">
                <RichTextRendererClient value={article.text as PortableTextBlock[]} />
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Determine layout based on image position
    let containerClasses = '';
    if (imagePosition === 'top') {
      containerClasses = `flex flex-col ${getAlignmentClasses()}`;
    } else if (imagePosition === 'bottom') {
      containerClasses = `flex flex-col-reverse ${getAlignmentClasses()}`;
    } else if (imagePosition === 'right' || articleImageSide === 'right') {
      containerClasses = `flex flex-row-reverse ${getAlignmentClasses()}`;
    } else {
      containerClasses = `flex flex-row ${getAlignmentClasses()}`;
    }

    const isVerticalImage = imagePosition === 'top' || imagePosition === 'bottom';

    return (
      <div key={article._id} className={articleClasses} style={articleStyle}>
        <div className={containerClasses}>
          {/* Image - no padding, extends to edges */}
          <div className={`${isVerticalImage ? 'w-full' : getImageSizeClasses()} flex-shrink-0`}>
            <img
              src={imageUrl}
              alt={article.image?.alt || article.title || 'Article image'}
              className={`w-full ${isVerticalImage ? 'h-20 md:h-24' : 'h-full'} object-cover`}
            />
          </div>

          {/* Content - with padding */}
          <div className={`${isVerticalImage ? 'w-full' : getContentSizeClasses()} flex flex-col justify-start gap-1 p-3 md:p-4`}>
            <h3 className="text-xs md:text-sm font-bold text-white line-clamp-2">
              {article.title}
            </h3>
            
            {article.text && article.text.length > 0 && (
              <div className="prose prose-sm max-w-none text-gray-300 line-clamp-2 text-xs leading-tight">
                <RichTextRendererClient value={article.text as PortableTextBlock[]} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Section Title */}
      {title && (
        <h2 className="text-base md:text-lg font-bold mb-2 text-white text-center">
          {title}
        </h2>
      )}

      {/* Articles Container */}
      {layout === 'horizontal' ? (
        <div className="overflow-x-auto -mx-2 px-2 pb-2">
          <div className={`flex ${getSpacingClasses()}`}>
            {articles.map((article, index) => renderArticle(article, index))}
          </div>
        </div>
      ) : (
        <div className={`flex flex-col ${getSpacingClasses()} max-w-2xl mx-auto`}>
          {articles.map((article, index) => renderArticle(article, index))}
        </div>
      )}
    </div>
  );
};
