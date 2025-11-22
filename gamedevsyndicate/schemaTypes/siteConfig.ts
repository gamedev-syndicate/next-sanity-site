import {defineType, defineField} from 'sanity'
import { colorSelectionField, customColorField, solidColorFields, gradientColorFields } from './utils/colorSelection'

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
    colorSelectionField(
      'menuColorSelection',
      'Menu Color',
      'Choose menu color from design system or use custom color'
    ),
    customColorField(
      'customMenuColor',
      'Custom Menu Color',
      'Custom menu color when not using design system colors'
    ),
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
          name: 'solidColorSelection',
          title: 'Background Color',
          type: 'string',
          description: 'Choose from design system colors or use custom color',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
              { title: 'Tertiary', value: 'tertiary' },
              { title: 'Button Primary', value: 'buttonPrimary' },
              { title: 'Button Secondary', value: 'buttonSecondary' },
              { title: 'Custom Color', value: 'custom' },
            ],
            layout: 'dropdown',
          },
          initialValue: 'primary',
          hidden: ({parent}) => parent?.type !== 'solid',
        },
        {
          name: 'customSolidColor',
          title: 'Custom Background Color',
          type: 'color',
          description: 'Custom background color when not using design system colors',
          options: {
            disableAlpha: false,
          },
          hidden: ({parent}) => parent?.type !== 'solid' || parent?.solidColorSelection !== 'custom',
        },
        {
          name: 'gradientFromSelection',
          title: 'Gradient Start Color',
          type: 'string',
          description: 'Choose start color from design system or use custom color',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
              { title: 'Tertiary', value: 'tertiary' },
              { title: 'Button Primary', value: 'buttonPrimary' },
              { title: 'Button Secondary', value: 'buttonSecondary' },
              { title: 'Custom Color', value: 'custom' },
            ],
            layout: 'dropdown',
          },
          initialValue: 'primary',
          hidden: ({parent}) => parent?.type !== 'gradient',
        },
        {
          name: 'customGradientFrom',
          title: 'Custom Gradient Start Color',
          type: 'color',
          description: 'Custom start color when not using design system colors',
          options: {
            disableAlpha: false,
          },
          hidden: ({parent}) => parent?.type !== 'gradient' || parent?.gradientFromSelection !== 'custom',
        },
        {
          name: 'gradientToSelection',
          title: 'Gradient End Color',
          type: 'string',
          description: 'Choose end color from design system or use custom color',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
              { title: 'Tertiary', value: 'tertiary' },
              { title: 'Button Primary', value: 'buttonPrimary' },
              { title: 'Button Secondary', value: 'buttonSecondary' },
              { title: 'Custom Color', value: 'custom' },
            ],
            layout: 'dropdown',
          },
          initialValue: 'secondary',
          hidden: ({parent}) => parent?.type !== 'gradient',
        },
        {
          name: 'customGradientTo',
          title: 'Custom Gradient End Color',
          type: 'color',
          description: 'Custom end color when not using design system colors',
          options: {
            disableAlpha: false,
          },
          hidden: ({parent}) => parent?.type !== 'gradient' || parent?.gradientToSelection !== 'custom',
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
      name: 'overlayTexture',
      title: 'Overlay Texture',
      type: 'object',
      description: 'SVG pattern with color overlay for the background',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Overlay',
          type: 'boolean',
          initialValue: false,
          description: 'Toggle to enable/disable the overlay texture',
        },
        {
          name: 'svgFile',
          title: 'SVG Pattern File',
          type: 'file',
          description: 'Upload an SVG file for the base pattern',
          options: {
            accept: '.svg',
          },
          hidden: ({parent}) => !parent?.enabled,
        },
        {
          name: 'patternSize',
          title: 'Pattern Size',
          type: 'string',
          options: {
            list: [
              {title: 'Small (200px)', value: '200px'},
              {title: 'Medium (400px)', value: '400px'},
              {title: 'Large (600px)', value: '600px'},
              {title: 'Extra Large (800px)', value: '800px'},
              {title: 'Custom', value: 'custom'},
            ],
          },
          initialValue: '400px',
          description: 'Size of the repeating pattern',
          hidden: ({parent}) => !parent?.enabled || !parent?.svgFile,
        },
        {
          name: 'customPatternSize',
          title: 'Custom Pattern Size',
          type: 'string',
          description: 'Custom size in pixels (e.g., "500px")',
          hidden: ({parent}) => !parent?.enabled || !parent?.svgFile || parent?.patternSize !== 'custom',
        },
        {
          name: 'tileMode',
          title: 'Tile Mode',
          type: 'string',
          options: {
            list: [
              {title: 'Repeat (Tile)', value: 'repeat'},
              {title: 'Repeat X (Horizontal only)', value: 'repeat-x'},
              {title: 'Repeat Y (Vertical only)', value: 'repeat-y'},
              {title: 'No Repeat (Single)', value: 'no-repeat'},
              {title: 'Space (Evenly spaced)', value: 'space'},
              {title: 'Round (Stretched to fit)', value: 'round'},
            ],
          },
          initialValue: 'repeat',
          description: 'How the pattern should tile across the background',
          hidden: ({parent}) => !parent?.enabled || !parent?.svgFile,
        },
        {
          name: 'colorType',
          title: 'Color Overlay Type',
          type: 'string',
          options: {
            list: [
              {title: 'Solid Color', value: 'solid'},
              {title: 'Gradient', value: 'gradient'},
            ],
          },
          initialValue: 'solid',
          description: 'Choose how to color the SVG pattern',
          hidden: ({parent}) => !parent?.enabled,
        },
        {
          name: 'solidColor',
          title: 'Color',
          type: 'color',
          description: 'Solid color to apply over the SVG pattern',
          hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'solid',
        },
        {
          name: 'gradientFrom',
          title: 'Gradient Start Color',
          type: 'color',
          description: 'Starting color for gradient overlay',
          hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'gradient',
        },
        {
          name: 'gradientTo',
          title: 'Gradient End Color',
          type: 'color',
          description: 'Ending color for gradient overlay',
          hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'gradient',
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
          hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'gradient',
        },
        {
          name: 'gradientStartPosition',
          title: 'Gradient Start Position (%)',
          type: 'number',
          description: 'Where the gradient starts (0-100%)',
          validation: Rule => Rule.min(0).max(100),
          initialValue: 0,
          hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'gradient',
        },
        {
          name: 'gradientEndPosition',
          title: 'Gradient End Position (%)',
          type: 'number',
          description: 'Where the gradient ends (0-100%)',
          validation: Rule => Rule.min(0).max(100),
          initialValue: 100,
          hidden: ({parent}) => !parent?.enabled || parent?.colorType !== 'gradient',
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
