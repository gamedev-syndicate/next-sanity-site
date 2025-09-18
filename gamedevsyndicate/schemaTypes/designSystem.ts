import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'designSystem',
  title: 'Design System',
  type: 'document',
  icon: () => '🎨',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Design System Colors',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'colors',
      title: 'Color Palette',
      type: 'object',
      fields: [
        defineField({
          name: 'primary',
          title: 'Primary Color',
          type: 'color',
          description: 'Main brand color used throughout the application',
          validation: (rule) => rule.required(),
          options: {
            disableAlpha: false,
          },
        }),
        defineField({
          name: 'secondary',
          title: 'Secondary Color',
          type: 'color',
          description: 'Secondary brand color for accents and highlights',
          validation: (rule) => rule.required(),
          options: {
            disableAlpha: false,
          },
        }),
        defineField({
          name: 'tertiary',
          title: 'Tertiary Color',
          type: 'color',
          description: 'Tertiary color for additional accent elements',
          validation: (rule) => rule.required(),
          options: {
            disableAlpha: false,
          },
        }),
        defineField({
          name: 'buttonPrimary',
          title: 'Primary Button Color',
          type: 'color',
          description: 'Color for primary action buttons',
          validation: (rule) => rule.required(),
          options: {
            disableAlpha: false,
          },
        }),
        defineField({
          name: 'buttonSecondary',
          title: 'Secondary Button Color',
          type: 'color',
          description: 'Color for secondary action buttons',
          validation: (rule) => rule.required(),
          options: {
            disableAlpha: false,
          },
        }),
      ],
    }),
    defineField({
      name: 'accessibility',
      title: 'Accessibility Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'contrastRatio',
          title: 'Minimum Contrast Ratio',
          type: 'number',
          description: 'WCAG AA compliance requires 4.5:1 for normal text',
          initialValue: 4.5,
          validation: (rule) => rule.min(1).max(21),
        }),
        defineField({
          name: 'colorBlindFriendly',
          title: 'Color Blind Friendly',
          type: 'boolean',
          description: 'Ensure colors are distinguishable for color blind users',
          initialValue: true,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      primaryColor: 'colors.primary.hex',
      secondaryColor: 'colors.secondary.hex',
    },
    prepare({ title, primaryColor, secondaryColor }) {
      return {
        title,
        subtitle: `Primary: ${primaryColor || 'Not set'} | Secondary: ${secondaryColor || 'Not set'}`,
      }
    },
  },
})
