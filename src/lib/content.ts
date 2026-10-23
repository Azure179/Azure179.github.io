import { getCollection, type CollectionEntry } from "astro:content";
import {
  isPublishable,
  localizedRecords,
  validateRecords,
} from "./content-policy";
import type { CollectionName, Locale } from "./routes";
import { resolvePublications } from "./publication-links";

export type ArchiveEntry = CollectionEntry<CollectionName>;

export async function allPublished(): Promise<ArchiveEntry[]> {
  const groups = await Promise.all([
    getCollection("research"),
    getCollection("software"),
    getCollection("publications"),
  ]);
  groups.forEach(validateRecords);
  const all = groups.flat();
  const owners = new Map<string, string>();
  for (const entry of all) {
    const owner = `${entry.collection}:${entry.data.translationKey}`;
    const existing = owners.get(entry.data.archiveId);
    if (existing && existing !== owner)
      throw new Error(`Global archive ID collision: ${entry.data.archiveId}`);
    owners.set(entry.data.archiveId, owner);
  }
  const published = all.filter((entry) => isPublishable(entry.data));
  for (const entry of published) {
    if (entry.collection === "research" && entry.data.study) {
      resolvePublications(
        published,
        entry.data.study.publicationIds,
        entry.data.locale,
      );
    }
    if (/\[TODO|DRAFT_ONLY_SENTINEL/i.test(entry.body ?? "")) {
      throw new Error(`Unfinished body cannot be published: ${entry.id}`);
    }
  }
  return published;
}

export async function entriesFor(collection: CollectionName, locale: Locale) {
  const entries = (await allPublished()).filter(
    (entry) => entry.collection === collection,
  );
  return localizedRecords(entries, locale);
}
