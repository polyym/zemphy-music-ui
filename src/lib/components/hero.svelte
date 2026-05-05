<script lang="ts">
	let {
		kicker,
		displayName,
		tagline,
		primaryCtaLabel,
		secondaryCtaLabel
	}: {
		kicker?: string;
		displayName?: string;
		tagline?: string;
		primaryCtaLabel?: string;
		secondaryCtaLabel?: string;
	} = $props();
</script>

<header class="hero">
	<!-- Decorative atmosphere — pure design, never CMS. -->
	<div
		class="blob"
		style="top: 18%; left: 8%; width: 280px; height: 280px; background: var(--pastel-pink); animation-delay: 0s;"
	></div>
	<div
		class="blob"
		style="top: 55%; right: 10%; width: 320px; height: 320px; background: var(--pastel-lilac); animation-delay: -3s;"
	></div>
	<div
		class="blob"
		style="bottom: 10%; left: 35%; width: 240px; height: 240px; background: var(--pastel-blue); animation-delay: -6s;"
	></div>

	<svg
		class="sparkle"
		style="top: 15%; left: 15%; animation-delay: 0s;"
		width="28"
		height="28"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<defs
			><radialGradient id="sg1" cx="50%" cy="50%" r="50%"
				><stop offset="0%" stop-color="#fffaee" /><stop offset="45%" stop-color="#ede4cc" /><stop
					offset="100%"
					stop-color="#a89e87"
				/></radialGradient
			></defs
		>
		<path
			d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
			fill="url(#sg1)"
		/>
	</svg>
	<svg
		class="sparkle"
		style="top: 22%; right: 18%; animation-delay: 1.2s;"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
			fill="#eab1c2"
		/>
	</svg>
	<svg
		class="sparkle"
		style="top: 42%; left: 10%; animation-delay: 2.1s;"
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
			fill="#c1aee0"
		/>
	</svg>
	<svg
		class="sparkle"
		style="top: 60%; right: 12%; animation-delay: 0.8s;"
		width="26"
		height="26"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<defs
			><radialGradient id="sg2" cx="50%" cy="50%" r="50%"
				><stop offset="0%" stop-color="#fffaee" /><stop offset="45%" stop-color="#ede4cc" /><stop
					offset="100%"
					stop-color="#a89e87"
				/></radialGradient
			></defs
		>
		<path
			d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
			fill="url(#sg2)"
		/>
	</svg>
	<svg
		class="sparkle"
		style="top: 75%; left: 22%; animation-delay: 1.8s;"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
			fill="#a8c4e0"
		/>
	</svg>
	<svg
		class="sparkle"
		style="top: 8%; left: 65%; animation-delay: 2.6s;"
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
			fill="#f4e5ba"
		/>
	</svg>
	<svg
		class="sparkle"
		style="top: 82%; right: 28%; animation-delay: 1.4s;"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
			fill="#eab1c2"
		/>
	</svg>

	{#if kicker}
		<div class="hero-kicker">{kicker}</div>
	{/if}
	{#if displayName}
		<h1><span class="rose">{displayName}</span></h1>
	{/if}
	{#if tagline}
		<p class="hero-tagline">{tagline}</p>
	{/if}
	{#if primaryCtaLabel ?? secondaryCtaLabel}
		<div class="hero-cta-row">
			{#if primaryCtaLabel}
				<a href="#booking" class="btn btn-primary">{primaryCtaLabel}</a>
			{/if}
			{#if secondaryCtaLabel}
				<a href="#repertoire" class="btn btn-ghost">{secondaryCtaLabel}</a>
			{/if}
		</div>
	{/if}
</header>

<style>
	.hero {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 8rem 2rem 4rem;
		position: relative;
	}
	.hero-kicker {
		font-family: var(--sans);
		font-size: 0.78rem;
		letter-spacing: 0.4em;
		text-transform: uppercase;
		color: var(--plum-soft);
		margin-bottom: 2rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		opacity: 0;
		animation: fadeUp 1s ease forwards 0.2s;
	}
	.hero-kicker::before,
	.hero-kicker::after {
		content: '';
		display: block;
		width: 40px;
		height: 1px;
		background: var(--plum-soft);
	}
	h1 {
		font-family: var(--serif);
		font-size: clamp(4rem, 13vw, 11rem);
		font-weight: 300;
		line-height: 0.92;
		letter-spacing: -0.03em;
		font-variation-settings:
			'opsz' 144,
			'SOFT' 100;
		color: var(--plum);
		margin-bottom: 0.3rem;
		opacity: 0;
		animation: fadeUp 1.2s ease forwards 0.4s;
	}
	.rose {
		font-style: italic;
		font-weight: 400;
		letter-spacing: 0.01em;
		background: linear-gradient(
			135deg,
			var(--pastel-pink-deep) 0%,
			var(--pastel-lilac-deep) 60%,
			var(--pastel-blue-deep) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		display: inline-block;
		position: relative;
	}
	.hero-tagline {
		font-family: var(--serif);
		font-style: italic;
		font-size: clamp(1.1rem, 1.8vw, 1.45rem);
		color: var(--plum-soft);
		max-width: 560px;
		margin: 1.5rem auto 2.8rem;
		font-weight: 300;
		opacity: 0;
		animation: fadeUp 1s ease forwards 0.7s;
	}
	.hero-cta-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
		opacity: 0;
		animation: fadeUp 1s ease forwards 0.9s;
	}
	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hero-kicker,
		h1,
		.hero-tagline,
		.hero-cta-row {
			animation: none;
			opacity: 1;
		}
	}
</style>
