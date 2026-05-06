<script lang="ts">
	import { POLYYM_GITHUB_URL } from '$lib/constants';

	let {
		logoName,
		footerTagline
	}: {
		logoName?: string;
		footerTagline?: string;
	} = $props();

	// Year is auto-generated, never CMS. The separator " · " is design formatting,
	// inserted only between parts that actually render so missing fields don't
	// leave dangling separators.
	const year = new Date().getFullYear();
	const parts = $derived(
		[String(year), logoName, footerTagline].filter(
			(p): p is string => p !== undefined && p.length > 0
		)
	);
</script>

{#if parts.length > 0}
	<footer>
		<div class="divider"></div>
		<div class="copyright">© {parts.join(' · ')}</div>
		<div class="attribution">
			<span class="extra">Built&nbsp;</span>by
			<a href={POLYYM_GITHUB_URL} target="_blank" rel="noopener noreferrer">polyym</a><span
				class="extra">&nbsp;for ZEMPHY &lt;3</span
			>
		</div>
	</footer>
{/if}

<style>
	footer {
		padding: 3rem 2rem;
		text-align: center;
		font-size: 0.8rem;
		color: var(--plum-soft);
		letter-spacing: 0.1em;
	}
	.divider {
		width: 60px;
		height: 1px;
		background: var(--plum-soft);
		margin: 0 auto 1.5rem;
		opacity: 0.4;
	}
	.attribution {
		/* `position: relative` provides the containing block for the link's
		   `::before` overlay, which extends the link's hit area across the
		   whole row. `cursor: pointer` makes the affordance obvious for users
		   hovering over the "Built " / " for ZEMPHY <3" parts as well. */
		position: relative;
		cursor: pointer;
		margin-top: 0.7rem;
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.85rem;
		font-weight: 300;
		letter-spacing: 0;
	}
	.attribution a {
		color: inherit;
		text-decoration: none;
		border-bottom: 1px solid currentColor;
		padding-bottom: 1px;
		opacity: 0.7;
		transition: opacity 0.3s;
	}
	.attribution a:hover {
		opacity: 1;
	}
	/* Transparent overlay covering the whole `.attribution` row so a click
	   anywhere on the line activates the link (not just on the "polyym" word).
	   The overlay sits visually under the text (transparent, no background) but
	   above it in stacking order, so click events route to the link element. */
	.attribution a::before {
		content: '';
		position: absolute;
		inset: 0;
	}
	/* The .extra spans hold the prefix ("Built ") and suffix (" for ZEMPHY <3").
	   At rest they collapse to zero width with hidden overflow so the line reads
	   simply as "by polyym". On hover (or keyboard focus on the link) max-width
	   eases out and opacity fades in, giving a smooth "the credit completes
	   itself" reveal without re-flowing the rest of the page. */
	.attribution .extra {
		display: inline-block;
		max-width: 0;
		overflow: hidden;
		opacity: 0;
		white-space: nowrap;
		/* Inline-block boxes with overflow: hidden have their CSS baseline
		   redefined to the bottom margin edge (not the inner text baseline),
		   which would float the revealed text above the surrounding "by polyym".
		   `vertical-align: bottom` aligns the box's bottom to the line box's
		   bottom, putting the inner text on the same visual baseline as the
		   surrounding flow. */
		vertical-align: bottom;
		transition:
			max-width 0.55s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.35s ease 0.05s;
	}
	.attribution:hover .extra,
	.attribution:focus-within .extra {
		max-width: 12rem;
		opacity: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.attribution .extra {
			transition: none;
		}
	}
</style>
