'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavigationItem } from '../types/sanity'

interface DynamicNavigationProps {
  items: NavigationItem[]
}

export default function DynamicNavigation({ items }: DynamicNavigationProps) {
  const pathname = usePathname()

  const isActive = (url: string) => {
    // Normalize URLs - ensure they start with /
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`
    const normalizedPathname = pathname
    
    // Handle homepage - exact match only
    if (normalizedUrl === '/' && normalizedPathname === '/') return true
    
    // For non-homepage URLs, check if pathname matches
    if (normalizedUrl !== '/') {
      // Exact match
      if (normalizedPathname === normalizedUrl) return true
      // Match with trailing slash
      if (normalizedPathname === `${normalizedUrl}/`) return true
      // If URL is a path segment
      if (normalizedPathname.startsWith(`${normalizedUrl}/`)) return true
    }
    
    return false
  }

  return (
    <nav className="flex items-center space-x-6">
      {items.map((item, index) => {
        const active = isActive(item.url)
        return (
          <Link
            key={index}
            href={item.url}
            target={item.openInNewTab ? '_blank' : '_self'}
            rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
            className={`nav-link relative text-white transition-all duration-300 py-2 ${
              active ? 'nav-link-active' : ''
            }`}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
