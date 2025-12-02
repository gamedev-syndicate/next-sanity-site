import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'shortArticleBlock',
  title: 'Short Article Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this block in the editor (e.g., "Feature Highlight", "News Item")',
      placeholder: 'e.g., Feature Highlight',
    }),
    defineField({
      name: 'article',
      title: 'Article',
      type: 'reference',
      description: '📄 Select an article to display',
      to: [{ type: 'shortArticle' }],
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
        title: internalLabel || title || 'Short Article Block',
        subtitle: `${side} Image ${imageAlignment || 'left'} • Article content`,
        media: selection.media,
      }
    },
  },
})
