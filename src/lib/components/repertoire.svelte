<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { SONGS_PER_PAGE } from '$lib/constants';
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

	const totalSongs = $derived(songs?.length ?? 0);
	const totalPages = $derived(Math.max(1, Math.ceil(totalSongs / SONGS_PER_PAGE)));
	const visibleSongs = $derived(
		songs?.slice((currentPage - 1) * SONGS_PER_PAGE, currentPage * SONGS_PER_PAGE) ?? []
	);

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
		currentPage = Math.max(1, Math.min(totalPages, page));
	}
</script>

{#if data ?? visibleSongs.length > 0}
	<section id="repertoire" class="reveal" use:reveal>
		<div class="repertoire">
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
				<ul class="song-list" style="--row-count: {Math.ceil(visibleSongs.length / 2)}">
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
						<span class="indicator" aria-current="page">Page {currentPage} of {totalPages}</span>
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

	@media (max-width: 900px) {
		.repertoire {
			padding: 3rem 1.5rem;
			border-radius: 24px;
			margin-left: 1rem;
			margin-right: 1rem;
		}
		.song-list {
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			grid-auto-flow: row;
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
		.song-meta {
			flex-direction: column;
			align-items: flex-end;
			gap: 0.45rem;
		}
		.artist {
			opacity: 1 !important;
		}
		.song-versions {
			position: static;
			transform: none;
			opacity: 1;
			pointer-events: auto;
		}
		.version,
		.version.chill,
		.version.energy {
			transform: none !important;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.song-list li:hover .version.chill .version-icon,
		.song-list li:hover .version.energy .version-icon {
			animation: none;
		}
	}
</style>
