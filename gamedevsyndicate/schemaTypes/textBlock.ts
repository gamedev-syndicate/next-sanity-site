import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional heading for this text block',
    }),
    defineField({
      name: 'headingLevel',
      title: 'Heading Level',
      type: 'string',
      options: {
        list: [
          {title: 'H1', value: 'h1'},
          {title: 'H2', value: 'h2'},
          {title: 'H3', value: 'h3'},
          {title: 'H4', value: 'h4'},
        ],
      },
      initialValue: 'h2',
      hidden: ({parent}) => !parent?.heading,
    }),
    defineField({
      name: 'text',
      title: 'Text Content',
      type: 'array',
      of: [{type: 'block'}],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'text',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Text Block',
        subtitle: subtitle && subtitle[0]?.children?.[0]?.text
          ? `${subtitle[0].children[0].text.substring(0, 50)}...`
          : 'Rich text content',
      }
    },
  },
})
