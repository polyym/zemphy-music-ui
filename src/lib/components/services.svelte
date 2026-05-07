<script lang="ts">
	import { onMount } from 'svelte';
	import { reveal } from '$lib/actions/reveal';
	import type { Service, ServicesSection } from '$lib/sanity/types';
	import MarkedText from './marked-text.svelte';

	let {
		data,
		services
	}: {
		data?: ServicesSection;
		services?: Service[];
	} = $props();

	// Single-expand accordion state for the mobile layout. On tablet (641-900px)
	// and desktop (>900px) the CSS forces every body open, so this state has no
	// visual effect at those widths. On phones, only the matching card has its
	// body in flow; the rest collapse to a tappable summary row. Default is 0
	// so the SSR'd HTML opens the first card on initial paint, matching what
	// the mobile bundle hydrates to without any flash.
	let isMobile = $state(false);
	let expandedIndex: number | undefined = $state(0);

	onMount(() => {
		const mq = globalThis.matchMedia('(max-width: 640px)');
		isMobile = mq.matches;
		const onChange = (event: MediaQueryListEvent) => {
			isMobile = event.matches;
		};
		mq.addEventListener('change', onChange);
		return () => {
			mq.removeEventListener('change', onChange);
		};
	});

	function toggle(i: number) {
		// Toggling is a no-op above 640px since the CSS shows every body
		// regardless. Skipping the state mutation here keeps `aria-expanded`
		// reflecting reality (true for every card on desktop) rather than
		// flickering as the user clicks.
		if (!isMobile) return;
		expandedIndex = expandedIndex === i ? undefined : i;
	}
</script>

{#if data ?? (services && services.length > 0)}
	<section id="services" class="reveal" use:reveal>
		{#if data?.eyebrowLabel}
			<div class="section-label">{data.eyebrowLabel}</div>
		{/if}
		{#if data?.heading}
			<h2 class="section-title">
				<MarkedText value={data.heading} mode="inline" />
			</h2>
		{/if}

		{#if services && services.length > 0}
			<div class="services-grid">
				{#each services as service, i (service._id)}
					<div class="service-card" class:expanded={expandedIndex === i}>
						<h3 class="service-card-title">
							<button
								class="service-summary"
								type="button"
								aria-expanded={expandedIndex === i}
								aria-controls="service-body-{i}"
								onclick={() => {
									toggle(i);
								}}
							>
								<span class="service-icon-wrap">
									{#if service.icon === 'rings'}
										<svg
											class="service-icon"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.2"
											stroke-linecap="round"
											aria-hidden="true"
										>
											<circle cx="9" cy="13" r="5.5" />
											<circle cx="15" cy="13" r="5.5" />
										</svg>
									{:else if service.icon === 'star'}
										<svg
											class="service-icon"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.2"
											stroke-linecap="round"
											stroke-linejoin="round"
											aria-hidden="true"
										>
											<path d="M12 2l3 7 7 1-5 5 1.5 7L12 18.5 5.5 22 7 15 2 10l7-1z" />
										</svg>
									{:else if service.icon === 'sparkles'}
										<svg
											class="service-icon"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.2"
											stroke-linecap="round"
											stroke-linejoin="round"
											aria-hidden="true"
										>
											<path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
											<path d="M19 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
											<path d="M5 15l.7 1.4 1.4.7-1.4.7L5 19.2 4.3 17.8 2.9 17.1l1.4-.7z" />
										</svg>
									{:else if service.icon === 'microphone'}
										<svg
											class="service-icon"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.2"
											stroke-linecap="round"
											stroke-linejoin="round"
											aria-hidden="true"
										>
											<rect x="9" y="2" width="6" height="11" rx="3" />
											<path d="M5 11a7 7 0 0 0 14 0" />
											<line x1="12" y1="18" x2="12" y2="22" />
											<line x1="8" y1="22" x2="16" y2="22" />
										</svg>
									{:else if service.icon === 'glass'}
										<svg
											class="service-icon"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.2"
											stroke-linecap="round"
											stroke-linejoin="round"
											aria-hidden="true"
										>
											<path d="M5 3h14l-2 8a5 5 0 0 1-10 0z" />
											<line x1="12" y1="16" x2="12" y2="21" />
											<line x1="8" y1="21" x2="16" y2="21" />
										</svg>
									{:else if service.icon === 'note'}
										<svg
											class="service-icon"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.2"
											stroke-linecap="round"
											stroke-linejoin="round"
											aria-hidden="true"
										>
											<path d="M9 18V5l12-2v13" />
											<circle cx="6" cy="18" r="3" />
											<circle cx="18" cy="16" r="3" />
										</svg>
									{/if}
								</span>
								<span class="service-title-text">{service.title}</span>
								<svg
									class="service-chevron"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M6 9l6 6 6-6" />
								</svg>
							</button>
						</h3>
						<div class="service-body" id="service-body-{i}" inert={isMobile && expandedIndex !== i}>
							<div class="service-body-inner">
								<p>{service.description}</p>
								{#if service.keywords.length > 0}
									<div class="price">{service.keywords.join(' · ')}</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
{/if}

<style>
	.services-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-top: 3rem;
	}
	.service-card {
		padding: 2.5rem 2rem;
		border-radius: 28px;
		background: rgba(253, 249, 245, 0.65);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.7);
		transition:
			transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.2),
			box-shadow 0.4s;
		position: relative;
		overflow: hidden;
	}
	.service-card::before {
		content: '';
		position: absolute;
		inset: 0;
		opacity: 0.4;
		z-index: 0;
		transition: opacity 0.4s;
	}
	.service-card:nth-child(1)::before {
		background: radial-gradient(circle at 0% 0%, var(--pastel-pink), transparent 60%);
	}
	.service-card:nth-child(2)::before {
		background: radial-gradient(circle at 100% 0%, var(--pastel-lilac), transparent 60%);
	}
	.service-card:nth-child(3)::before {
		background: radial-gradient(circle at 50% 0%, var(--pastel-blue), transparent 60%);
	}
	.service-card:nth-child(4)::before {
		background: radial-gradient(circle at 0% 100%, var(--pastel-blue), transparent 60%);
	}
	.service-card:nth-child(5)::before {
		background: radial-gradient(circle at 100% 100%, var(--pastel-pink), transparent 60%);
	}
	.service-card:nth-child(6)::before {
		background: radial-gradient(circle at 50% 100%, var(--pastel-lilac), transparent 60%);
	}
	.service-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 30px 60px -20px rgba(61, 43, 78, 0.2);
	}
	.service-card:hover::before {
		opacity: 0.7;
	}
	.service-card > :global(*) {
		position: relative;
		z-index: 1;
	}
	/* Reset the heading wrapper so the desktop card layout is identical to the
	   v1.0 component: icon block, then heading, then body, all stacked. The
	   accordion structure (h3 > button) is invisible at >640px because the
	   button is restyled to a plain block. */
	.service-card-title {
		margin: 0;
		padding: 0;
		font-weight: inherit;
	}
	.service-summary {
		display: contents;
		font: inherit;
		color: inherit;
		text-align: inherit;
		background: none;
		border: none;
		padding: 0;
		cursor: default;
	}
	.service-icon-wrap {
		display: block;
		margin-bottom: 1.5rem;
	}
	.service-icon {
		width: 52px;
		height: 52px;
		color: var(--plum);
	}
	.service-title-text {
		display: block;
		font-family: var(--serif);
		font-size: 1.7rem;
		font-weight: 400;
		font-style: italic;
		margin-bottom: 0.8rem;
		color: var(--plum);
	}
	.service-chevron {
		display: none;
	}
	.service-body-inner {
		min-height: 0;
	}
	.service-body p {
		color: var(--plum-soft);
		font-size: 0.95rem;
		line-height: 1.6;
	}
	.price {
		margin-top: 1.5rem;
		font-family: var(--serif);
		font-size: 0.9rem;
		color: var(--plum-soft);
		letter-spacing: 0.08em;
		padding-top: 1rem;
		border-top: 1px solid rgba(61, 43, 78, 0.1);
	}
	/* Tablet portrait (iPad / Surface, 641-900px) gets a 2-col grid: the
	   desktop 3-col makes each card too narrow at tablet widths, but a full
	   collapse to 1-col wastes the horizontal real estate. Below 640px the
	   cards stack to one per row (mobile). */
	@media (max-width: 900px) {
		.services-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
	/* Mobile accordion. Each card collapses to a single row (icon + title +
	   chevron) with the description and pricing tag tucked behind a tap.
	   Compared to v1.2.0's six near-identical full-viewport cards (~3,600px
	   of similar content) the same six categories now fit in roughly one
	   viewport, so the visitor scans them all in one glance and dives into
	   whichever matches their event. The body uses the grid-template-rows
	   0fr-to-1fr trick to animate height auto, with prefers-reduced-motion
	   collapsing the transition. The collapsed body carries `inert` so it's
	   removed from focus/SR navigation. Tap targets stay generous: the
	   summary row is 56px+ tall via padding. */
	@media (max-width: 640px) {
		.services-grid {
			grid-template-columns: 1fr;
			gap: 0.75rem;
			margin-top: 2rem;
		}
		.service-card {
			padding: 0;
			border-radius: 20px;
			overflow: hidden;
		}
		.service-card:hover {
			transform: none;
			box-shadow: none;
		}
		.service-summary {
			display: flex;
			align-items: center;
			gap: 1rem;
			width: 100%;
			padding: 1.1rem 1.25rem;
			cursor: pointer;
			text-align: left;
		}
		.service-summary:focus-visible {
			outline: 2px solid var(--plum);
			outline-offset: -4px;
			border-radius: 16px;
		}
		.service-icon-wrap {
			margin: 0;
			flex-shrink: 0;
		}
		.service-icon {
			width: 28px;
			height: 28px;
		}
		.service-title-text {
			flex: 1;
			margin: 0;
			font-size: 1.2rem;
		}
		.service-chevron {
			display: block;
			width: 18px;
			height: 18px;
			color: var(--plum-soft);
			flex-shrink: 0;
			transition: transform 0.3s ease;
		}
		.service-card.expanded .service-chevron {
			transform: rotate(180deg);
		}
		.service-body {
			display: grid;
			grid-template-rows: 0fr;
			transition: grid-template-rows 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1);
		}
		.service-card.expanded .service-body {
			grid-template-rows: 1fr;
		}
		.service-body-inner {
			overflow: hidden;
		}
		.service-body p {
			padding: 0 1.25rem 1.1rem;
		}
		.price {
			margin: 0 1.25rem 1rem;
			padding-top: 0.8rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.service-body {
			transition: none;
		}
		.service-chevron {
			transition: none;
		}
	}
</style>
