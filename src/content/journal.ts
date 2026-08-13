import { loadJournalEntries } from './journal-parser';

const modules = import.meta.glob('./journal/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const loaded = loadJournalEntries(modules);
export const journalErrors = loaded.errors;
export const journalEntries = loaded.entries;
export const publishedJournalEntries = journalEntries.filter((entry) => entry.status === 'published').sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const getJournalEntry = (type?: string, slug?: string) => journalEntries.find((entry) => entry.type === type && entry.slug === slug);
