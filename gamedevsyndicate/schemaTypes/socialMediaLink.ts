import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'socialMediaLink',
  title: 'Social Media Link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Twitter / X', value: 'twitter' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'GitHub', value: 'github' },
          { title: 'Discord', value: 'discord' },
          { title: 'Twitch', value: 'twitch' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'Reddit', value: 'reddit' },
          { title: 'Medium', value: 'medium' },
          { title: 'Mastodon', value: 'mastodon' },
          { title: 'Bluesky', value: 'bluesky' },
          { title: 'Threads', value: 'threads' },
          { title: 'Website', value: 'website' },
          { title: 'Email', value: 'email' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Full URL to your social profile (e.g., https://twitter.com/username)',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https', 'mailto'],
        }),
    }),
    defineField({
      name: 'label',
      title: 'Custom Label (Optional)',
      type: 'string',
      description: 'Optional: Override the default platform name',
    }),
  ],
  preview: {
    select: {
      platform: 'platform',
      url: 'url',
      label: 'label',
    },
    prepare({ platform, url, label }) {
      return {
        title: label || platform,
        subtitle: url,
      }
    },
  },
})
