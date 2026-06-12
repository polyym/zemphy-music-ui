import { describe, it, expect } from 'vitest';
import { chunk, clampPage, pageCount, pageSlice } from './paginate';

describe('chunk', () => {
	it('returns no pages for an empty list', () => {
		expect(chunk([], 2)).toEqual([]);
	});

	it('splits an exact multiple into equal pages', () => {
		expect(chunk(['a', 'b', 'c', 'd'], 2)).toEqual([
			['a', 'b'],
			['c', 'd']
		]);
	});

	it('puts the remainder on a shorter final page', () => {
		expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
	});

	it('throws on a non-positive page size', () => {
		expect(() => chunk([1], 0)).toThrow(RangeError);
	});
});

describe('pageCount', () => {
	it('never drops below one page, even for zero items', () => {
		expect(pageCount(0, 12)).toBe(1);
	});

	it('rounds up when the final page is partial', () => {
		expect(pageCount(13, 12)).toBe(2);
	});

	it('matches exactly full pages', () => {
		expect(pageCount(24, 12)).toBe(2);
	});
});

describe('clampPage', () => {
	it('clamps below-range pages up to 1', () => {
		expect(clampPage(0, 3)).toBe(1);
		expect(clampPage(-5, 3)).toBe(1);
	});

	it('clamps beyond-range pages down to the last page', () => {
		expect(clampPage(7, 3)).toBe(3);
	});

	it('passes in-range pages through unchanged', () => {
		expect(clampPage(2, 3)).toBe(2);
	});
});

describe('pageSlice', () => {
	const songs = ['a', 'b', 'c', 'd', 'e'];

	it('returns the first page', () => {
		expect(pageSlice(songs, 1, 2)).toEqual(['a', 'b']);
	});

	it('returns a shorter final page', () => {
		expect(pageSlice(songs, 3, 2)).toEqual(['e']);
	});

	it('returns empty past the end of the list', () => {
		expect(pageSlice(songs, 4, 2)).toEqual([]);
	});
});
