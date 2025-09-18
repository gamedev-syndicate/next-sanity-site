'use client'

import { useState, useEffect } from 'react'
import { getDesignSystem } from '@/lib/designSystem'
import type { DesignSystem } from '@/types/designSystem'
import { defaultDesignSystem } from '@/lib/designSystem'

export function useDesignSystem() {
  const [designSystem, setDesignSystem] = useState<DesignSystem>(defaultDesignSystem)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDesignSystem() {
      try {
        setIsLoading(true)
        const data = await getDesignSystem()
        setDesignSystem(data || defaultDesignSystem)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch design system')
        setDesignSystem(defaultDesignSystem)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDesignSystem()
  }, [])

  return { designSystem, isLoading, error }
}
