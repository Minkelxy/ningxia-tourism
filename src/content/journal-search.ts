import type { JournalEntry } from '../types';

export interface JournalFilters {
  q: string;
  city: string;
  tag: string;
}

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('zh-CN').replace(/\s+/g, ' ').trim();

const searchableText = (entry: JournalEntry) => {
  const common = [entry.title, entry.excerpt, entry.author, entry.locality, ...entry.tags];
  if (entry.type === 'guide') common.push(entry.scopeNote, ...entry.keyPoints);
  if (entry.type === 'travel') common.push(entry.duration, entry.transport, entry.budgetNote, ...entry.highlights);
  if (entry.type === 'food') common.push(entry.venueName, entry.cuisine, entry.address, ...entry.dishes);
  return normalize(common.join(' '));
};

export const filterJournalEntries = (entries: JournalEntry[], filters: JournalFilters) => {
  const query = normalize(filters.q);
  return entries.filter((entry) => {
    if (filters.city !== 'all' && entry.cityId !== filters.city) return false;
    if (filters.tag !== 'all' && !entry.tags.includes(filters.tag)) return false;
    return !query || searchableText(entry).includes(query);
  });
};
