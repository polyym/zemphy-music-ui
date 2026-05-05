<script lang="ts">
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
				{#each services as service (service._id)}
					<div class="service-card">
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
						<h3>{service.title}</h3>
						<p>{service.description}</p>
						{#if service.keywords.length > 0}
							<div class="price">{service.keywords.join(' · ')}</div>
						{/if}
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
	.service-icon {
		width: 52px;
		height: 52px;
		margin-bottom: 1.5rem;
		color: var(--plum);
	}
	h3 {
		font-family: var(--serif);
		font-size: 1.7rem;
		font-weight: 400;
		font-style: italic;
		margin-bottom: 0.8rem;
		color: var(--plum);
	}
	p {
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
	@media (max-width: 900px) {
		.services-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
