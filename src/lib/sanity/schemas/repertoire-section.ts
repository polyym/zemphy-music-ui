import { defineField, defineType } from 'sanity';

/**
 * Repertoire section: heading and intro paragraph. Songs themselves come from
 * the `song` collection. The heading parses `*foo*` into italic emphasis.
 */
export const repertoireSection = defineType({
	name: 'repertoireSection',
	title: 'Repertoire section',
	type: 'document',
	fields: [
		defineField({
			name: 'eyebrowLabel',
			title: 'Eyebrow label',
			description:
				'Small all-caps label above the heading (design example: "A Taste of the Songbook").',
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
		}),
		defineField({
			name: 'intro',
			title: 'Intro paragraph',
			description: 'Short paragraph alongside the heading.',
			type: 'text',
			rows: 4,
			validation: (rule) => rule.required()
		})
	],
	preview: {
		prepare: () => ({ title: 'Repertoire section' })
	}
});
