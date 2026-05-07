<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { SideNavLabels } from '$lib/sanity/types';

	let { labels }: { labels?: SideNavLabels } = $props();

	// Section IDs are part of the page's information architecture and tied to
	// the corresponding section components' anchor IDs. The labelKey indexes
	// into siteSettings.sideNavLabels for the visible tooltip text.
	const items = [
		{ id: 'about', labelKey: 'about' as const },
		{ id: 'services', labelKey: 'services' as const },
		{ id: 'repertoire', labelKey: 'repertoire' as const },
		{ id: 'kind-words', labelKey: 'testimonials' as const },
		{ id: 'booking', labelKey: 'booking' as const }
	];

	let activeId: string | undefined = $state();

	onMount(() => {
		// rootMargin shrinks the trigger zone to the central ~20% of the viewport
		// so the active dot updates feel intentional rather than flickery. We
		// keep an intersecting-set rather than just latching the last
		// intersecting entry: when the user scrolls back above all observed
		// sections (e.g. up to the hero), the previous "intersecting only"
		// implementation would leave the last-seen section's dot stuck active.
		// Tracking the live set lets us clear `activeId` when nothing is in
		// the trigger zone, and pick the topmost section when several are.
		const intersecting = new SvelteSet<string>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						intersecting.add(entry.target.id);
					} else {
						intersecting.delete(entry.target.id);
					}
				}
				// Pick the section that appears earliest in `items` (matches
				// document order) so the dot moves predictably as the user
				// scrolls, rather than flipping to whichever entry fired last.
				const ordered = items.find((item) => intersecting.has(item.id));
				activeId = ordered?.id;
			},
			{ rootMargin: '-40% 0px -40% 0px', threshold: 0 }
		);

		for (const item of items) {
			const el = document.querySelector(`#${item.id}`);
			if (el) observer.observe(el);
		}

		return () => {
			observer.disconnect();
		};
	});
</script>

<nav class="side-nav" aria-label="Page sections">
	{#each items as item (item.id)}
		{@const label = labels?.[item.labelKey]}
		{#if label}
			<a
				href={`#${item.id}`}
				data-label={label}
				aria-label={label}
				class:active={activeId === item.id}
			>
				<span class="side-nav-dot"></span>
			</a>
		{/if}
	{/each}
</nav>

<style>
	.side-nav {
		position: fixed;
		top: 50%;
		right: 1.6rem;
		transform: translateY(-50%);
		z-index: 90;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.4rem 0;
	}
	.side-nav a {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		/* Padding sized so the anchor's hit area clears WCAG 2.5.8's 24x24
		   minimum target size around the 7px visual dot. */
		padding: 0.55rem 0.6rem;
		text-decoration: none;
	}
	.side-nav-dot {
		display: block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--plum-soft);
		opacity: 0.35;
		transition:
			opacity 0.4s,
			transform 0.4s,
			background 0.4s,
			box-shadow 0.4s;
	}
	.side-nav a::before {
		content: attr(data-label);
		position: absolute;
		right: calc(100% - 0.2rem);
		top: 50%;
		transform: translateY(-50%) translateX(8px);
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.9rem;
		color: var(--plum);
		white-space: nowrap;
		opacity: 0;
		transition:
			opacity 0.45s ease,
			transform 0.45s ease;
		pointer-events: none;
		padding-right: 0.6rem;
	}
	.side-nav a:hover .side-nav-dot {
		opacity: 1;
		transform: scale(1.3);
	}
	.side-nav a.active .side-nav-dot {
		opacity: 1;
		transform: scale(1.5);
		background: linear-gradient(135deg, var(--pastel-pink-deep), var(--pastel-lilac-deep));
		box-shadow: 0 0 10px rgba(234, 177, 194, 0.55);
	}
	.side-nav a:hover::before {
		opacity: 1;
		transform: translateY(-50%) translateX(0);
	}
	@media (max-width: 900px) {
		.side-nav {
			display: none;
		}
	}
</style>
