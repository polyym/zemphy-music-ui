import {
	SPARKLE_INTERVAL_MS,
	SPARKLE_FADE_OUT_MS,
	SPARKLE_VISIBLE_MS,
	SPARKLE_TEXT_RETRY_LIMIT,
	SPARKLE_MIN_SIZE_PX,
	SPARKLE_SIZE_VARIANCE_PX
} from '$lib/constants';

const SPARKLE_SVG = (size: number): string =>
	`<svg width="${String(size)}" height="${String(size)}" viewBox="0 0 24 24">` +
	'<defs><radialGradient id="sg" cx="50%" cy="50%" r="50%">' +
	'<stop offset="0%" stop-color="#fffaee"/>' +
	'<stop offset="45%" stop-color="#ede4cc"/>' +
	'<stop offset="100%" stop-color="#a89e87"/>' +
	'</radialGradient></defs>' +
	'<path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" fill="url(#sg)"/>' +
	'</svg>';

function isOverText(x: number, y: number, doc: Document): boolean {
	const el = doc.elementFromPoint(x, y);
	if (!el) return false;
	// Only check direct text-node children. Walking up the tree would
	// false-positive on container divs whose unrelated descendants hold text.
	for (const childNode of el.childNodes) {
		if (childNode.nodeType === Node.TEXT_NODE && (childNode.textContent?.trim().length ?? 0) > 0) {
			return true;
		}
	}
	return false;
}

/**
 * Sprinkles small SVG sparkles at random viewport positions on a fixed
 * interval, retrying when a candidate position lands directly above text.
 * Sparkles are appended to the host element's owner document body so they're
 * not constrained by the action host's layout.
 *
 * Lifecycle is bound to the host element so applying `use:sparkles` lets
 * Svelte clean up the interval when the component unmounts.
 */
export function sparkles(node: HTMLElement) {
	const doc = node.ownerDocument;
	const win = doc.defaultView;
	if (!win) return {};

	function addSparkle() {
		if (!win) return;
		const size = SPARKLE_MIN_SIZE_PX + Math.random() * SPARKLE_SIZE_VARIANCE_PX;
		const startRotation = Math.random() * 90;

		let x = 0;
		let y = 0;
		let attempts = 0;
		while (attempts < SPARKLE_TEXT_RETRY_LIMIT) {
			x = Math.random() * win.innerWidth;
			y = Math.random() * win.innerHeight;
			if (!isOverText(x + size / 2, y + size / 2, doc)) break;
			attempts++;
		}
		if (attempts >= SPARKLE_TEXT_RETRY_LIMIT) return;

		const sparkle = doc.createElement('div');
		sparkle.innerHTML = SPARKLE_SVG(size);
		sparkle.style.position = 'fixed';
		sparkle.style.left = `${String(x)}px`;
		sparkle.style.top = `${String(y)}px`;
		sparkle.style.pointerEvents = 'none';
		sparkle.style.opacity = '0';
		sparkle.style.zIndex = '5';
		sparkle.style.transform = `scale(0.4) rotate(${String(startRotation)}deg)`;
		sparkle.style.filter =
			'drop-shadow(0 0 0 rgba(255, 250, 235, 0)) drop-shadow(0 0 0 rgba(232, 215, 175, 0))';
		sparkle.style.transition =
			'opacity 1.2s ease-in-out, transform 2.6s ease-in-out, filter 1.2s ease-in-out';
		doc.body.append(sparkle);

		win.requestAnimationFrame(() => {
			sparkle.style.opacity = '1';
			sparkle.style.transform = `scale(2) rotate(${String(startRotation + 60)}deg)`;
			sparkle.style.filter =
				'drop-shadow(0 0 5px rgba(255, 250, 235, 1)) drop-shadow(0 0 16px rgba(232, 215, 175, 0.75))';
		});

		win.setTimeout(() => {
			sparkle.style.transition = 'opacity 1.2s ease-in-out, filter 1.2s ease-in-out';
			sparkle.style.opacity = '0';
			sparkle.style.filter =
				'drop-shadow(0 0 0 rgba(255, 250, 235, 0)) drop-shadow(0 0 0 rgba(232, 215, 175, 0))';
			win.setTimeout(() => {
				sparkle.remove();
			}, SPARKLE_FADE_OUT_MS);
		}, SPARKLE_VISIBLE_MS);
	}

	const interval = win.setInterval(addSparkle, SPARKLE_INTERVAL_MS);
	return {
		destroy() {
			win.clearInterval(interval);
		}
	};
}
