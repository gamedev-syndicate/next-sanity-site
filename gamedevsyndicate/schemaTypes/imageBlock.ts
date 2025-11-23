import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'imageBlock',
  title: 'Image Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this image block in the editor (e.g., "Hero Image", "Team Photo")',
      placeholder: 'e.g., Hero Image',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption below the image',
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          {title: 'Small (25%)', value: 'small'},
          {title: 'Medium (50%)', value: 'medium'},
          {title: 'Large (75%)', value: 'large'},
          {title: 'Full Width (100%)', value: 'full'},
        ],
      },
      initialValue: 'full',
    }),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      alt: 'alt',
      caption: 'caption',
      media: 'image',
    },
    prepare({internalLabel, alt, caption, media}) {
      return {
        title: internalLabel || alt || 'Image Block',
        subtitle: `🖼️ Image Block${caption ? ` • ${caption}` : ''}`,
        media,
      }
    },
  },
})
