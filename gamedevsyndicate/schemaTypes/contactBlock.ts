import {defineType, defineField} from 'sanity'
import { colorSelectionField, customColorField } from './utils/colorSelection'

export default defineType({
  name: 'contactBlock',
  title: 'Contact Block',
  type: 'object',
  fields: [
    defineField({
      name: 'internalLabel',
      title: 'Internal Label',
      type: 'string',
      description: '🏷️ For CMS organization only - not displayed on the website. Use this to identify this block in the editor (e.g., "Homepage Contact Form", "Footer Contact")',
      placeholder: 'e.g., Homepage Contact Form',
    }),
    defineField({
      name: 'title',
      title: 'Form Title (Optional)',
      type: 'string',
      description: '📝 Title displayed above the contact form on the website. Leave empty to hide.',
      initialValue: 'Get in Touch',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Optional description text shown below the title',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'nameLabel',
      title: 'Name Field Label',
      type: 'string',
      initialValue: 'Name',
    }),
    defineField({
      name: 'emailLabel',
      title: 'Email Field Label',
      type: 'string',
      initialValue: 'Email',
    }),
    defineField({
      name: 'messageLabel',
      title: 'Message Field Label',
      type: 'string',
      initialValue: 'Message',
    }),
    defineField({
      name: 'buttonText',
      title: 'Submit Button Text',
      type: 'string',
      initialValue: 'Send',
      validation: Rule => Rule.required(),
    }),
    // Button styling with design system
    colorSelectionField(
      'buttonBackgroundColorSelection',
      'Button Background Color',
      'Choose button background color from design system or use custom color'
    ),
    customColorField(
      'customButtonBackgroundColor',
      'Custom Button Background Color',
      'Custom background color when not using design system colors'
    ),
    colorSelectionField(
      'buttonTextColorSelection',
      'Button Text Color',
      'Choose button text color from design system or use custom color'
    ),
    customColorField(
      'customButtonTextColor',
      'Custom Button Text Color',
      'Custom text color when not using design system colors'
    ),
    defineField({
      name: 'buttonSize',
      title: 'Button Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
          {title: 'Extra Large', value: 'xl'},
        ],
      },
      initialValue: 'large',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      description: 'Message shown when form is submitted successfully',
      initialValue: 'Thank you! Your message has been sent.',
    }),
    defineField({
      name: 'errorMessage',
      title: 'Error Message',
      type: 'string',
      description: 'Message shown when form submission fails',
      initialValue: 'Something went wrong. Please try again.',
    }),
    defineField({
      name: 'recipientEmail',
      title: 'Recipient Email (Optional)',
      type: 'string',
      description: 'Email address where form submissions should be sent. Leave empty to use default site contact email.',
      validation: Rule => Rule.email(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      description: 'Add social media links to display below the contact form',
      of: [{type: 'socialMediaLink'}],
    }),
  ],
  preview: {
    select: {
      internalLabel: 'internalLabel',
      title: 'title',
      buttonText: 'buttonText',
    },
    prepare({internalLabel, title, buttonText}) {
      return {
        title: internalLabel || title || 'Contact Form',
        subtitle: `📧 Contact Block • Button: "${buttonText || 'Send'}"`,
      }
    },
  },
})
