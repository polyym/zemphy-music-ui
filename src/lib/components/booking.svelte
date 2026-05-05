<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { BookingSection, SiteSettings } from '$lib/sanity/types';
	import MarkedText from './marked-text.svelte';

	let {
		data,
		settings
	}: {
		data?: BookingSection;
		settings?: SiteSettings;
	} = $props();

	const mailto = $derived(settings?.bookingEmail ? `mailto:${settings.bookingEmail}` : undefined);

	// Bake the trailing/leading space into the string itself so Prettier's line
	// wrapping in the template can't strip it. Earlier attempts at putting a
	// literal space between `{prefix}` and `<a>` got eaten when Prettier
	// reformatted the line and trimmed trailing whitespace.
	const contactPrefix = $derived(data?.contactInfoPrefix ? `${data.contactInfoPrefix} ` : '');
	const contactSuffix = $derived(data?.contactInfoSuffix ? ` ${data.contactInfoSuffix}` : '');
</script>

{#if data ?? settings}
	<section id="booking" class="booking reveal" use:reveal>
		{#if data?.eyebrowLabel}
			<div class="section-label">{data.eyebrowLabel}</div>
		{/if}
		{#if data?.heading}
			<h2>
				<MarkedText value={data.heading} mode="inline" />
			</h2>
		{/if}
		{#if data?.body}
			<p>{data.body}</p>
		{/if}

		<div class="booking-cta">
			{#if mailto && data?.primaryCtaLabel}
				<a href={mailto} class="btn btn-primary">{data.primaryCtaLabel}</a>
			{/if}
			{#if settings?.instagramUrl}
				<a href={settings.instagramUrl} target="_blank" rel="noopener" class="btn btn-ghost">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<rect x="3" y="3" width="18" height="18" rx="5" />
						<circle cx="12" cy="12" r="4" />
						<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
					</svg>
					Instagram
				</a>
			{/if}
			{#if settings?.youtubeUrl}
				<a href={settings.youtubeUrl} target="_blank" rel="noopener" class="btn btn-ghost">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path
							d="M23 7.5a3 3 0 00-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 001 7.5 31 31 0 00.5 12 31 31 0 001 16.5a3 3 0 002.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 002.1-2.1 31 31 0 00.5-4.5 31 31 0 00-.5-4.5zM10 15.5v-7l6 3.5-6 3.5z"
						/>
					</svg>
					YouTube
				</a>
			{/if}
		</div>

		{#if mailto ?? settings?.locationLine1 ?? settings?.locationLine2}
			<div class="contact-info">
				{#if mailto && settings?.bookingEmail}
					<div>
						{contactPrefix}<a href={mailto}>{settings.bookingEmail}</a>{contactSuffix}
					</div>
				{/if}
				{#if settings?.locationLine1}<div>{settings.locationLine1}</div>{/if}
				{#if settings?.locationLine2}<div>{settings.locationLine2}</div>{/if}
			</div>
		{/if}
	</section>
{/if}

<style>
	.booking {
		background: var(--plum);
		color: var(--ivory);
		border-radius: 40px;
		padding: 6rem 4rem;
		margin: 5rem 2rem;
		max-width: 1300px;
		margin-left: auto;
		margin-right: auto;
		text-align: center;
		position: relative;
		overflow: hidden;
	}
	.booking::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 15% 30%, rgba(246, 209, 220, 0.25), transparent 40%),
			radial-gradient(circle at 85% 70%, rgba(201, 220, 240, 0.2), transparent 40%),
			radial-gradient(circle at 50% 100%, rgba(220, 205, 238, 0.25), transparent 50%);
	}
	.booking > :global(*) {
		position: relative;
		z-index: 1;
	}
	.booking :global(.section-label) {
		color: rgba(251, 246, 239, 0.7);
		justify-content: center;
	}
	.booking :global(.section-label::before) {
		background: rgba(251, 246, 239, 0.4);
	}
	h2 {
		font-family: var(--serif);
		font-size: clamp(2.5rem, 6vw, 4.8rem);
		font-weight: 300;
		line-height: 1;
		letter-spacing: -0.02em;
		margin-bottom: 1.5rem;
	}
	h2 :global(em) {
		font-style: italic;
		background: linear-gradient(
			135deg,
			var(--pastel-pink) 0%,
			var(--pastel-lilac) 50%,
			var(--pastel-blue) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	p {
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.2rem;
		color: rgba(251, 246, 239, 0.85);
		max-width: 560px;
		margin: 0 auto 3rem;
		font-weight: 300;
	}
	.booking-cta {
		display: inline-flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.booking :global(.btn-primary) {
		background: var(--ivory);
		color: var(--plum);
	}
	.booking :global(.btn-ghost) {
		border-color: var(--ivory);
		color: var(--ivory);
		background: transparent;
	}
	.booking :global(.btn-ghost:hover) {
		background: var(--ivory);
		color: var(--plum);
	}
	.contact-info {
		margin-top: 4rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.85rem;
		color: rgba(251, 246, 239, 0.75);
		letter-spacing: 0.1em;
		text-align: center;
	}
	.contact-info a {
		color: var(--ivory);
		text-decoration: none;
		border-bottom: 1px solid rgba(251, 246, 239, 0.3);
		padding-bottom: 2px;
		transition: border 0.3s;
	}
	.contact-info a:hover {
		border-color: var(--ivory);
	}
	@media (max-width: 900px) {
		.booking {
			padding: 3rem 1.5rem;
			border-radius: 24px;
			margin-left: 1rem;
			margin-right: 1rem;
		}
	}
</style>
