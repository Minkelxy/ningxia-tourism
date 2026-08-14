import loaded from 'virtual:journal-content';
export const journalErrors = loaded.errors;
export const journalEntries = loaded.entries;
export const isPublishedJournalEntry = (entry: (typeof journalEntries)[number]) => entry.status === 'published'
  && ((entry.type === 'guide' && entry.contentKind === 'editorial') || (entry.type !== 'guide' && entry.contentKind === 'firsthand'));
export const publishedJournalEntries = journalEntries.filter(isPublishedJournalEntry).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const getJournalEntry = (type?: string, slug?: string) => journalEntries.find((entry) => entry.type === type && entry.slug === slug);
