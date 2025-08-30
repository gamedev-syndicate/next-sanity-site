import React from 'react';
import { getImageUrl } from '../lib/sanity-image';
import type { SanityImage } from '../types/sanity';

interface CompanyData {
  _id: string;
  name: string;
  logo?: SanityImage & {
    alt?: string;
  };
  ceoName?: string;
  email?: string;
  description?: string;
}

interface CompanyBlockProps {
  value: {
    company: CompanyData;
    layout?: 'card' | 'horizontal' | 'minimal';
  };
}

interface CompanyListBlockProps {
  value: {
    title?: string;
    companies: CompanyData[];
    layout?: 'grid' | 'list' | 'carousel' | 'honeycomb';
    showDescription?: boolean;
    showCEO?: boolean;
    showEmail?: boolean;
  };
}

const CompanyHoneycomb: React.FC<{
  company: CompanyData;
  showDescription?: boolean;
  showCEO?: boolean;
  showEmail?: boolean;
}> = ({ company, showDescription = true, showCEO = true, showEmail = false }) => {
  const logoUrl = company.logo ? getImageUrl(company.logo, 60, 60) : null;

  return (
    <div className="relative group w-full h-full">
      {/* Hexagonal shape with flat sides horizontal - proper honeycomb orientation */}
      <div 
        className="relative bg-gradient-to-br from-gray-800/70 to-gray-900/90 backdrop-blur-sm border border-gray-600/30 group-hover:from-gray-700/80 group-hover:to-gray-800/95 group-hover:border-gray-500/50 transition-all duration-300 flex flex-col justify-center items-center text-center w-full h-full py-2 px-3"
        style={{
          clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
        }}
      >
        {logoUrl && (
          <div className="flex-shrink-0 mb-1">
            <img
              src={logoUrl}
              alt={company.logo?.alt || `${company.name} logo`}
              className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 object-contain rounded mx-auto group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="flex-1 flex flex-col justify-center items-center">
          <h3 className="text-xs font-bold text-white leading-tight text-center px-1 mb-1">
            {company.name.length > 12 ? `${company.name.slice(0, 12)}...` : company.name}
          </h3>
          
          {showCEO && company.ceoName && (
            <p className="text-gray-300 text-xs text-center px-1 mb-1 hidden md:block">
              {company.ceoName.length > 10 ? `${company.ceoName.slice(0, 10)}...` : company.ceoName}
            </p>
          )}
          
          {showDescription && company.description && (
            <p className="text-gray-300 text-xs text-center px-1 hidden lg:block leading-tight">
              {company.description.length > 20 
                ? `${company.description.slice(0, 20)}...` 
                : company.description
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const CompanyCard: React.FC<{
  company: CompanyData;
  layout: 'card' | 'horizontal' | 'minimal';
  showDescription?: boolean;
  showCEO?: boolean;
  showEmail?: boolean;
}> = ({ company, layout, showDescription = true, showCEO = true, showEmail = false }) => {
  const logoUrl = company.logo ? getImageUrl(company.logo, 150, 150) : null;

  if (layout === 'minimal') {
    return (
      <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={company.logo?.alt || `${company.name} logo`}
            className="w-12 h-12 object-contain rounded"
          />
        )}
        <div>
          <h3 className="text-lg font-semibold text-white">{company.name}</h3>
          {showCEO && company.ceoName && (
            <p className="text-sm text-gray-300">CEO: {company.ceoName}</p>
          )}
        </div>
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div className="flex items-start space-x-6 p-6 bg-gray-800/30 rounded-lg backdrop-blur-sm border border-gray-700/50">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={company.logo?.alt || `${company.name} logo`}
            className="w-20 h-20 object-contain rounded flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{company.name}</h3>
          {showCEO && company.ceoName && (
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">CEO:</span> {company.ceoName}
            </p>
          )}
          {showEmail && company.email && (
            <p className="text-blue-400 mb-2">
              <a href={`mailto:${company.email}`} className="hover:underline">
                {company.email}
              </a>
            </p>
          )}
          {showDescription && company.description && (
            <p className="text-gray-300 leading-relaxed">{company.description}</p>
          )}
        </div>
      </div>
    );
  }

  // Default card layout
  return (
    <div className="bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50 text-center">
      {logoUrl && (
        <img
          src={logoUrl}
          alt={company.logo?.alt || `${company.name} logo`}
          className="w-24 h-24 object-contain rounded mx-auto mb-4"
        />
      )}
      <h3 className="text-xl font-bold text-white mb-2">{company.name}</h3>
      {showCEO && company.ceoName && (
        <p className="text-gray-300 mb-2">
          <span className="font-semibold">CEO:</span> {company.ceoName}
        </p>
      )}
      {showEmail && company.email && (
        <p className="text-blue-400 mb-3">
          <a href={`mailto:${company.email}`} className="hover:underline">
            {company.email}
          </a>
        </p>
      )}
      {showDescription && company.description && (
        <p className="text-gray-300 leading-relaxed">{company.description}</p>
      )}
    </div>
  );
};

export const CompanyBlock: React.FC<CompanyBlockProps> = ({ value }) => {
  if (!value.company) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CompanyCard 
        company={value.company} 
        layout={value.layout || 'card'} 
      />
    </div>
  );
};

export const CompanyListBlock: React.FC<CompanyListBlockProps> = ({ value }) => {
  if (!value.companies || value.companies.length === 0) {
    return null;
  }

  const { title, companies, layout = 'grid', showDescription, showCEO, showEmail } = value;

  const getGridClasses = () => {
    switch (layout) {
      case 'list':
        return 'space-y-4';
      case 'carousel':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto';
      case 'honeycomb':
        return 'honeycomb-grid';
      default: // grid
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  // Function to organize companies into honeycomb rows
  const organizeIntoHoneycombRows = (companies: CompanyData[]) => {
    const rows: CompanyData[][] = [];
    const companiesPerRow = [4, 3, 4, 3]; // Alternating pattern for true honeycomb tessellation
    let currentIndex = 0;
    let rowPatternIndex = 0;

    while (currentIndex < companies.length) {
      const companiesInThisRow = companiesPerRow[rowPatternIndex % companiesPerRow.length];
      const row = companies.slice(currentIndex, currentIndex + companiesInThisRow);
      if (row.length > 0) {
        rows.push(row);
      }
      currentIndex += companiesInThisRow;
      rowPatternIndex++;
    }

    return rows;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {title && (
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{title}</h2>
      )}
      <div className={getGridClasses()}>
        {layout === 'honeycomb' ? (
          // Honeycomb layout with proper tessellation
          organizeIntoHoneycombRows(companies).map((row, rowIndex) => (
            <div key={rowIndex} className="honeycomb-row">
              {row.map((company, index) => (
                <CompanyHoneycomb
                  key={`${company._id}-${rowIndex}-${index}`}
                  company={company}
                  showDescription={showDescription}
                  showCEO={showCEO}
                  showEmail={showEmail}
                />
              ))}
            </div>
          ))
        ) : (
          // Other layouts
          companies.map((company, index) => (
            <CompanyCard
              key={`${company._id}-${index}`} // Use company ID + index for unique keys
              company={company}
              layout={layout === 'list' ? 'horizontal' : 'card'}
              showDescription={showDescription}
              showCEO={showCEO}
              showEmail={showEmail}
            />
          ))
        )}
      </div>
    </div>
  );
};
