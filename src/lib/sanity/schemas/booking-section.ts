import { defineField, defineType } from 'sanity';

/**
 * Booking block: heading, body paragraph, and primary CTA label. The mailto
 * address itself lives in `siteSettings.bookingEmail`. The heading parses
 * `*foo*` into italic emphasis (rendered with the pink-lilac-blue gradient
 * on the dark plum background).
 */
export const bookingSection = defineType({
	name: 'bookingSection',
	title: 'Booking',
	type: 'document',
	fields: [
		defineField({
			name: 'eyebrowLabel',
			title: 'Eyebrow label',
			description: 'Small all-caps label above the heading (design example: "Let\'s Chat").',
			type: 'string'
		}),
		defineField({
			name: 'heading',
			title: 'Heading',
			description:
				'Section title. Wrap an accent word in *single asterisks* for the gradient italic emphasis. Press Enter for a soft line break.',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required().max(160)
		}),
		defineField({
			name: 'body',
			title: 'Body paragraph',
			description: 'Short italic body below the heading.',
			type: 'text',
			rows: 4,
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'primaryCtaLabel',
			title: 'Primary CTA label',
			description: 'Filled button text. Opens a mailto: to the booking email.',
			type: 'string',
			validation: (rule) => rule.required().max(40)
		}),
		defineField({
			name: 'contactInfoPrefix',
			title: 'Contact info prefix',
			description:
				'Text shown immediately before the linked email address in the contact line. Design example: "Email".',
			type: 'string'
		}),
		defineField({
			name: 'contactInfoSuffix',
			title: 'Contact info suffix',
			description:
				'Text shown immediately after the linked email address in the contact line. Design example: "for more information".',
			type: 'string'
		})
	],
	preview: {
		prepare: () => ({ title: 'Booking' })
	}
});
