import React from "react";
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
}

const TiltedSquare: React.FC<{
  company: CompanyData;
  showDescription?: boolean;
  showCEO?: boolean;
  showEmail?: boolean;
  size: number;
}> = ({ company, showDescription = true, showCEO = true, showEmail = false, size }) => {
  const logoUrl = company.logo ? getImageUrl(company.logo, 55, 55) : null;
  return (
    <div
      className="tilted-square group flex items-center justify-center"
      style={{
        width: size,
        height: size,
        transform: "rotate(45deg)",
        background: "linear-gradient(135deg, #23272f 80%, #1a1d22 100%)",
        border: "1.5px solid #444",
        margin: 0,
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
        <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 2, wordBreak: "break-word" }}>
          {company.name.length > 12 ? `${company.name.slice(0, 12)}...` : company.name}
        </div>
        {showCEO && company.ceoName && (
          <div style={{ color: "#ccc", fontSize: 12, marginBottom: 2 }}>
            {company.ceoName.length > 10 ? `${company.ceoName.slice(0, 10)}...` : company.ceoName}
          </div>
        )}
        {showDescription && company.description && (
          <div style={{ color: "#bbb", fontSize: 11, marginBottom: 2 }}>
            {company.description.length > 18 ? `${company.description.slice(0, 18)}...` : company.description}
          </div>
        )}
        {showEmail && company.email && (
          <div style={{ color: "#aaa", fontSize: 10, marginTop: 2 }}>
            {company.email.length > 16 ? `${company.email.slice(0, 16)}...` : company.email}
          </div>
        )}
      </div>
    </div>
  );
};


export const TiltedSquareGrid: React.FC<TiltedSquareGridProps> = ({
  companies,
  showDescription,
  showCEO,
  showEmail,
  size = 90,
  gap = 4,
  maxItemsPerRow = 5,
}) => {
  const itemsPerRow = Math.max(1, maxItemsPerRow || 5);
  const rows: CompanyData[][] = [];
  for (let i = 0; i < companies.length; i += itemsPerRow) {
    rows.push(companies.slice(i, i + itemsPerRow));
  }

  // Calculate vertical offset so squares touch at corners
  const diamondHeight = size * Math.SQRT2 / 2; // height from center to top/bottom corner
  const verticalStep = diamondHeight + gap / 2;
  const horizontalStep = size * Math.SQRT2 + gap; // <-- FIXED HERE

  return (
    <div
      className="tilted-square-grid"
      style={{
        position: 'relative',
        width: itemsPerRow * horizontalStep + horizontalStep / 2,
        margin: '0 auto',
        padding: gap,
        minHeight: rows.length * verticalStep + size / 2,
      }}
    >
      {rows.map((row, rowIdx) => (
        row.map((company, colIdx) => {
          // Diagonal/brick offset: each row starts further right
          const left = colIdx * horizontalStep + rowIdx * (horizontalStep / 2);
          const top = rowIdx * verticalStep;
          return (
            <div
              key={`${company._id}-${rowIdx}-${colIdx}`}
              style={{
                position: 'absolute',
                left,
                top,
              }}
            >
              <TiltedSquare
                company={company}
                showDescription={showDescription}
                showCEO={showCEO}
                showEmail={showEmail}
                size={size}
              />
            </div>
          );
        })
      ))}
    </div>
  );
};
