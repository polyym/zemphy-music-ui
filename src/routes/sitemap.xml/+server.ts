import { SITE_URL } from '$lib/constants';
import { sanityClient } from '$lib/sanity/client';

export const prerender = true;

// Newest publish timestamp across every document type the home page renders.
// Sourcing <lastmod> from the content (rather than the build clock) keeps it
// truthful: it moves when an editor publishes, not on every redeploy of an
// unchanged site. The sitemap is prerendered, so this fetch runs in the same
// build that already queries Sanity for the page itself.
const LAST_MOD_QUERY = `*[_type in [
	"siteSettings", "heroSection", "aboutSection", "servicesSection",
	"repertoireSection", "testimonialsSection", "bookingSection",
	"service", "song", "testimonial"
]] | order(_updatedAt desc)[0]._updatedAt`;

interface SitemapEntry {
	path: string;
	priority: string;
	changefreq: string;
}

const pages: readonly SitemapEntry[] = [{ path: '/', priority: '1.0', changefreq: 'monthly' }];

export async function GET(): Promise<Response> {
	const lastMod = await sanityClient.fetch<string | null>(LAST_MOD_QUERY);
	const lastModTag = lastMod ? `\n\t\t<lastmod>${lastMod}</lastmod>` : '';

	const urlEntries = pages
		.map(
			(p) => `
	<url>
		<loc>${SITE_URL}${p.path}</loc>${lastModTag}
		<changefreq>${p.changefreq}</changefreq>
		<priority>${p.priority}</priority>
	</url>`
		)
		.join('');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`.trim();

	// No Cache-Control here: the route is prerendered, so this Response is
	// written to a static file at build time and runtime caching is governed
	// by the platform (netlify.toml), not by headers set in this handler.
	return new Response(sitemap, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
