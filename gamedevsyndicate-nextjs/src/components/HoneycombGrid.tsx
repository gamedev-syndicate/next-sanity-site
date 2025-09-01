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
  showDescription?: boolean;
  showCEO?: boolean;
  showEmail?: boolean;
}

// Configuration object for honeycomb dimensions across different screen sizes
const HONEYCOMB_CONFIG = {
  mobile: {
    breakpoint: 480,
    hexagon: {
      width: 92,
      height: 80,
      marginHorizontal: 2, // margin on each side (total gap = 4px)
    }
  },
  tablet: {
    breakpoint: 768,
    hexagon: {
      width: 119,
      height: 103,
      marginHorizontal: 1, // margin on each side (total gap = 2px)
    }
  },
  desktop: {
    hexagon: {
      width: 145,
      height: 125,
      marginHorizontal: 2, // margin on each side (total gap = 4px)
    }
  }
} as const;

/**
 * Utility class for calculating honeycomb layout dimensions and offsets
 */
class HoneycombCalculator {
  private windowWidth: number;
  
  constructor(windowWidth: number) {
    this.windowWidth = windowWidth;
  }
  
  /**
   * Get the current screen configuration based on window width
   */
  getCurrentConfig() { // Remove 'private' to make it accessible
    if (this.windowWidth <= HONEYCOMB_CONFIG.mobile.breakpoint) {
      return HONEYCOMB_CONFIG.mobile;
    } else if (this.windowWidth <= HONEYCOMB_CONFIG.tablet.breakpoint) {
      return HONEYCOMB_CONFIG.tablet;
    } else {
      return HONEYCOMB_CONFIG.desktop;
    }
  }
  
  /**
   * Calculate the total horizontal space occupied by one hexagon (width + margins)
   */
  getHexagonSpacing(): number {
    const config = this.getCurrentConfig();
    return config.hexagon.width + (config.hexagon.marginHorizontal * 2);
  }
  
  /**
   * Calculate the total width of a row containing the specified number of hexagons
   */
  getRowWidth(itemCount: number): number {
    if (itemCount === 0) return 0;
    
    const config = this.getCurrentConfig();
    const hexagonWidth = config.hexagon.width;
    const marginGap = config.hexagon.marginHorizontal * 2;
    
    // Total width = (hexagon widths) + (gaps between hexagons)
    return (hexagonWidth * itemCount) + (marginGap * (itemCount - 1));
  }
  
  /**
   * Calculate the proper offset for honeycomb tessellation
   * Offset rows should start at the center gap of the previous row
   */
  getRowOffset(previousRowLength: number): number {
    const hexagonSpacing = this.getHexagonSpacing();
    
    // Calculate where the center gap is in the previous row
    let centerGapOffset: number;
    
    if (previousRowLength % 2 === 0) {
      // Even number: gap is between middle items (e.g., between items 2 and 3 in a 4-item row)
      centerGapOffset = (previousRowLength / 2) * hexagonSpacing;
    } else {
      // Odd number: gap is between center item and the one before it
      // (e.g., between items 2 and 3 in a 5-item row, rounded down to item 2)
      const centerIndex = Math.floor(previousRowLength / 2);
      centerGapOffset = (centerIndex + 0.5) * hexagonSpacing;
    }
    
    // On wider screens, we need to double the offset for proper tessellation
    // This matches your original working values
    // if (this.windowWidth > HONEYCOMB_CONFIG.tablet.breakpoint) {
    //   centerGapOffset *= 2;
    // } else if (this.windowWidth > HONEYCOMB_CONFIG.mobile.breakpoint) {
    //   centerGapOffset *= 1.5;
    // }
    
    // Return negative offset to move the row left to align with the center gap
    return -centerGapOffset;
  }
  
  /**
   * Calculate the minimum padding needed on each side (half hexagon width)
   */
  getMinimumSidePadding(): number {
    const config = this.getCurrentConfig();
    return config.hexagon.width / 2;
  }
  
  /**
   * Calculate the maximum number of items that can fit while maintaining minimum padding
   */
  getMaxItemsThatFit(configuredMax: number): number {
    const minimumPadding = this.getMinimumSidePadding();
    const hexagonSpacing = this.getHexagonSpacing();
    const config = this.getCurrentConfig();
    
    // Available width after accounting for minimum padding on both sides
    const availableWidth = this.windowWidth - (minimumPadding * 2);
    
    // Calculate maximum items that fit in available width
    // Formula: (availableWidth + marginGap) / hexagonSpacing
    // The +marginGap accounts for the fact that the last item doesn't need a trailing margin
    const marginGap = config.hexagon.marginHorizontal * 2;
    const maxFittingItems = Math.floor((availableWidth + marginGap) / hexagonSpacing);
    
    // Use the smaller of configured max or what actually fits
    return Math.min(configuredMax, Math.max(1, maxFittingItems));
  }
  
  /**
   * Calculate responsive max items per row based on configured value, screen size, and space constraints
   */
  getResponsiveMaxItems(configuredMax: number): number {
    const baseMax = Math.max(3, configuredMax);
    
    // First apply screen size reductions
    let responsiveMax: number;
    if (this.windowWidth <= HONEYCOMB_CONFIG.mobile.breakpoint) {
      // Mobile: reduce by 2, but minimum of 3
      responsiveMax = Math.max(3, baseMax - 2);
    } else if (this.windowWidth <= HONEYCOMB_CONFIG.tablet.breakpoint) {
      // Tablet: reduce by 1, but minimum of 3
      responsiveMax = Math.max(3, baseMax - 1);
    } else {
      // Desktop: use configured value
      responsiveMax = baseMax;
    }
    
    // Then apply space constraints to ensure minimum padding
    const maxThatFits = this.getMaxItemsThatFit(responsiveMax);
    
    return Math.max(1, maxThatFits);
  }
  
  /**
   * Check if the current layout provides adequate spacing
   */
  hasAdequateSpacing(itemCount: number): boolean {
    const rowWidth = this.getRowWidth(itemCount);
    const minimumPadding = this.getMinimumSidePadding();
    const requiredWidth = rowWidth + (minimumPadding * 2);
    
    return this.windowWidth >= requiredWidth;
  }
  
  /**
   * Get spacing information for debugging
   */
  getSpacingInfo(itemCount: number) {
    const config = this.getCurrentConfig();
    const rowWidth = this.getRowWidth(itemCount);
    const minimumPadding = this.getMinimumSidePadding();
    const availableWidth = this.windowWidth - (minimumPadding * 2);
    const actualPaddingPerSide = (this.windowWidth - rowWidth) / 2;
    
    return {
      windowWidth: this.windowWidth,
      hexagonWidth: config.hexagon.width,
      itemCount,
      rowWidth,
      minimumPadding,
      availableWidth,
      actualPaddingPerSide,
      hasAdequateSpacing: this.hasAdequateSpacing(itemCount)
    };
  }
}

/**
 * Utility function to organize companies into rows for honeycomb display
 * Items are placed from center outward, alternating left and right
 */
const organizeCompaniesIntoRows = (
  companies: CompanyData[], 
  calculator: HoneycombCalculator, 
  maxItemsPerRow: number
): CompanyData[][] => {
  const rows: CompanyData[][] = [];
  const maxItems = calculator.getResponsiveMaxItems(maxItemsPerRow);
  let currentIndex = 0;
  let rowIndex = 0;

  while (currentIndex < companies.length) {
    let companiesInThisRow: number;
    
    // Special handling for edge cases
    if (maxItems === 1) {
      // With only 1 item per row, no alternating pattern makes sense
      companiesInThisRow = 1;
    } else if (maxItems === 2) {
      // With 2 max items, alternate between 2 and 1
      companiesInThisRow = rowIndex % 2 === 0 ? 2 : 1;
    } else {
      // Standard pattern: alternate between max and max-1 items per row
      companiesInThisRow = rowIndex % 2 === 0 ? maxItems : maxItems - 1;
    }
    
    // Don't exceed remaining companies
    companiesInThisRow = Math.min(companiesInThisRow, companies.length - currentIndex);
    
    // Get the companies for this row
    const rowCompanies = companies.slice(currentIndex, currentIndex + companiesInThisRow);
    
    // Arrange companies from center outward, alternating left and right
    const arrangedRow = arrangeFromCenter(rowCompanies);
    
    if (arrangedRow.length > 0) {
      rows.push(arrangedRow);
    }
    
    currentIndex += companiesInThisRow;
    rowIndex++;
  }

  return rows;
};

/**
 * Arrange companies from center outward, alternating placement on left and right
 */
const arrangeFromCenter = (companies: CompanyData[]): CompanyData[] => {
  if (companies.length <= 1) {
    return companies;
  }
  
  const result: CompanyData[] = new Array(companies.length);
  const isOdd = companies.length % 2 === 1;
  const center = Math.floor(companies.length / 2);
  
  if (isOdd) {
    // For odd numbers: start with center, then alternate left/right
    result[center] = companies[0];
    
    for (let i = 1; i < companies.length; i++) {
      const distance = Math.ceil(i / 2);
      if (i % 2 === 1) {
        // Place to the right
        result[center + distance] = companies[i];
      } else {
        // Place to the left
        result[center - distance] = companies[i];
      }
    }
  } else {
    // For even numbers: start with center-right and center-left
    let leftIndex = center - 1;
    let rightIndex = center;
    
    for (let i = 0; i < companies.length; i++) {
      if (i % 2 === 0) {
        // Place to the right side
        result[rightIndex] = companies[i];
        rightIndex++;
      } else {
        // Place to the left side
        result[leftIndex] = companies[i];
        leftIndex--;
      }
    }
  }
  
  return result;
};

const CompanyHoneycomb: React.FC<{
  company: CompanyData;
  showDescription?: boolean;
  showCEO?: boolean;
  showEmail?: boolean;
}> = ({ company, showDescription = true, showCEO = true, showEmail = false }) => {
  const logoUrl = company.logo ? getImageUrl(company.logo, 55, 55) : null;

  return (
    <div className="relative group w-full h-full">
      <div 
        className="relative bg-gradient-to-br from-gray-800/70 to-gray-900/90 backdrop-blur-sm border border-gray-600/30 group-hover:from-gray-700/80 group-hover:to-gray-800/95 group-hover:border-gray-500/50 transition-all duration-300 flex flex-col justify-center items-center text-center w-full h-full"
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
              className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 object-contain rounded mx-auto group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden max-w-full">
          <h3 className="text-sm md:text-sm lg:text-base font-bold text-white leading-none text-center mb-1 break-words max-w-full">
            {company.name.length > 12 ? `${company.name.slice(0, 12)}...` : company.name}
          </h3>
          
          {showCEO && company.ceoName && (
            <p className="text-gray-300 text-xs md:text-sm leading-none text-center mb-1 hidden md:block break-words max-w-full">
              {company.ceoName.length > 10 ? `${company.ceoName.slice(0, 10)}...` : company.ceoName}
            </p>
          )}
          
          {showDescription && company.description && (
            <p className="text-gray-300 text-xs leading-tight text-center hidden lg:block break-words max-w-full">
              {company.description.length > 18 
                ? `${company.description.slice(0, 18)}...` 
                : company.description
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const HoneycombGrid: React.FC<HoneycombGridProps> = ({ 
  companies, 
  maxItemsPerRow = 4, 
  showDescription, 
  showCEO, 
  showEmail 
}) => {
  // State for responsive behavior - use consistent initial value to avoid hydration mismatch
  const [windowWidth, setWindowWidth] = useState(1024);
  const [isClient, setIsClient] = useState(false);
  
  // Handle window resize for responsive recalculation
  useEffect(() => {
    // Set client flag and initial window width
    setIsClient(true);
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize calculator with current window width
  const calculator = new HoneycombCalculator(windowWidth);
  
  // Organize companies into rows
  const rows = organizeCompaniesIntoRows(companies, calculator, maxItemsPerRow);

  // For SSR compatibility, use a simplified layout initially
  const useSimpleLayout = !isClient;
  
  /**
   * Calculate the inline style for each row based on tessellation requirements
   */
  const getRowStyle = (rowIndex: number, rowLength: number): React.CSSProperties => {
    // For SSR compatibility, use simpler layout initially
    if (useSimpleLayout) {
      return {};
    }
    
    // Only odd-indexed rows (2nd, 4th, 6th...) get tessellation offset
    const shouldOffset = rowIndex % 2 === 1;
    
    if (!shouldOffset) {
      return {};
    }
    
    // Get the previous row's length to calculate proper offset
    const previousRow = rows[rowIndex - 1];
    const previousRowLength = previousRow ? previousRow.length : rowLength;
    
    // Calculate the proper offset for this row based on previous row's center gap
    const offset = calculator.getRowOffset(previousRowLength);
    
    return {
      marginLeft: `${offset}px`
    };
  };

  /**
   * Calculate the grid container style to center the honeycomb grid
   */
  const getGridContainerStyle = (): React.CSSProperties => {
    // For SSR compatibility, use simpler centered layout
    if (useSimpleLayout) {
      return {
        width: 'fit-content',
        margin: '0 auto'
      };
    }
    
    // Calculate the width of the widest row (accounting for offsets)
    let maxRowWidth = 0;
    
    rows.forEach((row, rowIndex) => {
      const baseRowWidth = calculator.getRowWidth(row.length);
      const shouldOffset = rowIndex % 2 === 1;
      
      if (shouldOffset) {
        // For offset rows, add the absolute value of the offset to the width
        const offset = Math.abs(calculator.getRowOffset(row.length));
        maxRowWidth = Math.max(maxRowWidth, baseRowWidth + offset);
      } else {
        maxRowWidth = Math.max(maxRowWidth, baseRowWidth);
      }
    });
    
    // Calculate the left margin needed to center the grid
    const availableWidth = windowWidth;
    const leftMargin = Math.max(0, (availableWidth - maxRowWidth) / 2);
    
    return {
      marginLeft: `${leftMargin}px`,
      marginRight: `${leftMargin}px`,
      width: 'fit-content'
    };
  };

  return (
    <div className="honeycomb-grid" style={getGridContainerStyle()}>
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="honeycomb-row"
          style={getRowStyle(rowIndex, row.length)}
        >
          {row.map((company, index) => (
            <CompanyHoneycomb
              key={`${company._id}-${rowIndex}-${index}`}
              company={company}
              showDescription={showDescription}
              showCEO={showCEO}
              showEmail={showEmail}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
