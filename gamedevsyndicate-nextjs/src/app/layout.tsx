import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import DynamicStyles from '../components/DynamicStyles';
import VisualEditingWrapper from '../components/VisualEditingWrapper';
import { getSiteConfig } from '../lib/sanity-queries';
import { generateBackgroundStyle } from '../lib/background-utils';
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
  const menuColor = siteConfig?.menuColor?.hex || 'rgba(0,0,0,0.6)';
  const navigationItems: NavigationItem[] = siteConfig?.navigationItems || [];
  const backgroundStyle = generateBackgroundStyle(siteConfig?.pageBackground);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={backgroundStyle}
      >
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
        <main className="pt-20 px-4 content-container min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
