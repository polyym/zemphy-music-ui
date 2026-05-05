<script lang="ts">
	import { sparkles } from '$lib/actions/sparkles';
	import {
		About,
		Booking,
		Footer,
		Hero,
		Marquee,
		Nav,
		Repertoire,
		Services,
		SideNav,
		Testimonials
	} from '$lib/components';
	import { SITE_URL } from '$lib/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const settings = $derived(data.siteSettings);
	const hero = $derived(data.heroSection);

	// JSON-LD MusicGroup block. Search engines parse this for rich-result
	// styling on result pages. Only emitted when we have a name to attach.
	const musicGroupJsonLd = $derived.by(() => {
		if (!settings?.logoName) return;
		const sameAs: string[] = [];
		if (settings.instagramUrl) sameAs.push(settings.instagramUrl);
		if (settings.youtubeUrl) sameAs.push(settings.youtubeUrl);
		const payload: Record<string, unknown> = {
			'@context': 'https://schema.org',
			'@type': 'MusicGroup',
			name: settings.logoName,
			url: SITE_URL
		};
		if (sameAs.length > 0) payload.sameAs = sameAs;
		if (settings.bookingEmail) payload.email = settings.bookingEmail;
		return JSON.stringify(payload);
	});

	// Page title joins the brand wordmark with the hero kicker so search
	// engine results and link previews carry the keyword-rich descriptor
	// ("ZEMPHY · Irish Singer-Songwriter · 90s · 00s · 10s Nostalgia")
	// instead of just the brand word. The kicker already runs the SEO terms
	// the brand wants to rank for, so we reuse it rather than maintain a
	// separate CMS field. Composed length sits in the 50-60 char SEO sweet
	// spot at current content; a longer kicker will get truncated by search
	// engines past ~60 chars but the fallback to displayName-only stays clean.
	const pageTitle = $derived.by(() => {
		const brand = hero?.displayName ?? settings?.logoName;
		const parts = [brand, hero?.kicker].filter((p): p is string => p !== undefined && p.length > 0);
		return parts.join(' · ');
	});
	const ogDescription = $derived(hero?.tagline ?? '');

	// Build the JSON-LD tag via string concatenation so the source never
	// contains the literal close-tag token. Svelte's HTML parser otherwise
	// tries to terminate the surrounding component scope and chokes, even
	// though the literal sits inside a runtime template string.
	const ldScriptOpen = '<scr' + 'ipt type="application/ld+json">';
	const ldScriptClose = '</scr' + 'ipt>';
	const ldScript = $derived(
		musicGroupJsonLd ? ldScriptOpen + musicGroupJsonLd + ldScriptClose : undefined
	);
</script>

<svelte:head>
	{#if pageTitle}
		<title>{pageTitle}</title>
		<meta property="og:title" content={pageTitle} />
		<meta name="twitter:title" content={pageTitle} />
	{/if}
	{#if ogDescription}
		<meta name="description" content={ogDescription} />
		<meta property="og:description" content={ogDescription} />
		<meta name="twitter:description" content={ogDescription} />
	{/if}
	<meta property="og:url" content={SITE_URL} />
	<link rel="canonical" href={SITE_URL} />
	<meta name="twitter:card" content="summary_large_image" />
	{#if ldScript}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html ldScript}
	{/if}
</svelte:head>

<div use:sparkles>
	<Nav
		logoName={settings?.logoName}
		navCtaLabel={settings?.navCtaLabel}
		instagramUrl={settings?.instagramUrl}
		youtubeUrl={settings?.youtubeUrl}
	/>
	<SideNav labels={settings?.sideNavLabels} />

	<main>
		<Hero
			kicker={hero?.kicker}
			displayName={hero?.displayName}
			tagline={hero?.tagline}
			primaryCtaLabel={hero?.primaryCtaLabel}
			secondaryCtaLabel={hero?.secondaryCtaLabel}
		/>

		<About data={data.aboutSection} />
		<Marquee keywords={settings?.keywords} />
		<Services data={data.servicesSection} services={data.services} />
		<Repertoire data={data.repertoireSection} songs={data.songs} />
		<Testimonials data={data.testimonialsSection} testimonials={data.testimonials} />
		<Booking data={data.bookingSection} {settings} />
	</main>

	<Footer logoName={settings?.logoName} footerTagline={settings?.footerTagline} />
</div>
