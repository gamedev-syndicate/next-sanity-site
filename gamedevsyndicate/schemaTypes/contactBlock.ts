import {defineType, defineField} from 'sanity'
import { colorSelectionField, customColorField } from './utils/colorSelection'

export default defineType({
  name: 'contactBlock',
  title: 'Contact Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Form Title',
      type: 'string',
      description: 'Title displayed above the contact form',
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
  ],
  preview: {
    select: {
      title: 'title',
      buttonText: 'buttonText',
    },
    prepare({title, buttonText}) {
      return {
        title: title || 'Contact Form',
        subtitle: `Button: "${buttonText || 'Send'}"`,
      }
    },
  },
})
