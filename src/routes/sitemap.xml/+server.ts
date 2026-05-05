export const prerender = true;

const SITE_URL = 'https://zemphy.music';
const LAST_MOD = new Date().toISOString();

interface SitemapEntry {
	path: string;
	priority: string;
	changefreq: string;
}

const pages: readonly SitemapEntry[] = [{ path: '/', priority: '1.0', changefreq: 'monthly' }];

export function GET(): Response {
	const urlEntries = pages
		.map(
			(p) => `
	<url>
		<loc>${SITE_URL}${p.path}</loc>
		<lastmod>${LAST_MOD}</lastmod>
		<changefreq>${p.changefreq}</changefreq>
		<priority>${p.priority}</priority>
	</url>`
		)
		.join('');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
