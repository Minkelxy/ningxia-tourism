import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { loadJournalFiles } from './scripts/load-journal-files';

const journalModuleId = 'virtual:journal-content';
const resolvedJournalModuleId = `\0${journalModuleId}`;

const journalContentPlugin = (): Plugin => ({
  name: 'journal-content',
  resolveId(id) { if (id === journalModuleId) return resolvedJournalModuleId; },
  load(id) { if (id === resolvedJournalModuleId) return `export default ${JSON.stringify(loadJournalFiles())}`; },
  handleHotUpdate(context) {
    const file = context.file.replaceAll('\\', '/');
    if (!file.includes('/src/content/journal/') || !file.endsWith('.md')) return;
    const module = context.server.moduleGraph.getModuleById(resolvedJournalModuleId);
    if (!module) return [];
    context.server.moduleGraph.invalidateModule(module);
    return [module];
  },
});

const base = process.env.GITHUB_ACTIONS 
  ? '/ningxia-tourism/' 
  : process.env.VITE_BASE_URL || '/';

export default defineConfig({
  base,
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    journalContentPlugin(),
    react(),
    tsconfigPaths()
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
