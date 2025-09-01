import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'companyBlock',
  title: 'Company Block',
  type: 'object',
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'reference',
      to: [{ type: 'company' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Card', value: 'card' },
          { title: 'Horizontal', value: 'horizontal' },
          { title: 'Minimal', value: 'minimal' },
        ],
      },
      initialValue: 'card',
    }),
  ],
  preview: {
    select: {
      title: 'company.name',
      media: 'company.logo',
      layout: 'layout',
    },
    prepare(selection) {
      const { title, layout } = selection
      return {
        title: title || 'Company Block',
        subtitle: `${layout || 'card'} layout`,
        media: selection.media,
      }
    },
  },
})
