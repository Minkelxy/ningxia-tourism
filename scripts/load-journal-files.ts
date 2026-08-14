import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadJournalEntries } from '../src/content/journal-parser';

export const loadJournalFiles = () => {
  const directory = resolve(process.cwd(), 'src/content/journal');
  const sources: Record<string, string> = {};
  if (existsSync(directory)) {
    for (const filename of readdirSync(directory).filter((name) => name.endsWith('.md'))) sources[filename] = readFileSync(resolve(directory, filename), 'utf8');
  }
  return loadJournalEntries(sources);
};
