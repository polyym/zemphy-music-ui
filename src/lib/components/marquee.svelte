<script lang="ts">
	let { keywords }: { keywords?: string[] } = $props();

	// Render the keyword set twice back-to-back so the CSS keyframe animation
	// produces a seamless infinite scroll. The single track translates by -50%,
	// so the second copy slides into position as the first scrolls off.
</script>

{#if keywords && keywords.length > 0}
	<div class="marquee">
		<div class="marquee-track">
			{#each [keywords, keywords] as set, setIndex (setIndex)}
				<span>
					{#each set as keyword, i (`${String(setIndex)}-${String(i)}`)}
						{keyword}
						<span class="dot"></span>
					{/each}
				</span>
			{/each}
		</div>
	</div>
{/if}

<style>
	.marquee {
		overflow: hidden;
		padding: 2.5rem 0;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(246, 209, 220, 0.3),
			rgba(220, 205, 238, 0.3),
			rgba(201, 220, 240, 0.3),
			transparent
		);
		border-top: 1px solid rgba(193, 174, 224, 0.3);
		border-bottom: 1px solid rgba(193, 174, 224, 0.3);
		margin: 2rem 0;
	}
	.marquee-track {
		display: flex;
		gap: 3rem;
		animation: scroll 45s linear infinite;
		white-space: nowrap;
		font-family: var(--serif);
		font-size: 1.8rem;
		font-style: italic;
		font-weight: 300;
		color: var(--plum);
	}
	.marquee-track span {
		display: inline-flex;
		align-items: center;
		gap: 3rem;
	}
	.marquee-track .dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--pastel-pink-deep);
	}
	@keyframes scroll {
		to {
			transform: translateX(-50%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}
	}
</style>
