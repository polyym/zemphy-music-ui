import { defineField, defineType } from 'sanity';

/**
 * Site-wide settings: logo, social URLs, contact email, location lines, footer
 * tagline, and the keyword strip rendered as the marquee. One document; the
 * Studio structure pins it as a singleton.
 */
export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Site settings',
	type: 'document',
	fields: [
		defineField({
			name: 'logoName',
			title: 'Logo wordmark',
			description: 'Brand wordmark rendered in the top-left corner and the footer.',
			type: 'string',
			validation: (rule) => rule.required().max(20)
		}),
		defineField({
			name: 'navCtaLabel',
			title: 'Nav CTA label',
			description:
				'Short call-to-action in the top-right corner that jumps to the booking section.',
			type: 'string',
			validation: (rule) => rule.required().max(20)
		}),
		defineField({
			name: 'sideNavLabels',
			title: 'Side nav labels',
			description:
				'Tooltip labels for the vertical dot index on desktop. One short word or phrase each.',
			type: 'object',
			fields: [
				defineField({ name: 'about', title: 'About', type: 'string' }),
				defineField({ name: 'services', title: 'Services', type: 'string' }),
				defineField({ name: 'repertoire', title: 'Repertoire', type: 'string' }),
				defineField({ name: 'testimonials', title: 'Testimonials', type: 'string' }),
				defineField({ name: 'booking', title: 'Booking', type: 'string' })
			]
		}),
		defineField({
			name: 'instagramUrl',
			title: 'Instagram URL',
			type: 'url',
			validation: (rule) => rule.uri({ scheme: ['http', 'https'] })
		}),
		defineField({
			name: 'youtubeUrl',
			title: 'YouTube URL',
			type: 'url',
			validation: (rule) => rule.uri({ scheme: ['http', 'https'] })
		}),
		defineField({
			name: 'bookingEmail',
			title: 'Booking email',
			description: 'Used in the booking section as the mailto: target.',
			type: 'string',
			validation: (rule) =>
				rule.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'email address' })
		}),
		defineField({
			name: 'locationLine1',
			title: 'Location line 1',
			description: 'First line of the location footnote in the booking section.',
			type: 'string'
		}),
		defineField({
			name: 'locationLine2',
			title: 'Location line 2',
			description: 'Second line; longer reach statement.',
			type: 'string'
		}),
		defineField({
			name: 'footerTagline',
			title: 'Footer tagline',
			description: 'Single line shown after the year in the footer.',
			type: 'string'
		}),
		defineField({
			name: 'keywords',
			title: 'Marquee keywords',
			description:
				'Rendered as the scrolling strip below the hero. Max 20; each one is a short label.',
			type: 'array',
			of: [{ type: 'string' }],
			validation: (rule) => rule.max(20)
		})
	],
	preview: {
		prepare: () => ({ title: 'Site settings' })
	}
});
