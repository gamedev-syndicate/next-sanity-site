import {defineType, defineField} from 'sanity'

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
    defineField({
      name: 'useBrandColor',
      title: 'Use Brand Color',
      type: 'boolean',
      description: 'Use primary or secondary brand color instead of style-based color',
      initialValue: false,
    }),
    defineField({
      name: 'brandColorType',
      title: 'Brand Color Type',
      type: 'string',
      options: {
        list: [
          {title: 'Primary Brand Color', value: 'primary'},
          {title: 'Secondary Brand Color', value: 'secondary'},
        ],
      },
      initialValue: 'primary',
      hidden: ({parent}) => !parent?.useBrandColor,
    }),
    defineField({
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: buttonStyleOptions,
      },
      initialValue: 'primary',
      hidden: ({parent}) => parent?.useBrandColor,
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
  ],
  preview: {
    select: {
      title: 'text',
      subtitle: 'url',
      style: 'style',
      useBrandColor: 'useBrandColor',
      brandColorType: 'brandColorType',
    },
    prepare({title, subtitle, style, useBrandColor, brandColorType}) {
      const displayStyle = useBrandColor ? `Brand ${brandColorType}` : style;
      return {
        title: title || 'Button',
        subtitle: `${displayStyle} • ${subtitle}`,
      }
    },
  },
})
