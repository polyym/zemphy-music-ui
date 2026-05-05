import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, SINGLETON_TYPES } from './src/lib/sanity/schemas';

const PROJECT_ID = '5b75k1rw';
const DATASET = 'production';

export default defineConfig({
	name: 'default',
	title: 'Zemphy',
	projectId: PROJECT_ID,
	dataset: DATASET,
	basePath: '/studio',
	plugins: [
		structureTool({
			structure: (S) =>
				S.list()
					.title('Content')
					.items([
						// Singletons pinned at the top of the structure: each opens a fixed
						// document by ID. The actions config below removes create/delete so
						// editors can't accidentally orphan them.
						S.listItem()
							.title('Site settings')
							.id('siteSettings')
							.child(S.document().schemaType('siteSettings').documentId('siteSettings')),
						S.listItem()
							.title('Hero')
							.id('heroSection')
							.child(S.document().schemaType('heroSection').documentId('heroSection')),
						S.listItem()
							.title('About')
							.id('aboutSection')
							.child(S.document().schemaType('aboutSection').documentId('aboutSection')),
						S.listItem()
							.title('Services section')
							.id('servicesSection')
							.child(S.document().schemaType('servicesSection').documentId('servicesSection')),
						S.listItem()
							.title('Repertoire section')
							.id('repertoireSection')
							.child(S.document().schemaType('repertoireSection').documentId('repertoireSection')),
						S.listItem()
							.title('Testimonials section')
							.id('testimonialsSection')
							.child(
								S.document().schemaType('testimonialsSection').documentId('testimonialsSection')
							),
						S.listItem()
							.title('Booking')
							.id('bookingSection')
							.child(S.document().schemaType('bookingSection').documentId('bookingSection')),
						S.divider(),
						// Collections — editors create, edit, reorder freely.
						S.documentTypeListItem('service').title('Services'),
						S.documentTypeListItem('song').title('Songs'),
						S.documentTypeListItem('testimonial').title('Testimonials')
					])
		}),
		visionTool()
	],
	schema: {
		types: schemaTypes,
		// Hide the "Create new..." template entries for singleton types so editors
		// can't accidentally create a second siteSettings document.
		templates: (templates) => templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType))
	},
	document: {
		// Strip delete / duplicate / unpublish actions for singletons; the document
		// must always exist with its fixed ID.
		actions: (input, context) => {
			if (SINGLETON_TYPES.has(context.schemaType)) {
				return input.filter(
					({ action }) => action !== 'unpublish' && action !== 'delete' && action !== 'duplicate'
				);
			}
			return input;
		}
	}
});
