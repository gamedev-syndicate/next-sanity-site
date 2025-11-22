'use client'

import { useEffect } from 'react'
import { generateCSSVariables } from '@/lib/designSystem'
import type { DesignSystem } from '@/types/designSystem'

interface DesignSystemProviderProps {
  children: React.ReactNode
  designSystem?: DesignSystem | null
}

export function DesignSystemProvider({ children, designSystem }: DesignSystemProviderProps) {
  useEffect(() => {
    let cssContent = '';
    
    if (designSystem) {
      // Use the design system to generate CSS variables
      cssContent = generateCSSVariables(designSystem);
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
  }, [designSystem])

  return <>{children}</>
}
