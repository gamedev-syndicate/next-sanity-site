import { defineField, defineType } from 'sanity'
import { colorSelectionField, customColorField } from './utils/colorSelection'

export default defineType({
  name: 'companyListBlock',
  title: 'Company List Block (Vertical)',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this company list in the editor (e.g., "Homepage Partners", "All Members")',
      placeholder: 'e.g., Homepage Partners',
    }),
    defineField({
      name: 'title',
      title: 'Title (Optional)',
      type: 'string',
      description: '📝 Title displayed above the company list on the website. Leave empty to hide.',
    }),
    defineField({
      name: 'alternateImagePosition',
      title: 'Alternate Image Position',
      type: 'boolean',
      description: '🔄 When enabled, every other company will have its image on the opposite side',
      initialValue: false,
    }),
    defineField({
      name: 'logoBlendMode',
      title: 'Logo Blend Mode',
      type: 'string',
      description: '🎨 Apply blend mode to logos to help remove dark backgrounds. "Lighten" works well for logos with black backgrounds.',
      options: {
        list: [
          { title: 'None (Default)', value: 'normal' },
          { title: 'Lighten (Remove Dark Backgrounds)', value: 'lighten' },
          { title: 'Screen', value: 'screen' },
          { title: 'Color Dodge', value: 'color-dodge' },
          { title: 'Multiply', value: 'multiply' },
        ],
      },
      initialValue: 'normal',
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
    colorSelectionField(
      'borderColorSelection',
      'Border Color',
      'Choose border color from design system or use custom color'
    ),
    customColorField(
      'customBorderColor',
      'Custom Border Color',
      'Custom border color when not using design system colors'
    ),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      title: 'title',
    },
    prepare(selection) {
      const { internalLabel, title } = selection
      return {
        title: internalLabel || title || 'Company List Block',
        subtitle: `📋 Vertical List • All companies with full details`,
      }
    },
  },
})
