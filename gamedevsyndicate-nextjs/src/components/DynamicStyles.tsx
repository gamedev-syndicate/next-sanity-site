'use client';

import { useEffect } from 'react';

interface DynamicStylesProps {
  menuColor?: string;
}

export default function DynamicStyles({ menuColor }: DynamicStylesProps) {
  useEffect(() => {
    if (menuColor) {
      const style = document.createElement('style');
      style.textContent = `
        header {
          background-color: ${menuColor} !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [menuColor]);

  return null;
}
