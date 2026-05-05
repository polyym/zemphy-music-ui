/**
 * Shape of an image field as it lands in a GROQ result. Compatible with the
 * `imageUrl()` builder's input. Internal — consumers reach this type via
 * `AboutSection.portraitImage` or `Testimonial.avatarImage`.
 */
interface SanityImage {
	_type: 'image';
	asset: { _ref: string; _type: 'reference' };
	hotspot?: { x: number; y: number; height: number; width: number };
	crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SideNavLabels {
	about?: string;
	services?: string;
	repertoire?: string;
	testimonials?: string;
	booking?: string;
}

export interface SiteSettings {
	logoName?: string;
	navCtaLabel?: string;
	sideNavLabels?: SideNavLabels;
	instagramUrl?: string;
	youtubeUrl?: string;
	bookingEmail?: string;
	locationLine1?: string;
	locationLine2?: string;
	footerTagline?: string;
	keywords?: string[];
}

export interface HeroSection {
	kicker?: string;
	displayName?: string;
	tagline?: string;
	primaryCtaLabel?: string;
	secondaryCtaLabel?: string;
}

export interface AboutSection {
	eyebrowLabel?: string;
	heading?: string;
	body?: string;
	portraitImage?: SanityImage;
	signature?: string;
	badgeLine1?: string;
	badgeLine2?: string;
	badgeEstablished?: string;
}

export interface ServicesSection {
	eyebrowLabel?: string;
	heading?: string;
}

export interface RepertoireSection {
	eyebrowLabel?: string;
	heading?: string;
	intro?: string;
}

export interface TestimonialsSection {
	eyebrowLabel?: string;
	heading?: string;
}

export interface BookingSection {
	eyebrowLabel?: string;
	heading?: string;
	body?: string;
	primaryCtaLabel?: string;
	contactInfoPrefix?: string;
	contactInfoSuffix?: string;
}

type ServiceIcon = 'rings' | 'star' | 'sparkles' | 'microphone' | 'glass' | 'note';

export interface Service {
	_id: string;
	title: string;
	description: string;
	keywords: string[];
	icon: ServiceIcon;
	order: number;
}

export interface Song {
	_id: string;
	title: string;
	artist: string;
	year: number;
	chillLink?: string;
	energyLink?: string;
	order: number;
}

export interface Testimonial {
	_id: string;
	quote: string;
	name: string;
	keywords: string[];
	avatarImage?: SanityImage;
	order: number;
}

/**
 * Aggregate of every CMS document the home page renders. Returned by the
 * page-level load function in `src/routes/+page.ts`. Named `HomeContent`
 * (not `PageData`) to avoid confusion with SvelteKit's auto-generated
 * `./$types` `PageData` typing.
 *
 * Singleton fields are optional: when a singleton document hasn't been
 * created in Sanity yet, the GROQ query returns nothing and the
 * corresponding section component renders nothing.
 */
export interface HomeContent {
	siteSettings?: SiteSettings;
	heroSection?: HeroSection;
	aboutSection?: AboutSection;
	servicesSection?: ServicesSection;
	repertoireSection?: RepertoireSection;
	testimonialsSection?: TestimonialsSection;
	bookingSection?: BookingSection;
	services: Service[];
	songs: Song[];
	testimonials: Testimonial[];
}

export const EMPTY_HOME_CONTENT: HomeContent = {
	services: [],
	songs: [],
	testimonials: []
};
