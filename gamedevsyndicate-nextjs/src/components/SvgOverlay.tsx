'use client';

import React from 'react';
import { OverlayTexture, PageBackground, SectionBackground } from '../types/sanity';
import { generateOverlayCSS, generateSVGPatternStyle } from '../lib/background-utils';

interface SvgOverlayProps {
  overlayTexture?: OverlayTexture;
  backgroundConfig?: PageBackground | SectionBackground;
  className?: string;
  isSection?: boolean;
}

/**
 * SvgOverlay Component
 * Renders an SVG pattern overlay that inherits colors from the background configuration.
 * Supports both page-level (fixed) and section-level (scrolling) positioning.
 */
export default function SvgOverlay({ 
  overlayTexture, 
  backgroundConfig, 
  className = '', 
  isSection = false 
}: SvgOverlayProps) {
  // Don't render if overlay is disabled or no SVG file
  if (!overlayTexture?.enabled || !overlayTexture.svgFile?.asset?.url) {
    return null;
  }

  // Generate background CSS from the background configuration
  let backgroundCSS: string | undefined;
  if (backgroundConfig) {
    if (isSection) {
      backgroundCSS = generateOverlayCSS(backgroundConfig as SectionBackground);
    } else {
      backgroundCSS = generateOverlayCSS(backgroundConfig as PageBackground);
    }
  }

  // Generate the complete SVG pattern style with inherited background
  const patternStyle = generateSVGPatternStyle(overlayTexture, isSection);

  return (
    <div
      className={className}
      aria-hidden="true"
      style={patternStyle}
    />
  );
}
