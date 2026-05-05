import { defineField, defineType } from 'sanity';

/**
 * Hero block: kicker line, gradient display name, tagline, and the two CTA
 * labels. Singleton.
 */
export const heroSection = defineType({
	name: 'heroSection',
	title: 'Hero',
	type: 'document',
	fields: [
		defineField({
			name: 'kicker',
			title: 'Kicker line',
			description: 'Small all-caps line above the display name.',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'displayName',
			title: 'Display name',
			description: 'Large gradient wordmark. Single short word reads best.',
			type: 'string',
			validation: (rule) => rule.required().max(20)
		}),
		defineField({
			name: 'tagline',
			title: 'Tagline',
			description: 'One or two italic sentences below the display name.',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'primaryCtaLabel',
			title: 'Primary CTA label',
			description: 'Filled button; jumps to the booking section.',
			type: 'string',
			validation: (rule) => rule.required().max(40)
		}),
		defineField({
			name: 'secondaryCtaLabel',
			title: 'Secondary CTA label',
			description: 'Ghost button; jumps to the songbook.',
			type: 'string',
			validation: (rule) => rule.required().max(40)
		})
	],
	preview: {
		prepare: () => ({ title: 'Hero' })
	}
});
