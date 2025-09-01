import React from 'react';
import { getImageUrl } from '../lib/sanity-image';
import type { SanityImage } from '../types/sanity';
import { HoneycombGrid } from './HoneycombGrid';
import { TiltedSquareGrid } from './TiltedSquareGrid';

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
    layout?: 'grid' | 'list' | 'carousel' | 'honeycomb' | 'tiltedsquare';
    maxItemsPerRow?: number; // Maximum items per row for honeycomb tessellation
    showDescription?: boolean;
    showCEO?: boolean;
    showEmail?: boolean;
  };
}



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

  const { title, companies, layout = 'grid', maxItemsPerRow, showDescription, showCEO, showEmail } = value;


  const getGridClasses = () => {
    switch (layout) {
      case 'list':
        return 'space-y-4';
      case 'carousel':
        return 'flex gap-6 overflow-x-auto pb-4';
      case 'honeycomb':
        return 'honeycomb-grid';
      case 'tiltedsquare':
        return ''; // TiltedSquareGrid handles its own layout
      default: // grid
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {title && (
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{title}</h2>
      )}
      <div className={getGridClasses()}>
        {layout === 'honeycomb' ? (
          <HoneycombGrid
            companies={companies}
            maxItemsPerRow={maxItemsPerRow}
            showDescription={showDescription}
            showCEO={showCEO}
            showEmail={showEmail}
          />
        ) : layout === 'tiltedsquare' ? (
          <TiltedSquareGrid
            companies={companies}
            showDescription={showDescription}
            showCEO={showCEO}
            showEmail={showEmail}
            maxItemsPerRow={maxItemsPerRow}
          />
        ) : (
          companies.map((company, index) => (
            <CompanyCard
              key={`${company._id}-${index}`}
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
