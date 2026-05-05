import { defineField, defineType } from 'sanity';

/**
 * One row in the songbook. Year is the last two digits (e.g. 96 for 1996); the
 * renderer adds the leading apostrophe. Both version links are optional; the
 * row stays non-interactive when neither is set. The home page slices the
 * collection to the first 12 by `order` ascending.
 */
export const song = defineType({
	name: 'song',
	title: 'Song',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required().max(80)
		}),
		defineField({
			name: 'artist',
			title: 'Artist',
			type: 'string',
			validation: (rule) => rule.required().max(40)
		}),
		defineField({
			name: 'year',
			title: 'Year (last two digits)',
			description: 'Two-digit year, e.g. 96 for 1996. Rendered with a leading apostrophe.',
			type: 'number',
			validation: (rule) => rule.required().integer().min(0).max(99)
		}),
		defineField({
			name: 'chillLink',
			title: 'Chill version link',
			description:
				'Optional. YouTube link to a mellow / acoustic cover. Reveals on hover with a moon icon.',
			type: 'url',
			validation: (rule) => rule.uri({ scheme: ['http', 'https'] })
		}),
		defineField({
			name: 'energyLink',
			title: 'High-energy version link',
			description:
				'Optional. YouTube link to an upbeat / full-band version. Reveals on hover with a lightning icon.',
			type: 'url',
			validation: (rule) => rule.uri({ scheme: ['http', 'https'] })
		}),
		defineField({
			name: 'order',
			title: 'Order',
			description:
				'Lower numbers appear first. Only the first 12 by order surface on the home page.',
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
		select: { title: 'title', artist: 'artist', year: 'year', order: 'order' },
		prepare: ({ title, artist, year, order }) => ({
			title: typeof title === 'string' ? title : 'Song',
			subtitle:
				typeof order === 'number' && typeof artist === 'string' && typeof year === 'number'
					? `${String(order)} · ${artist} · '${String(year).padStart(2, '0')}`
					: undefined
		})
	}
});
