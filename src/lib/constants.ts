export const SITE_URL = 'https://zemphy.music';

// Sparkle spawner timing. The visible window has to comfortably exceed
// SPARKLE_FADE_OUT_MS so the fade animation completes before the node is
// removed from the DOM.
export const SPARKLE_INTERVAL_MS = 1500;
export const SPARKLE_VISIBLE_MS = 2100;
export const SPARKLE_FADE_OUT_MS = 1200;
export const SPARKLE_TEXT_RETRY_LIMIT = 8;
export const SPARKLE_MIN_SIZE_PX = 14;
export const SPARKLE_SIZE_VARIANCE_PX = 8;

// Repertoire UI: the design's two-column-of-six layout takes 12 songs per
// page. Editors can publish more than this in Sanity; the home page slices
// the full list into pages of this size and shows prev/next controls.
export const SONGS_PER_PAGE = 12;

// Testimonials UI: the design pairs two cards side-by-side per page and the
// home page paginates by scroll-snap. Editors can publish more than this in
// Sanity; pages of this size are arranged as horizontal scroll snap points
// with subtle clickable dots below for affordance.
export const TESTIMONIALS_PER_PAGE = 2;

// GitHub repo for this project. Linked from the footer's "by polyym" credit.
// The repo is public; update this constant if the repo is moved or renamed.
export const POLYYM_GITHUB_URL = 'https://github.com/polyym/zemphy-music-ui';
