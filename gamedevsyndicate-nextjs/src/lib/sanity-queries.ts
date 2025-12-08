import { getClient } from '../sanityClient';
import { draftMode } from 'next/headers';
import { SiteConfig, Page, Homepage } from '../types/sanity';

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
      navigationTextColorSelection,
      customNavigationTextColor,
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
      enableBannerAnimation,
      textArea,
      enableTextAreaAnimation,
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
            "companies": *[_type == "company"] | order(name asc) {
              _id,
              name,
              logo,
              ceoName,
              email,
              description
            },
            backgroundColorSelection,
            customBackgroundColor,
            borderColorSelection,
            customBorderColor,
            backgroundColor,
            borderColor
          },
          _type == "compactCompanyListBlock" => {
            title,
            "companies": *[_type == "company"] | order(name asc) {
              _id,
              name,
              logo
            },
            layout,
            backgroundColorSelection,
            customBackgroundColor,
            borderColorSelection,
            customBorderColor
          },
          _type == "imageTextBlock" => {
            title,
            image{
              ...,
              asset->
            },
            text,
            imagePosition,
            imageSize,
            backgroundColorSelection,
            customBackgroundColor,
            verticalAlignment
          },
          _type == "textAndImageBlock" => {
            internalLabel,
            article->{
              _id,
              title,
              text,
              image{
                ...,
                asset->,
                alt
              },
              excerpt,
              publishedAt
            },
            imageAlignment,
            imageSize,
            verticalAlignment,
            textAlign
          },
          _type == "textAndImageListBlock" => {
            internalLabel,
            title,
            articles[]{
              _key,
              title,
              text,
              image{
                ...,
                asset->,
                alt
              }
            },
            layout,
            imagePosition,
            imageAlignment,
            imageSize,
            verticalAlignment,
            spacing,
            backgroundColorSelection,
            customBackgroundColor
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
      showInNavigation,
      navigationOrder,
      backgroundColor,
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
        shadow,
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
        contentAlignment,
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
            "companies": *[_type == "company"] | order(name asc) {
              _id,
              name,
              logo,
              ceoName,
              email,
              description
            },
            backgroundColorSelection,
            customBackgroundColor,
            borderColorSelection,
            customBorderColor,
            backgroundColor,
            borderColor
          },
          _type == "compactCompanyListBlock" => {
            title,
            "companies": *[_type == "company"] | order(name asc) {
              _id,
              name,
              logo
            },
            layout,
            backgroundColorSelection,
            customBackgroundColor,
            borderColorSelection,
            customBorderColor,
            maxItemsPerRow
          },
          _type == "imageTextBlock" => {
            title,
            image{
              ...,
              asset->
            },
            text,
            imagePosition,
            imageSize,
            backgroundColorSelection,
            customBackgroundColor,
            verticalAlignment
          },
          _type == "textAndImageBlock" => {
            internalLabel,
            article->{
              _id,
              title,
              text,
              image{
                ...,
                asset->,
                alt
              },
              excerpt,
              publishedAt
            },
            imageAlignment,
            imageSize,
            verticalAlignment,
            textAlign
          },
          _type == "textAndImageListBlock" => {
            internalLabel,
            title,
            articles[]{
              _key,
              title,
              text,
              image{
                ...,
                asset->,
                alt
              }
            },
            layout,
            imagePosition,
            imageAlignment,
            imageSize,
            verticalAlignment,
            spacing,
            backgroundColorSelection,
            customBackgroundColor
          }
        }
      }
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

// Text and Image queries
export async function getTextAndImage(id: string) {
  try {
    const query = `*[_type == "textAndImage" && _id == $id][0]{
      _id,
      title,
      text,
      image{
        ...,
        asset->,
        alt
      },
      publishedAt
    }`;
    const client = await getQueryClient();
    return await client.fetch(query, { id }, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch text and image:', error);
    return null;
  }
}

export async function getAllTextAndImages() {
  try {
    const query = `*[_type == "textAndImage"] | order(publishedAt desc) {
      _id,
      title,
      text,
      image{
        ...,
        asset->,
        alt
      },
      publishedAt
    }`;  
    const client = await getQueryClient();
    return await client.fetch(query, {}, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch text and images:', error);
    return [];
  }
}

// Article Page queries
export async function getArticlePage(slug: string) {
  try {
    const query = `*[_type == "articlePage" && slug.current == $slug][0]{
      _id,
      _type,
      internalLabel,
      title,
      slug,
      excerpt,
      author,
      publishedAt,
      updatedAt,
      featuredImage{
        ...,
        asset->,
        alt
      },
      showInNavigation,
      navigationOrder,
      tags,
      category,
      backgroundColorSelection,
      customBackgroundColor,
      content[]{
        ...,
        _type == "imageBlock" => {
          image{
            ...,
            asset->,
            alt
          },
          caption,
          size
        },
        _type == "textBlock" => {
          text,
          textAlign,
          fontSize
        },
        _type == "buttonBlock" => {
          text,
          url,
          style,
          openInNewTab,
          buttonColorSelection,
          customButtonColor
        },
        _type == "companyBlock" => {
          company->{
            _id,
            name,
            description,
            logo{
              ...,
              asset->,
              alt
            },
            website,
            socialMedia
          },
          layout,
          showDescription
        },
        _type == "contactBlock" => {
          title,
          description,
          email,
          phone,
          address,
          showSocialLinks,
          backgroundColorSelection,
          customBackgroundColor
        },
        _type == "imageTextBlock" => {
          title,
          text,
          image{
            ...,
            asset->,
            alt
          },
          imagePosition,
          imageSize,
          backgroundColorSelection,
          customBackgroundColor,
          verticalAlignment
        },
        _type == "textAndImageBlock" => {
          internalLabel,
          article->{
            _id,
            title,
            text,
            image{
              ...,
              asset->,
              alt
            },
            excerpt,
            publishedAt
          },
          imageAlignment,
          imageSize,
          verticalAlignment,
          textAlign
        },
        _type == "textAndImageListBlock" => {
          internalLabel,
          title,
          articles[]{
            _key,
            title,
            text,
            image{
              ...,
              asset->,
              alt
            }
          },
          layout,
          imagePosition,
          imageAlignment,
          imageSize,
          verticalAlignment,
          spacing,
          backgroundColorSelection,
          customBackgroundColor
        },
        _type == "contentSeparator" => {
          lineColorSelection,
          customLineColor,
          diamondColorSelection,
          customDiamondColor,
          lineColor,
          diamondColor,
          strokeWidth,
          height,
          margin
        }
      },
      relatedArticles[]->{
        _id,
        title,
        slug,
        excerpt,
        author,
        publishedAt,
        featuredImage{
          ...,
          asset->,
          alt
        },
        category
      },
      seo
    }`;
    const client = await getQueryClient();
    return await client.fetch(query, { slug }, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch article page:', error);
    return null;
  }
}

export async function getAllArticlePages() {
  try {
    const query = `*[_type == "articlePage"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      author,
      publishedAt,
      updatedAt,
      featuredImage{
        ...,
        asset->,
        alt
      },
      category,
      tags
    }`;
    const client = await getQueryClient();
    return await client.fetch(query, {}, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch article pages:', error);
    return [];
  }
}

export async function getArticlePagesByCategory(category: string) {
  try {
    const query = `*[_type == "articlePage" && category == $category] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      author,
      publishedAt,
      featuredImage{
        ...,
        asset->,
        alt
      },
      category,
      tags
    }`;
    const client = await getQueryClient();
    return await client.fetch(query, { category }, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch article pages by category:', error);
    return [];
  }
}

export async function getArticlePagesByTag(tag: string) {
  try {
    const query = `*[_type == "articlePage" && $tag in tags] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      author,
      publishedAt,
      featuredImage{
        ...,
        asset->,
        alt
      },
      category,
      tags
    }`;
    const client = await getQueryClient();
    // @ts-expect-error - Sanity's type inference doesn't handle 'in' operator well
    return await client.fetch(query, { tag }, getCacheConfig());
  } catch (error) {
    console.error('Failed to fetch article pages by tag:', error);
    return [];
  }
}