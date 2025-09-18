interface SanityColor {
  hex?: string;
  alpha?: number;
}

interface BrandColors {
  primaryColor?: SanityColor;
  secondaryColor?: SanityColor;
  buttonPrimaryColor?: SanityColor;
  buttonSecondaryColor?: SanityColor;
}

const colorToCSS = (color?: SanityColor): string => {
  if (!color?.hex) return '';
  
  if (color.alpha !== undefined && color.alpha < 1) {
    const alphaHex = Math.floor(color.alpha * 255).toString(16).padStart(2, '0');
    return `${color.hex}${alphaHex}`;
  }
  
  return color.hex;
};

export const getBrandColor = (colorType: 'primary' | 'secondary' | 'buttonPrimary' | 'buttonSecondary', brandColors?: BrandColors): string => {
  if (!brandColors) return '';
  
  switch (colorType) {
    case 'primary':
      return colorToCSS(brandColors.primaryColor);
    case 'secondary':
      return colorToCSS(brandColors.secondaryColor);
    case 'buttonPrimary':
      return colorToCSS(brandColors.buttonPrimaryColor);
    case 'buttonSecondary':
      return colorToCSS(brandColors.buttonSecondaryColor);
    default:
      return '';
  }
};

export const generateCSSVariables = (brandColors?: BrandColors): string => {
  if (!brandColors) return '';
  
  const variables = [];
  
  const primaryColor = getBrandColor('primary', brandColors);
  const secondaryColor = getBrandColor('secondary', brandColors);
  const buttonPrimaryColor = getBrandColor('buttonPrimary', brandColors);
  const buttonSecondaryColor = getBrandColor('buttonSecondary', brandColors);
  
  if (primaryColor) variables.push(`--brand-primary: ${primaryColor}`);
  if (secondaryColor) variables.push(`--brand-secondary: ${secondaryColor}`);
  if (buttonPrimaryColor) variables.push(`--brand-button-primary: ${buttonPrimaryColor}`);
  if (buttonSecondaryColor) variables.push(`--brand-button-secondary: ${buttonSecondaryColor}`);
  
  return variables.join('; ');
};

export type { BrandColors, SanityColor };