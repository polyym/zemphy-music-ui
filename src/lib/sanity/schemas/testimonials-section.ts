import { defineField, defineType } from 'sanity';

/**
 * Testimonials section: just the heading. Quotes come from the `testimonial`
 * collection. The heading parses `*foo*` into italic emphasis.
 */
export const testimonialsSection = defineType({
	name: 'testimonialsSection',
	title: 'Testimonials section',
	type: 'document',
	fields: [
		defineField({
			name: 'eyebrowLabel',
			title: 'Eyebrow label',
			description: 'Small all-caps label above the heading (design example: "Kind Words").',
			type: 'string'
		}),
		defineField({
			name: 'heading',
			title: 'Heading',
			description:
				'Section title. Wrap an accent word in *single asterisks* for the italic emphasis.',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required().max(160)
		})
	],
	preview: {
		prepare: () => ({ title: 'Testimonials section' })
	}
});
