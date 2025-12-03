'use client';

import { useEffect } from 'react';

interface DynamicStylesProps {
  menuColor?: string;
  navigationTextColor?: string;
  navigationActiveColor?: string;
}

export default function DynamicStyles({ menuColor, navigationTextColor, navigationActiveColor }: DynamicStylesProps) {
  useEffect(() => {
    let styles = '';
    
    if (menuColor) {
      styles += `
        header {
          background-color: ${menuColor} !important;
        }
      `;
    }
    
    if (navigationTextColor) {
      styles += `
        .nav-link {
          color: ${navigationTextColor} !important;
        }
      `;
    }
    
    if (navigationActiveColor) {
      styles += `
        .nav-link-active::after {
          background: ${navigationActiveColor} !important;
        }
      `;
    }
    
    if (styles) {
      // Create or update the style element
      let styleElement = document.getElementById('dynamic-nav-styles')
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-nav-styles';
        // Add data attributes to prevent tree-shaking/removal
        styleElement.setAttribute('data-critical', 'true');
        styleElement.setAttribute('data-navigation', 'true');
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = styles;
    }
  }, [menuColor, navigationTextColor, navigationActiveColor]);

  return null;
}
