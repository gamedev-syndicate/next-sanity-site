import { defineField, defineType } from 'sanity'
import { colorSelectionField, customColorField } from './utils/colorSelection'

export default defineType({
  name: 'companyListBlock',
  title: 'Company List Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'companies',
      title: 'Companies',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'company' }] }],
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
    defineField({
      name: 'showDescription',
      title: 'Show Description',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showCEO',
      title: 'Show CEO',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showEmail',
      title: 'Show Email',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      companiesCount: 'companies.length',
      layout: 'layout',
    },
    prepare(selection) {
      const { title, companiesCount, layout } = selection
      return {
        title: title || 'Company List Block',
        subtitle: `${companiesCount || 0} companies • ${layout || 'grid'} layout`,
      }
    },
  },
})
