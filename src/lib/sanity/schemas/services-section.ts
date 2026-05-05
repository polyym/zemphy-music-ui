import { defineField, defineType } from 'sanity';

/**
 * Services section: just the heading. The cards themselves come from the
 * `service` collection. The heading parses `*foo*` into italic emphasis.
 */
export const servicesSection = defineType({
	name: 'servicesSection',
	title: 'Services section',
	type: 'document',
	fields: [
		defineField({
			name: 'eyebrowLabel',
			title: 'Eyebrow label',
			description: 'Small all-caps label above the heading (design example: "What I Offer").',
			type: 'string'
		}),
		defineField({
			name: 'heading',
			title: 'Heading',
			description:
				'Section title. Wrap an accent word in *single asterisks* for the italic emphasis. Press Enter for a soft line break.',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required().max(160)
		})
	],
	preview: {
		prepare: () => ({ title: 'Services section' })
	}
});
