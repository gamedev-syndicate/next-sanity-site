import { defineType, defineField } from 'sanity'

export const companyBlock = defineType({
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
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          { title: 'Card', value: 'card' },
          { title: 'Horizontal', value: 'horizontal' },
          { title: 'Minimal', value: 'minimal' },
        ],
        layout: 'radio',
      },
      initialValue: 'card',
    }),
  ],
  preview: {
    select: {
      companyName: 'company.name',
      companyLogo: 'company.logo',
      layout: 'layout',
    },
    prepare({ companyName, companyLogo, layout }) {
      return {
        title: companyName || 'Company Block',
        subtitle: `Layout: ${layout || 'card'}`,
        media: companyLogo,
      }
    },
  },
})
