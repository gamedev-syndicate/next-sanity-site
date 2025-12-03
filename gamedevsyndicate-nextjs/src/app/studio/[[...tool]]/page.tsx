'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity/sanity.config'

// WARNING: This studio route has NO authentication
// Anyone can access it at /studio
// For production, you should either:
// 1. Add authentication middleware (recommended)
// 2. Use Sanity's hosted studio instead
// 3. Deploy this on a separate admin subdomain with restricted access

export default function StudioPage() {
  return <NextStudio config={config} />
}