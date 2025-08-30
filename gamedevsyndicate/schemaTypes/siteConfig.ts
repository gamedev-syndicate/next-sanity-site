import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'siteConfig',
  title: 'Site Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'Name for this configuration (e.g., "Main Site Settings")',
      initialValue: 'Site Configuration',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'menuColor',
      title: 'Menu Color',
      type: 'color',
      description: 'Color for the top menu',
      options: {
        disableAlpha: false,
      },
    }),
    defineField({
      name: 'pageBackground',
      title: 'Page Background',
      type: 'object',
      description: 'Global background settings for all pages',
      fields: [
        {
          name: 'type',
          title: 'Background Type',
          type: 'string',
          options: {
            list: [
              {title: 'Solid Color', value: 'solid'},
              {title: 'Gradient', value: 'gradient'},
              {title: 'Image', value: 'image'},
              {title: 'Custom CSS', value: 'custom'},
            ],
          },
          initialValue: 'gradient',
        },
        {
          name: 'solidColor',
          title: 'Solid Color',
          type: 'color',
          description: 'Single background color',
          hidden: ({parent}) => parent?.type !== 'solid',
        },
        {
          name: 'gradientFrom',
          title: 'Gradient Start Color',
          type: 'color',
          description: 'Starting color for gradient',
          hidden: ({parent}) => parent?.type !== 'gradient',
        },
        {
          name: 'gradientTo',
          title: 'Gradient End Color',
          type: 'color',
          description: 'Ending color for gradient',
          hidden: ({parent}) => parent?.type !== 'gradient',
        },
        {
          name: 'gradientDirection',
          title: 'Gradient Direction',
          type: 'string',
          options: {
            list: [
              {title: 'Top to Bottom', value: 'to-b'},
              {title: 'Bottom to Top', value: 'to-t'},
              {title: 'Left to Right', value: 'to-r'},
              {title: 'Right to Left', value: 'to-l'},
              {title: 'Top-Left to Bottom-Right', value: 'to-br'},
              {title: 'Top-Right to Bottom-Left', value: 'to-bl'},
            ],
          },
          initialValue: 'to-br',
          hidden: ({parent}) => parent?.type !== 'gradient',
        },
        {
          name: 'gradientStartPosition',
          title: 'Gradient Start Position (%)',
          type: 'number',
          description: 'Where the gradient starts (0-100%)',
          validation: Rule => Rule.min(0).max(100),
          initialValue: 0,
          hidden: ({parent}) => parent?.type !== 'gradient',
        },
        {
          name: 'gradientEndPosition',
          title: 'Gradient End Position (%)',
          type: 'number',
          description: 'Where the gradient ends (0-100%)',
          validation: Rule => Rule.min(0).max(100),
          initialValue: 100,
          hidden: ({parent}) => parent?.type !== 'gradient',
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          description: 'Image to use as background',
          hidden: ({parent}) => parent?.type !== 'image',
        },
        {
          name: 'customCSS',
          title: 'Custom CSS Background',
          type: 'text',
          description: 'Custom CSS background property (e.g., "linear-gradient(45deg, #ff0000, #0000ff)")',
          hidden: ({parent}) => parent?.type !== 'custom',
        },
      ],
    }),
    defineField({
      name: 'navigationItems',
      title: 'Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Menu Title',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
              description: 'Internal path (e.g., /about) or external URL',
              validation: Rule => Rule.required(),
            },
            {
              name: 'openInNewTab',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
  ],
  // Singleton pattern: only one config document
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Site Configuration',
        subtitle: 'Global site settings',
      }
    },
  },
//   __experimental_actions: ['update', 'publish'],
})
