import {defineType} from 'sanity'

export default defineType({
  name: 'contentSeparator',
  title: 'Content Separator',
  type: 'object',
  fields: [
    {
      name: 'lineColor',
      title: 'Line Color',
      type: 'color',
      description: 'Color of the divider lines',
      options: {
        disableAlpha: false,
      },
    },
    {
      name: 'diamondColor',
      title: 'Diamond Color', 
      type: 'color',
      description: 'Color of the center diamond',
      options: {
        disableAlpha: false,
      },
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
    prepare() {
      return {
        title: 'Content Separator',
        subtitle: 'Divider with diamond center',
      }
    },
  },
})