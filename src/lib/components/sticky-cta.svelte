<script lang="ts">
	import { onMount } from 'svelte';

	let { ctaLabel, ctaHref }: { ctaLabel?: string; ctaHref?: string } = $props();

	// Two IntersectionObservers: one on the hero, one on #booking. The CTA
	// slides up after the hero leaves the viewport (so it doesn't compete
	// with the in-hero "BOOK A PERFORMANCE" pill) and slides back down when
	// the booking section is itself on-screen (the user has reached the
	// section the button would scroll them to). Hidden via CSS at >640px,
	// so the desktop top nav's ENQUIRE pill remains the canonical action.
	let heroOut = $state(false);
	let bookingIn = $state(false);
	const visible = $derived(heroOut && !bookingIn);

	onMount(() => {
		const heroEl = document.querySelector('.hero');
		const bookingEl = document.querySelector('#booking');
		if (!heroEl || !bookingEl) return;

		const heroObs = new IntersectionObserver(
			([entry]) => {
				heroOut = !entry.isIntersecting;
			},
			{ threshold: 0 }
		);
		const bookObs = new IntersectionObserver(
			([entry]) => {
				bookingIn = entry.isIntersecting;
			},
			{ threshold: 0.05 }
		);
		heroObs.observe(heroEl);
		bookObs.observe(bookingEl);
		return () => {
			heroObs.disconnect();
			bookObs.disconnect();
		};
	});
</script>

{#if ctaLabel && ctaHref}
	<a class="sticky-cta" class:visible href={ctaHref} inert={!visible}>
		{ctaLabel}
	</a>
{/if}

<style>
	.sticky-cta {
		display: none;
	}
	/* Mobile-only sticky pill anchored to the bottom of the viewport.
	   Hidden until the user scrolls past the hero so it doesn't crowd the
	   in-hero CTA, hidden again when #booking itself is in view (the
	   destination is on-screen, no need for a shortcut). The bottom offset
	   honours `env(safe-area-inset-bottom)` for iOS home-indicator clearance.
	   The pill carries `inert` while hidden so screen readers and Tab order
	   skip it cleanly; toggling `inert` is supported in every browser that
	   matches the >=Chrome 102 / Firefox 112 / Safari 15.5 baseline this
	   project already targets (CSS Grid subgrid, `text-wrap: balance`). */
	@media (max-width: 640px) {
		.sticky-cta {
			position: fixed;
			bottom: calc(0.85rem + env(safe-area-inset-bottom, 0px));
			left: 1rem;
			right: 1rem;
			z-index: 95;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 1rem 1.5rem;
			background: var(--plum);
			color: var(--ivory);
			font-family: var(--sans);
			font-size: 0.85rem;
			font-weight: 500;
			letter-spacing: 0.15em;
			text-transform: uppercase;
			text-decoration: none;
			border-radius: 999px;
			box-shadow: 0 18px 40px -8px rgba(61, 43, 78, 0.4);
			opacity: 0;
			transform: translateY(140%);
			pointer-events: none;
			transition:
				opacity 0.4s ease,
				transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.1);
		}
		.sticky-cta.visible {
			opacity: 1;
			transform: translateY(0);
			pointer-events: auto;
		}
		.sticky-cta:focus-visible {
			outline: 2px solid var(--ivory);
			outline-offset: 3px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sticky-cta {
			transition: none;
		}
	}
</style>
