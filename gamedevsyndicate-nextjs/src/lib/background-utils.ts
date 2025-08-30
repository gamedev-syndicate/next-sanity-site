import { PageBackground, SectionBackground, SanityColor } from '../types/sanity';
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
      
      // Convert direction to CSS
      const cssDirection = {
        'to-b': 'to bottom',
        'to-r': 'to right',
        'to-br': 'to bottom right',
      }[direction] || 'to bottom';
      
      return `linear-gradient(${cssDirection}, ${fromColor} 0%, ${toColor} 100%)`;

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
