import {defineType} from 'sanity'
import { colorSelectionField, customColorField } from '../utils/colorSelection'

export default defineType({
  name: 'contentSeparator',
  title: 'Content Separator',
  type: 'object',
  fields: [
    {
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this separator in the editor (e.g., "After Hero", "Section Divider")',
      placeholder: 'e.g., Section Divider',
    },
    // Design system color selection for line
    colorSelectionField(
      'lineColorSelection',
      'Line Color',
      'Choose line color from design system or use custom color'
    ),
    customColorField(
      'customLineColor',
      'Custom Line Color',
      'Custom line color when not using design system colors'
    ),
    // Design system color selection for diamond
    colorSelectionField(
      'diamondColorSelection',
      'Diamond Color',
      'Choose diamond color from design system or use custom color'
    ),
    customColorField(
      'customDiamondColor',
      'Custom Diamond Color',
      'Custom diamond color when not using design system colors'
    ),
    // Legacy color fields for backward compatibility
    {
      name: 'lineColor',
      title: 'Line Color (Legacy)',
      type: 'color',
      description: 'Color of the divider lines (legacy field)',
      options: {
        disableAlpha: false,
      },
      hidden: true, // Hide from UI but keep for data migration
    },
    {
      name: 'diamondColor',
      title: 'Diamond Color (Legacy)', 
      type: 'color',
      description: 'Color of the center diamond (legacy field)',
      options: {
        disableAlpha: false,
      },
      hidden: true, // Hide from UI but keep for data migration
    },
    {
      name: 'strokeWidth',
      title: 'Line Thickness',
      type: 'number',
      description: 'Thickness of the divider lines',
      initialValue: 0.4,
      validation: Rule => Rule.min(0.1).max(2),
    },
    {
      name: 'height',
      title: 'Height',
      type: 'string',
      description: 'Height of the separator',
      options: {
        list: [
          {title: 'Small (16px)', value: '16px'},
          {title: 'Medium (24px)', value: '24px'},
          {title: 'Large (32px)', value: '32px'},
          {title: 'Extra Large (48px)', value: '48px'},
        ],
      },
      initialValue: '24px',
    },
    {
      name: 'margin',
      title: 'Spacing',
      type: 'object',
      description: 'Spacing around the separator',
      fields: [
        {
          name: 'top',
          title: 'Top Margin',
          type: 'string',
          options: {
            list: [
              {title: 'None', value: '0'},
              {title: 'Small', value: '1rem'},
              {title: 'Medium', value: '2rem'},
              {title: 'Large', value: '3rem'},
            ],
          },
          initialValue: '2rem',
        },
        {
          name: 'bottom',
          title: 'Bottom Margin',
          type: 'string',
          options: {
            list: [
              {title: 'None', value: '0'},
              {title: 'Small', value: '1rem'},
              {title: 'Medium', value: '2rem'},
              {title: 'Large', value: '3rem'},
            ],
          },
          initialValue: '2rem',
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
    },
    prepare({internalLabel}) {
      return {
        title: internalLabel || 'Content Separator',
        subtitle: '➖ Divider with diamond center',
      }
    },
  },
})