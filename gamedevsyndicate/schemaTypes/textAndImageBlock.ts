import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'textAndImageBlock',
  title: 'Text and Image Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this block in the editor (e.g., "Feature Highlight", "Content Section")',
      placeholder: 'e.g., Feature Highlight',
    }),
    defineField({
      name: 'article',
      title: 'Content',
      type: 'reference',
      description: '📄 Select content to display',
      to: [{ type: 'textAndImage' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'imageAlignment',
      title: 'Image Alignment',
      type: 'string',
      description: '⬅️➡️ Choose which side the image appears on',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'imageSize',
      title: 'Image Size',
      type: 'string',
      description: '📏 Choose the size of the image',
      options: {
        list: [
          { title: 'Small (20%)', value: 'small' },
          { title: 'Medium (30%)', value: 'medium' },
          { title: 'Large (40%)', value: 'large' },
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'verticalAlignment',
      title: 'Vertical Alignment',
      type: 'string',
      description: '⬆️⬇️ Align image and content vertically',
      options: {
        list: [
          { title: 'Top', value: 'start' },
          { title: 'Center', value: 'center' },
          { title: 'Bottom', value: 'end' },
        ],
        layout: 'radio',
      },
      initialValue: 'start',
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      description: '⬅️➡️ Align text content',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      title: 'article.title',
      media: 'article.image',
      imageAlignment: 'imageAlignment',
    },
    prepare(selection) {
      const { internalLabel, title, imageAlignment } = selection
      const side = imageAlignment === 'left' ? '⬅️' : '➡️'
      return {
        title: internalLabel || title || 'Text and Image Block',
        subtitle: `${side} Image ${imageAlignment || 'left'} • Content`,
        media: selection.media,
      }
    },
  },
})
