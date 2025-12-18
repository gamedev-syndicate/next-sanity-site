import {defineConfig} from 'sanity'

import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'
import {loadPreviewSecret} from './lib/config'

export default defineConfig({
  name: 'default',
  title: 'Gamedevsyndicate',

  projectId: 'iu8qgjyf',
  dataset: process.env.NODE_ENV === 'dev' ? 'dev' : 'production',

  plugins: [
    structureTool(), 
    visionTool(), 
    colorInput(),
    presentationTool({
      previewUrl: {
        origin: process.env.PREVIEW_URL || 'http://localhost:3000',
        previewMode: {
          enable: `/api/draft?secret=${loadPreviewSecret()}&slug=`,
          disable: '/api/disable-draft'
        }
      },
    })
  ],

  schema: {
    types: schemaTypes,
  },
})
