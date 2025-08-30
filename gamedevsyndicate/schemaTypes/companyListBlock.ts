import { defineType, defineField } from 'sanity'

export const companyListBlock = defineType({
  name: 'companyListBlock',
  title: 'Company List Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'List Title',
      type: 'string',
      placeholder: 'e.g., Our Partner Companies, Featured Companies',
    }),
    defineField({
      name: 'companies',
      title: 'Companies',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'company' }],
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one company is required'),
    }),
    defineField({
      name: 'layout',
      title: 'List Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid (Cards)', value: 'grid' },
          { title: 'List (Horizontal)', value: 'list' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'Honeycomb Pattern', value: 'honeycomb' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'showDescription',
      title: 'Show Company Descriptions',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showCEO',
      title: 'Show CEO Information',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showEmail',
      title: 'Show Contact Email',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      layout: 'layout',
      companies: 'companies',
    },
    prepare({ title, layout, companies }) {
      const companyCount = companies?.length || 0;
      return {
        title: title || 'Company List',
        subtitle: `${companyCount} companies • ${layout || 'grid'} layout`,
      }
    },
  },
})
