export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const pages = [
  "home",
  "academic",
  "technical",
  "research",
  "publications",
  "projects",
  "contact",
  "cv",
  "credits",
] as const;
export type PageKey = (typeof pages)[number];
export type CollectionName = "research" | "software" | "publications";

export function pagePath(page: PageKey, locale: Locale): string {
  return `${locale === "zh" ? "/zh" : ""}/${page === "home" ? "" : `${page}/`}`;
}

export function collectionPage(collection: CollectionName): PageKey {
  return collection === "software" ? "projects" : collection;
}

export function entryPath(
  collection: CollectionName,
  slug: string,
  locale: Locale,
): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error(`Invalid slug: ${slug}`);
  return `${pagePath(collectionPage(collection), locale)}${slug}/`;
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === "en" ? "zh" : "en";
}
