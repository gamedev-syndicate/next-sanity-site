import {defineType, defineField} from 'sanity'
import { colorSelectionField, customColorField, opacityPresetField } from './utils/colorSelection'

const buttonStyleOptions = [
  {title: 'Primary', value: 'primary'},
  {title: 'Secondary', value: 'secondary'},
  {title: 'Outline', value: 'outline'},
  {title: 'Ghost', value: 'ghost'},
  {title: 'Danger', value: 'danger'},
];

const buttonSizeOptions = [
  {title: 'Small', value: 'small'},
  {title: 'Medium', value: 'medium'},
  {title: 'Large', value: 'large'},
  {title: 'Extra Large', value: 'xl'},
];

export default defineType({
  name: 'buttonBlock',
  title: 'Button Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this button in the editor (e.g., "CTA Button", "Download Link")',
      placeholder: 'e.g., CTA Button',
    }),
    defineField({
      name: 'text',
      title: 'Button Text',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      description: 'Internal path (e.g., /about, /contact) or external URL (e.g., https://example.com)',
      validation: Rule => Rule.required().custom((url) => {
        if (!url) return 'URL is required';
        
        if (url.startsWith('/')) return true;
        
        try {
          new URL(url);
          return true;
        } catch {
          return 'Must be a valid URL (https://example.com) or internal path (/about)';
        }
      }),
    }),
    // Design system color selection
    colorSelectionField(
      'backgroundColorSelection',
      'Button Background Color',
      'Choose button background color from design system or use custom color'
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
    colorSelectionField(
      'textColorSelection',
      'Button Text Color',
      'Choose button text color from design system or use custom color'
    ),
    opacityPresetField(
      'textOpacityPreset',
      'Text Opacity'
    ),
    customColorField(
      'customTextColor',
      'Custom Text Color',
      'Custom text color when not using design system colors'
    ),
    defineField({
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: buttonStyleOptions,
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'size',
      title: 'Button Size',
      type: 'string',
      options: {
        list: buttonSizeOptions,
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'alignment',
      title: 'Button Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      text: 'text',
      url: 'url',
      style: 'style',
      alignment: 'alignment',
    },
    prepare({internalLabel, text, url, style, alignment}) {
      return {
        title: internalLabel || text || 'Button',
        subtitle: `🔘 Button • ${style} • ${alignment} • ${url}`,
      }
    },
  },
})
