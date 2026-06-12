<script lang="ts">
	import { onMount } from 'svelte';
	import { reveal } from '$lib/actions/reveal';
	import { SONGS_PER_PAGE } from '$lib/constants';
	import { clampPage, pageCount, pageSlice } from '$lib/paginate';
	import type { RepertoireSection, Song } from '$lib/sanity/types';
	import MarkedText from './marked-text.svelte';

	let {
		data,
		songs
	}: {
		data?: RepertoireSection;
		songs?: Song[];
	} = $props();

	let currentPage = $state(1);

	// Mobile teaser state. Tablet (641-900px) and desktop (>900px) always show
	// the full paginated song list, so this state has no effect at those
	// widths. On phones the songbook renders the first three songs as a teaser
	// by default; tapping the heading swaps to the full paginated list and
	// reveals the prev/next controls.
	let isMobile = $state(false);
	let expanded = $state(false);

	// How many songs to show as a teaser on mobile when the songbook is
	// collapsed. Hardcoded here rather than a constant because the value is
	// purely a mobile UX decision, not a content schema concern.
	const MOBILE_TEASER_COUNT = 3;

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

	const totalSongs = $derived(songs?.length ?? 0);
	const totalPages = $derived(pageCount(totalSongs, SONGS_PER_PAGE));
	const visibleSongs = $derived.by(() => {
		if (!songs || songs.length === 0) return [];
		// Mobile teaser: always the first N songs of the whole songbook,
		// regardless of `currentPage`. Collapsing after paginating to page 2
		// returns to the canonical "top three" rather than "first three of
		// page 2", which would be confusing.
		if (isMobile && !expanded) {
			return songs.slice(0, MOBILE_TEASER_COUNT);
		}
		return pageSlice(songs, currentPage, SONGS_PER_PAGE);
	});

	// Clamp page when the song list shrinks (editor deletes songs in Studio).
	// Without this, currentPage could end up beyond totalPages and slice would
	// return an empty array even though songs still exist.
	$effect(() => {
		if (currentPage > totalPages) currentPage = totalPages;
	});

	function formatYear(year: number): string {
		return `'${String(year).padStart(2, '0')}`;
	}

	function goToPage(page: number) {
		currentPage = clampPage(page, totalPages);
	}

	function toggle() {
		// Toggling is a no-op above 640px since the CSS shows the body
		// regardless of `expanded`. Skipping the state mutation on desktop
		// keeps `aria-expanded` stable (always true at >640px).
		if (!isMobile) return;
		expanded = !expanded;
	}
</script>

{#if data ?? visibleSongs.length > 0}
	<section id="repertoire" class="reveal" use:reveal>
		<div class="repertoire" class:expanded={!isMobile || expanded}>
			<div class="repertoire-head">
				<div>
					{#if data?.eyebrowLabel}
						<div class="section-label">{data.eyebrowLabel}</div>
					{/if}
					{#if data?.heading}
						<h2 class="section-title">
							<MarkedText value={data.heading} mode="inline" />
						</h2>
					{/if}
				</div>
				{#if data?.intro}
					<p>{data.intro}</p>
				{/if}
			</div>

			{#if visibleSongs.length > 0}
				<div id="repertoire-body" class="repertoire-body">
					<ul
						id="repertoire-songs"
						class="song-list"
						style="--row-count: {Math.ceil(visibleSongs.length / 2)}"
					>
						{#each visibleSongs as song (song._id)}
							<li>
								<span class="song-title">{song.title}</span>
								<span class="song-meta">
									<span class="artist">{song.artist} · {formatYear(song.year)}</span>
									{#if song.chillLink ?? song.energyLink}
										<span class="song-versions">
											{#if song.chillLink}
												<a
													class="version chill"
													target="_blank"
													rel="noopener noreferrer"
													href={song.chillLink}
												>
													<svg
														class="version-icon"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="1.8"
														stroke-linecap="round"
														stroke-linejoin="round"
														aria-hidden="true"
													>
														<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
													</svg>
													<span>Chill version</span>
												</a>
											{/if}
											{#if song.energyLink}
												<a
													class="version energy"
													target="_blank"
													rel="noopener noreferrer"
													href={song.energyLink}
												>
													<span>High-energy version</span>
													<svg
														class="version-icon"
														viewBox="0 0 24 24"
														fill="currentColor"
														aria-hidden="true"
													>
														<path d="M13 2 L4 14 h6 l-1 8 9-12 h-6 z" />
													</svg>
												</a>
											{/if}
										</span>
									{/if}
								</span>
							</li>
						{/each}
					</ul>
					<button
						class="repertoire-toggle"
						type="button"
						aria-expanded={!isMobile || expanded}
						aria-controls="repertoire-songs"
						onclick={toggle}
					>
						<svg
							class="repertoire-chevron"
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
						<span class="visually-hidden">{expanded ? 'Show fewer songs' : 'Show all songs'}</span>
					</button>
					{#if totalPages > 1}
						<div class="songbook-pagination" aria-label="Songbook pagination">
							<button
								type="button"
								onclick={() => {
									goToPage(currentPage - 1);
								}}
								disabled={currentPage === 1}
								aria-label="Previous page"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M15 18l-6-6 6-6" />
								</svg>
								<span>Previous</span>
							</button>
							<!-- aria-live announces page changes to screen readers; aria-current
								 would be a misuse here (it marks the current item within a set of
								 navigation links, which this status text is not). -->
							<span class="indicator" aria-live="polite">Page {currentPage} of {totalPages}</span>
							<button
								type="button"
								onclick={() => {
									goToPage(currentPage + 1);
								}}
								disabled={currentPage === totalPages}
								aria-label="Next page"
							>
								<span>Next</span>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M9 18l6-6-6-6" />
								</svg>
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
	.repertoire {
		background: linear-gradient(135deg, rgba(220, 205, 238, 0.35), rgba(201, 220, 240, 0.35));
		border-radius: 40px;
		padding: 5rem 4rem;
		margin: 4rem auto;
		position: relative;
		overflow: hidden;
	}
	.repertoire::before {
		content: '\266A';
		position: absolute;
		top: -30px;
		right: -20px;
		font-size: 20rem;
		font-family: var(--serif);
		color: rgba(61, 43, 78, 0.06);
		line-height: 1;
	}
	.repertoire-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		flex-wrap: wrap;
		gap: 2rem;
		margin-bottom: 3rem;
	}
	.repertoire-head p {
		max-width: 420px;
		color: var(--plum-soft);
		font-size: 1rem;
	}
	/* The expand/collapse toggle is rendered after the song list, not above
	   the heading — so a mobile visitor reads the teaser songs first and
	   then sees the affordance to reveal the rest. Hidden entirely on
	   tablet and desktop, where the song list is always fully visible.
	   `visually-hidden` is the canonical sr-only pattern for the accessible
	   label that announces "Show all songs" / "Show fewer songs" without
	   rendering visible text. */
	.repertoire-toggle {
		display: none;
	}
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
	/* Grid (column-major) instead of CSS multi-column. CSS multi-column would
	   render absolutely-positioned descendants that overflow a column item at
	   the top of the next column — the same quirk the design comments call
	   out for the underline accent, but it also affects `.song-versions` on
	   the last row of a column. Grid gives each row its own cell, contained.
	   `--row-count` is set inline by the component as ceil(songs/2). */
	.song-list {
		list-style: none;
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(var(--row-count, 6), auto);
		column-gap: 3rem;
	}
	.song-list li {
		padding: 0.85rem 0;
		border-bottom: 1px solid rgba(61, 43, 78, 0.12);
		font-family: var(--serif);
		font-size: 1.05rem;
		color: var(--plum);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.25rem;
	}
	/* Only rows that have at least one version anchor become interactive. The
	   :has(.version) selector reads as the single source of truth — the
	   component already omits the .song-versions wrapper when both links are
	   missing, so a static row will simply have no .version descendants. */
	.song-list li:has(.version) {
		cursor: pointer;
	}
	.song-list .song-title {
		flex-shrink: 0;
	}
	.artist {
		font-family: var(--sans);
		font-size: 0.75rem;
		color: var(--plum-soft);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.song-meta {
		position: relative;
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}
	.song-meta .artist {
		transition: opacity 0.3s ease;
	}
	.song-list li:has(.version):hover .song-meta .artist,
	.song-list li:has(.version):focus-within .song-meta .artist {
		opacity: 0;
	}

	.song-versions {
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.18rem;
		font-family: var(--sans);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}
	.song-list li:hover .song-versions,
	.song-list li:focus-within .song-versions {
		opacity: 1;
		pointer-events: auto;
	}

	.version {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		text-decoration: none;
		position: relative;
		/* Bottom padding keeps the underline accent inside the link's box. */
		padding-bottom: 4px;
		transition:
			color 0.25s ease,
			transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.version.chill {
		color: #6a8cb0;
		transform: translateY(-4px);
	}
	.version.energy {
		color: #c4748a;
		transform: translateY(4px);
	}
	.song-list li:hover .version,
	.song-list li:focus-within .version {
		transform: translateY(0);
	}
	.song-list li:hover .version.energy,
	.song-list li:focus-within .version.energy {
		transition-delay: 60ms;
	}
	.version:hover {
		color: var(--plum);
	}
	.version:focus-visible {
		outline: 2px solid var(--plum);
		outline-offset: 3px;
		border-radius: 2px;
	}
	.version::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 0.3s ease;
	}
	.version:hover::after {
		transform: scaleX(1);
	}

	.version-icon {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
		color: currentColor;
	}
	.song-list li:hover .version.chill .version-icon,
	.song-list li:focus-within .version.chill .version-icon {
		animation: chill-float 2.8s ease-in-out infinite;
		transform-origin: center;
	}
	.song-list li:hover .version.energy .version-icon,
	.song-list li:focus-within .version.energy .version-icon {
		animation: energy-zap 0.95s ease-in-out infinite;
		transform-origin: center;
	}
	@keyframes chill-float {
		0%,
		100% {
			transform: translateY(0) rotate(-6deg);
		}
		50% {
			transform: translateY(-2px) rotate(8deg);
		}
	}
	@keyframes energy-zap {
		0%,
		100% {
			transform: scale(1) rotate(-4deg);
			filter: drop-shadow(0 0 0 rgba(196, 116, 138, 0));
		}
		50% {
			transform: scale(1.25) rotate(8deg);
			filter: drop-shadow(0 0 4px rgba(196, 116, 138, 0.85));
		}
	}
	/* Three-column grid (1fr | auto | 1fr) so the indicator sits at the true
	   centre of the row regardless of button widths. With a flex + gap layout
	   the indicator drifts whenever Previous and Next have unequal widths
	   (e.g. "Previous" is 8 chars, "Next" is 4). */
	.songbook-pagination {
		margin-top: 3rem;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1.5rem;
		font-family: var(--sans);
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--plum-soft);
	}
	.songbook-pagination button:first-of-type {
		justify-self: end;
	}
	.songbook-pagination button:last-of-type {
		justify-self: start;
	}
	.songbook-pagination button {
		background: none;
		border: none;
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		color: var(--plum-soft);
		cursor: pointer;
		padding: 0.5rem 0.4rem;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.3s;
	}
	.songbook-pagination button:hover:not(:disabled) {
		color: var(--plum);
	}
	.songbook-pagination button:focus-visible {
		outline: 2px solid var(--plum);
		outline-offset: 3px;
		border-radius: 2px;
	}
	.songbook-pagination button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	.songbook-pagination button svg {
		width: 14px;
		height: 14px;
	}
	.songbook-pagination .indicator {
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.95rem;
		font-weight: 300;
		letter-spacing: 0.02em;
		text-transform: none;
		color: var(--plum);
	}

	/* Card-level padding/margin/border-radius shrink at tablet widths so the
	   bordered songbook card has comfortable inset on iPads as well as phones.
	   The two-column song layout, however, holds at tablet (641-900px) — only
	   collapses to one column at <= 640px. */
	@media (max-width: 900px) {
		.repertoire {
			padding: 3rem 1.5rem;
			border-radius: 24px;
			margin-left: 1rem;
			margin-right: 1rem;
		}
		.songbook-pagination {
			gap: 0.8rem;
			font-size: 0.7rem;
		}
		.songbook-pagination button span {
			display: none;
		}
	}
	@media (max-width: 640px) {
		.song-list {
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			grid-auto-flow: row;
		}
		/* The CMS heading carries a `\n` between the two phrases so MarkedText
		   renders it as two desktop lines via `<br />`. At desktop widths the
		   serif heading is huge enough that each phrase fits on one line and
		   the break feels intentional. On a 375px viewport the same clamp
		   floor (2.4rem) plus the implicit auto-wrap of "Three decades of
		   hits" compounds with the explicit `<br />` and produces four
		   jagged lines ("Three decades / of hits / you still know / by
		   heart."). Shrinking the mobile heading to 1.6rem lets each phrase
		   sit on a single line with the manual break still kicking in: two
		   tidy lines, the same intent the desktop layout has. */
		.repertoire-head h2 {
			font-size: 1.6rem;
		}
		.repertoire {
			padding: 2.5rem 1rem;
			margin-left: 0.5rem;
			margin-right: 0.5rem;
		}
		/* The intro paragraph (~8 lines on a 375px viewport) sits between the
		   heading and the actual song list on mobile and pushes every song
		   below the fold. Songs ARE the content here; the intro mostly
		   tells the visitor "here's a taste, ask if you want something
		   I don't have", which the booking CTA already conveys. Drop the
		   intro on phones so a song appears immediately under the heading;
		   tablet (641-900px) and desktop keep the full intro alongside
		   the heading. */
		.repertoire-head p {
			display: none;
		}
		.repertoire-head {
			margin-bottom: 0;
		}
		/* Mobile teaser. The toggle is a horizontally-centred chevron button
		   sitting under the song list, so the visitor reads the three-song
		   teaser first and then sees the affordance to reveal the rest.
		   Tapping flips `expanded`, the `visibleSongs` derived swaps from
		   `songs.slice(0, 3)` to the full paginated page, and the
		   prev/next pagination row reveals via the matching CSS rule
		   below. The button is a 44x44 hit area (the Apple HIG floor,
		   above WCAG 2.5.8's 24x24 minimum) wrapping a 28x28 visual
		   chevron in a translucent ivory pill so it reads as interactive
		   without competing with the songbook card's plum palette. */
		.repertoire-toggle {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 44px;
			height: 44px;
			margin: 1.5rem auto 0;
			padding: 0;
			border: 1px solid rgba(193, 174, 224, 0.4);
			border-radius: 50%;
			background: rgba(253, 249, 245, 0.8);
			cursor: pointer;
			transition: transform 0.3s ease;
		}
		.repertoire-toggle:hover {
			background: rgba(253, 249, 245, 1);
		}
		.repertoire-toggle:focus-visible {
			outline: 2px solid var(--plum);
			outline-offset: 3px;
		}
		.repertoire-chevron {
			display: block;
			width: 20px;
			height: 20px;
			color: var(--plum-soft);
			flex-shrink: 0;
			transition: transform 0.3s ease;
		}
		.repertoire.expanded .repertoire-chevron {
			transform: rotate(180deg);
		}
		/* Pagination only makes sense once the user has expanded the full
		   songbook (the teaser shows just the first three songs across the
		   whole list, regardless of `currentPage`). Hidden on mobile while
		   collapsed; tablet and desktop always show it. */
		.repertoire:not(.expanded) .songbook-pagination {
			display: none;
		}
	}
	@media (max-width: 640px) {
		/* Stack each song row vertically: title on its own line, then the
		   artist+versions row below it. On the previous flex-row layout the
		   right-side meta column had to share a single line with the title
		   and got squeezed past the card edge — long artist names like
		   "Backstreet Boys · '99" and "High-energy version" labels were
		   truncated mid-word. Single-column rows give every line full width. */
		.song-list li {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.4rem;
			padding: 1rem 0;
		}
		.song-title {
			font-size: 1.1rem;
		}
		.song-meta {
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			flex-wrap: wrap;
			gap: 0.5rem 1rem;
			width: 100%;
		}
		.artist {
			opacity: 1 !important;
		}
		.song-versions {
			position: static;
			transform: none;
			opacity: 1;
			pointer-events: auto;
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
		}
		/* On mobile each version link becomes a proper round chip — 40x40
		   visible button, with a pseudo-element extending the click target
		   to 44x44 (the Apple HIG floor; WCAG 2.5.8's actual minimum is
		   24x24). The translucent ivory
		   background + tinted border makes the link read as tappable
		   without hover affordance (which mobile lacks), and the larger
		   16px icon is comfortably legible. The accessible name still comes
		   from the visually-hidden span so screen readers announce "Chill
		   version" / "High-energy version" exactly as on desktop. */
		.version,
		.version.chill,
		.version.energy {
			transform: none !important;
			padding: 0;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			border: 1px solid rgba(193, 174, 224, 0.4);
			background: rgba(253, 249, 245, 0.7);
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			position: relative;
		}
		.version::before {
			content: '';
			position: absolute;
			inset: -3px;
		}
		.version.chill {
			color: #6a8cb0;
		}
		.version.energy {
			color: #c4748a;
		}
		.version::after {
			/* Drop the desktop hover underline accent — irrelevant at this
			   size and would visually conflict with the round chip. */
			display: none;
		}
		.version span {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
		}
		.version-icon {
			width: 16px;
			height: 16px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.repertoire-chevron {
			transition: none;
		}
		.song-list li:hover .version.chill .version-icon,
		.song-list li:hover .version.energy .version-icon {
			animation: none;
		}
	}
</style>
