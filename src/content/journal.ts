import loaded from 'virtual:journal-content';
export const journalErrors = loaded.errors;
export const journalEntries = loaded.entries;
export const publishedJournalEntries = journalEntries.filter((entry) => entry.status === 'published' && entry.contentKind === 'firsthand').sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const getJournalEntry = (type?: string, slug?: string) => journalEntries.find((entry) => entry.type === type && entry.slug === slug);
