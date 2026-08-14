/// <reference types="vite/client" />

declare module 'virtual:journal-content' {
  const content: {
    entries: import('./types').JournalEntry[];
    errors: string[];
  };
  export default content;
}
