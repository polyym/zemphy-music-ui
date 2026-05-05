import type { SchemaTypeDefinition } from 'sanity';
import { aboutSection } from './about-section';
import { bookingSection } from './booking-section';
import { heroSection } from './hero-section';
import { repertoireSection } from './repertoire-section';
import { service } from './service';
import { servicesSection } from './services-section';
import { siteSettings } from './site-settings';
import { song } from './song';
import { testimonial } from './testimonial';
import { testimonialsSection } from './testimonials-section';

/**
 * Document type names treated as singletons by the Studio's structure tool.
 * The structure builder pins them as fixed list items rather than letting
 * editors create or delete them, and the document actions config strips the
 * delete/duplicate/unpublish actions for these types.
 */
export const SINGLETON_TYPES: ReadonlySet<string> = new Set([
	'siteSettings',
	'heroSection',
	'aboutSection',
	'servicesSection',
	'repertoireSection',
	'testimonialsSection',
	'bookingSection'
]);

export const schemaTypes: SchemaTypeDefinition[] = [
	siteSettings,
	heroSection,
	aboutSection,
	servicesSection,
	repertoireSection,
	testimonialsSection,
	bookingSection,
	service,
	song,
	testimonial
];
