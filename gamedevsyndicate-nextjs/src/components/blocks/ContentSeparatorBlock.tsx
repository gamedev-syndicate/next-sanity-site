import React from 'react';

interface SanityColor {
  _type: 'color';
  alpha: number;
  hex: string;
  hsl: object;
  hsv: object;
  rgb: object;
}

interface ContentSeparatorBlockProps {
  lineColor?: SanityColor;
  diamondColor?: SanityColor;
  strokeWidth?: number;
  height?: string;
  margin?: {
    top?: string;
    bottom?: string;
  };
}

const getColorValue = (color?: SanityColor): string => {
  console.log('Full color object structure:', JSON.stringify(color, null, 2));
  
  if (!color?.hex) {
    console.log('No valid color found, using default');
    return '#FFFFFF3D'; // Default fallback
  }
  
  if (color.alpha !== undefined && color.alpha < 1) {
    // Convert to hex with alpha
    const alphaHex = Math.floor(color.alpha * 255).toString(16).padStart(2, '0');
    const result = `${color.hex}${alphaHex}`;
    console.log('Color with alpha:', result);
    return result;
  }
  
  console.log('Using hex color:', color.hex);
  return color.hex;
};

const ContentSeparatorBlock: React.FC<ContentSeparatorBlockProps> = ({
  lineColor,
  diamondColor,
  strokeWidth = 0.4,
  height = '24px',
  margin = { top: '2rem', bottom: '2rem' },
}) => {
  console.log('ContentSeparatorBlock props received:', JSON.stringify({ lineColor, diamondColor, strokeWidth, height, margin }, null, 2));
  
  const lineColorValue = getColorValue(lineColor);
  const diamondColorValue = getColorValue(diamondColor);
  
  console.log('Final colors:', { lineColorValue, diamondColorValue });
  
  const containerStyle: React.CSSProperties = {
    marginTop: margin?.top || '2rem',
    marginBottom: margin?.bottom || '2rem',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: height,
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const lineStyle: React.CSSProperties = {
    flex: 1,
    height: `${strokeWidth}px`,
    backgroundColor: lineColorValue,
    borderRadius: '2px',
  };

  const diamondStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    backgroundColor: diamondColorValue,
    transform: 'rotate(45deg)',
    margin: '0 20px',
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={lineStyle}></div>
      <div style={diamondStyle}></div>
      <div style={lineStyle}></div>
    </div>
  );
};

export default ContentSeparatorBlock;