"use client";
import React, { useEffect, useState } from "react";
import type { SanityImage } from '../types/sanity';
import { getImageUrl } from '../lib/sanity-image';

interface CompanyData {
  _id: string;
  name: string;
  logo?: SanityImage & { alt?: string };
  ceoName?: string;
  email?: string;
  description?: string;
}

interface TiltedSquareGridProps {
  companies: CompanyData[];
  showDescription?: boolean;
  showCEO?: boolean;
  showEmail?: boolean;
  size?: number; // px size of the square
  gap?: number; // px gap between squares
  maxItemsPerRow?: number;
  backgroundColor?: { hex: string; alpha?: number };
  borderColor?: { hex: string; alpha?: number };
}

const TiltedSquare: React.FC<{
  company: CompanyData;
  showDescription?: boolean;
  showCEO?: boolean;
  showEmail?: boolean;
  size: number;
  backgroundColor?: { hex: string; alpha?: number };
  borderColor?: { hex: string; alpha?: number };
}> = ({ company, showDescription = true, showCEO = true, showEmail = false, size, backgroundColor, borderColor }) => {
  const logoUrl = company.logo ? getImageUrl(company.logo, 55, 55) : null;

  const getBackgroundColor = () => {
    if (!backgroundColor) return "linear-gradient(135deg, #23272f 80%, #1a1d22 100%)";
    
    if (backgroundColor.alpha !== undefined && backgroundColor.alpha < 1) {
      return `${backgroundColor.hex}${Math.floor(backgroundColor.alpha * 255).toString(16).padStart(2, '0')}`;
    }
    return backgroundColor.hex;
  };

  const getBorderColor = () => {
    if (!borderColor) return '#444';
    
    if (borderColor.alpha !== undefined && borderColor.alpha < 1) {
      return `${borderColor.hex}${Math.floor(borderColor.alpha * 255).toString(16).padStart(2, '0')}`;
    }
    return borderColor.hex;
  };

  const isLightBackground = backgroundColor 
    ? getLuminance(backgroundColor.hex) > 0.5 
    : false;

  const textColor = isLightBackground ? '#000' : '#fff';
  const subTextColor = isLightBackground ? '#666' : '#ccc';
  const descTextColor = isLightBackground ? '#888' : '#bbb';
  const emailTextColor = isLightBackground ? '#999' : '#aaa';

  return (
    <div
      className="tilted-square group flex items-center justify-center"
      style={{
        width: size,
        height: size,
        transform: "rotate(45deg)",
        background: getBackgroundColor(),
        border: `2.5px solid ${getBorderColor()}`,
        margin: 20,
        position: "relative",
        transition: "box-shadow 0.2s",
        boxShadow: "0 2px 8px 0 #0002"
      }}
    >
      <div
        style={{
          transform: "rotate(-45deg)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 6,
        }}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt={company.logo?.alt || `${company.name} logo`}
            style={{ width: 32, height: 32, objectFit: "contain", marginBottom: 4, borderRadius: 4 }}
          />
        )}
        <div style={{ fontWeight: 700, color: textColor, fontSize: 14, marginBottom: 2, wordBreak: "break-word" }}>
          {company.name.length > 12 ? `${company.name.slice(0, 12)}...` : company.name}
        </div>
        {showCEO && company.ceoName && (
          <div style={{ color: subTextColor, fontSize: 12, marginBottom: 2 }}>
            {company.ceoName.length > 10 ? `${company.ceoName.slice(0, 10)}...` : company.ceoName}
          </div>
        )}
        {showDescription && company.description && (
          <div style={{ color: descTextColor, fontSize: 11, marginBottom: 2 }}>
            {company.description.length > 18 ? `${company.description.slice(0, 18)}...` : company.description}
          </div>
        )}
        {showEmail && company.email && (
          <div style={{ color: emailTextColor, fontSize: 10, marginTop: 2 }}>
            {company.email.length > 16 ? `${company.email.slice(0, 16)}...` : company.email}
          </div>
        )}
      </div>
    </div>
  );
};

function getLuminance(hex: string): number {
  const rgb = hex.replace('#', '');
  const r = parseInt(rgb.substr(0, 2), 16) / 255;
  const g = parseInt(rgb.substr(2, 2), 16) / 255;
  const b = parseInt(rgb.substr(4, 2), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}


export const TiltedSquareGrid: React.FC<TiltedSquareGridProps> = ({
  companies,
  showDescription,
  showCEO,
  showEmail,
  size = 140,
  gap = 4,
  maxItemsPerRow = 5,
  backgroundColor,
  borderColor,
}) => {
  const [itemsPerRow, setItemsPerRow] = useState(Math.max(1, maxItemsPerRow || 5));
  const [squareSize, setSquareSize] = useState(size);

  useEffect(() => {
    function handleResize() {
      let newItemsPerRow = Math.max(1, maxItemsPerRow || 5);
      if (window.innerWidth < 500) newItemsPerRow = 2;
      else if (window.innerWidth < 800) newItemsPerRow = 3;
      setItemsPerRow(newItemsPerRow);

      // Responsive square size for 2 items per row
      if (newItemsPerRow === 2) {
        // The grid width is 2 * (size * sqrt(2) + gap)
        // We want this to fit within window.innerWidth - some padding
        const maxGridWidth = window.innerWidth - 140; // 16px padding on each side
        const maxSquareSize = (maxGridWidth - 2 * gap) / (2 * Math.SQRT2);
        setSquareSize(Math.min(size, Math.floor(maxSquareSize)));
      } else {
        setSquareSize(size);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [maxItemsPerRow, size, gap]);

  const rows: CompanyData[][] = [];
  for (let i = 0; i < companies.length; i += itemsPerRow) {
    rows.push(companies.slice(i, i + itemsPerRow));
  }

  const diamondHeight = squareSize * Math.SQRT2 / 2;
  const verticalStep = diamondHeight + gap / 2;
  const horizontalStep = squareSize * Math.SQRT2 + gap;
  const gridWidth = itemsPerRow * horizontalStep;

  return (
    <div
      className="tilted-square-grid"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: gridWidth,
        margin: '0 auto',
        padding: gap,
        minHeight: rows.length * verticalStep + squareSize / 2,
        boxSizing: 'border-box',
      }}
    >
      {rows.map((row, rowIdx) =>
        row.map((company, colIdx) => {
          const left = colIdx * horizontalStep + (rowIdx % 2 === 1 ? horizontalStep / 2 : 0);
          return (
            <div
              key={`${company._id}-${rowIdx}-${colIdx}`}
              style={{
                position: 'absolute',
                left: `calc(${left}px)`,
                top: rowIdx * verticalStep,
              }}
            >
              <TiltedSquare
                company={company}
                showDescription={showDescription}
                showCEO={showCEO}
                showEmail={showEmail}
                size={squareSize}
                backgroundColor={backgroundColor}
                borderColor={borderColor}
              />
            </div>
          );
        })
      )}
    </div>
  );
};
