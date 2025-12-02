import fs from 'fs'

interface AppConfig {
  sanity: {
    projectId: string
    dataset: string
    apiVersion: string
    token?: string
    previewSecret: string
    studioUrl: string
  }
  app: {
    url: string
    environment: 'dev' | 'production' | 'preview'
  }
  features: {
    visualEditing: boolean
    caching: boolean
    analytics: boolean
  }
}

// Default configuration
const defaultConfig: AppConfig = {
  sanity: {
    projectId: 'iu8qgjyf',
    dataset: 'production',
    apiVersion: '2023-01-01',
    previewSecret: 'change-me-in-production',
    studioUrl: 'http://localhost:3333',
  },
  app: {
    url: 'http://localhost:3000',
    environment: 'dev',
  },
  features: {
    visualEditing: true,
    caching: true,
    analytics: false,
  },
}

// Load local config file if it exists (development only)
function loadLocalConfig(): Partial<AppConfig> {
  if (process.env.NODE_ENV === 'production') {
    return {}
  }

  try {
    // Try to load local config file from dev secrets location
    const configPath = 'c:\\devsecrets\\syndicate\\local.config.json'
    
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8')
      const localConfig = JSON.parse(configContent)
      console.log('📁 Loaded local configuration file from c:\\devsecrets\\syndicate\\local.config.json')
      console.log('🔧 Local config preview secret:', localConfig.sanity?.previewSecret)
      return localConfig
    } else {
      console.log('📁 No local config found at c:\\devsecrets\\syndicate\\local.config.json')
    }
  } catch (error) {
    // File doesn't exist or has syntax errors - that's ok
    console.log('📁 No local config found at c:\\devsecrets\\syndicate\\local.config.json')
    console.error('Config loading error:', error)
    return {}
  }
  
  return {}
}

// Load configuration from environment variables
function loadEnvConfig(): Partial<AppConfig> {
  const envConfig: Partial<AppConfig> = {}

  // Sanity configuration
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    if (!envConfig.sanity) envConfig.sanity = {} as AppConfig['sanity'];
    envConfig.sanity.projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  }

  if (process.env.NEXT_PUBLIC_SANITY_DATASET) {
    if (!envConfig.sanity) envConfig.sanity = {} as AppConfig['sanity'];
    envConfig.sanity.dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  }

  if (process.env.SANITY_API_TOKEN) {
    if (!envConfig.sanity) envConfig.sanity = {} as AppConfig['sanity'];
    envConfig.sanity.token = process.env.SANITY_API_TOKEN
  }

  if (process.env.SANITY_PREVIEW_SECRET) {
    if (!envConfig.sanity) envConfig.sanity = {} as AppConfig['sanity'];
    envConfig.sanity.previewSecret = process.env.SANITY_PREVIEW_SECRET
  }

  if (process.env.NEXT_PUBLIC_SANITY_STUDIO_URL) {
    if (!envConfig.sanity) envConfig.sanity = {} as AppConfig['sanity'];
    envConfig.sanity.studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL
  }

  // App configuration
  if (process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL) {
    if (!envConfig.app) envConfig.app = {} as AppConfig['app'];
    envConfig.app.url = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`
  }

  if (process.env.NODE_ENV) {
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'development') {
      if (!envConfig.app) envConfig.app = {} as AppConfig['app'];
      envConfig.app.environment = 'dev';
    } else if (nodeEnv === 'production') {
      if (!envConfig.app) envConfig.app = {} as AppConfig['app'];
      envConfig.app.environment = 'production';
    }
  }

  // Feature flags
  if (process.env.ENABLE_VISUAL_EDITING !== undefined) {
    if (!envConfig.features) envConfig.features = {} as AppConfig['features'];
    envConfig.features.visualEditing = process.env.ENABLE_VISUAL_EDITING === 'true'
  }

  if (process.env.ENABLE_CACHING !== undefined) {
    if (!envConfig.features) envConfig.features = {} as AppConfig['features'];
    envConfig.features.caching = process.env.ENABLE_CACHING === 'true'
  }

  if (process.env.ENABLE_ANALYTICS !== undefined) {
    if (!envConfig.features) envConfig.features = {} as AppConfig['features'];
    envConfig.features.analytics = process.env.ENABLE_ANALYTICS === 'true'
  }

  // Clean up empty objects
  if (Object.keys(envConfig.sanity || {}).length === 0) delete envConfig.sanity
  if (Object.keys(envConfig.app || {}).length === 0) delete envConfig.app
  if (Object.keys(envConfig.features || {}).length === 0) delete envConfig.features

  return envConfig
}

// Deep merge function
function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key], source[key] as Partial<T[Extract<keyof T, string>]>)
    } else if (source[key] !== undefined) {
      result[key] = source[key] as T[Extract<keyof T, string>]
    }
  }
  
  return result
}

// Create final configuration
function createConfig(): AppConfig {
  const localConfig = loadLocalConfig()
  const envConfig = loadEnvConfig()
  
  // Merge: default -> local -> environment
  let config = deepMerge(defaultConfig, localConfig)
  config = deepMerge(config, envConfig)
  
  // Log configuration source in development
  if (process.env.NODE_ENV === 'development') {
    console.log('⚙️ Configuration loaded from:', {
      default: '✅',
      local: Object.keys(localConfig).length > 0 ? '✅' : '❌',
      environment: Object.keys(envConfig).length > 0 ? '✅' : '❌',
    })
  }
  
  return config
}

export const config = createConfig()
export type { AppConfig }
