/**
 * Sanity Studio Configuration Loader
 * 
 * Loads configuration from the same devsecrets file as the Next.js app
 * for consistency across the monorepo.
 */

import fs from 'fs'

interface LocalConfig {
  sanity?: {
    previewSecret?: string
  }
}

/**
 * Load preview secret from devsecrets file
 */
export function loadPreviewSecret(): string {
  const defaultSecret = 'use-env-variable'

  // First check environment variable
  if (process.env.SANITY_PREVIEW_SECRET) {
    return process.env.SANITY_PREVIEW_SECRET
  }

  // Skip file loading in production
  if (process.env.NODE_ENV === 'production') {
    return defaultSecret
  }

  // Try to load from devsecrets file
  try {
    const configPath = 'c:\\devsecrets\\syndicate\\local.config.json'
    
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8')
      const localConfig: LocalConfig = JSON.parse(configContent)
      
      if (localConfig.sanity?.previewSecret) {
        console.log('📁 Sanity Studio: Loaded preview secret from devsecrets file')
        return localConfig.sanity.previewSecret
      }
    }
  } catch (error) {
    console.error('📁 Sanity Studio: Error loading devsecrets file:', error)
  }

  return defaultSecret
}
