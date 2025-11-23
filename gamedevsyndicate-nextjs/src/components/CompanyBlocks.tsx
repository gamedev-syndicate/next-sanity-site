'use client'

import React from 'react';
import { getImageUrl } from '../lib/sanity-image';
import type { SanityImage } from '../types/sanity';
import { HoneycombGrid } from './HoneycombGrid';
import { TiltedSquareGrid } from './TiltedSquareGrid';
import { useDesignSystem } from '../hooks/useDesignSystem';
import { colorToCSS } from '../lib/colorUtils';

interface CompanyData {
  _id: string;
  name: string;
  logo?: SanityImage & {
    alt?: string;
  };
  ceoName?: string;
  email?: string;
  description?: string;
}

interface CompanyBlockProps {
  value: {
    company: CompanyData;
    layout?: 'card' | 'horizontal' | 'minimal';
  };
}

interface CompanyListBlockProps {
  value: {
    title?: string;
    companies: CompanyData[];
    backgroundColorSelection?: string;
    customBackgroundColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
    borderColorSelection?: string;
    customBorderColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
    // Legacy support for backward compatibility
    backgroundColor?: { hex: string; alpha?: number };
    borderColor?: { hex: string; alpha?: number };
  };
}

const CompanyCard: React.FC<{
  company: CompanyData;
  layout: 'card' | 'horizontal' | 'minimal';
  showDescription?: boolean;
  showCEO?: boolean;
  showEmail?: boolean;
  backgroundColor?: { hex: string; alpha?: number };
  borderColor?: { hex: string; alpha?: number };
}> = ({ company, layout, showDescription = true, showCEO = true, showEmail = false, backgroundColor, borderColor }) => {
  const logoUrl = company.logo ? getImageUrl(company.logo, 220, 220) : null;

  const backgroundStyle = backgroundColor 
    ? { backgroundColor: backgroundColor.hex }
    : {};

  const borderStyle = borderColor 
    ? { borderColor: borderColor.hex }
    : {};

  const isLightBackground = backgroundColor 
    ? getLuminance(backgroundColor.hex) > 0.5 
    : false; // Default to dark theme

  const textColorClass = isLightBackground ? 'text-gray-900' : 'text-white';
  const subTextColorClass = isLightBackground ? 'text-gray-600' : 'text-gray-300';
  const cardBgClass = backgroundColor ? '' : 'bg-gray-800/30';
  const borderClass = borderColor ? 'border' : 'border border-gray-700/50';

  if (layout === 'minimal') {
    return (
      <div 
        className={`flex items-center space-x-4 p-4 rounded-lg backdrop-blur-sm ${cardBgClass} ${borderClass}`}
        style={{...backgroundStyle, ...borderStyle}}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt={company.logo?.alt || `${company.name} logo`}
            className="w-[4.4rem] h-[4.4rem] object-contain rounded"
          />
        )}
        <div>
          <h3 className={`text-lg font-semibold ${textColorClass}`}>{company.name}</h3>
          {showCEO && company.ceoName && (
            <p className={`text-sm ${subTextColorClass}`}>CEO: {company.ceoName}</p>
          )}
        </div>
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div 
        className={`flex items-start space-x-6 p-6 rounded-lg backdrop-blur-sm ${cardBgClass} ${borderClass}`}
        style={{...backgroundStyle, ...borderStyle}}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt={company.logo?.alt || `${company.name} logo`}
            className="w-[6.6rem] h-[6.6rem] object-contain rounded flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-2 ${textColorClass}`}>{company.name}</h3>
          {showCEO && company.ceoName && (
            <p className={`mb-2 ${subTextColorClass}`}>
              <span className="font-semibold">CEO:</span> {company.ceoName}
            </p>
          )}
          {showEmail && company.email && (
            <p className="text-blue-400 mb-2">
              <a href={`mailto:${company.email}`} className="hover:underline">
                {company.email}
              </a>
            </p>
          )}
          {showDescription && company.description && (
            <p className={`leading-relaxed ${subTextColorClass}`}>{company.description}</p>
          )}
        </div>
      </div>
    );
  }

  // Default card layout
  return (
    <div 
      className={`rounded-lg p-6 backdrop-blur-sm text-center ${cardBgClass} ${borderClass}`}
      style={{...backgroundStyle, ...borderStyle}}
    >
      {logoUrl && (
        <img
          src={logoUrl}
          alt={company.logo?.alt || `${company.name} logo`}
          className="w-[8.8rem] h-[8.8rem] object-contain rounded mx-auto mb-4"
        />
      )}
      <h3 className={`text-xl font-bold mb-2 ${textColorClass}`}>{company.name}</h3>
      {showCEO && company.ceoName && (
        <p className={`mb-2 ${subTextColorClass}`}>
          <span className="font-semibold">CEO:</span> {company.ceoName}
        </p>
      )}
      {showEmail && company.email && (
        <p className="text-blue-400 mb-3">
          <a href={`mailto:${company.email}`} className="hover:underline">
            {company.email}
          </a>
        </p>
      )}
      {showDescription && company.description && (
        <p className={`leading-relaxed ${subTextColorClass}`}>{company.description}</p>
      )}
    </div>
  );
};

export const CompanyBlock: React.FC<CompanyBlockProps> = ({ value }) => {
  if (!value.company) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CompanyCard 
        company={value.company} 
        layout={value.layout || 'card'} 
      />
    </div>
  );
};

export const CompanyListBlock: React.FC<CompanyListBlockProps> = ({ value }) => {
  const { designSystem } = useDesignSystem();
  const { 
    title, 
    companies, 
    backgroundColorSelection,
    customBackgroundColor,
    borderColorSelection,
    customBorderColor,
    // Legacy support
    backgroundColor: legacyBackgroundColor,
    borderColor: legacyBorderColor
  } = value;

  if (!companies || companies.length === 0) {
    return null;
  }

  // Helper function to resolve color and convert to expected format
  const resolveColorToObject = (
    colorSelection?: string,
    customColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } },
    legacyColor?: { hex: string; alpha?: number }
  ): { hex: string; alpha?: number } | undefined => {
    if (colorSelection && colorSelection !== 'custom' && designSystem?.colors) {
      const colorValue = designSystem.colors[colorSelection as keyof typeof designSystem.colors];
      if (colorValue) {
        return { hex: colorToCSS(colorValue), alpha: 1 };
      }
    }
    
    if (colorSelection === 'custom' && customColor) {
      return { 
        hex: customColor.hex, 
        alpha: customColor.alpha ?? 1 
      };
    }
    
    return legacyColor;
  };

  // Resolve colors using design system
  const finalBackgroundColor = resolveColorToObject(
    backgroundColorSelection,
    customBackgroundColor,
    legacyBackgroundColor
  );

  const finalBorderColor = resolveColorToObject(
    borderColorSelection,
    customBorderColor,
    legacyBorderColor
  );

  const isLightBackground = finalBackgroundColor 
    ? getLuminance(finalBackgroundColor.hex) > 0.5 
    : false;

  const textColorClass = isLightBackground ? 'text-gray-900' : 'text-white';
  const subTextColorClass = isLightBackground ? 'text-gray-600' : 'text-gray-300';
  const cardBgClass = finalBackgroundColor ? '' : 'bg-gray-800/30';
  const borderClass = finalBorderColor ? 'border' : 'border border-gray-700/50';

  const backgroundStyle = finalBackgroundColor 
    ? { backgroundColor: finalBackgroundColor.hex }
    : {};

  const borderStyle = finalBorderColor 
    ? { borderColor: finalBorderColor.hex }
    : {};

  return (
    <div className="w-full max-w-5xl mx-auto">
      {title && (
        <h2 className={`text-3xl font-bold mb-8 text-center ${textColorClass}`}>{title}</h2>
      )}
      <div className="space-y-6">
        {companies.map((company, index) => {
          const logoUrl = company.logo ? getImageUrl(company.logo, 120, 120) : null;
          
          return (
            <div 
              key={`${company._id}-${index}`}
              className={`flex items-start gap-6 p-6 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] ${cardBgClass} ${borderClass}`}
              style={{...backgroundStyle, ...borderStyle}}
            >
              {/* Logo */}
              {logoUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={logoUrl}
                    alt={company.logo?.alt || `${company.name} logo`}
                    className="w-[120px] h-[120px] object-contain rounded-lg"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Company Name */}
                <h3 className={`text-2xl font-bold mb-3 ${textColorClass}`}>
                  {company.name}
                </h3>
                
                {/* CEO */}
                {company.ceoName && (
                  <p className={`mb-3 ${subTextColorClass}`}>
                    <span className="font-semibold">CEO:</span> {company.ceoName}
                  </p>
                )}
                
                {/* Email */}
                {company.email && (
                  <p className="mb-3">
                    <a 
                      href={`mailto:${company.email}`} 
                      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                      {company.email}
                    </a>
                  </p>
                )}
                
                {/* Description */}
                {company.description && (
                  <p className={`leading-relaxed ${subTextColorClass}`}>
                    {company.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// CompactCompanyListBlock: Shows all companies with layout options (grid, list, carousel, honeycomb, tiltedsquare)
interface CompactCompanyListBlockProps {
  value: {
    title?: string;
    companies: CompanyData[];
    layout?: 'grid' | 'list' | 'carousel' | 'honeycomb' | 'tiltedsquare';
    maxItemsPerRow?: number;
    backgroundColorSelection?: string;
    customBackgroundColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
    borderColorSelection?: string;
    customBorderColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
    // Legacy support
    backgroundColor?: { hex: string; alpha?: number };
    borderColor?: { hex: string; alpha?: number };
  };
}

export const CompactCompanyListBlock: React.FC<CompactCompanyListBlockProps> = ({ value }) => {
  const { designSystem } = useDesignSystem();
  const { 
    title, 
    companies, 
    layout = 'grid',
    maxItemsPerRow,
    backgroundColorSelection,
    customBackgroundColor,
    borderColorSelection,
    customBorderColor,
    backgroundColor: legacyBackgroundColor,
    borderColor: legacyBorderColor
  } = value;

  if (!companies || companies.length === 0) {
    return null;
  }

  // Helper function to resolve color and convert to expected format
  const resolveColorToObject = (
    colorSelection?: string,
    customColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } },
    legacyColor?: { hex: string; alpha?: number }
  ): { hex: string; alpha?: number } | undefined => {
    if (colorSelection && colorSelection !== 'custom' && designSystem?.colors) {
      const colorValue = designSystem.colors[colorSelection as keyof typeof designSystem.colors];
      if (colorValue) {
        return { hex: colorToCSS(colorValue), alpha: 1 };
      }
    }
    
    if (colorSelection === 'custom' && customColor) {
      return { 
        hex: customColor.hex, 
        alpha: customColor.alpha ?? 1 
      };
    }
    
    return legacyColor;
  };

  const finalBackgroundColor = resolveColorToObject(
    backgroundColorSelection,
    customBackgroundColor,
    legacyBackgroundColor
  );

  const finalBorderColor = resolveColorToObject(
    borderColorSelection,
    customBorderColor,
    legacyBorderColor
  );

  const isLightBackground = finalBackgroundColor 
    ? getLuminance(finalBackgroundColor.hex) > 0.5 
    : false;

  const textColorClass = isLightBackground ? 'text-gray-900' : 'text-white';

  const getGridClasses = () => {
    switch (layout) {
      case 'list':
        return 'space-y-4';
      case 'carousel':
        return 'flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900';
      case 'honeycomb':
        return 'honeycomb-grid';
      case 'tiltedsquare':
        return '';
      default: // grid
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {title && (
        <h2 className={`text-3xl font-bold mb-8 text-center ${textColorClass}`}>{title}</h2>
      )}
      <div className={getGridClasses()}>
        {layout === 'honeycomb' ? (
          <HoneycombGrid
            companies={companies}
            maxItemsPerRow={maxItemsPerRow}
            backgroundColor={finalBackgroundColor}
            borderColor={finalBorderColor}
          />
        ) : layout === 'tiltedsquare' ? (
          <TiltedSquareGrid
            companies={companies}
            maxItemsPerRow={maxItemsPerRow}
            backgroundColor={finalBackgroundColor}
            borderColor={finalBorderColor}
          />
        ) : (
          companies.map((company, index) => (
            <div 
              key={`${company._id}-${index}`}
              className={layout === 'carousel' ? 'flex-shrink-0 w-80' : ''}
            >
              <CompanyCard
                company={company}
                layout={layout === 'list' ? 'horizontal' : 'card'}
                showDescription={false}
                showCEO={false}
                showEmail={false}
                backgroundColor={finalBackgroundColor}
                borderColor={finalBorderColor}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function getLuminance(hex: string): number {
  const rgb = hex.replace('#', '');
  const r = parseInt(rgb.substr(0, 2), 16) / 255;
  const g = parseInt(rgb.substr(2, 2), 16) / 255;
  const b = parseInt(rgb.substr(4, 2), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
