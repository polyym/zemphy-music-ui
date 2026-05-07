import { sanityClient } from '$lib/sanity/client';
import {
	EMPTY_HOME_CONTENT,
	type AboutSection,
	type BookingSection,
	type HeroSection,
	type HomeContent,
	type RepertoireSection,
	type Service,
	type ServicesSection,
	type SiteSettings,
	type Song,
	type Testimonial,
	type TestimonialsSection
} from '$lib/sanity/types';

// Single GROQ round-trip per build. `[0]` returns null when a singleton hasn't
// been created yet, which the components handle by rendering nothing. Songs
// are fetched in full and paginated client-side in the Repertoire component
// (page size lives in `$lib/constants`). Pre-paginating server-side would
// drop later songs from the bundle and break the prev/next controls.
//
// The aboutSection projection expands `audioPreview` from a Sanity file
// reference into `{ url, mimeType }` so the home page can play it inline
// without making a follow-up runtime fetch. The `...` spread keeps every
// other field as-is; the explicit projection only overrides `audioPreview`.
const HOME_QUERY = `{
	"siteSettings": *[_type == "siteSettings"][0],
	"heroSection": *[_type == "heroSection"][0],
	"aboutSection": *[_type == "aboutSection"][0]{
		...,
		"audioPreview": audioPreview.asset->{ url, mimeType }
	},
	"servicesSection": *[_type == "servicesSection"][0],
	"repertoireSection": *[_type == "repertoireSection"][0],
	"testimonialsSection": *[_type == "testimonialsSection"][0],
	"bookingSection": *[_type == "bookingSection"][0],
	"services": *[_type == "service"] | order(order asc),
	"songs": *[_type == "song"] | order(order asc),
	"testimonials": *[_type == "testimonial"] | order(order asc)
}`;

interface RawHomeResult {
	siteSettings: SiteSettings | null;
	heroSection: HeroSection | null;
	aboutSection: AboutSection | null;
	servicesSection: ServicesSection | null;
	repertoireSection: RepertoireSection | null;
	testimonialsSection: TestimonialsSection | null;
	bookingSection: BookingSection | null;
	services: Service[] | null;
	songs: Song[] | null;
	testimonials: Testimonial[] | null;
}

/**
 * Home page load. Runs at build time (prerendered). Throws on a Sanity
 * connectivity failure so a broken build is loud, never silent. Missing
 * singleton documents are normal on a fresh deploy and surface as
 * `undefined` in the returned HomeContent.
 */
export async function load(): Promise<HomeContent> {
	const raw = await sanityClient.fetch<RawHomeResult>(HOME_QUERY);

	return {
		...EMPTY_HOME_CONTENT,
		siteSettings: raw.siteSettings ?? undefined,
		heroSection: raw.heroSection ?? undefined,
		aboutSection: raw.aboutSection ?? undefined,
		servicesSection: raw.servicesSection ?? undefined,
		repertoireSection: raw.repertoireSection ?? undefined,
		testimonialsSection: raw.testimonialsSection ?? undefined,
		bookingSection: raw.bookingSection ?? undefined,
		services: raw.services ?? [],
		songs: raw.songs ?? [],
		testimonials: raw.testimonials ?? []
	};
}
