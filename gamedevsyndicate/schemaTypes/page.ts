import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'Show this page in the main navigation menu',
      initialValue: true,
    }),
    defineField({
      name: 'navigationOrder',
      title: 'Navigation Order',
      type: 'number',
      description: 'Order in navigation menu (lower numbers appear first)',
      initialValue: 100,
      hidden: ({parent}) => !parent?.showInNavigation,
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      description: 'Background color for the page',
      options: {
        disableAlpha: false,
      },
    }),
    defineField({
      name: 'content',
      title: 'Content Blocks',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'imageBlock'},
        {type: 'textBlock'},
        {type: 'buttonBlock'},
      ],
    }),
  ],
})
