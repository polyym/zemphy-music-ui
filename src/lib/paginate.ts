/**
 * Pure pagination helpers shared by the repertoire songbook and the
 * testimonials carousel. Component-state-free so the arithmetic the UI
 * depends on (page counts, clamping, slicing) is unit-testable in isolation;
 * see `paginate.test.ts`.
 */

/**
 * Splits `items` into consecutive pages of at most `size` items. The final
 * page holds the remainder, so it may be shorter.
 *
 * @param items - The full list to paginate
 * @param size - Items per page; must be a positive integer
 */
export function chunk<T>(items: readonly T[], size: number): T[][] {
	if (size < 1) throw new RangeError(`chunk size must be >= 1, got ${String(size)}`);
	const result: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		result.push(items.slice(i, i + size));
	}
	return result;
}

/**
 * Number of pages `total` items occupy at `perPage` items per page. Never
 * less than 1, so "Page 1 of 1" stays renderable while a list is empty.
 */
export function pageCount(total: number, perPage: number): number {
	return Math.max(1, Math.ceil(total / perPage));
}

/**
 * Clamps a 1-based page number into the valid `[1, totalPages]` range.
 */
export function clampPage(page: number, totalPages: number): number {
	return Math.max(1, Math.min(totalPages, page));
}

/**
 * Returns the items visible on 1-based `page` at `perPage` items per page.
 * Pages past the end of the list come back empty rather than throwing.
 */
export function pageSlice<T>(items: readonly T[], page: number, perPage: number): T[] {
	return items.slice((page - 1) * perPage, page * perPage);
}
