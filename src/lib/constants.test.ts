import { describe, it, expect } from 'vitest';
import {
	SITE_URL,
	SPARKLE_FADE_OUT_MS,
	SPARKLE_VISIBLE_MS,
	SONGS_PER_PAGE,
	TESTIMONIALS_PER_PAGE,
	POLYYM_GITHUB_URL,
	OG_IMAGE_WIDTH_PX,
	OG_IMAGE_HEIGHT_PX
} from './constants';

describe('constants', () => {
	it('SITE_URL is the canonical zemphy.music origin', () => {
		expect(SITE_URL).toBe('https://zemphy.music');
	});

	it('SITE_URL has no trailing slash so paths can be appended directly', () => {
		expect(SITE_URL.endsWith('/')).toBe(false);
	});

	it('sparkle visible window outlives the fade-out so removal is invisible', () => {
		expect(SPARKLE_VISIBLE_MS).toBeGreaterThan(SPARKLE_FADE_OUT_MS);
	});

	it('songs per page matches the design layout (12 = 2 columns of 6)', () => {
		expect(SONGS_PER_PAGE).toBe(12);
	});

	it('testimonials per page matches the design layout (two cards side-by-side)', () => {
		expect(TESTIMONIALS_PER_PAGE).toBe(2);
	});

	it('POLYYM_GITHUB_URL is an https github.com URL', () => {
		expect(POLYYM_GITHUB_URL).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+$/);
	});

	it('OG image dimensions match the social-card 1.91:1 aspect target', () => {
		const ratio = OG_IMAGE_WIDTH_PX / OG_IMAGE_HEIGHT_PX;
		// 1200/630 = 1.9047... — the canonical Open Graph dimensions, just
		// inside the 1.9-1.92 band that Twitter/X and Facebook accept for
		// summary_large_image without falling back to a basic summary card.
		expect(ratio).toBeGreaterThan(1.9);
		expect(ratio).toBeLessThan(1.92);
	});
});
