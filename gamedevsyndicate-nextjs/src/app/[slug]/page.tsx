import { notFound } from 'next/navigation';
import DynamicStyles from '../../components/DynamicStyles';
import SvgOverlay from '../../components/SvgOverlay';
import { getPage, getSiteConfig, getDesignSystem, getAllPageSlugs } from '../../lib/sanity-queries';
import { generateBackgroundStyle, sanityColorToCSS } from '../../lib/background-utils';
import type { Metadata } from 'next';

import RichTextRenderer from '../../components/RichTextRendererClient';
interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const page = await getPage(resolvedParams.slug);
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }
  
  return {
    title: `${page.title} | GameDev Syndicate`,
    description: `${page.title} - GameDev Syndicate`,
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const page = await getPage(resolvedParams.slug);
  const siteConfig = await getSiteConfig();
  const designSystem = await getDesignSystem();
  
  if (!page) {
    notFound();
  }

  console.log('Design system fetched:', designSystem);
  
  // Handle menu color with design system support
  let menuColor = siteConfig?.menuColor?.hex || 'rgba(0,0,0,0.6)';
  
  if (siteConfig?.menuColorSelection) {
    if (siteConfig.menuColorSelection !== 'custom') {
      // Try design system first, fallback to brandColors
      let colorValue = null;
      
      if (designSystem?.colors) {
        colorValue = designSystem.colors[siteConfig.menuColorSelection as keyof typeof designSystem.colors];
      } else if (siteConfig.brandColors) {
        // Fallback to old brandColors system
        const brandColorMapping: Record<string, any> = {
          'primary': siteConfig.brandColors.primaryColor,
          'secondary': siteConfig.brandColors.secondaryColor,
          'buttonPrimary': siteConfig.brandColors.buttonPrimaryColor,
          'buttonSecondary': siteConfig.brandColors.buttonSecondaryColor,
        };
        colorValue = brandColorMapping[siteConfig.menuColorSelection];
      }
      
      if (colorValue?.hex) {
        menuColor = colorValue.hex;
      }
    } else if (siteConfig.customMenuColor) {
      // Use custom color
      menuColor = siteConfig.customMenuColor.hex;
    }
  }
  
  // Only apply background if page specifically has one set
  const pageBackgroundStyle = page.backgroundColor 
    ? { background: sanityColorToCSS(page.backgroundColor) }
    : {}; // No background - let layout background show through

  return (
    <div 
      style={pageBackgroundStyle} 
      className="min-h-screen relative"
    >
      <DynamicStyles menuColor={menuColor} />
      
      {/* Global SVG Overlay for pages */}
      <SvgOverlay 
        overlayTexture={siteConfig?.overlayTexture} 
        backgroundConfig={siteConfig?.pageBackground}
        isSection={false} 
      />
      
      <div className="content-container relative z-10" style={{ paddingTop: '3rem' }}>
        <div className="content-section">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">{page.title}</h1>
          
          {page.content && (
            <div className="prose prose-invert prose-lg max-w-none">
              <RichTextRenderer value={page.content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
