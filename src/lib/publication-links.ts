interface PublicationRecord {
  collection: string;
  data: { translationKey: string; locale: string };
}

// Resolve logical IDs, never paths to a private or draft content file.
export function resolvePublications<T extends PublicationRecord>(
  entries: T[],
  ids: string[],
  locale: string,
): T[] {
  if (ids.length !== new Set(ids).size)
    throw new Error("Duplicate publication reference");
  return ids.map((id) => {
    const matches = entries.filter(
      (entry) =>
        entry.collection === "publications" && entry.data.translationKey === id,
    );
    const entry =
      matches.find((item) => item.data.locale === locale) ??
      matches.find((item) => item.data.locale === "en");
    if (!entry) throw new Error(`Missing public publication: ${id}`);
    return entry;
  });
}
