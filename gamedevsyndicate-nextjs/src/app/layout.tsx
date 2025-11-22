import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import DynamicNavigation from '../components/DynamicNavigation';
import DynamicStyles from '../components/DynamicStyles';
import VisualEditingWrapper from '../components/VisualEditingWrapper';
import { DesignSystemProvider } from '../components/DesignSystemProvider';
import { getSiteConfig, getDesignSystem } from '../lib/sanity-queries';
import { resolveSingleColor } from '../lib/colorUtils';
import { generateBackgroundStyle, generateSVGPatternStyle, generateColorOverlayStyle } from '../lib/background-utils';
import type { NavigationItem } from '../types/sanity';

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
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
      // Use design system colors
      if (designSystem?.colors) {
        const colorValue = designSystem.colors[siteConfig.menuColorSelection as keyof typeof designSystem.colors];
        if (colorValue?.hex) {
          menuColor = colorValue.hex;
        }
      }
    } else if (siteConfig.customMenuColor) {
      // Use custom color
      menuColor = siteConfig.customMenuColor.hex;
    }
  }
  
  // Handle navigation active indicator color with design system support
  let navigationActiveColor = 'rgb(147, 197, 253)'; // Default blue color
  
  if (siteConfig?.navigationActiveColorSelection) {
    if (siteConfig.navigationActiveColorSelection !== 'custom') {
      // Use design system colors
      if (designSystem?.colors) {
        const colorValue = designSystem.colors[siteConfig.navigationActiveColorSelection as keyof typeof designSystem.colors];
        if (colorValue?.hex) {
          navigationActiveColor = colorValue.hex;
        }
      }
    } else if (siteConfig.customNavigationActiveColor) {
      // Use custom color
      navigationActiveColor = siteConfig.customNavigationActiveColor.hex;
    }
  }
  
  const navigationItems: NavigationItem[] = siteConfig?.navigationItems || [];
  const backgroundStyle = generateBackgroundStyle(siteConfig?.pageBackground, designSystem);

  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased min-h-screen`}
        style={backgroundStyle}
      >
        <DesignSystemProvider designSystem={designSystem}>
          <header className="w-full py-4 flex items-center justify-center bg-black/60 backdrop-blur-md shadow-lg fixed top-0 left-0 z-50" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <DynamicNavigation items={navigationItems} />
          </header>
          <DynamicStyles menuColor={menuColor} navigationActiveColor={navigationActiveColor} />
          <VisualEditingWrapper />
          <main className="pt-20 px-4 content-container min-h-screen relative z-10">
            {children}
          </main>
        </DesignSystemProvider>
      </body>
    </html>
  );
}
