import { sanityClient } from '@/sanityClient'
import type { DesignSystem, ColorValue } from '@/types/designSystem'

export async function getDesignSystem(): Promise<DesignSystem | null> {
  try {
    const designSystem = await sanityClient.fetch<DesignSystem>(
      `*[_type == "designSystem"][0]{
        _id,
        _type,
        title,
        colors,
        accessibility,
        _createdAt,
        _updatedAt
      }`
    )
    
    return designSystem
  } catch (error) {
    console.error('Error fetching design system:', error)
    return null
  }
}

export function colorToCSS(color: ColorValue): string {
  if (!color) return '#000000'
  
  if (color.alpha < 1) {
    return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.alpha})`
  }
  
  return color.hex
}

export function generateCSSVariables(designSystem: DesignSystem): string {
  if (!designSystem?.colors) return ''
  
  const { colors } = designSystem
  
  return `
    :root {
      --color-primary: ${colorToCSS(colors.primary)};
      --color-secondary: ${colorToCSS(colors.secondary)};
      --color-tertiary: ${colorToCSS(colors.tertiary)};
      --color-button-primary: ${colorToCSS(colors.buttonPrimary)};
      --color-button-secondary: ${colorToCSS(colors.buttonSecondary)};
      --color-button-text-primary: ${colorToCSS(colors.buttonTextPrimary)};
      --color-button-text-secondary: ${colorToCSS(colors.buttonTextSecondary)};
      
      /* RGB values for Tailwind CSS */
      --color-primary-rgb: ${colors.primary?.rgb ? `${colors.primary.rgb.r} ${colors.primary.rgb.g} ${colors.primary.rgb.b}` : '0 0 0'};
      --color-secondary-rgb: ${colors.secondary?.rgb ? `${colors.secondary.rgb.r} ${colors.secondary.rgb.g} ${colors.secondary.rgb.b}` : '0 0 0'};
      --color-tertiary-rgb: ${colors.tertiary?.rgb ? `${colors.tertiary.rgb.r} ${colors.tertiary.rgb.g} ${colors.tertiary.rgb.b}` : '0 0 0'};
      --color-button-primary-rgb: ${colors.buttonPrimary?.rgb ? `${colors.buttonPrimary.rgb.r} ${colors.buttonPrimary.rgb.g} ${colors.buttonPrimary.rgb.b}` : '0 0 0'};
      --color-button-secondary-rgb: ${colors.buttonSecondary?.rgb ? `${colors.buttonSecondary.rgb.r} ${colors.buttonSecondary.rgb.g} ${colors.buttonSecondary.rgb.b}` : '0 0 0'};
      --color-button-text-primary-rgb: ${colors.buttonTextPrimary?.rgb ? `${colors.buttonTextPrimary.rgb.r} ${colors.buttonTextPrimary.rgb.g} ${colors.buttonTextPrimary.rgb.b}` : '255 255 255'};
      --color-button-text-secondary-rgb: ${colors.buttonTextSecondary?.rgb ? `${colors.buttonTextSecondary.rgb.r} ${colors.buttonTextSecondary.rgb.g} ${colors.buttonTextSecondary.rgb.b}` : '255 255 255'};
    }
  `
}

export const defaultDesignSystem: DesignSystem = {
  _id: 'default',
  _type: 'designSystem',
  title: 'Default Design System',
  colors: {
    primary: {
      hex: '#3b82f6',
      alpha: 1,
      hsl: { h: 217, s: 91, l: 60, a: 1 },
      hsv: { h: 217, s: 76, v: 96, a: 1 },
      rgb: { r: 59, g: 130, b: 246, a: 1 }
    },
    secondary: {
      hex: '#10b981',
      alpha: 1,
      hsl: { h: 160, s: 84, l: 39, a: 1 },
      hsv: { h: 160, s: 91, v: 72, a: 1 },
      rgb: { r: 16, g: 185, b: 129, a: 1 }
    },
    tertiary: {
      hex: '#f59e0b',
      alpha: 1,
      hsl: { h: 38, s: 92, l: 50, a: 1 },
      hsv: { h: 38, s: 95, v: 96, a: 1 },
      rgb: { r: 245, g: 158, b: 11, a: 1 }
    },
    buttonPrimary: {
      hex: '#1d4ed8',
      alpha: 1,
      hsl: { h: 227, s: 83, l: 48, a: 1 },
      hsv: { h: 227, s: 86, v: 85, a: 1 },
      rgb: { r: 29, g: 78, b: 216, a: 1 }
    },
    buttonSecondary: {
      hex: '#6b7280',
      alpha: 1,
      hsl: { h: 220, s: 9, l: 46, a: 1 },
      hsv: { h: 220, s: 16, v: 50, a: 1 },
      rgb: { r: 107, g: 114, b: 128, a: 1 }
    },
    buttonTextPrimary: {
      hex: '#ffffff',
      alpha: 1,
      hsl: { h: 0, s: 0, l: 100, a: 1 },
      hsv: { h: 0, s: 0, v: 100, a: 1 },
      rgb: { r: 255, g: 255, b: 255, a: 1 }
    },
    buttonTextSecondary: {
      hex: '#ffffff',
      alpha: 1,
      hsl: { h: 0, s: 0, l: 100, a: 1 },
      hsv: { h: 0, s: 0, v: 100, a: 1 },
      rgb: { r: 255, g: 255, b: 255, a: 1 }
    }
  },
  accessibility: {
    contrastRatio: 4.5,
    colorBlindFriendly: true
  },
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString()
}
