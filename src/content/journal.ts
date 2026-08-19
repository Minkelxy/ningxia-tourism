import loaded from 'virtual:journal-content';
export const journalErrors = loaded.errors;
export const journalEntries = loaded.entries;
export const isPublishedJournalEntry = (entry: (typeof journalEntries)[number]) => entry.status === 'published'
  && ((entry.type === 'guide' && entry.contentKind === 'editorial') || (entry.type !== 'guide' && entry.contentKind === 'firsthand'));
export const publishedJournalEntries = journalEntries.filter(isPublishedJournalEntry).sort((a, b) => Number(b.featured) - Number(a.featured)
  || b.updatedAt.localeCompare(a.updatedAt)
  || b.publishedAt.localeCompare(a.publishedAt)
  || a.title.localeCompare(b.title, 'zh-CN'));
const journalEntriesByKey = new Map(journalEntries.map((entry) => [`${entry.type}:${entry.slug}`, entry]));
export const getJournalEntry = (type?: string, slug?: string) => type && slug ? journalEntriesByKey.get(`${type}:${slug}`) : undefined;
