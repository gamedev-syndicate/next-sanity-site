import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'companyBlock',
  title: 'Company Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this company block in the editor (e.g., "Featured Company", "Partner Showcase")',
      placeholder: 'e.g., Featured Company',
    }),
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
      internalLabel: 'internalLabel',
      companyName: 'company.name',
      media: 'company.logo',
      layout: 'layout',
    },
    prepare(selection) {
      const { internalLabel, companyName, layout } = selection
      return {
        title: internalLabel || companyName || 'Company Block',
        subtitle: `🏢 Company Block • ${layout || 'card'} layout`,
        media: selection.media,
      }
    },
  },
})
