"use client";

import React, { useState, useEffect } from 'react';
import type { SanityImage } from '../types/sanity';
import { getImageUrl } from '../lib/sanity-image';

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

interface HoneycombGridProps {
  companies: CompanyData[];
  maxItemsPerRow?: number;
  backgroundColor?: { hex: string; alpha?: number };
  borderColor?: { hex: string; alpha?: number };
}

// Configuration for hexagon dimensions across screen sizes
const HEXAGON_CONFIG = {
  mobile: {
    breakpoint: 480,
    hexWidth: 92,
    hexHeight: 80,
  },
  tablet: {
    breakpoint: 768,
    hexWidth: 119,
    hexHeight: 103,
  },
  desktop: {
    hexWidth: 145,
    hexHeight: 125,
  }
} as const;

/**
 * Get hexagon dimensions based on window width
 */
function getHexDimensions(windowWidth: number) {
  if (windowWidth <= HEXAGON_CONFIG.mobile.breakpoint) {
    return HEXAGON_CONFIG.mobile;
  } else if (windowWidth <= HEXAGON_CONFIG.tablet.breakpoint) {
    return HEXAGON_CONFIG.tablet;
  } else {
    return HEXAGON_CONFIG.desktop;
  }
}

/**
 * Calculate honeycomb grid layout positions
 * The clip-path polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%) creates:
 * - A pointy-topped hexagon with flat vertical sides from 25% to 75% height
 * - The hexagon spans the full width (0% to 100%) at its widest points
 * 
 * For proper honeycomb tessellation:
 * - Horizontal spacing = full hexWidth + margin (hexagons side-by-side)
 * - Vertical spacing = 75% of hexHeight (standard honeycomb row overlap)
 * - Odd rows offset by half hexWidth (creates interlocking pattern)
 */
function calculateHoneycombLayout(
  companies: CompanyData[],
  maxItemsPerRow: number,
  hexWidth: number,
  hexHeight: number
) {
  const rows: Array<{
    companies: CompanyData[];
    offsetX: number;
    offsetY: number;
  }> = [];

  // Horizontal spacing: full width + small margin (keep margin minimal for tight spacing)
  const horizontalSpacing = hexWidth + 2;
  
  // Vertical spacing: 75% of height + 2px for proper interlocking with spacing
  const verticalSpacing = hexHeight * 0.75 + 2;

  let currentIndex = 0;
  let rowIndex = 0;

  while (currentIndex < companies.length) {
    const isEvenRow = rowIndex % 2 === 0;
    
    // Alternate between full rows and offset rows with one less item
    const itemsInRow = isEvenRow 
      ? Math.min(maxItemsPerRow, companies.length - currentIndex)
      : Math.min(maxItemsPerRow - 1, companies.length - currentIndex);

    if (itemsInRow <= 0) break;

    const rowCompanies = companies.slice(currentIndex, currentIndex + itemsInRow);

    // Even rows (0, 2, 4...) align normally
    // Odd rows (1, 3, 5...) are offset by half horizontal spacing
    const offsetX = isEvenRow ? 0 : horizontalSpacing / 2;
    const offsetY = rowIndex * verticalSpacing;

    rows.push({
      companies: rowCompanies,
      offsetX,
      offsetY,
    });

    currentIndex += itemsInRow;
    rowIndex++;
  }

  // Calculate total grid dimensions
  const maxRowWidth = maxItemsPerRow * horizontalSpacing + hexWidth * 0.25;
  const totalHeight = rows.length * verticalSpacing + hexHeight * 0.25;

  return { 
    rows, 
    gridWidth: maxRowWidth, 
    gridHeight: totalHeight,
    horizontalSpacing,
    verticalSpacing
  };
}

function getLuminance(hex: string): number {
  const rgb = hex.replace('#', '');
  const r = parseInt(rgb.substr(0, 2), 16) / 255;
  const g = parseInt(rgb.substr(2, 2), 16) / 255;
  const b = parseInt(rgb.substr(4, 2), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

const CompanyHoneycomb: React.FC<{
  company: CompanyData;
  backgroundColor?: { hex: string; alpha?: number };
  borderColor?: { hex: string; alpha?: number };
}> = ({ company, backgroundColor, borderColor }) => {
  const logoUrl = company.logo ? getImageUrl(company.logo, 88, 88) : null;

  const backgroundStyle = backgroundColor 
    ? { 
        backgroundColor: backgroundColor.alpha !== undefined && backgroundColor.alpha < 1
          ? `${backgroundColor.hex}${Math.floor(backgroundColor.alpha * 255).toString(16).padStart(2, '0')}`
          : backgroundColor.hex
      }
    : {};

  const borderColorValue = borderColor
    ? (borderColor.alpha !== undefined && borderColor.alpha < 1
        ? `${borderColor.hex}${Math.floor(borderColor.alpha * 255).toString(16).padStart(2, '0')}`
        : borderColor.hex)
    : 'rgba(156, 163, 175, 0.3)';

  const isLightBackground = backgroundColor 
    ? getLuminance(backgroundColor.hex) > 0.5 
    : false;

  const textColorClass = isLightBackground ? 'text-gray-900' : 'text-white';
  const cardBgClass = backgroundColor ? '' : 'bg-gradient-to-br from-gray-800/70 to-gray-900/90';

  return (
    <div className="relative group w-full h-full">
      {/* Content container with clipped background */}
      <div 
        className={`absolute inset-0 ${cardBgClass} backdrop-blur-sm transition-all duration-300`}
        style={{
          clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
          ...backgroundStyle,
        }}
      />
      
      {/* SVG border that follows the hexagon shape - NOT clipped */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <polygon
          points="0,25 0,75 50,100 100,75 100,25 50,0"
          fill="none"
          stroke={borderColorValue}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      
      {/* Content layer on top */}
      <div 
        className="relative z-20 flex flex-col justify-center items-center text-center w-full h-full"
        style={{
          clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
          padding: '2px 12px',
        }}
      >
        {logoUrl && (
          <div className="flex-shrink-0 mb-1">
            <img
              src={logoUrl}
              alt={company.logo?.alt || `${company.name} logo`}
              className="w-[1.925rem] h-[1.925rem] md:w-[2.2rem] md:h-[2.2rem] lg:w-11 lg:h-11 object-contain rounded mx-auto group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden max-w-full">
          <h3 className="text-sm md:text-sm lg:text-base font-bold text-white leading-none text-center break-words max-w-full">
            {company.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export const HoneycombGrid: React.FC<HoneycombGridProps> = ({ 
  companies, 
  maxItemsPerRow = 4,
  backgroundColor,
  borderColor 
}) => {
  const [windowWidth, setWindowWidth] = useState(1024);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get hexagon dimensions for current screen size
  const hexDimensions = getHexDimensions(windowWidth);
  const { hexWidth, hexHeight } = hexDimensions;

  // Adjust max items based on screen size
  let responsiveMax = maxItemsPerRow;
  if (windowWidth <= HEXAGON_CONFIG.mobile.breakpoint) {
    responsiveMax = Math.max(2, Math.min(3, maxItemsPerRow - 2));
  } else if (windowWidth <= HEXAGON_CONFIG.tablet.breakpoint) {
    responsiveMax = Math.max(3, maxItemsPerRow - 1);
  }

  // Calculate layout
  const layout = calculateHoneycombLayout(companies, responsiveMax, hexWidth, hexHeight);
  
  // Use the horizontal spacing from the layout calculation
  const horizontalSpacing = layout.horizontalSpacing;

  return (
    <div 
      className="honeycomb-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: `${layout.gridWidth}px`,
        margin: '0 auto',
        height: `${layout.gridHeight}px`,
        padding: '20px',
      }}
    >
      {layout.rows.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.companies.map((company, itemIndex) => {
            const xPos = row.offsetX + (itemIndex * horizontalSpacing);
            const yPos = row.offsetY;
            
            return (
              <div
                key={`${company._id}-${rowIndex}-${itemIndex}`}
                style={{
                  position: 'absolute',
                  left: `${xPos}px`,
                  top: `${yPos}px`,
                  width: `${hexWidth}px`,
                  height: `${hexHeight}px`,
                }}
              >
                <CompanyHoneycomb
                  company={company}
                  backgroundColor={backgroundColor}
                  borderColor={borderColor}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
