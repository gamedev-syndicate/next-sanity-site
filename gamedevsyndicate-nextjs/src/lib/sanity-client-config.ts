// Client-safe Sanity configuration
// This file only contains configuration that can be safely used in the browser

export const sanityClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iu8qgjyf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
} as const
