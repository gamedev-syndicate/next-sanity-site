import { PageBackground, SectionBackground, SanityColor, OverlayTexture } from '../types/sanity';
import { getImageUrl } from './sanity-image';

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

/**
 * Generates CSS background style from section background configuration
 */
export function generateSectionBackgroundCSS(sectionBackground?: SectionBackground): string {
  if (!sectionBackground || sectionBackground.type === 'none') {
    return 'transparent';
  }

  switch (sectionBackground.type) {
    case 'solid':
      return sanityColorToCSS(sectionBackground.solidColor);

    case 'gradient':
      const fromColor = sanityColorToCSS(sectionBackground.gradientFrom);
      const toColor = sanityColorToCSS(sectionBackground.gradientTo);
      const direction = sectionBackground.gradientDirection || 'to-b';
      const startPos = sectionBackground.gradientStartPosition ?? 0;
      const endPos = sectionBackground.gradientEndPosition ?? 100;
      
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
export function generateSectionBackgroundStyle(sectionBackground?: SectionBackground): React.CSSProperties {
  const backgroundCSS = generateSectionBackgroundCSS(sectionBackground);
  
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

/**
 * Generates CSS background style from page background configuration
 */
export function generateBackgroundCSS(pageBackground?: PageBackground): string {
  if (!pageBackground) {
    // Default gradient
    return 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)';
  }

  switch (pageBackground.type) {
    case 'solid':
      return sanityColorToCSS(pageBackground.solidColor);

    case 'gradient':
      const fromColor = sanityColorToCSS(pageBackground.gradientFrom);
      const toColor = sanityColorToCSS(pageBackground.gradientTo);
      const direction = pageBackground.gradientDirection || 'to-br';
      const startPos = pageBackground.gradientStartPosition ?? 0;
      const endPos = pageBackground.gradientEndPosition ?? 100;
      
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
export function generateBackgroundStyle(pageBackground?: PageBackground): React.CSSProperties {
  const backgroundCSS = generateBackgroundCSS(pageBackground);
  
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
 * Applies opacity to a color value
 */
function applyOpacityToColor(color: string, opacity: number): string {
  // If color is already transparent, return it
  if (color === 'transparent') return color;
  
  // If it's already an rgba color, modify the alpha
  if (color.startsWith('rgba(')) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
    if (match) {
      const [, r, g, b] = match;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
  
  // If it's a hex color, convert to rgba with opacity
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // For other color formats, return as is
  return color;
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

  return {
    background,
    mask: `url('${overlayTexture.svgFile.asset.url}')`,
    maskRepeat: tileMode,
    maskSize: `${size}px ${size}px`,
    maskPosition: '0 0',
    WebkitMask: `url('${overlayTexture.svgFile.asset.url}')`,
    WebkitMaskRepeat: tileMode,
    WebkitMaskSize: `${size}px ${size}px`,
    WebkitMaskPosition: '0 0',
    pointerEvents: 'none',
    position: 'absolute', // <-- FIXED for page-level
    top: 0,
    left: 0,
    width: isSection ? '100%' : '100vw',        // <-- 100vw for page-level
    height: isSection ? '100%' : '100vh',       // <-- 100vh for page-level
    zIndex: 0,
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
