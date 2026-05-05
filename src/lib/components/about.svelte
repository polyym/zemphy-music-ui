<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { imageUrl } from '$lib/sanity/image';
	import type { AboutSection } from '$lib/sanity/types';
	import MarkedText from './marked-text.svelte';

	let { data }: { data?: AboutSection } = $props();

	// Build the portrait CSS background-image inline so the design's pseudo-element
	// warmth wash and bottom darkening (in this component's scoped CSS) layer
	// over a CMS-driven asset URL without any of those styles being touched.
	const portraitStyle = $derived(
		data?.portraitImage
			? `background-image: url('${imageUrl(data.portraitImage).width(900).height(1125).fit('crop').url()}');`
			: ''
	);
</script>

{#if data}
	<section id="about" class="reveal" use:reveal>
		<div class="about">
			<div class="portrait-wrap">
				<div class="portrait" style={portraitStyle}></div>
				{#if data.badgeLine1 ?? data.badgeLine2 ?? data.badgeEstablished}
					<div class="portrait-badge">
						{#if data.badgeLine1}{data.badgeLine1}<br />{/if}
						{#if data.badgeLine2}{data.badgeLine2}<br />{/if}
						{#if data.badgeEstablished}<span>{data.badgeEstablished}</span>{/if}
					</div>
				{/if}
			</div>
			<div class="about-copy">
				{#if data.eyebrowLabel}
					<div class="section-label">{data.eyebrowLabel}</div>
				{/if}
				{#if data.heading}
					<h2 class="section-title">
						<MarkedText value={data.heading} mode="inline" />
					</h2>
				{/if}
				<MarkedText value={data.body} mode="blocks" />
				{#if data.signature}
					<div class="about-signature">{data.signature}</div>
				{/if}
			</div>
		</div>
	</section>
{/if}

<style>
	.about {
		display: grid;
		grid-template-columns: 1fr 1.15fr;
		gap: 5rem;
		align-items: center;
	}
	.portrait-wrap {
		position: relative;
	}
	.portrait {
		aspect-ratio: 4 / 5;
		border-radius: 240px 240px 12px 12px;
		background-color: var(--pastel-lilac);
		background-size: cover;
		background-position: center 25%;
		box-shadow:
			0 30px 80px -20px rgba(61, 43, 78, 0.25),
			0 0 0 1px rgba(255, 255, 255, 0.4) inset;
		position: relative;
		overflow: hidden;
	}
	/* Warmth wash overlay; pseudo-element so swapping the inline background-image
	   from CMS leaves this gradient untouched. */
	.portrait::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			165deg,
			rgba(246, 209, 220, 0.15) 0%,
			transparent 40%,
			rgba(201, 220, 240, 0.15) 100%
		);
		pointer-events: none;
	}
	.portrait::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 60%, rgba(61, 43, 78, 0.15));
		pointer-events: none;
	}
	.portrait-badge {
		position: absolute;
		bottom: -30px;
		right: -30px;
		width: 140px;
		height: 140px;
		border-radius: 50%;
		background: var(--ivory);
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.9rem;
		line-height: 1.2;
		color: var(--plum);
		box-shadow: 0 20px 40px -10px rgba(193, 174, 224, 0.5);
		animation: slowSpin 30s linear infinite;
	}
	.portrait-badge span {
		display: block;
		font-family: var(--sans);
		font-style: normal;
		font-size: 0.65rem;
		letter-spacing: 0.3em;
		margin-top: 4px;
		color: var(--plum-soft);
	}
	@keyframes slowSpin {
		to {
			transform: rotate(360deg);
		}
	}
	.about-copy :global(p) {
		font-family: var(--serif);
		font-size: 1.25rem;
		font-weight: 300;
		line-height: 1.7;
		color: var(--plum);
		margin-bottom: 1.3rem;
	}
	.about-copy :global(p:first-of-type::first-letter) {
		font-size: 3.4rem;
		font-style: italic;
		float: left;
		line-height: 0.9;
		padding: 0.3rem 0.6rem 0 0;
		color: var(--pastel-pink-deep);
	}
	.about-signature {
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.8rem;
		color: var(--plum-soft);
		margin-top: 2rem;
		letter-spacing: 0.02em;
	}
	@media (max-width: 900px) {
		.about {
			grid-template-columns: 1fr;
			gap: 3rem;
		}
	}
	@media (max-width: 640px) {
		.portrait-badge {
			width: 100px;
			height: 100px;
			font-size: 0.75rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.portrait-badge {
			animation: none;
		}
	}
</style>
