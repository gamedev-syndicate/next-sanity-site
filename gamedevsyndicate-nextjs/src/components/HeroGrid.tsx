"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { SanityImage } from '../types/sanity';
import { getImageUrl } from '../lib/sanity-image';

// Helper to convert hex color with alpha to proper format
function colorWithAlpha(color: { hex: string; alpha?: number }): string {
  if (color.alpha !== undefined && color.alpha < 1) {
    const r = parseInt(color.hex.slice(1, 3), 16);
    const g = parseInt(color.hex.slice(3, 5), 16);
    const b = parseInt(color.hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${color.alpha})`;
  }
  return color.hex;
}

interface CompanyData {
  _id: string;
  name: string;
  logo?: SanityImage & {
    alt?: string;
  };
  nameIncludedInLogo?: boolean;
  heroImage?: SanityImage & {
    alt?: string;
  };
  ceoName?: string;
  email?: string;
  description?: string;
}

interface HeroGridProps {
  companies: CompanyData[];
  maxItemsPerRow?: number;
  logoBlendMode?: string;
  backgroundColor?: { hex: string; alpha?: number };
  borderColor?: { hex: string; alpha?: number };
}

const HeroGrid: React.FC<HeroGridProps> = ({
  companies,
  maxItemsPerRow = 3,
  logoBlendMode = 'normal',
  backgroundColor,
  borderColor,
}) => {
  // Animation state management
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set up Intersection Observer for scroll animations
  useEffect(() => {
    if (!companies || companies.length === 0) return;
    
    const observers: IntersectionObserver[] = [];
    
    itemRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => new Set(prev).add(index));
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );
      
      observer.observe(ref);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [companies]);

  // Determine grid columns based on maxItemsPerRow
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    7: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7',
    8: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8',
    9: 'grid-cols-3 md:grid-cols-5 lg:grid-cols-9',
    10: 'grid-cols-3 md:grid-cols-5 lg:grid-cols-10',
  }[Math.min(maxItemsPerRow, 10)] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridColsClass} gap-6`}>
      {companies.map((company, index) => {
        const heroImageUrl = company.heroImage 
          ? getImageUrl(company.heroImage, 800, 600, { fit: 'crop' })
          : null;
        
        const logoUrl = company.logo 
          ? getImageUrl(company.logo, 200, 200, { fit: 'max' })
          : null;

        // Animation classes
        const isVisible = visibleItems.has(index);
        const animationClass = 'animate-fadeIn';

        return (
          <div
            key={company._id}
            ref={(el) => { itemRefs.current[index] = el; }}
            className={`relative rounded-lg shadow-lg overflow-hidden aspect-[4/3] bg-gray-800 ${isVisible ? animationClass : 'opacity-0'}`}
          >
            {/* Hero Image Background */}
            {heroImageUrl && (
              <img
                src={heroImageUrl}
                alt={company.heroImage?.alt || `${company.name} hero image`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* White Box Overlay - Bottom Left */}
            <div className="absolute bottom-4 left-4 bg-white shadow-md p-3 flex items-center gap-3 max-w-[calc(100%-2rem)]">
              {/* Logo */}
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={company.logo?.alt || `${company.name} logo`}
                  className="max-h-12 max-w-[200px] object-contain flex-shrink-0"
                  style={{ mixBlendMode: logoBlendMode as React.CSSProperties['mixBlendMode'] }}
                />
              )}
              
              {/* Company Name - Only show if not included in logo */}
              {!company.nameIncludedInLogo && (
                <h3 className="text-gray-900 font-semibold text-sm md:text-base m-0">
                  {company.name}
                </h3>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeroGrid;
