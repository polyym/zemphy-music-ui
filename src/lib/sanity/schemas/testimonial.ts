import { defineField, defineType } from 'sanity';

/**
 * One quote in the kind-words section. The avatar image is optional; without
 * it the design's pink-to-lilac gradient placeholder fills the circle.
 */
export const testimonial = defineType({
	name: 'testimonial',
	title: 'Testimonial',
	type: 'document',
	fields: [
		defineField({
			name: 'quote',
			title: 'Quote',
			type: 'text',
			rows: 4,
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'name',
			title: 'Name',
			description: 'Reviewer name; renders bold under the quote.',
			type: 'string',
			validation: (rule) => rule.required().max(60)
		}),
		defineField({
			name: 'keywords',
			title: 'Keywords',
			description:
				'Up to 2 short keywords (e.g. event type, location). Joined with " · " in the byline.',
			type: 'array',
			of: [{ type: 'string' }],
			validation: (rule) => rule.required().max(2)
		}),
		defineField({
			name: 'avatarImage',
			title: 'Avatar (optional)',
			description: 'Square headshot. Without one, a pastel gradient placeholder shows.',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'order',
			title: 'Order',
			description: 'Lower numbers appear first.',
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
		select: { title: 'name', subtitle: 'order' },
		prepare: ({ title, subtitle }) => ({
			title: typeof title === 'string' ? title : 'Testimonial',
			subtitle: typeof subtitle === 'number' ? `Order ${String(subtitle)}` : undefined
		})
	}
});
