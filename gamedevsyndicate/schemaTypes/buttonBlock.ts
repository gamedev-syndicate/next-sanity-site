import {defineType, defineField} from 'sanity'

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
      type: 'string', // Changed from 'url' to 'string' to allow relative paths
      description: 'Internal path (e.g., /about, /contact) or external URL (e.g., https://example.com)',
      validation: Rule => Rule.required().custom((url) => {
        if (!url) return 'URL is required';
        
        // Allow relative paths starting with /
        if (url.startsWith('/')) return true;
        
        // Allow absolute URLs
        try {
          new URL(url);
          return true;
        } catch {
          return 'Must be a valid URL (https://example.com) or internal path (/about)';
        }
      }),
    }),
    defineField({
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Outline', value: 'outline'},
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'size',
      title: 'Button Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
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
    },
    prepare({title, subtitle, style}) {
      return {
        title: title || 'Button',
        subtitle: `${style} • ${subtitle}`,
      }
    },
  },
})
