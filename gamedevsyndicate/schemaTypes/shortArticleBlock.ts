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
      name: 'title',
      title: 'Title',
      type: 'string',
      description: '📝 Article title displayed at the top',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text Content',
      type: 'array',
      description: '📄 Article text content displayed below the title',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
              {
                name: 'textAlign',
                type: 'object',
                title: 'Text Alignment',
                fields: [
                  {
                    name: 'align',
                    type: 'string',
                    title: 'Alignment',
                    options: {
                      list: [
                        { title: 'Left', value: 'left' },
                        { title: 'Center', value: 'center' },
                        { title: 'Right', value: 'right' },
                        { title: 'Justify', value: 'justify' },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: '🖼️ Article image displayed to the side of the content',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        },
      ],
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
      title: 'title',
      media: 'image',
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
