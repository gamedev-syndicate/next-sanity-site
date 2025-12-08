import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this block in the editor (e.g., "About Section", "Mission Statement")',
      placeholder: 'e.g., About Section',
    }),
    defineField({
      name: 'heading',
      title: 'Heading (Optional)',
      type: 'string',
      description: '📝 Optional heading displayed above the text block on the website. Leave empty to hide.',
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
    defineField({
      name: 'enableAnimation',
      title: 'Enable Fade-In Animation',
      type: 'boolean',
      description: '✨ When enabled, the text block will fade in when it scrolls into view',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      heading: 'heading',
      text: 'text',
    },
    prepare({internalLabel, heading, text}) {
      const contentPreview = text && text[0]?.children?.[0]?.text
        ? `${text[0].children[0].text.substring(0, 50)}...`
        : 'Rich text content';
      
      return {
        title: internalLabel || heading || 'Text Block',
        subtitle: `📝 Text Block • ${contentPreview}`,
      }
    },
  },
})
