import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './client';

const builder = createImageUrlBuilder(sanityClient);

type SanityImageSource = Parameters<typeof builder.image>[0];
type ImageUrlBuilder = ReturnType<typeof builder.image>;

/**
 * Build a Sanity CDN URL for an image source. The returned builder is chainable
 * so callers can add transforms before calling `.url()`:
 *
 *   imageUrl(portrait).width(800).height(1000).fit('crop').url()
 *
 * @param source - The Sanity image asset, hotspot reference, or asset reference
 * @returns A chainable image URL builder
 */
export function imageUrl(source: SanityImageSource): ImageUrlBuilder {
	return builder.image(source);
}
