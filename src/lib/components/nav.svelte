<script lang="ts">
	let {
		logoName,
		navCtaLabel,
		instagramUrl,
		youtubeUrl
	}: {
		logoName?: string;
		navCtaLabel?: string;
		instagramUrl?: string;
		youtubeUrl?: string;
	} = $props();
</script>

<nav>
	{#if logoName}
		<div class="logo">
			<span class="logo-mark"></span>
			{logoName}
		</div>
	{:else}
		<span></span>
	{/if}
	<div class="nav-right">
		<div class="nav-socials">
			{#if instagramUrl}
				<a href={instagramUrl} target="_blank" rel="noopener" aria-label="Instagram">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="3" y="3" width="18" height="18" rx="5" />
						<circle cx="12" cy="12" r="4" />
						<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
					</svg>
				</a>
			{/if}
			{#if youtubeUrl}
				<a href={youtubeUrl} target="_blank" rel="noopener" aria-label="YouTube">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M23 7.5a3 3 0 00-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 001 7.5 31 31 0 00.5 12 31 31 0 001 16.5a3 3 0 002.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 002.1-2.1 31 31 0 00.5-4.5 31 31 0 00-.5-4.5zM10 15.5v-7l6 3.5-6 3.5z"
						/>
					</svg>
				</a>
			{/if}
		</div>
		{#if navCtaLabel}
			<a class="nav-cta" href="#booking">{navCtaLabel}</a>
		{/if}
	</div>
</nav>

<style>
	/* Two floating corners — wordmark left, socials + CTA right — with no
	   backdrop, blur, or border between them. Section-jump navigation lives in
	   the side-nav dot index instead. */
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 1.6rem 2.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 100;
		pointer-events: none;
	}
	nav > :global(*) {
		pointer-events: auto;
	}
	.logo {
		font-family: var(--serif);
		font-size: 1.5rem;
		font-style: italic;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--plum);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.logo-mark {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--pastel-pink-deep), var(--pastel-lilac-deep));
		box-shadow: 0 0 12px var(--pastel-pink);
	}
	.nav-cta {
		padding: 0.6rem 1.4rem;
		background: var(--plum);
		color: var(--ivory);
		border-radius: 999px;
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 500;
		text-decoration: none;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	.nav-cta:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(61, 43, 78, 0.25);
	}
	.nav-socials {
		display: flex;
		gap: 0.9rem;
		align-items: center;
		margin-right: 1.2rem;
	}
	.nav-socials a {
		width: 36px;
		height: 36px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: var(--plum-soft);
		transition:
			color 0.3s,
			background 0.3s,
			transform 0.3s;
	}
	.nav-socials a:hover {
		color: var(--plum);
		background: rgba(220, 205, 238, 0.4);
		transform: translateY(-2px);
	}
	.nav-socials svg {
		width: 18px;
		height: 18px;
	}
	.nav-right {
		display: flex;
		align-items: center;
	}
	@media (max-width: 900px) {
		nav {
			padding: 1rem 1.5rem;
		}
	}
</style>
