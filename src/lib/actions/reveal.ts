/**
 * Adds the `visible` class to the host element the first time it intersects
 * the viewport, then stops observing. Pair with the `.reveal` / `.reveal.visible`
 * pair in `app.css` for the fade-up effect on each section.
 *
 * @param node - The element whose visibility should trigger the class toggle
 */
export function reveal(node: HTMLElement) {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					observer.unobserve(entry.target);
				}
			}
		},
		{ threshold: 0.12 }
	);
	observer.observe(node);
	return {
		destroy() {
			observer.disconnect();
		}
	};
}
