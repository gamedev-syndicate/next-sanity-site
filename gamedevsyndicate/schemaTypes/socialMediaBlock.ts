import { defineType, defineField } from 'sanity'
import { colorSelectionField, customColorField } from './utils/colorSelection'

export default defineType({
  name: 'socialMediaBlock',
  title: 'Social Media Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only (not displayed on site)',
      placeholder: 'e.g., Footer Social Links, Contact Page Social Media',
    }),
    defineField({
      name: 'title',
      title: 'Section Title (Optional)',
      type: 'string',
      description: 'Optional heading displayed above the social links',
      placeholder: 'e.g., Connect With Us, Follow Us',
    }),
    defineField({
      name: 'links',
      title: 'Social Media Links',
      type: 'array',
      of: [{ type: 'socialMediaLink' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description: 'How to display the social media links',
      options: {
        list: [
          { title: 'Horizontal', value: 'horizontal' },
          { title: 'Vertical', value: 'vertical' },
          { title: 'Grid', value: 'grid' },
        ],
        layout: 'radio',
      },
      initialValue: 'horizontal',
    }),
    defineField({
      name: 'showLabels',
      title: 'Show Labels',
      type: 'boolean',
      description: 'Display text labels next to icons',
      initialValue: false,
    }),
    defineField({
      name: 'iconSize',
      title: 'Icon Size',
      type: 'string',
      options: {
        list: [
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    colorSelectionField(
      'linkColorSelection',
      'Link Color',
      'Choose link/icon color from design system or use custom color'
    ),
    customColorField(
      'customLinkColor',
      'Custom Link Color',
      'Custom link color when not using design system colors'
    ),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      title: 'title',
      links: 'links',
      layout: 'layout',
    },
    prepare({ internalLabel, title, links, layout }) {
      const linkCount = links?.length || 0
      return {
        title: internalLabel || title || 'Social Media Block',
        subtitle: `🔗 Social Media • ${linkCount} link${linkCount !== 1 ? 's' : ''} • ${layout || 'horizontal'} layout`,
      }
    },
  },
})
