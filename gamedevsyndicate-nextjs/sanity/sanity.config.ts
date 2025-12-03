import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from '../../gamedevsyndicate/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Gamedevsyndicate',

  projectId: 'iu8qgjyf',
  dataset: process.env.NODE_ENV === 'development' ? 'dev' : 'production',
  basePath: '/studio',

  plugins: [
    structureTool(), 
    visionTool(), 
    presentationTool({
      previewUrl: {
        origin: typeof window !== 'undefined' && window.location.origin || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft',
        },
      },
    })
  ],

  schema: {
    types: schemaTypes as any,
  },
})
