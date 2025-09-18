'use client'

import { useEffect } from 'react'
import { generateCSSVariables } from '@/lib/designSystem'
import type { DesignSystem } from '@/types/designSystem'

interface FallbackColors {
  primaryColor?: { _type: 'color'; hex: string; alpha?: number };
  secondaryColor?: { _type: 'color'; hex: string; alpha?: number };
  buttonPrimaryColor?: { _type: 'color'; hex: string; alpha?: number };
  buttonSecondaryColor?: { _type: 'color'; hex: string; alpha?: number };
}

interface DesignSystemProviderProps {
  children: React.ReactNode
  designSystem?: DesignSystem | null
  fallbackColors?: FallbackColors
}

export function DesignSystemProvider({ children, designSystem, fallbackColors }: DesignSystemProviderProps) {
  useEffect(() => {
    let cssContent = '';
    
    if (designSystem) {
      // Use the design system to generate CSS variables
      cssContent = generateCSSVariables(designSystem);
    } else if (fallbackColors) {
      // Generate CSS variables from fallback colors (old brandColors)
      const fallbackCSS = [];
      if (fallbackColors.primaryColor) {
        fallbackCSS.push(`--color-primary: ${fallbackColors.primaryColor.hex};`);
      }
      if (fallbackColors.secondaryColor) {
        fallbackCSS.push(`--color-secondary: ${fallbackColors.secondaryColor.hex};`);
      }
      if (fallbackColors.buttonPrimaryColor) {
        fallbackCSS.push(`--color-buttonPrimary: ${fallbackColors.buttonPrimaryColor.hex};`);
      }
      if (fallbackColors.buttonSecondaryColor) {
        fallbackCSS.push(`--color-buttonSecondary: ${fallbackColors.buttonSecondaryColor.hex};`);
      }
      
      if (fallbackCSS.length > 0) {
        cssContent = `:root { ${fallbackCSS.join(' ')} }`;
      }
    }
    
    if (cssContent) {
      // Create or update the style element
      let styleElement = document.getElementById('design-system-colors')
      
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = 'design-system-colors'
        document.head.appendChild(styleElement)
      }
      
      styleElement.textContent = cssContent;
    }
  }, [designSystem, fallbackColors])

  return <>{children}</>
}
