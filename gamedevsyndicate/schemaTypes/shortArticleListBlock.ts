import { defineField, defineType } from 'sanity'
import { colorSelectionField, customColorField } from './utils/colorSelection'

export default defineType({
  name: 'shortArticleListBlock',
  title: 'Short Article List Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this block in the editor (e.g., "Feature List", "News Feed")',
      placeholder: 'e.g., Latest Features',
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: '📝 Optional title displayed above the article list',
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
      name: 'articles',
      title: 'Articles',
      type: 'array',
      description: '📄 Select articles to display',
      of: [
        {
          type: 'reference',
          to: [{ type: 'shortArticle' }],
        },
      ],
      validation: Rule => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description: '📐 Choose how articles are displayed',
      options: {
        list: [
          { title: 'Vertical Stack', value: 'vertical' },
          { title: 'Horizontal Scroll', value: 'horizontal' },
        ],
        layout: 'radio',
      },
      initialValue: 'vertical',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      description: '🖼️ Choose where the image appears relative to text',
      options: {
        list: [
          { title: 'Above Text', value: 'top' },
          { title: 'Left of Text', value: 'left' },
          { title: 'Right of Text', value: 'right' },
          { title: 'Below Text', value: 'bottom' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'imageAlignment',
      title: 'Alternate Image Sides (Vertical Layout)',
      type: 'boolean',
      description: '🔄 When using left/right position in vertical layout, alternate sides for each article',
      initialValue: false,
      hidden: ({ parent }) => parent?.layout === 'horizontal' || (parent?.imagePosition !== 'left' && parent?.imagePosition !== 'right'),
    }),
    defineField({
      name: 'imageSize',
      title: 'Image Size',
      type: 'string',
      description: '📏 Choose the size of the images',
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
      name: 'spacing',
      title: 'Article Spacing',
      type: 'string',
      description: '↕️ Space between articles',
      options: {
        list: [
          { title: 'Compact', value: 'compact' },
          { title: 'Normal', value: 'normal' },
          { title: 'Relaxed', value: 'relaxed' },
        ],
      },
      initialValue: 'normal',
    }),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      title: 'title',
      layout: 'layout',
      articleCount: 'articles.length',
    },
    prepare(selection) {
      const { internalLabel, title, layout, articleCount } = selection
      const layoutIcon = layout === 'horizontal' ? '↔️' : '↕️'
      const count = articleCount || 0
      return {
        title: internalLabel || title || 'Short Article List Block',
        subtitle: `${layoutIcon} ${layout || 'vertical'} • ${count} article${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
