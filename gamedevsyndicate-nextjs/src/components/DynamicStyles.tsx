'use client';

import { useEffect } from 'react';

interface DynamicStylesProps {
  menuColor?: string;
  navigationTextColor?: string;
  navigationActiveColor?: string;
}

export default function DynamicStyles({ menuColor, navigationTextColor, navigationActiveColor }: DynamicStylesProps) {
  useEffect(() => {
    const style = document.createElement('style');
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
      style.textContent = styles;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [menuColor, navigationTextColor, navigationActiveColor]);

  return null;
}
