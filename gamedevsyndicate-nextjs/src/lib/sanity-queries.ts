import { getClient } from '../sanityClient';
import { draftMode } from 'next/headers';
import { config } from '../config';
import { SiteConfig, Page, Homepage } from '../types/sanity';
import { DesignSystem } from '../types/designSystem';

// Helper to get the right client based on draft mode
async function getQueryClient() {
  const draft = await draftMode();
  return getClient(draft.isEnabled);
}

// Helper to get cache settings
function getCacheConfig() {
  // Always disable cache for immediate updates during development
  return { next: { revalidate: 0 } };
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const query = `*[_type == "siteConfig"][0]{
      _id,
      _type,
      menuColor,
      menuColorSelection,
      customMenuColor,
      navigationActiveColorSelection,
      customNavigationActiveColor,
      pageBackground{
        type,
        // Legacy fields
        solidColor,
        gradientFrom,
        gradientTo,
        gradientDirection,
        gradientStartPosition,
        gradientEndPosition,
        backgroundImage,
        customCSS,
        // New design system fields
        solidColorSelection,
        customSolidColor,
        gradientFromSelection,
        customGradientFrom,
        gradientToSelection,
        customGradientTo
      },
      overlayTexture{
        enabled,
        svgFile{
          _type,
          asset->{
            _ref,
            _type,
            url
          }
        },
        patternSize,
        customPatternSize,
        tileMode,
        colorType,
        solidColor,
        gradientFrom,
        gradientTo,
        gradientDirection,
        gradientStartPosition,
        gradientEndPosition,
        opacity
      },
      navigationItems,
      buttonConfig {
        styles[] {
          key,
          name,
          backgroundColor,
          textColor,
          borderColor,
          hoverBackgroundColor,
          hoverTextColor,
          customClasses,
          description
        },
        sizes[] {
          key,
          name,
          padding,
          fontSize,
          customClasses
        },
        baseClasses
      }
    }`;
    
    const client = await getQueryClient();
    const result = await client.fetch(query, {}, getCacheConfig());
    
    console.log('Site config fetched:', result); // Debug log
    return result;
  } catch (error) {
    console.error('Failed to fetch site config:', error);
    return null;
  }
}

export async function getHomepage(): Promise<Homepage | null> {
  try {
    const query = `*[_type == "homepage"][0]{
      _id,
      _type,
      bannerImage,
      bannerPosition{
        offsetX,
        offsetY,
        scale
      },
      textArea,
      sections[]{
        _key,
        title,
        background{
          type,
          // Legacy fields
          solidColor,
          gradientFrom,
          gradientTo,
          gradientDirection,
          gradientStartPosition,
          gradientEndPosition,
          backgroundImage,
          // New design system fields
          solidColorSelection,
          customSolidColor,
          gradientFromSelection,
          customGradientFrom,
          gradientToSelection,
          customGradientTo
        },
        overlayTexture{
          enabled,
          svgFile{
            _type,
            asset->{
              _ref,
              _type,
              url
            }
          },
          patternSize,
          customPatternSize,
          tileMode,
          colorType,
          solidColor,
          gradientFrom,
          gradientTo,
          gradientDirection,
          gradientStartPosition,
          gradientEndPosition,
          opacity
        },
        padding{
          top,
          bottom
        },
        content[]{
          _key,
          _type,
          ...,
          _type == "companyBlock" => {
            company->{
              _id,
              name,
              logo,
              ceoName,
              email,
              description
            },
            layout
          },
          _type == "companyListBlock" => {
            title,
            companies[]->{
              _id,
              name,
              logo,
              ceoName,
              email,
              description
            },
            layout,
            showDescription,
            showCEO,
            showEmail,
            backgroundColorSelection,
            customBackgroundColor,
            borderColorSelection,
            customBorderColor
          }
        }
      },
      blockArea,
      backgroundColor
    }`;
    
    const client = await getQueryClient();
    return await client.fetch(query, {}, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch homepage:', error);
    return null;
  }
}

export async function getPage(slug: string): Promise<Page | null> {
  try {
    const query = `*[_type == "page" && slug.current == $slug][0]{
      _id,
      _type,
      title,
      slug,
      backgroundColor,
      content
    }`;
    
    const client = await getQueryClient();
    return await client.fetch(query, { slug }, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return null;
  }
}

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const query = `*[_type == "page" && defined(slug.current)].slug.current`;
    // Use non-preview client for static generation
    const client = getClient(false);
    return await client.fetch(query, {}, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch page slugs:', error);
    return [];
  }
}

// Company queries
export async function getCompany(id: string) {
  try {
    const query = `*[_type == "company" && _id == $id][0]{
      _id,
      name,
      logo,
      ceoName,
      email,
      description
    }`;
    const client = await getQueryClient();
    return await client.fetch(query, { id }, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch company:', error);
    return null;
  }
}

export async function getAllCompanies() {
  try {
    const query = `*[_type == "company"] | order(name asc) {
      _id,
      name,
      logo,
      ceoName,
      email,
      description
    }`;
    const client = await getQueryClient();
    return await client.fetch(query, {}, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return [];
  }
}

export async function getDesignSystem() {
  try {
    const query = `*[_type == "designSystem"][0]{
      _id,
      _type,
      title,
      colors{
        primary,
        secondary,
        tertiary,
        buttonPrimary,
        buttonSecondary,
        buttonTextPrimary,
        buttonTextSecondary
      }
    }`;
    const client = await getQueryClient();
    return await client.fetch(query, {}, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch design system:', error);
    return null;
  }
}