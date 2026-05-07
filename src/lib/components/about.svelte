<script lang="ts">
	import { onDestroy } from 'svelte';
	import { reveal } from '$lib/actions/reveal';
	import { imageUrl } from '$lib/sanity/image';
	import type { AboutSection } from '$lib/sanity/types';
	import MarkedText from './marked-text.svelte';

	let { data }: { data?: AboutSection } = $props();

	// Build the portrait CSS background-image inline so the design's pseudo-element
	// warmth wash and bottom darkening (in this component's scoped CSS) layer
	// over a CMS-driven asset URL without any of those styles being touched.
	const portraitStyle = $derived(
		data?.portraitImage
			? `background-image: url('${imageUrl(data.portraitImage).width(900).height(1125).fit('crop').url()}');`
			: ''
	);

	// Optional inline audio sample. The CMS field is a Sanity file asset that
	// the page-level GROQ projection has already resolved into `{ url,
	// mimeType }`; without a published audio file the whole player block is
	// omitted (no DOM, no <audio> element). Built without `<audio controls>`
	// so the rendered chrome matches the brand rather than the browser
	// default — a single round play/pause button next to an optional
	// CMS-driven label and an audio-reactive equalizer.
	let audioEl: HTMLAudioElement | undefined = $state();
	let isPlaying = $state(false);

	// Audio visualizer. Bars are driven by a real-time AnalyserNode so the
	// heights respond to the playing audio's frequency content. At rest the
	// bars sit at `BAR_REST_HEIGHT` so the equalizer track always has visual
	// presence — never an empty stretch of pill background. The AnalyserNode
	// is built lazily on first play (it can only be created after a user
	// gesture, and `createMediaElementSource` is single-shot per element)
	// and torn down on component destroy.
	const BAR_COUNT = 24;
	const BAR_REST_HEIGHT = 3;
	const BAR_MAX_HEIGHT = 18;
	const BAR_RESPONSE_GAMMA = 0.7;
	let barHeights = $state<number[]>(Array.from({ length: BAR_COUNT }, () => BAR_REST_HEIGHT));
	let audioContext: AudioContext | undefined;
	let analyser: AnalyserNode | undefined;
	// `Uint8Array<ArrayBuffer>` rather than the bare `Uint8Array` because
	// `AnalyserNode.getByteFrequencyData` constrains the buffer type to
	// `ArrayBuffer` (not `SharedArrayBuffer`) under TypeScript's strict
	// typed-array generics.
	let dataArray: Uint8Array<ArrayBuffer> | undefined;
	let rafHandle: number | undefined;

	function setupAudioGraph() {
		if (audioContext || !audioEl || typeof AudioContext === 'undefined') return;
		audioContext = new AudioContext();
		const source = audioContext.createMediaElementSource(audioEl);
		analyser = audioContext.createAnalyser();
		// fftSize 64 gives 32 frequency bins covering ~0-22kHz at 44.1kHz
		// sample rate. The lower 24 bins (~0-16.5kHz) span the musical
		// range; the highest few bins are usually silent for vocals so we
		// drop them rather than rendering dead bars on the right.
		analyser.fftSize = 64;
		analyser.smoothingTimeConstant = 0.7;
		source.connect(analyser);
		analyser.connect(audioContext.destination);
		dataArray = new Uint8Array(analyser.frequencyBinCount);
	}

	function startVisualizer() {
		if (!analyser || !dataArray) return;
		// Reduced-motion users see the static rest pattern; we don't drive
		// the bars from audio at all.
		if (
			typeof globalThis.matchMedia === 'function' &&
			globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return;
		}
		const tick = () => {
			if (!analyser || !dataArray) return;
			analyser.getByteFrequencyData(dataArray);
			// Gamma-curve the 0-255 amplitude so quiet frequencies are still
			// readable — pure linear mapping leaves only the loudest few
			// bars moving.
			barHeights = Array.from({ length: BAR_COUNT }, (_, i) => {
				const v = dataArray?.[i] ?? 0;
				const scaled = (v / 255) ** BAR_RESPONSE_GAMMA;
				return BAR_REST_HEIGHT + scaled * (BAR_MAX_HEIGHT - BAR_REST_HEIGHT);
			});
			rafHandle = requestAnimationFrame(tick);
		};
		tick();
	}

	function stopVisualizer() {
		if (rafHandle !== undefined) {
			cancelAnimationFrame(rafHandle);
			rafHandle = undefined;
		}
		barHeights = Array.from({ length: BAR_COUNT }, () => BAR_REST_HEIGHT);
	}

	function toggleAudio() {
		if (!audioEl) return;
		if (audioEl.paused) {
			// Order matters and everything stays synchronous inside the click
			// handler — both `audioContext.resume()` and `audioEl.play()`
			// require a live user-gesture context, so awaiting between them
			// would lose the gesture and silently fail. We set up the audio
			// graph (one-shot, gated by `if (audioContext)` inside the
			// helper), fire resume() as fire-and-forget, then call play()
			// while the gesture is still active. resume() resolves under
			// the hood and the analyser starts receiving frames.
			setupAudioGraph();
			void audioContext?.resume();
			void audioEl.play();
		} else {
			audioEl.pause();
		}
	}

	function handlePlay() {
		isPlaying = true;
		startVisualizer();
	}

	function handlePauseOrEnd() {
		isPlaying = false;
		stopVisualizer();
	}

	onDestroy(() => {
		stopVisualizer();
		void audioContext?.close();
	});
</script>

{#if data}
	<section id="about" class="reveal" use:reveal>
		<div class="about">
			<div class="portrait-wrap">
				<div class="portrait" style={portraitStyle}></div>
				{#if data.badgeLine1 ?? data.badgeLine2 ?? data.badgeEstablished}
					<div class="portrait-badge">
						{#if data.badgeLine1}{data.badgeLine1}<br />{/if}
						{#if data.badgeLine2}{data.badgeLine2}<br />{/if}
						{#if data.badgeEstablished}<span>{data.badgeEstablished}</span>{/if}
					</div>
				{/if}
			</div>
			<div class="about-copy">
				{#if data.eyebrowLabel}
					<div class="section-label">{data.eyebrowLabel}</div>
				{/if}
				{#if data.heading}
					<h2 class="section-title">
						<MarkedText value={data.heading} mode="inline" />
					</h2>
				{/if}
				<MarkedText value={data.body} mode="blocks" />
				{#if data.audioPreview?.url}
					<div class="audio-sample" class:playing={isPlaying}>
						<button
							type="button"
							class="audio-play"
							aria-label={isPlaying ? 'Pause voice sample' : 'Play voice sample'}
							aria-pressed={isPlaying}
							onclick={toggleAudio}
						>
							{#if isPlaying}
								<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<rect x="6" y="5" width="4" height="14" rx="1" />
									<rect x="14" y="5" width="4" height="14" rx="1" />
								</svg>
							{:else}
								<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M7 5v14l12-7z" />
								</svg>
							{/if}
						</button>
						{#if data.audioPreviewLabel}
							<span class="audio-label">{data.audioPreviewLabel}</span>
						{/if}
						<span class="audio-equalizer" aria-hidden="true">
							{#each barHeights as h, i (i)}
								<span class="audio-equalizer-bar" style="height: {h}px"></span>
							{/each}
						</span>
						<audio
							bind:this={audioEl}
							src={data.audioPreview.url}
							preload="metadata"
							crossorigin="anonymous"
							onplay={handlePlay}
							onpause={handlePauseOrEnd}
							onended={handlePauseOrEnd}
						></audio>
					</div>
				{/if}
				{#if data.signature}
					<div class="about-signature">{data.signature}</div>
				{/if}
			</div>
		</div>
	</section>
{/if}

<style>
	.about {
		display: grid;
		grid-template-columns: 1fr 1.15fr;
		gap: 5rem;
		align-items: center;
	}
	.portrait-wrap {
		position: relative;
	}
	.portrait {
		aspect-ratio: 4 / 5;
		border-radius: 240px 240px 12px 12px;
		background-color: var(--pastel-lilac);
		background-size: cover;
		background-position: center 25%;
		box-shadow:
			0 30px 80px -20px rgba(61, 43, 78, 0.25),
			0 0 0 1px rgba(255, 255, 255, 0.4) inset;
		position: relative;
		overflow: hidden;
	}
	/* Warmth wash overlay; pseudo-element so swapping the inline background-image
	   from CMS leaves this gradient untouched. */
	.portrait::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			165deg,
			rgba(246, 209, 220, 0.15) 0%,
			transparent 40%,
			rgba(201, 220, 240, 0.15) 100%
		);
		pointer-events: none;
	}
	.portrait::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 60%, rgba(61, 43, 78, 0.15));
		pointer-events: none;
	}
	.portrait-badge {
		position: absolute;
		bottom: -30px;
		right: -30px;
		width: 140px;
		height: 140px;
		border-radius: 50%;
		background: var(--ivory);
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.9rem;
		line-height: 1.2;
		color: var(--plum);
		box-shadow: 0 20px 40px -10px rgba(193, 174, 224, 0.5);
		animation: slowSpin 30s linear infinite;
	}
	.portrait-badge span {
		display: block;
		font-family: var(--sans);
		font-style: normal;
		font-size: 0.65rem;
		letter-spacing: 0.3em;
		margin-top: 4px;
		color: var(--plum-soft);
	}
	@keyframes slowSpin {
		to {
			transform: rotate(360deg);
		}
	}
	.about-copy :global(p) {
		font-family: var(--serif);
		font-size: 1.25rem;
		font-weight: 300;
		line-height: 1.7;
		color: var(--plum);
		margin-bottom: 1.3rem;
	}
	.about-copy :global(p:first-of-type::first-letter) {
		font-size: 3.4rem;
		font-style: italic;
		float: left;
		line-height: 0.9;
		padding: 0.3rem 0.6rem 0 0;
		color: var(--pastel-pink-deep);
	}
	.about-signature {
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.8rem;
		color: var(--plum-soft);
		margin-top: 2rem;
		letter-spacing: 0.02em;
	}
	/* Optional inline voice sample player. The bar spans the full width of
	   the body column (`display: flex`, default `width: auto`) so it
	   visually closes the paragraph above with a deliberate horizontal
	   stroke; the round 44x44 plum button sits at the left, the optional
	   italic-serif label sits to its right, and an equalizer animation
	   fills whatever empty space remains while audio is playing. Player
	   only renders when the CMS has an audio asset, so this CSS is
	   dead-loaded otherwise. Sized for a comfortable tap target on mobile
	   (>= 44x44 per WCAG 2.5.8). */
	.audio-sample {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 1.5rem;
		padding: 0.6rem 1rem 0.6rem 0.6rem;
		background: rgba(253, 249, 245, 0.7);
		border-radius: 999px;
		border: 1px solid rgba(193, 174, 224, 0.35);
		backdrop-filter: blur(8px);
	}
	.audio-play {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: none;
		background: var(--plum);
		color: var(--ivory);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		padding: 0;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	.audio-play:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 24px -8px rgba(61, 43, 78, 0.35);
	}
	.audio-play:focus-visible {
		outline: 2px solid var(--plum);
		outline-offset: 3px;
	}
	.audio-play svg {
		width: 20px;
		height: 20px;
	}
	.audio-label {
		font-family: var(--serif);
		font-style: italic;
		font-size: 1rem;
		color: var(--plum-soft);
		flex-shrink: 1;
		min-width: 0;
	}
	/* Audio-reactive equalizer that fills whatever empty space remains to
	   the right of the label. `flex: 1 1 0` claims all remaining space;
	   `min-width: 0` lets the column shrink below the bars' intrinsic
	   content size; `overflow: hidden` clips bars cleanly when there
	   isn't enough room. Graceful degradation: a short label leaves a
	   wide equalizer track, a long label squeezes the bars, and a label
	   that fills the entire bar collapses the equalizer to zero — the
	   user sees no sliver of partial bars. `justify-content:
	   space-between` distributes the 24 fixed-width bars evenly across
	   the available track so they read as a continuous visualisation
	   regardless of how wide the player gets. Bar heights come from the
	   AnalyserNode's frequency data via inline `style="height: {n}px"` —
	   no CSS keyframes — so the bars literally react to the audio. At
	   rest each bar holds at `BAR_REST_HEIGHT` (3px), giving the track
	   a quiet horizontal stroke rather than empty pill space. */
	.audio-equalizer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0;
		flex: 1 1 0;
		min-width: 0;
		overflow: hidden;
		height: 22px;
		padding: 0 0.6rem;
	}
	.audio-equalizer-bar {
		display: block;
		flex: 0 0 3px;
		width: 3px;
		min-height: 3px;
		background: var(--plum-soft);
		border-radius: 2px;
		/* Brief CSS smoothing on top of the AnalyserNode's
		   `smoothingTimeConstant` so frame-to-frame height changes look
		   musical rather than jittery. */
		transition: height 0.06s linear;
	}
	@media (prefers-reduced-motion: reduce) {
		.audio-play {
			transition: none;
		}
		.audio-equalizer-bar {
			transition: none;
		}
	}
	/* Keep the portrait + copy side-by-side at tablet widths (641-900px);
	   only collapse to a single column on phones (<= 640px) where the
	   portrait would shrink too small to read alongside the copy. */
	@media (max-width: 640px) {
		.about {
			grid-template-columns: 1fr;
			gap: 3rem;
		}
		.portrait-badge {
			width: 100px;
			height: 100px;
			font-size: 0.75rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.portrait-badge {
			animation: none;
		}
	}
</style>
