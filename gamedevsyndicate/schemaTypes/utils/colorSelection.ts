import { defineField } from 'sanity'

export const opacityPresetField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description: description || '⚠️ Set transparency level. If the selected design system color already has transparency, this preset will multiply with it (e.g., 50% preset on a 50% transparent color = 25% final opacity).',
    options: {
      list: [
        { title: '100% (Solid)', value: '100' },
        { title: '75% (Strong)', value: '75' },
        { title: '50% (Medium)', value: '50' },
        { title: '25% (Subtle)', value: '25' },
      ],
      layout: 'dropdown',
    },
    initialValue: '100',
    hidden: ({ parent }) => parent?.colorSelection === 'custom',
  })

export const colorSelectionField = (name: string, title: string, description?: string) => 
  defineField({
    name,
    title,
    type: 'string',
    description,
    options: {
      list: [
        { title: 'Primary', value: 'primary' },
        { title: 'Secondary', value: 'secondary' },
        { title: 'Tertiary', value: 'tertiary' },
        { title: 'Button Primary', value: 'buttonPrimary' },
        { title: 'Button Secondary', value: 'buttonSecondary' },
        { title: 'Button Text Primary', value: 'buttonTextPrimary' },
        { title: 'Button Text Secondary', value: 'buttonTextSecondary' },
        { title: 'Custom Color', value: 'custom' },
      ],
      layout: 'dropdown',
    },
    initialValue: 'primary',
  })

export const customColorField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'color',
    description,
    options: {
      disableAlpha: false,
    },
    hidden: ({ parent }) => parent?.colorSelection !== 'custom',
  })

// For solid color backgrounds
export const solidColorFields = () => [
  colorSelectionField(
    'solidColorSelection',
    'Background Color',
    'Choose from design system colors or use a custom color'
  ),
  customColorField(
    'customSolidColor',
    'Custom Background Color',
    'Custom background color when not using design system colors'
  ),
]

// For gradient backgrounds  
export const gradientColorFields = () => [
  colorSelectionField(
    'gradientFromSelection',
    'Gradient Start Color',
    'Choose start color from design system or use custom color'
  ),
  customColorField(
    'customGradientFrom',
    'Custom Gradient Start Color',
    'Custom start color when not using design system colors'
  ),
  colorSelectionField(
    'gradientToSelection',
    'Gradient End Color',
    'Choose end color from design system or use custom color'
  ),
  customColorField(
    'customGradientTo',
    'Custom Gradient End Color',
    'Custom end color when not using design system colors'
  ),
]

export const backgroundColorGroup = (groupName = 'backgroundColor') => ({
  colorSelection: colorSelectionField(
    'colorSelection',
    'Color Choice',
    'Choose from design system colors or use a custom color'
  ),
  customColor: customColorField(
    'customColor',
    'Custom Color',
    'Custom color when not using design system colors'
  ),
})

// Helper to create a group with color selection, opacity preset, and custom color
export const colorFieldsWithOpacity = (
  colorFieldName: string,
  opacityFieldName: string,
  customColorFieldName: string,
  colorTitle: string,
  colorDescription?: string
) => [
  colorSelectionField(colorFieldName, colorTitle, colorDescription),
  opacityPresetField(
    opacityFieldName,
    'Opacity',
    '⚠️ WARNING: If the selected design system color already has transparency, this preset will multiply with it. For example: 50% preset on a 50% transparent color = 25% final opacity.'
  ),
  customColorField(customColorFieldName, `Custom ${colorTitle}`, `Use custom color instead of design system`),
]
