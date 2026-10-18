/**
 * Shared types for the theme's configuration and data files.
 *
 * Long-form content (projects, services and the dormant journal template) is typed by the
 * content collection schemas in `src/content.config.ts` instead — use
 * `CollectionEntry<'projects'>` and friends for those.
 */

/** Keys of the icons defined in `src/components/icons/IconSprite.astro`. */
export type IconName =
  | 'arrow'
  | 'asterisk'
  | 'behance'
  | 'chart'
  | 'check'
  | 'close'
  | 'code'
  | 'device'
  | 'dribbble'
  | 'facebook'
  | 'flag'
  | 'github'
  | 'grid'
  | 'handshake'
  | 'instagram'
  | 'layers'
  | 'linkedin'
  | 'logo'
  | 'mail'
  | 'menu'
  | 'motion'
  | 'pen'
  | 'phone'
  | 'pin'
  | 'plus'
  | 'spark'
  | 'type'
  | 'up';

export interface NavItem {
  /** Visible link text. */
  label: string;
  /** Absolute, site-relative path (keep the trailing slash). */
  href: string;
  /** Optional same-page anchor used on the homepage only. */
  anchor?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
}

export interface SiteConfig {
  /** Short brand name used in `<title>` and metadata. */
  name: string;
  /** Full name of the person the portfolio belongs to. */
  author: string;
  /** Role line shown under the hero and used in structured data. */
  role: string;
  /** Default `<title>` for the homepage. */
  title: string;
  /** Default meta description. */
  description: string;
  /** Canonical origin. Sourced from `site` in `astro.config.mjs`. */
  url: string;
  /** Default Open Graph image, relative to the site root. */
  ogImage: string;
  /** BCP-47 language tag used on `<html lang>`. */
  locale: string;
  /** `theme-color` meta value. */
  themeColor: string;
  contact: {
    email: string;
    phone: string;
    /** Machine-readable phone for `tel:` links. */
    phoneHref: string;
    location: string;
    /** Short availability line shown on the hero card and CTA. */
    availability: string;
    /** Public Web3Forms access key; an empty value keeps the form disabled. */
    web3FormsAccessKey: string;
  };
  social: SocialLink[];
  /** Footer blurb. */
  about: string;
  /** Legal owner shown in the footer copyright line. */
  copyrightHolder: string;
}

export interface Client {
  name: string;
  logo: string;
}

export interface Stat {
  /** Short heading shown above the supporting text in the approach cards. */
  value: string;
  label: string;
}

export interface ToolkitItem {
  icon: IconName | 'database-search' | 'workflow' | 'server-cog';
  title: string;
  detail: string;
}
