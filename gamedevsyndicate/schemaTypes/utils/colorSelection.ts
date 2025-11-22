import { defineField } from 'sanity'

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
