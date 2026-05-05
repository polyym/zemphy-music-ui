import { defineField, defineType } from 'sanity';

const ACCENT_NOTE =
	"Wrap an accent word in *single asterisks* to apply the design's italic emphasis.";

/**
 * About block: portrait, heading, body, signature, and the spinning portrait
 * badge text. Singleton. Heading and body are plain text; the renderer parses
 * `*foo*` into `<em>foo</em>` and `\n\n` into paragraph breaks.
 */
export const aboutSection = defineType({
	name: 'aboutSection',
	title: 'About',
	type: 'document',
	fields: [
		defineField({
			name: 'eyebrowLabel',
			title: 'Eyebrow label',
			description: 'Small all-caps label above the heading (design example: "About the Artist").',
			type: 'string'
		}),
		defineField({
			name: 'heading',
			title: 'Heading',
			description: `Section title. ${ACCENT_NOTE} Press Enter for a soft line break in the middle of the heading.`,
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required().max(160)
		}),
		defineField({
			name: 'body',
			title: 'Body',
			description: `Multi-paragraph introduction. Press Enter twice for a paragraph break. ${ACCENT_NOTE}`,
			type: 'text',
			rows: 8,
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'portraitImage',
			title: 'Portrait',
			description: 'Suggested aspect ratio 4:5; focus point in the upper third.',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'signature',
			title: 'Signature line',
			description: 'Italic sign-off below the body.',
			type: 'string'
		}),
		defineField({
			name: 'badgeLine1',
			title: 'Badge line 1',
			description: 'Top half of the spinning portrait badge.',
			type: 'string'
		}),
		defineField({
			name: 'badgeLine2',
			title: 'Badge line 2',
			description: 'Middle of the spinning portrait badge.',
			type: 'string'
		}),
		defineField({
			name: 'badgeEstablished',
			title: 'Badge established line',
			description: 'Small caps line on the badge (e.g. EST. 2013).',
			type: 'string'
		})
	],
	preview: {
		prepare: () => ({ title: 'About' })
	}
});
