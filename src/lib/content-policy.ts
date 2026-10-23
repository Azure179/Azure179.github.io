export interface PublicationFlags {
  draft: boolean;
  verified: boolean;
  visibility: "public" | "private";
}

export function isPublishable(data: PublicationFlags): boolean {
  return !data.draft && data.verified && data.visibility === "public";
}

export interface LocalizedRecord {
  data: {
    locale: "en" | "zh";
    translationKey: string;
    archiveId: string;
    slug: string;
    revision: string;
    sourceRevision?: string;
  } & PublicationFlags;
}

/** Prefer a real translation; expose the English record if none exists. */
export function localizedRecords<T extends LocalizedRecord>(
  entries: T[],
  locale: "en" | "zh",
): T[] {
  const published = entries.filter((entry) => isPublishable(entry.data));
  const groups = new Map<string, T[]>();
  for (const entry of published) {
    const group = groups.get(entry.data.translationKey) ?? [];
    group.push(entry);
    groups.set(entry.data.translationKey, group);
  }
  return [...groups.values()].flatMap((group) => {
    const selected =
      group.find((entry) => entry.data.locale === locale) ??
      group.find((entry) => entry.data.locale === "en");
    return selected ? [selected] : [];
  });
}

export function validateRecords(entries: LocalizedRecord[]): void {
  const identities = new Set<string>();
  const routes = new Set<string>();
  const archiveOwners = new Map<string, string>();
  for (const { data } of entries) {
    const key = `${data.translationKey}:${data.locale}`;
    const route = `${data.locale}:${data.slug}`;
    if (identities.has(key) || routes.has(route))
      throw new Error(`Duplicate content identity or route: ${key}`);
    if (data.slug === "template")
      throw new Error(
        "The slug 'template' is reserved for the layout preview.",
      );
    identities.add(key);
    routes.add(route);
    const owner = archiveOwners.get(data.archiveId);
    if (owner && owner !== data.translationKey)
      throw new Error(`Duplicate archive ID: ${data.archiveId}`);
    archiveOwners.set(data.archiveId, data.translationKey);
    const counterpart = entries.find(
      (entry) =>
        entry.data.translationKey === data.translationKey &&
        entry.data.locale !== data.locale,
    );
    if (
      counterpart &&
      (counterpart.data.slug !== data.slug ||
        counterpart.data.archiveId !== data.archiveId)
    ) {
      throw new Error(`Translation identity mismatch: ${data.translationKey}`);
    }
    if (isPublishable(data) && data.locale === "zh") {
      const english = entries.find(
        (entry) =>
          entry.data.translationKey === data.translationKey &&
          entry.data.locale === "en",
      );
      if (
        !english ||
        !isPublishable(english.data) ||
        data.sourceRevision !== english.data.revision
      ) {
        throw new Error(
          `Missing English original or stale translation: ${data.translationKey}`,
        );
      }
    }
  }
}
