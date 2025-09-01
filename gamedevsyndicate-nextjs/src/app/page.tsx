import { PortableText } from '@portabletext/react';
import { customComponents } from '../components/CustomBlocks';
import DynamicStyles from '../components/DynamicStyles';
import SvgOverlay from '../components/SvgOverlay';
import { getHomepage, getSiteConfig } from '../lib/sanity-queries';
import { getImageUrl } from '../lib/sanity-image';
import { generateSectionBackgroundStyle } from '../lib/background-utils';
import styles from './homepage.module.css';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  
  return {
    title: 'GameDev Syndicate',
    description: 'Your ultimate destination for game development resources, tutorials, and community.',
  };
}

export default async function Home() {
  const homepage = await getHomepage();
  const siteConfig = await getSiteConfig();
  
  const menuColor = siteConfig?.menuColor?.hex || 'rgba(0,0,0,0.6)';

  // If no homepage content exists, show default content
  if (!homepage) {
    return (
      <div className={styles.homepage}>
        <DynamicStyles menuColor={menuColor} />
        
        <div className="container mx-auto py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-white mb-6">
              Welcome to GameDev Syndicate
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Create a "Homepage" document in Sanity Studio to customize this content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.homepage}>
      <DynamicStyles menuColor={menuColor} />
      
      {/* Global SVG Overlay for homepage */}
      <SvgOverlay 
        overlayTexture={siteConfig?.overlayTexture} 
        backgroundConfig={siteConfig?.pageBackground}
        isSection={false} 
      />
      
      {/* Banner Image */}
      {homepage.bannerImage && (
        <section className={`${styles.bannerSection} py-8`}>
          <img
            src={getImageUrl(homepage.bannerImage, 1200, 400)}
            alt="Homepage Banner"
            className={styles.bannerImage}
            style={{
              transform: `translate(${homepage.bannerPosition?.offsetX || 0}%, ${homepage.bannerPosition?.offsetY || 0}%) scale(${(homepage.bannerPosition?.scale || 100) / 100})`,
              transformOrigin: 'center center',
            }}
          />
        </section>
      )}

      {/* Text Area */}
      {homepage.textArea && (
        <section className={styles.textSection}>
          <div className={styles.textContent}>
            <PortableText 
              value={homepage.textArea} 
              components={customComponents} 
            />
          </div>
        </section>
      )}

      {/* Homepage Sections */}
      {homepage.sections && homepage.sections.length > 0 && (
        <>
          {homepage.sections.map((section, index) => (
            <section 
              key={section._key || index}
              className={`${styles.homepageSection} relative`}
              style={{
                ...generateSectionBackgroundStyle(section.background),
              }}
            >
              {/* SVG Overlay for this section */}
              <SvgOverlay 
                overlayTexture={section.overlayTexture} 
                backgroundConfig={section.background}
                isSection={true}
              />
              
              <div 
                className={`${styles.sectionContent} relative z-10`}
                style={{
                  paddingTop: section.padding?.top || '4rem',
                  paddingBottom: section.padding?.bottom || '4rem',
                }}
              >
                {section.title && (
                  <h2 className="text-4xl font-bold text-white mb-8 text-center">
                    {section.title}
                  </h2>
                )}
                {section.content && section.content.length > 0 && (
                  <>
                    {section.content.map((block, blockIndex) => (
                      <div key={block._key || blockIndex} className={styles.blockItem}>
                        <PortableText 
                          value={[block]} 
                          components={customComponents} 
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </section>
          ))}
        </>
      )}

      {/* Legacy Block Area */}
      {homepage.blockArea && homepage.blockArea.length > 0 && (
        <section className={styles.blockSection}>
          {homepage.blockArea.map((block, index) => (
            <div key={block._key || index} className={styles.blockItem}>
              <PortableText 
                value={[block]} 
                components={customComponents} 
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
