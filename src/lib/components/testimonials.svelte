<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { TESTIMONIALS_PER_PAGE } from '$lib/constants';
	import { imageUrl } from '$lib/sanity/image';
	import type { Testimonial, TestimonialsSection } from '$lib/sanity/types';
	import MarkedText from './marked-text.svelte';

	let {
		data,
		testimonials
	}: {
		data?: TestimonialsSection;
		testimonials?: Testimonial[];
	} = $props();

	let trackEl: HTMLDivElement | undefined = $state();
	let activePage = $state(0);

	const pages = $derived.by((): Testimonial[][] => {
		if (!testimonials || testimonials.length === 0) return [];
		const result: Testimonial[][] = [];
		for (let i = 0; i < testimonials.length; i += TESTIMONIALS_PER_PAGE) {
			result.push(testimonials.slice(i, i + TESTIMONIALS_PER_PAGE));
		}
		return result;
	});
	const totalPages = $derived(pages.length);
	const pageIndices = $derived.by(() => {
		const indices: number[] = [];
		for (let i = 0; i < totalPages; i++) indices.push(i);
		return indices;
	});

	function avatarStyle(testimonial: Testimonial): string {
		if (!testimonial.avatarImage) return '';
		const url = imageUrl(testimonial.avatarImage).width(96).height(96).fit('crop').url();
		return `background-image: url('${url}');`;
	}

	function onTrackScroll() {
		if (!trackEl) return;
		const pageWidth = trackEl.clientWidth;
		if (pageWidth === 0) return;
		activePage = Math.round(trackEl.scrollLeft / pageWidth);
	}

	function scrollToPage(i: number) {
		if (!trackEl) return;
		trackEl.scrollTo({ left: i * trackEl.clientWidth, behavior: 'smooth' });
	}
</script>

{#if data ?? (testimonials && testimonials.length > 0)}
	<section id="kind-words" class="reveal" use:reveal>
		{#if data?.eyebrowLabel}
			<div class="section-label">{data.eyebrowLabel}</div>
		{/if}
		{#if data?.heading}
			<h2 class="section-title">
				<MarkedText value={data.heading} mode="inline" />
			</h2>
		{/if}

		{#if pages.length > 0}
			<div class="testimonials-carousel">
				{#if totalPages > 1}
					<button
						class="arrow arrow-prev"
						type="button"
						aria-label="Previous testimonials"
						disabled={activePage === 0}
						onclick={() => {
							scrollToPage(activePage - 1);
						}}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M15 18l-6-6 6-6" />
						</svg>
					</button>
				{/if}
				<div class="testimonials-track" bind:this={trackEl} onscroll={onTrackScroll}>
					{#each pages as page, pi (pi)}
						<div class="testimonials-page">
							{#each page as testimonial (testimonial._id)}
								<div class="testimonial">
									<div class="quote-mark">"</div>
									<blockquote>{testimonial.quote}</blockquote>
									<cite>
										<div class="avatar" style={avatarStyle(testimonial)}></div>
										<div>
											<div class="name">{testimonial.name}</div>
											{#if testimonial.keywords.length > 0}
												<div class="event">{testimonial.keywords.join(' · ')}</div>
											{/if}
										</div>
									</cite>
								</div>
							{/each}
						</div>
					{/each}
				</div>
				{#if totalPages > 1}
					<button
						class="arrow arrow-next"
						type="button"
						aria-label="Next testimonials"
						disabled={activePage === totalPages - 1}
						onclick={() => {
							scrollToPage(activePage + 1);
						}}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</button>
				{/if}
			</div>

			{#if totalPages > 1}
				<div class="testimonials-dots" role="tablist" aria-label="Testimonial pages">
					{#each pageIndices as i (i)}
						<button
							type="button"
							role="tab"
							aria-selected={i === activePage}
							aria-label="Page {i + 1} of {totalPages}"
							class:active={i === activePage}
							onclick={() => {
								scrollToPage(i);
							}}
						></button>
					{/each}
				</div>
			{/if}
		{/if}
	</section>
{/if}

<style>
	/* Horizontal scroll-snap carousel. Each `.testimonials-page` is one snap
	   point and holds two side-by-side cards. The track sits cleanly within
	   the section's content area — no negative horizontal margins — so the
	   clipping box matches the visible edge and adjacent pages don't bleed
	   into view. Vertical padding (top/bottom only) gives the slightly
	   tilted cards room so their corners aren't clipped. Native scrollbar
	   is hidden; arrows on the sides and dots below provide the affordance. */
	.testimonials-carousel {
		position: relative;
		margin-top: 3rem;
		/* Horizontal padding reserves a gutter on each side for the arrows so
		   they sit fully beside the cards rather than overlapping them. The
		   track + cards within take the remaining width. */
		padding: 0 4rem;
	}
	.testimonials-track {
		display: flex;
		overflow-x: auto;
		overflow-y: visible;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		padding: 1.5rem 0;
	}
	.testimonials-track::-webkit-scrollbar {
		display: none;
	}
	.testimonials-page {
		flex: 0 0 100%;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

	.testimonial {
		padding: 3rem;
		background: rgba(253, 249, 245, 0.7);
		backdrop-filter: blur(10px);
		border-radius: 24px;
		border: 1px solid rgba(255, 255, 255, 0.6);
		position: relative;
	}
	/* Tilt scope: nth-child within each `.testimonials-page`, so every page
	   gets the alternating left-tilt / right-tilt+drop rhythm. */
	.testimonial:nth-child(odd) {
		transform: rotate(-0.6deg);
	}
	.testimonial:nth-child(even) {
		transform: rotate(0.6deg);
		margin-top: 2rem;
	}
	.quote-mark {
		font-family: var(--serif);
		font-size: 5rem;
		line-height: 0.7;
		color: var(--pastel-pink-deep);
		margin-bottom: 0.5rem;
		font-style: italic;
	}
	blockquote {
		font-family: var(--serif);
		font-size: 1.2rem;
		font-weight: 300;
		line-height: 1.6;
		color: var(--plum);
		font-style: italic;
		margin-bottom: 2rem;
	}
	cite {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-style: normal;
	}
	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--pastel-pink), var(--pastel-lilac));
		background-size: cover;
		background-position: center;
		flex-shrink: 0;
	}
	.name {
		font-weight: 600;
		color: var(--plum);
		font-size: 0.95rem;
	}
	.event {
		font-size: 0.8rem;
		color: var(--plum-soft);
		letter-spacing: 0.05em;
	}

	/* Side arrows for desktop / mouse users. Round, soft-glass styling that
	   matches the testimonial cards' aesthetic. Sits half over the cards' outer
	   edge so the visual lives in the section gutter without claiming a column
	   of its own. Disabled at the first / last page; hidden on mobile (the
	   stack layout doesn't have horizontal pages to navigate). */
	.arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: rgba(253, 249, 245, 0.85);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.7);
		box-shadow: 0 6px 16px -6px rgba(61, 43, 78, 0.18);
		color: var(--plum);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition:
			background 0.3s,
			color 0.3s,
			box-shadow 0.3s,
			transform 0.3s,
			opacity 0.3s;
	}
	.arrow:hover:not(:disabled) {
		background: var(--plum);
		color: var(--ivory);
		box-shadow: 0 10px 24px -8px rgba(61, 43, 78, 0.35);
		transform: translateY(-50%) scale(1.05);
	}
	.arrow:focus-visible {
		outline: 2px solid var(--plum);
		outline-offset: 3px;
	}
	.arrow:disabled {
		opacity: 0.25;
		cursor: not-allowed;
	}
	.arrow svg {
		width: 18px;
		height: 18px;
	}
	.arrow-prev {
		left: 0.5rem;
	}
	.arrow-next {
		right: 0.5rem;
	}

	.testimonials-dots {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
		gap: 0.7rem;
	}
	.testimonials-dots button {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--plum-soft);
		opacity: 0.3;
		border: none;
		padding: 0;
		cursor: pointer;
		transition:
			opacity 0.4s,
			transform 0.4s,
			background 0.4s,
			box-shadow 0.4s;
	}
	.testimonials-dots button:hover {
		opacity: 0.6;
	}
	.testimonials-dots button.active {
		opacity: 1;
		transform: scale(1.4);
		background: linear-gradient(135deg, var(--pastel-pink-deep), var(--pastel-lilac-deep));
		box-shadow: 0 0 8px rgba(234, 177, 194, 0.55);
	}
	.testimonials-dots button:focus-visible {
		outline: 2px solid var(--plum);
		outline-offset: 4px;
	}

	@media (max-width: 900px) {
		/* Mobile collapses the carousel into a plain vertical stack — single
		   column, all cards visible, no swiping. Arrows and dots both hidden;
		   nothing to navigate to. Drop the desktop's arrow-gutter padding so
		   the cards reclaim the full width on small screens. */
		.testimonials-carousel {
			margin-top: 3rem;
			padding: 0;
		}
		.testimonials-track {
			flex-direction: column;
			overflow-x: visible;
			overflow-y: visible;
			scroll-snap-type: none;
			gap: 2rem;
			padding: 0;
			margin: 0;
		}
		.testimonials-page {
			flex: 1 1 auto;
			grid-template-columns: 1fr;
		}
		.arrow,
		.testimonials-dots {
			display: none;
		}
	}
</style>
