import type { DesignSystem, ColorValue } from '@/types/designSystem'

export interface ColorReference {
  colorSelection?: 'primary' | 'secondary' | 'tertiary' | 'buttonPrimary' | 'buttonSecondary' | 'custom'
  customColor?: {
    hex: string
    alpha?: number
    rgb: { r: number; g: number; b: number; a: number }
  }
  opacityPreset?: string  // '100', '75', '50', or '25'
}

// Extended interfaces for new schema structure
export interface SolidColorReference {
  solidColorSelection?: string
  customSolidColor?: {
    hex: string
    alpha?: number
    rgb: { r: number; g: number; b: number; a: number }
  }
}

export interface GradientColorReference {
  gradientFromSelection?: string
  customGradientFrom?: {
    hex: string
    alpha?: number
    rgb: { r: number; g: number; b: number; a: number }
  }
  gradientToSelection?: string
  customGradientTo?: {
    hex: string
    alpha?: number
    rgb: { r: number; g: number; b: number; a: number }
  }
  gradientDirection?: string
  gradientStartPosition?: number
  gradientEndPosition?: number
}

export interface BackgroundConfig {
  type?: 'none' | 'solid' | 'gradient' | 'image' | 'custom'
  // Solid color fields
  solidColorSelection?: string
  customSolidColor?: {
    hex: string
    alpha?: number
    rgb: { r: number; g: number; b: number; a: number }
  }
  // Gradient fields
  gradientFromSelection?: string
  customGradientFrom?: {
    hex: string
    alpha?: number
    rgb: { r: number; g: number; b: number; a: number }
  }
  gradientToSelection?: string
  customGradientTo?: {
    hex: string
    alpha?: number
    rgb: { r: number; g: number; b: number; a: number }
  }
  gradientDirection?: string
  gradientStartPosition?: number
  gradientEndPosition?: number
  // Legacy support
  solidColor?: { hex: string; alpha?: number }
  gradientFrom?: { hex: string; alpha?: number }
  gradientTo?: { hex: string; alpha?: number }
  backgroundImage?: unknown
  customCSS?: string
}

export function resolveColor(
  colorRef: ColorReference,
  designSystem: DesignSystem,
  fallback = '#000000'
): string {
  if (!colorRef || !colorRef.colorSelection) {
    return fallback
  }

  // Custom colors don't use opacity preset
  if (colorRef.colorSelection === 'custom' && colorRef.customColor) {
    const alpha = colorRef.customColor.alpha ?? 1
    if (alpha < 1) {
      const { r, g, b, a } = colorRef.customColor.rgb
      return `rgba(${r}, ${g}, ${b}, ${a})`
    }
    return colorRef.customColor.hex
  }

  // Design system colors with opacity preset multiplication
  if (colorRef.colorSelection !== 'custom' && designSystem?.colors) {
    const colorValue = designSystem.colors[colorRef.colorSelection as keyof typeof designSystem.colors]
    if (colorValue) {
      // Apply opacity preset - defaults to 100% (1.0) if not specified
      const opacityMultiplier = colorRef.opacityPreset ? parseInt(colorRef.opacityPreset) / 100 : 1
      
      // Log warning if color already has transparency and preset is being applied
      if (colorValue.alpha < 1 && opacityMultiplier < 1 && typeof window !== 'undefined') {
        console.warn(
          `Color "${colorRef.colorSelection}" already has ${(colorValue.alpha * 100).toFixed(0)}% opacity. ` +
          `Applying ${colorRef.opacityPreset}% preset will result in ${(colorValue.alpha * opacityMultiplier * 100).toFixed(0)}% final opacity.`
        )
      }
      
      return colorToCSS(colorValue, opacityMultiplier)
    }
  }

  return fallback
}

export function resolveSingleColor(
  colorSelection?: string,
  customColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } },
  designSystem?: DesignSystem,
  fallback = '#000000'
): string {
  if (!colorSelection) {
    return fallback
  }

  if (colorSelection === 'custom' && customColor) {
    const alpha = customColor.alpha ?? 1
    if (alpha < 1) {
      const { r, g, b, a } = customColor.rgb
      return `rgba(${r}, ${g}, ${b}, ${a})`
    }
    return customColor.hex
  }

  if (colorSelection !== 'custom' && designSystem?.colors) {
    const colorValue = designSystem.colors[colorSelection as keyof typeof designSystem.colors]
    if (colorValue) {
      return colorToCSS(colorValue)
    }
  }

  return fallback
}

export function resolveBackgroundStyle(
  config: BackgroundConfig,
  designSystem?: DesignSystem
): React.CSSProperties {
  if (!config || !config.type || config.type === 'none') {
    return {}
  }

  switch (config.type) {
    case 'solid': {
      // Try new format first, fallback to legacy
      const color = config.solidColorSelection 
        ? resolveSingleColor(config.solidColorSelection, config.customSolidColor, designSystem)
        : config.solidColor?.hex || 'transparent'
      
      return {
        backgroundColor: color,
      }
    }

    case 'gradient': {
      // Try new format first, fallback to legacy
      const fromColor = config.gradientFromSelection
        ? resolveSingleColor(config.gradientFromSelection, config.customGradientFrom, designSystem)
        : config.gradientFrom?.hex || '#000000'
      
      const toColor = config.gradientToSelection
        ? resolveSingleColor(config.gradientToSelection, config.customGradientTo, designSystem)
        : config.gradientTo?.hex || '#ffffff'

      const direction = config.gradientDirection || 'to-br'
      const startPos = config.gradientStartPosition ?? 0
      const endPos = config.gradientEndPosition ?? 100

      // Convert Tailwind direction to CSS
      const directionMap: Record<string, string> = {
        'to-t': '0deg',
        'to-b': '180deg',
        'to-l': '270deg',
        'to-r': '90deg',
        'to-tl': '315deg',
        'to-tr': '45deg',
        'to-bl': '225deg',
        'to-br': '135deg',
      }

      const cssDirection = directionMap[direction] || '135deg'
      
      return {
        background: `linear-gradient(${cssDirection}, ${fromColor} ${startPos}%, ${toColor} ${endPos}%)`,
      }
    }

    case 'image': {
      if (config.backgroundImage) {
        // Handle Sanity image
        const bgImage = config.backgroundImage as { url?: string } | string;
        const imageUrl = typeof bgImage === 'string' ? bgImage : bgImage.url || '';
        return {
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      }
      return {}
    }

    case 'custom': {
      if (config.customCSS) {
        return {
          background: config.customCSS,
        }
      }
      return {}
    }

    default:
      return {}
  }
}

export function colorToCSS(color: ColorValue, opacityMultiplier = 1): string {
  if (!color) return '#000000'
  
  // Multiply existing alpha with the preset multiplier
  const finalAlpha = color.alpha * opacityMultiplier
  
  if (finalAlpha < 1) {
    return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${finalAlpha})`
  }
  
  return color.hex
}

export function getCSSVariableForColor(colorSelection: string): string {
  switch (colorSelection) {
    case 'primary':
      return 'var(--color-primary)'
    case 'secondary':
      return 'var(--color-secondary)'
    case 'tertiary':
      return 'var(--color-tertiary)'
    case 'buttonPrimary':
      return 'var(--color-button-primary)'
    case 'buttonSecondary':
      return 'var(--color-button-secondary)'
    default:
      return 'var(--color-primary)'
  }
}
