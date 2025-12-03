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
      // Create or update the style element with data attribute to prevent removal
      let styleElement = document.getElementById('design-system-colors')
      
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = 'design-system-colors'
        // Add data attribute to prevent tree-shaking/removal
        styleElement.setAttribute('data-critical', 'true')
        styleElement.setAttribute('data-design-system', 'true')
        // Insert as first child of head for priority
        if (document.head.firstChild) {
          document.head.insertBefore(styleElement, document.head.firstChild)
        } else {
          document.head.appendChild(styleElement)
        }
      }
      
      styleElement.textContent = cssContent;
    }
  }, [designSystem])

  return <>{children}</>
}
