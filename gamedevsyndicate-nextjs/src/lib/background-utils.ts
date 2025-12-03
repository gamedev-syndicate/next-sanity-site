import { PageBackground, SectionBackground, OverlayTexture } from '../types/sanity';
import { getImageUrl } from './sanity-image';
import { resolveBackgroundStyle, type BackgroundConfig } from './colorUtils';
import type { DesignSystem } from '@/types/designSystem';

interface SanityColor {
  _type: 'color';
  hex: string;
  alpha?: number;
}

/**
 * Converts a Sanity color object to a CSS color string
 */
export function sanityColorToCSS(color?: SanityColor): string {
  if (!color) return 'transparent';
  
  if (color.alpha !== undefined && color.alpha < 1) {
    // Convert hex to rgba if alpha is present
    const hex = color.hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${color.alpha})`;
  }
  
  return color.hex;
}

interface DesignSystemColorValue {
  hex: string;
  alpha?: number;
  rgb?: { r: number; g: number; b: number; a: number };
}

/**
 * Converts a design system color value to CSS string
 */
export function designSystemColorToCSS(colorValue?: DesignSystemColorValue): string {
  if (!colorValue) return 'transparent';
  
  if (colorValue.alpha !== undefined && colorValue.alpha < 1 && colorValue.rgb) {
    const { r, g, b, a } = colorValue.rgb;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  
  return colorValue.hex;
}

/**
 * Generates CSS background style from section background configuration
 * Now supports both legacy and new design system structure
 */
export function generateSectionBackgroundCSS(
  sectionBackground?: SectionBackground,
  designSystem?: DesignSystem
): string {
  if (!sectionBackground || sectionBackground.type === 'none') {
    return 'transparent';
  }

  // Use new design system approach if available
  const sectionBg = sectionBackground as SectionBackground & {
    solidColorSelection?: string;
    customSolidColor?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
    gradientFromSelection?: string;
    customGradientFrom?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
    gradientToSelection?: string;
    customGradientTo?: { hex: string; alpha?: number; rgb: { r: number; g: number; b: number; a: number } };
  };
  
  const backgroundConfig: BackgroundConfig = {
    type: sectionBackground.type,
    // New design system fields
    solidColorSelection: sectionBg.solidColorSelection,
    customSolidColor: sectionBg.customSolidColor,
    gradientFromSelection: sectionBg.gradientFromSelection,
    customGradientFrom: sectionBg.customGradientFrom,
    gradientToSelection: sectionBg.gradientToSelection,
    customGradientTo: sectionBg.customGradientTo,
    gradientDirection: sectionBackground.gradientDirection,
    gradientStartPosition: sectionBackground.gradientStartPosition,
    gradientEndPosition: sectionBackground.gradientEndPosition,
    // Legacy fields for backward compatibility
    solidColor: sectionBackground.solidColor,
    gradientFrom: sectionBackground.gradientFrom,
    gradientTo: sectionBackground.gradientTo,
    backgroundImage: sectionBackground.backgroundImage,
  };

  const styles = resolveBackgroundStyle(backgroundConfig, designSystem);
  
  if (styles.background && typeof styles.background === 'string') {
    return styles.background;
  }
  
  if (styles.backgroundColor && typeof styles.backgroundColor === 'string') {
    return styles.backgroundColor;
  }

  // Fallback to legacy logic
  switch (sectionBackground.type) {
    case 'solid':
      return sanityColorToCSS(sectionBackground.solidColor);

    case 'gradient':
      const fromColor = sanityColorToCSS(sectionBackground.gradientFrom);
      const toColor = sanityColorToCSS(sectionBackground.gradientTo);
      const direction = sectionBackground.gradientDirection || 'to-b';
      const startPos = sectionBackground.gradientStartPosition ?? 0;
      const endPos = sectionBackground.gradientEndPosition ?? 100;
      
      // Handle radial gradient
      if (direction === 'radial') {
        return `radial-gradient(circle, ${fromColor} ${startPos}%, ${toColor} ${endPos}%)`;
      }
      
      // Convert direction to CSS
      const cssDirection = {
        'to-b': 'to bottom',
        'to-r': 'to right',
        'to-br': 'to bottom right',
      }[direction] || 'to bottom';
      
      return `linear-gradient(${cssDirection}, ${fromColor} ${startPos}%, ${toColor} ${endPos}%)`;

    case 'image':
      if (sectionBackground.backgroundImage) {
        const imageUrl = getImageUrl(sectionBackground.backgroundImage, 1920, 1080);
        return `url('${imageUrl}')`;
      }
      return 'transparent';

    default:
      return 'transparent';
  }
}

/**
 * Generates complete background style properties for sections
 */
export function generateSectionBackgroundStyle(
  sectionBackground?: SectionBackground, 
  designSystem?: DesignSystem
): React.CSSProperties {
  const backgroundCSS = generateSectionBackgroundCSS(sectionBackground, designSystem);
  
  const baseStyle: React.CSSProperties = {
    background: backgroundCSS,
  };

  // Add additional properties for image backgrounds
  if (sectionBackground?.type === 'image') {
    return {
      ...baseStyle,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  return baseStyle;
}

type ExtendedPageBackground = PageBackground & {
  solidColorSelection?: string;
  customSolidColor?: SanityColor;
  gradientFromSelection?: string;
  customGradientFrom?: SanityColor;
  gradientToSelection?: string;
  customGradientTo?: SanityColor;
};

/**
 * Generates CSS background style from page background configuration
 * Now supports design system colors
 */
export function generateBackgroundCSS(pageBackground?: PageBackground, designSystem?: DesignSystem): string {
  if (!pageBackground) {
    // Default gradient
    return 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)';
  }

  const extendedBg = pageBackground as ExtendedPageBackground;

  switch (pageBackground.type) {
    case 'solid':
      // Try design system first, then fallback to legacy
      if (extendedBg.solidColorSelection) {
        const selection = extendedBg.solidColorSelection;
        if (selection === 'custom' && extendedBg.customSolidColor) {
          return sanityColorToCSS(extendedBg.customSolidColor);
        } else if (selection !== 'custom' && designSystem?.colors) {
          const colorValue = designSystem.colors[selection as keyof typeof designSystem.colors];
          if (colorValue) {
            return designSystemColorToCSS(colorValue);
          }
        }
      }
      // Fallback to legacy solidColor
      return sanityColorToCSS(pageBackground.solidColor) || '#044769'; // Fallback to primary color

    case 'gradient':
      let fromColor = 'transparent';
      let toColor = 'transparent';

      // Try design system colors first
      if (extendedBg.gradientFromSelection) {
        const fromSelection = extendedBg.gradientFromSelection;
        if (fromSelection === 'custom' && extendedBg.customGradientFrom) {
          fromColor = sanityColorToCSS(extendedBg.customGradientFrom);
        } else if (fromSelection !== 'custom' && designSystem?.colors) {
          const colorValue = designSystem.colors[fromSelection as keyof typeof designSystem.colors];
          if (colorValue) {
            fromColor = designSystemColorToCSS(colorValue);
          }
        }
      } else {
        // Fallback to legacy gradientFrom
        fromColor = sanityColorToCSS(pageBackground.gradientFrom);
      }

      if (extendedBg.gradientToSelection) {
        const toSelection = extendedBg.gradientToSelection;
        if (toSelection === 'custom' && extendedBg.customGradientTo) {
          toColor = sanityColorToCSS(extendedBg.customGradientTo);
        } else if (toSelection !== 'custom' && designSystem?.colors) {
          const colorValue = designSystem.colors[toSelection as keyof typeof designSystem.colors];
          if (colorValue) {
            toColor = designSystemColorToCSS(colorValue);
          }
        }
      } else {
        // Fallback to legacy gradientTo
        toColor = sanityColorToCSS(pageBackground.gradientTo);
      }

      const direction = pageBackground.gradientDirection || 'to-br';
      const startPos = pageBackground.gradientStartPosition ?? 0;
      const endPos = pageBackground.gradientEndPosition ?? 100;
      
      // Handle radial gradient
      if (direction === 'radial') {
        return `radial-gradient(circle, ${fromColor} ${startPos}%, ${toColor} ${endPos}%)`;
      }
      
      // Convert Tailwind-style direction to CSS
      const cssDirection = {
        'to-b': 'to bottom',
        'to-t': 'to top',
        'to-r': 'to right',
        'to-l': 'to left',
        'to-br': 'to bottom right',
        'to-bl': 'to bottom left',
      }[direction] || 'to bottom right';
      
      return `linear-gradient(${cssDirection}, ${fromColor} ${startPos}%, ${toColor} ${endPos}%)`;

    case 'image':
      if (pageBackground.backgroundImage) {
        const imageUrl = getImageUrl(pageBackground.backgroundImage, 1920, 1080);
        return `url('${imageUrl}')`;
      }
      return 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)';

    case 'custom':
      return pageBackground.customCSS || 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)';

    default:
      return 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)';
  }
}

/**
 * Generates complete background style properties for CSS
 */
export function generateBackgroundStyle(pageBackground?: PageBackground, designSystem?: DesignSystem): React.CSSProperties {
  const backgroundCSS = generateBackgroundCSS(pageBackground, designSystem);
  
  const baseStyle: React.CSSProperties = {
    background: backgroundCSS,
  };

  // Add additional properties for image backgrounds
  if (pageBackground?.type === 'image') {
    return {
      ...baseStyle,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    };
  }

  return baseStyle;
}



/**
 * Generates CSS background style from overlay texture configuration
 * (NO additional opacity, only color alpha is used)
 */
export function generateOverlayCSS(overlayTexture?: OverlayTexture): string {
  if (!overlayTexture?.enabled) {
    return 'transparent';
  }

  // Generate color overlay based on type
  switch (overlayTexture.colorType) {
    case 'solid':
      return sanityColorToCSS(overlayTexture.solidColor);

    case 'gradient':
      const fromColor = sanityColorToCSS(overlayTexture.gradientFrom);
      const toColor = sanityColorToCSS(overlayTexture.gradientTo);

      if (fromColor === 'transparent' || toColor === 'transparent') {
        return 'transparent';
      }

      const direction = overlayTexture.gradientDirection || 'to-br';
      const startPos = overlayTexture.gradientStartPosition ?? 0;
      const endPos = overlayTexture.gradientEndPosition ?? 100;

      // Handle radial gradient
      if (direction === 'radial') {
        return `radial-gradient(circle, ${fromColor} ${startPos}%, ${toColor} ${endPos}%)`;
      }

      const cssDirection = {
        'to-b': 'to bottom',
        'to-t': 'to top',
        'to-r': 'to right',
        'to-l': 'to left',
        'to-br': 'to bottom right',
        'to-bl': 'to bottom left',
      }[direction] || 'to bottom right';

      return `linear-gradient(${cssDirection}, ${fromColor} ${startPos}%, ${toColor} ${endPos}%)`;

    default:
      return 'transparent';
  }
}

/**
 * Generates SVG pattern style properties for CSS
 * (NO additional opacity, only color alpha is used)
 */
export function generateSVGPatternStyle(
  overlayTexture?: OverlayTexture, 
  isSection: boolean = false
): React.CSSProperties {
  if (!overlayTexture?.enabled || !overlayTexture.svgFile?.asset?.url) {
    return {};
  }

  const background = generateOverlayCSS(overlayTexture);

  let patternSize = '400px';
  if (overlayTexture.patternSize) {
    if (overlayTexture.patternSize === 'custom' && overlayTexture.customPatternSize) {
      patternSize = overlayTexture.customPatternSize;
    } else {
      patternSize = overlayTexture.patternSize;
    }
  }

  const size = parseInt(patternSize);
  const tileMode = overlayTexture.tileMode || 'repeat';
  const svgUrl = overlayTexture.svgFile.asset.url;

  // Return explicit inline styles to prevent tree-shaking
  return {
    background: background || 'transparent',
    // Standard mask properties
    mask: `url('${svgUrl}')`,
    maskRepeat: tileMode as React.CSSProperties['maskRepeat'],
    maskSize: `${size}px ${size}px`,
    maskPosition: '0 0',
    maskComposite: 'source-over' as React.CSSProperties['maskComposite'],
    // WebKit-specific mask properties (required for Safari/Chrome)
    WebkitMask: `url('${svgUrl}')`,
    WebkitMaskRepeat: tileMode,
    WebkitMaskSize: `${size}px ${size}px`,
    WebkitMaskPosition: '0 0',
    WebkitMaskComposite: 'source-over',
    // Positioning
    pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
    position: (isSection ? 'absolute' : 'fixed') as React.CSSProperties['position'],
    top: 0,
    left: 0,
    width: isSection ? '100%' : '100vw',
    height: isSection ? '100%' : '100vh',
    zIndex: 0,
    // Force layer creation to ensure rendering
    willChange: 'transform',
    transform: 'translateZ(0)',
  };
}

/**
 * Generates color overlay style properties for CSS
 * (NO additional opacity, only color alpha is used)
 */
export function generateColorOverlayStyle(overlayTexture?: OverlayTexture, isSection: boolean = false): React.CSSProperties {
  if (!overlayTexture?.enabled) {
    return { display: 'none' };
  }

  const colorOverlay = generateOverlayCSS(overlayTexture);

  if (colorOverlay === 'transparent') {
    return { display: 'none' };
  }

  if (isSection) {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: colorOverlay,
      pointerEvents: 'none',
      zIndex: 0,
    } as React.CSSProperties;
  } else {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: colorOverlay,
      pointerEvents: 'none',
      zIndex: 0,
    } as React.CSSProperties;
  }
}

/**
 * @deprecated Use generateSVGPatternStyle and generateColorOverlayStyle instead
 * Generates complete overlay style properties for CSS
 */
export function generateOverlayStyle(overlayTexture?: OverlayTexture): React.CSSProperties {
  if (!overlayTexture?.enabled) {
    return { display: 'none' };
  }

  const colorOverlay = generateOverlayCSS(overlayTexture);
  const svgUrl = overlayTexture.svgFile?.asset?.url;
  
  const baseStyle: React.CSSProperties = {
    opacity: overlayTexture.opacity || 0.3,
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  };

  // If we have an SVG file, use it as background pattern with color overlay
  if (svgUrl) {
    return {
      ...baseStyle,
      backgroundImage: `url('${svgUrl}')`,
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
    };
  } else {
    // If no SVG, just show the color overlay
    return {
      ...baseStyle,
      background: colorOverlay,
    };
  }
}
