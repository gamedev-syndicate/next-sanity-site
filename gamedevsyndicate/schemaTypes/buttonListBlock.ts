import { defineField, defineType } from 'sanity'
import { colorSelectionField, customColorField, opacityPresetField } from './utils/colorSelection'

export default defineType({
  name: 'buttonListBlock',
  title: 'Button List Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this button list in the editor (e.g., "CTA Buttons", "Social Links")',
      placeholder: 'e.g., Homepage CTAs',
    }),
    defineField({
      name: 'title',
      title: 'Section Title (Optional)',
      type: 'string',
      description: '📝 Optional title displayed above the button list',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      description: '🔘 Add buttons to the list',
      of: [{ type: 'buttonBlock' }],
      validation: Rule => Rule.required().min(1).max(6).error('Must have between 1 and 6 buttons'),
    }),
    defineField({
      name: 'layout',
      title: 'Layout Direction (Desktop)',
      type: 'string',
      description: '📐 How buttons are arranged on desktop screens. Mobile always stacks vertically.',
      options: {
        list: [
          { title: 'Vertical Stack', value: 'vertical' },
          { title: 'Horizontal Row', value: 'horizontal' },
        ],
        layout: 'radio',
      },
      initialValue: 'horizontal',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'spacing',
      title: 'Button Spacing',
      type: 'string',
      description: '↔️ Space between buttons',
      options: {
        list: [
          { title: 'Compact', value: 'compact' },
          { title: 'Normal', value: 'normal' },
          { title: 'Relaxed', value: 'relaxed' },
        ],
      },
      initialValue: 'normal',
    }),
    defineField({
      name: 'alignment',
      title: 'Button Alignment',
      type: 'string',
      description: '⬅️ Horizontal alignment of buttons within the container',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'center',
    }),
    colorSelectionField(
      'backgroundColorSelection',
      'Background Color',
      'Choose background color from design system or use custom color'
    ),
    opacityPresetField(
      'backgroundOpacityPreset',
      'Background Opacity'
    ),
    customColorField(
      'customBackgroundColor',
      'Custom Background Color',
      'Custom background color when not using design system colors'
    ),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      title: 'title',
      buttons: 'buttons',
      layout: 'layout',
    },
    prepare({ internalLabel, title, buttons, layout }) {
      const buttonCount = buttons?.length || 0;
      const layoutIcon = layout === 'horizontal' ? '↔️' : '↕️';
      return {
        title: internalLabel || title || 'Button List Block',
        subtitle: `${layoutIcon} ${buttonCount} button${buttonCount !== 1 ? 's' : ''} • ${layout}`,
      };
    },
  },
})
