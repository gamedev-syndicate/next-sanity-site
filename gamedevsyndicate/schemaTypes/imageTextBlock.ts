import { defineField, defineType } from 'sanity'
import { colorSelectionField, customColorField } from './utils/colorSelection'

export default defineType({
  name: 'imageTextBlock',
  title: 'Image Text Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this block in the editor (e.g., "About Section", "Feature Highlight")',
      placeholder: 'e.g., About Section',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: '📝 Title displayed next to the image',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: '🖼️ Image displayed on one side of the content',
      options: {
        hotspot: true,
      },
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
      name: 'text',
      title: 'Text Content',
      type: 'array',
      description: '📄 Rich text content displayed below the title',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
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
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
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
      description: '📏 Choose the width of the image column',
      options: {
        list: [
          { title: 'Small (25%)', value: 'small' },
          { title: 'Medium (33%)', value: 'medium' },
          { title: 'Large (40%)', value: 'large' },
          { title: 'Half (50%)', value: 'half' },
        ],
      },
      initialValue: 'medium',
    }),
    colorSelectionField(
      'backgroundColorSelection',
      'Background Color',
      'Choose background color from design system or use custom color'
    ),
    customColorField(
      'customBackgroundColor',
      'Custom Background Color',
      'Custom background color when not using design system colors'
    ),
    defineField({
      name: 'verticalAlignment',
      title: 'Vertical Alignment',
      type: 'string',
      description: '⬆️⬇️ Align content vertically',
      options: {
        list: [
          { title: 'Top', value: 'start' },
          { title: 'Center', value: 'center' },
          { title: 'Bottom', value: 'end' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      title: 'title',
      media: 'image',
      imagePosition: 'imagePosition',
    },
    prepare(selection) {
      const { internalLabel, title, imagePosition } = selection
      const side = imagePosition === 'left' ? '⬅️' : '➡️'
      return {
        title: internalLabel || title || 'Image Text Block',
        subtitle: `${side} Image ${imagePosition || 'left'} • Text content`,
        media: selection.media,
      }
    },
  },
})
