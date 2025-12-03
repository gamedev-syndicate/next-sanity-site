'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import DynamicNavigation from './DynamicNavigation'
import DynamicStyles from './DynamicStyles'
import VisualEditingWrapper from './VisualEditingWrapper'
import type { NavigationItem } from '../types/sanity'

interface ConditionalLayoutProps {
  children: ReactNode
  navigationItems: NavigationItem[]
  menuColor: string
  navigationTextColor: string
  navigationActiveColor: string
}

export default function ConditionalLayout({
  children,
  navigationItems,
  menuColor,
  navigationTextColor,
  navigationActiveColor,
}: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')

  // For studio routes, render children without any site layout
  if (isStudioRoute) {
    return <>{children}</>
  }

  // For regular routes, render with full site layout
  return (
    <>
      <header className="w-full py-4 flex items-center justify-center bg-black/60 backdrop-blur-md shadow-lg fixed top-0 left-0 z-50" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
        <DynamicNavigation items={navigationItems} />
      </header>
      <DynamicStyles menuColor={menuColor} navigationTextColor={navigationTextColor} navigationActiveColor={navigationActiveColor} />
      <VisualEditingWrapper />
      <main className="pt-20 px-4 content-container min-h-screen relative z-10">
        {children}
      </main>
    </>
  )
}
