'use client'

import { enableVisualEditing } from '@sanity/visual-editing'
import { useEffect } from 'react'

export default function VisualEditingWrapper() {
  useEffect(() => {
    // Only enable in development and when in draft mode
    if (process.env.NODE_ENV === 'development') {
      enableVisualEditing()
    }
  }, [])
  
  return null
}
