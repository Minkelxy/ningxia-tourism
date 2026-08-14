import { parse } from 'yaml';
import type { EditorialJournal, FoodJournal, JournalContentKind, JournalEntry, JournalReference, JournalType, TravelJournal } from '../types';

export interface JournalParseResult {
  entries: JournalEntry[];
  errors: string[];
}

const splitDocument = (source: string) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error('缺少合法 Frontmatter');
  return { metadata: parse(match[1]) as Record<string, unknown>, body: match[2].trim() };
};

const list = (value: unknown) => Array.isArray(value) ? value.map(String) : [];
const references = (value: unknown): JournalReference[] => Array.isArray(value) ? value.map((item) => {
  const source = item && typeof item === 'object' ? item as Record<string, unknown> : {};
  return { label: String(source.label ?? ''), url: String(source.url ?? ''), checkedAt: String(source.checkedAt ?? '') };
}) : [];

export const parseJournalSource = (source: string, filename = 'unknown.md'): JournalEntry => {
  const { metadata, body } = splitDocument(source);
  const type = metadata.type as JournalType;
  if (metadata.status !== 'published' && metadata.status !== 'draft') throw new Error(`${filename}: status 必须为 published 或 draft`);
  if (metadata.contentKind !== 'firsthand' && metadata.contentKind !== 'editorial' && metadata.contentKind !== 'demo') throw new Error(`${filename}: contentKind 必须为 firsthand、editorial 或 demo`);

  const common = {
    slug: String(metadata.slug ?? ''),
    type,
    status: metadata.status,
    contentKind: metadata.contentKind as JournalContentKind,
    title: String(metadata.title ?? ''),
    excerpt: String(metadata.excerpt ?? ''),
    author: String(metadata.author || (type === 'guide' ? '站点编辑' : '站主手记')),
    publishedAt: String(metadata.publishedAt ?? ''),
    updatedAt: String(metadata.updatedAt ?? ''),
    cityId: String(metadata.cityId ?? '') as JournalEntry['cityId'],
    locality: String(metadata.locality ?? ''),
    tags: list(metadata.tags),
    cover: metadata.cover as JournalEntry['cover'],
    gallery: (metadata.gallery ?? []) as JournalEntry['gallery'],
    relatedAttractionIds: list(metadata.relatedAttractionIds),
    relatedRouteIds: list(metadata.relatedRouteIds),
    body,
  };

  if (!common.slug || !common.title || !common.excerpt || !body) throw new Error(`${filename}: 公共字段不完整`);
  if (type === 'travel') {
    return {
      ...common,
      type,
      tripDate: String(metadata.tripDate ?? ''),
      duration: String(metadata.duration ?? ''),
      transport: String(metadata.transport ?? ''),
      budgetNote: String(metadata.budgetNote ?? ''),
      highlights: list(metadata.highlights),
    } as TravelJournal;
  }
  if (type === 'food') {
    return {
      ...common,
      type,
      visitedAt: String(metadata.visitedAt ?? ''),
      venueName: String(metadata.venueName ?? ''),
      cuisine: String(metadata.cuisine ?? ''),
      address: String(metadata.address ?? ''),
      mapQuery: String(metadata.mapQuery ?? ''),
      pricePerPerson: String(metadata.pricePerPerson ?? ''),
      dishes: list(metadata.dishes),
      queueNote: String(metadata.queueNote ?? ''),
      suitableFor: String(metadata.suitableFor ?? ''),
      revisitNote: String(metadata.revisitNote ?? ''),
    } as FoodJournal;
  }
  if (type === 'guide') {
    return {
      ...common,
      type,
      reviewedAt: String(metadata.reviewedAt ?? ''),
      scopeNote: String(metadata.scopeNote ?? ''),
      keyPoints: list(metadata.keyPoints),
      references: references(metadata.references),
    } as EditorialJournal;
  }
  throw new Error(`${filename}: type 必须为 travel、food 或 guide`);
};

export const loadJournalEntries = (sources: Record<string, string>): JournalParseResult => {
  const entries: JournalEntry[] = [];
  const errors: string[] = [];
  for (const [filename, source] of Object.entries(sources)) {
    try {
      entries.push(parseJournalSource(source, filename));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `${filename}: 无法解析`);
    }
  }
  return { entries, errors };
};
