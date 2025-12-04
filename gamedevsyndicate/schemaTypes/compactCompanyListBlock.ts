import { defineField, defineType } from 'sanity'
import { colorSelectionField, customColorField } from './utils/colorSelection'

export default defineType({
  name: 'compactCompanyListBlock',
  title: 'Compact Company List Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this compact list in the editor (e.g., "Footer Companies", "Sidebar Partners")',
      placeholder: 'e.g., Footer Companies',
    }),
    defineField({
      name: 'title',
      title: 'Title (Optional)',
      type: 'string',
      description: '📝 Title displayed above the company list on the website. Leave empty to hide.',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'List', value: 'list' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'Honeycomb', value: 'honeycomb' },
          { title: 'Tilted Square', value: 'tiltedsquare' },
        ],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'logoBlendMode',
      title: 'Logo Blend Mode',
      type: 'string',
      description: '🎨 Apply blend mode to logos to help remove dark backgrounds. "Lighten" works well for logos with black backgrounds.',
      options: {
        list: [
          { title: 'None (Default)', value: 'normal' },
          { title: 'Lighten (Remove Dark Backgrounds)', value: 'lighten' },
          { title: 'Screen', value: 'screen' },
          { title: 'Color Dodge', value: 'color-dodge' },
          { title: 'Multiply', value: 'multiply' },
        ],
      },
      initialValue: 'normal',
    }),
    colorSelectionField(
      'backgroundColorSelection',
      'Background Color',
      'Choose background color from design system or use custom color'
    ),
    customColorField(
      'customBackgroundColor',
      'Custom Background Color',
      'Custom background color when not using design system colors'
    ),
    colorSelectionField(
      'borderColorSelection',
      'Border Color',
      'Choose border color from design system or use custom color'
    ),
    customColorField(
      'customBorderColor',
      'Custom Border Color',
      'Custom border color when not using design system colors'
    ),
    defineField({
      name: 'maxItemsPerRow',
      title: 'Max Items Per Row',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(10),
    }),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      title: 'title',
      layout: 'layout',
    },
    prepare(selection) {
      const { internalLabel, title, layout } = selection
      return {
        title: internalLabel || title || 'Compact Company List Block',
        subtitle: `🏢 Compact List • All companies • ${layout || 'grid'} layout`,
      }
    },
  },
})
