<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error</title>
</svelte:head>

<main class="error-page">
	<div class="error-container">
		<div class="error-code">{page.status}</div>
		<h1>
			{#if page.status === 404}Page not found{:else}Something went wrong{/if}
		</h1>
		<p>
			{#if page.status === 404}
				The page you are looking for has wandered off.
			{:else}
				An unexpected error occurred.
			{/if}
		</p>
		<a href={resolve('/')} class="home-link">Return home</a>
	</div>
</main>

<style>
	.error-page {
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
	}
	.error-container {
		max-width: 480px;
	}
	.error-code {
		font-family: var(--serif);
		font-style: italic;
		font-size: clamp(4rem, 12vw, 7rem);
		font-weight: 300;
		color: var(--plum-soft);
		opacity: 0.5;
		line-height: 1;
		margin-bottom: 1rem;
	}
	h1 {
		font-family: var(--serif);
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 300;
		color: var(--plum);
		margin-bottom: 1rem;
	}
	p {
		font-family: var(--serif);
		font-style: italic;
		color: var(--plum-soft);
		margin-bottom: 2.5rem;
	}
	.home-link {
		display: inline-block;
		padding: 1rem 2.2rem;
		background: var(--plum);
		color: var(--ivory);
		border-radius: 999px;
		font-size: 0.85rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		font-weight: 500;
		text-decoration: none;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2),
			box-shadow 0.35s;
	}
	.home-link:hover {
		transform: translateY(-3px);
		box-shadow: 0 14px 34px rgba(61, 43, 78, 0.3);
	}
</style>
