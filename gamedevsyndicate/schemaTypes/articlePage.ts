import {defineType, defineField} from 'sanity'
import { colorSelectionField, customColorField } from './utils/colorSelection'

export default defineType({
  name: 'articlePage',
  title: 'Article Page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this article in the editor (e.g., "Company History Article", "Tech Blog Post")',
      placeholder: 'e.g., Company History Article',
    }),
    defineField({
      name: 'title',
      title: 'Article Title',
      type: 'string',
      description: '📝 The article title displayed as the main heading and in browser tab',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: '📄 Short summary of the article (used in previews and meta descriptions)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: '✍️ Article author name',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: '📅 When this article was published',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      description: '🔄 When this article was last updated',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: '🖼️ Main article image displayed at the top',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'Show this article in the main navigation menu',
      initialValue: false,
    }),
    defineField({
      name: 'navigationOrder',
      title: 'Navigation Order',
      type: 'number',
      description: 'Order in navigation menu (lower numbers appear first)',
      initialValue: 100,
      hidden: ({parent}) => !parent?.showInNavigation,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: '🏷️ Tags for categorizing and filtering articles',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: '📁 Main category for this article',
      options: {
        list: [
          {title: 'News', value: 'news'},
          {title: 'Blog', value: 'blog'},
          {title: 'Tutorial', value: 'tutorial'},
          {title: 'Case Study', value: 'case-study'},
          {title: 'Announcement', value: 'announcement'},
          {title: 'Other', value: 'other'},
        ],
      },
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
    defineField({
      name: 'content',
      title: 'Article Content',
      type: 'array',
      description: '📝 Main article content using rich text blocks',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {type: 'imageBlock'},
        {type: 'textBlock'},
        {type: 'buttonBlock'},
        {type: 'companyBlock'},
        {type: 'compactCompanyListBlock'},
        {type: 'contactBlock'},
        {type: 'textAndImageBlock'},
        {type: 'textAndImageListBlock'},
        {type: 'contentSeparator'},
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      description: '🔗 Related articles to show at the bottom',
      of: [
        {
          type: 'reference',
          to: [{type: 'articlePage'}],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      description: '🔍 Search engine optimization settings',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Title for search engines (leave empty to use article title)',
          validation: (Rule: any) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Description for search engines (leave empty to use excerpt)',
          validation: (Rule: any) => Rule.max(160),
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags',
          },
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      internalLabel: 'internalLabel',
      author: 'author',
      media: 'featuredImage',
      publishedAt: 'publishedAt',
      category: 'category',
    },
    prepare(selection) {
      const {title, internalLabel, author, publishedAt, category} = selection
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Not published'
      const categoryLabel = category ? ` • ${category}` : ''
      const authorLabel = author ? ` by ${author}` : ''
      
      return {
        title: internalLabel || title || 'Untitled Article',
        subtitle: `📅 ${date}${categoryLabel}${authorLabel}`,
        media: selection.media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
    {
      title: 'Title, Z-A',
      name: 'titleDesc',
      by: [{field: 'title', direction: 'desc'}],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{field: 'category', direction: 'asc'}],
    },
  ],
})
