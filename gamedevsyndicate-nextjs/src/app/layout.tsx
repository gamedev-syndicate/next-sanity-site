import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import DynamicStyles from '../components/DynamicStyles';
import VisualEditingWrapper from '../components/VisualEditingWrapper';
import { DesignSystemProvider } from '../components/DesignSystemProvider';
import { getSiteConfig, getDesignSystem } from '../lib/sanity-queries';
import { resolveSingleColor } from '../lib/colorUtils';
import { generateBackgroundStyle, generateSVGPatternStyle, generateColorOverlayStyle } from '../lib/background-utils';
import type { NavigationItem } from '../types/sanity';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameDev Syndicate",
  description: "Your game development hub",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();
  const designSystem = await getDesignSystem();
  
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
  
  const navigationItems: NavigationItem[] = siteConfig?.navigationItems || [];
  const backgroundStyle = generateBackgroundStyle(siteConfig?.pageBackground, designSystem);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={backgroundStyle}
      >
        <DesignSystemProvider designSystem={designSystem} fallbackColors={siteConfig?.brandColors}>
          <header className="w-full py-4 flex items-center justify-center bg-black/60 backdrop-blur-md shadow-lg fixed top-0 left-0 z-50" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <nav className="space-x-6">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  target={item.openInNewTab ? '_blank' : '_self'}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </header>
          <DynamicStyles menuColor={menuColor} />
          <VisualEditingWrapper />
          <main className="pt-20 px-4 content-container min-h-screen relative z-10">
            {children}
          </main>
        </DesignSystemProvider>
      </body>
    </html>
  );
}
