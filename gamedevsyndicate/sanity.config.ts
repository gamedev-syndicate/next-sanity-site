import {defineConfig} from 'sanity'

import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'

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
        origin: 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft?secret=FiP5aWHffnAr2UlELJvkQHdA0jp0TQCo&slug=',
          disable: '/api/disable-draft'
        }
      },
    })
  ],

  schema: {
    types: schemaTypes,
  },
})
