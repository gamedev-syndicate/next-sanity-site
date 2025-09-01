import { defineField, defineType } from 'sanity'

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
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      options: {
        disableAlpha: false,
      },
    }),
    defineField({
      name: 'borderColor',
      title: 'Border Color',
      type: 'color',
      options: {
        disableAlpha: false,
      },
    }),
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
