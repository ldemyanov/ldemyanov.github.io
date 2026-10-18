import type { SiteConfig } from '~/types';

/**
 * Structured data builders.
 *
 * Everything here is derived from `src/config/site.ts` and the page's own
 * content — nothing is invented. Drop a builder if you do not want the
 * corresponding schema.org type emitted.
 */

type Json = Record<string, unknown>;

export function personSchema(site: SiteConfig): Json {
  return {
    '@type': 'Person',
    '@id': `${site.url}/#person`,
    name: site.author,
    jobTitle: site.role,
    url: `${site.url}/`,
    email: `mailto:${site.contact.email}`,
    sameAs: site.social.map((s) => s.href),
  };
}

export function websiteSchema(site: SiteConfig): Json {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    description: site.description,
    inLanguage: site.locale,
    publisher: { '@id': `${site.url}/#person` },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Wraps one or more schema objects in a single `@graph` document. */
export function graph(nodes: Json[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
