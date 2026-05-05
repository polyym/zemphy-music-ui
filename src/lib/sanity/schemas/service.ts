import { defineField, defineType } from 'sanity';

/**
 * One card in the services grid. The icon is a fixed enum so editors can't
 * introduce arbitrary SVGs; the rendering component looks up an SVG by enum
 * value. Sort by `order` ascending; the design supports up to 6 cards before
 * the per-card pastel gradient wash runs out.
 */
export const service = defineType({
	name: 'service',
	title: 'Service',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required().max(40)
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 5,
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'keywords',
			title: 'Keywords',
			description: 'Up to 3 short keywords. Joined with " · " in the card footer.',
			type: 'array',
			of: [{ type: 'string' }],
			validation: (rule) => rule.required().max(3)
		}),
		defineField({
			name: 'icon',
			title: 'Icon',
			description: 'Picks one of six pre-drawn SVGs. The site renders the matching glyph.',
			type: 'string',
			options: {
				list: [
					{ title: 'Rings (weddings)', value: 'rings' },
					{ title: 'Star (corporate)', value: 'star' },
					{ title: 'Sparkles (private parties)', value: 'sparkles' },
					{ title: 'Microphone (live venues)', value: 'microphone' },
					{ title: 'Glass (hospitality)', value: 'glass' },
					{ title: 'Music note (bespoke)', value: 'note' }
				],
				layout: 'radio'
			},
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'order',
			title: 'Order',
			description: 'Lower numbers appear first. Use 10, 20, 30 to leave gaps for reordering.',
			type: 'number',
			validation: (rule) => rule.required().integer().min(0)
		})
	],
	orderings: [
		{
			title: 'Display order',
			name: 'orderAsc',
			by: [{ field: 'order', direction: 'asc' }]
		}
	],
	preview: {
		select: { title: 'title', subtitle: 'icon', order: 'order' },
		prepare: ({ title, subtitle, order }) => ({
			title: typeof title === 'string' ? title : 'Service',
			subtitle:
				typeof order === 'number' && typeof subtitle === 'string'
					? `${String(order)} · ${subtitle}`
					: undefined
		})
	}
});
