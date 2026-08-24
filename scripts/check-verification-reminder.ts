/**
 * verifiedAt 到期前置提醒脚本：在距离 180 天硬阻断只剩 ≤ 170 天时给出软提醒。
 *
 * 两种输出模式：
 *   --format=human（默认）：命令行表格 + 颜色；在 GitHub Actions 环境下同步输出 ::warning 注解
 *   --format=json               ：机器可读 JSON，供 CI workflow 构建 Issue 正文
 *
 * 两种退出码模式：
 *   --exit-zero（默认）：无论是否有提醒，始终退出 0（用于 build job 的 warning-only 步骤）
 *   --exit-code                ：有提醒条目 → 退出 1；无条目 → 0；脚本自身错误 → 2
 *
 * 不引新 npm 包，全部使用 Node 内建 + 现有 TS 数据模块。
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { attractions } from '../src/data/attractions';
import { foods } from '../src/data/foods';
import { routes } from '../src/data/routes';
import { transportHubs } from '../src/data/transport';
import { governmentMarkers } from '../src/components/map/config';
import {
  VERIFICATION_REMINDER_DAYS,
  VERIFICATION_STALE_DAYS,
  daysUntilStale,
  isInReminderWindow,
} from '../src/data/validate';
import { siteDateString } from '../src/lib/site';

export interface ReminderItem {
  category: 'attraction' | 'food' | 'hub' | 'route' | 'government';
  id: string;
  name: string;
  verifiedAt: string;
  daysUntilStale: number;
  file?: string;
}

export interface ReminderResult {
  generatedAt: string;
  staleThresholdDays: number;
  reminderWindowDays: number;
  hasReminders: boolean;
  summary: {
    attractionCount: number;
    foodCount: number;
    hubCount: number;
    routeCount: number;
    governmentCount: number;
    total: number;
  };
  items: ReminderItem[];
}

export type ReminderFormat = 'human' | 'json';
export type ReminderExitMode = 'exit-zero' | 'exit-code';

export const CATEGORY_FILE_HINT: Record<ReminderItem['category'], string> = {
  attraction: 'src/data/attractions.ts',
  food: 'src/data/foods.ts',
  hub: 'src/data/transport.ts',
  route: 'src/data/routes.ts',
  government: 'src/components/map/config.ts',
};

/**
 * 收集进入 170 天提醒窗口的 5 类数据条目；按剩余天数升序（越紧急越靠前）。
 * 参数 referenceToday 用于单元测试注入「虚拟今天」，正常 CLI 不传。
 */
export const collectReminders = (referenceToday = siteDateString()): ReminderResult => {
  const items: ReminderItem[] = [];

  for (const item of attractions) {
    if (item.status !== 'published') continue;
    if (isInReminderWindow(item.verifiedAt, referenceToday)) {
      const remaining = daysUntilStale(item.verifiedAt, referenceToday) ?? -9999;
      items.push({
        category: 'attraction',
        id: item.id,
        name: item.name,
        verifiedAt: item.verifiedAt,
        daysUntilStale: remaining,
        file: CATEGORY_FILE_HINT.attraction,
      });
    }
  }

  for (const item of foods) {
    if (item.status !== 'published') continue;
    if (isInReminderWindow(item.verifiedAt, referenceToday)) {
      const remaining = daysUntilStale(item.verifiedAt, referenceToday) ?? -9999;
      items.push({
        category: 'food',
        id: item.id,
        name: item.name,
        verifiedAt: item.verifiedAt,
        daysUntilStale: remaining,
        file: CATEGORY_FILE_HINT.food,
      });
    }
  }

  for (const hub of transportHubs) {
    if (isInReminderWindow(hub.verifiedAt, referenceToday)) {
      const remaining = daysUntilStale(hub.verifiedAt, referenceToday) ?? -9999;
      items.push({
        category: 'hub',
        id: hub.id,
        name: hub.name,
        verifiedAt: hub.verifiedAt,
        daysUntilStale: remaining,
        file: CATEGORY_FILE_HINT.hub,
      });
    }
  }

  for (const route of routes) {
    if (isInReminderWindow(route.verifiedAt, referenceToday)) {
      const remaining = daysUntilStale(route.verifiedAt, referenceToday) ?? -9999;
      items.push({
        category: 'route',
        id: route.id,
        name: route.name,
        verifiedAt: route.verifiedAt,
        daysUntilStale: remaining,
        file: CATEGORY_FILE_HINT.route,
      });
    }
  }

  for (const marker of governmentMarkers) {
    if (isInReminderWindow(marker.verifiedAt, referenceToday)) {
      const remaining = daysUntilStale(marker.verifiedAt, referenceToday) ?? -9999;
      items.push({
        category: 'government',
        id: marker.id,
        name: marker.name,
        verifiedAt: marker.verifiedAt,
        daysUntilStale: remaining,
        file: CATEGORY_FILE_HINT.government,
      });
    }
  }

  items.sort((a, b) => a.daysUntilStale - b.daysUntilStale);

  const summary = {
    attractionCount: items.filter((item) => item.category === 'attraction').length,
    foodCount: items.filter((item) => item.category === 'food').length,
    hubCount: items.filter((item) => item.category === 'hub').length,
    routeCount: items.filter((item) => item.category === 'route').length,
    governmentCount: items.filter((item) => item.category === 'government').length,
    total: items.length,
  };

  return {
    generatedAt: referenceToday,
    staleThresholdDays: VERIFICATION_STALE_DAYS,
    reminderWindowDays: VERIFICATION_REMINDER_DAYS,
    hasReminders: items.length > 0,
    summary,
    items,
  };
};

const categoryLabel: Record<ReminderItem['category'], string> = {
  attraction: '景点',
  food: '美食',
  hub: '交通枢纽',
  route: '路线',
  government: '政府标记',
};

export const formatHuman = (result: ReminderResult): string => {
  const lines: string[] = [];
  lines.push(`内容核验周期提醒（${result.generatedAt}）`);
  lines.push(`硬阻断阈值：> ${result.staleThresholdDays} 天未复核 ｜ 软提醒窗口：≤ ${result.reminderWindowDays} 天（进入后给出 warning）`);
  lines.push(
    `汇总：景点 ${result.summary.attractionCount}、美食 ${result.summary.foodCount}、交通枢纽 ${result.summary.hubCount}、路线 ${result.summary.routeCount}、政府标记 ${result.summary.governmentCount}；合计 ${result.summary.total} 条进入窗口。\n`,
  );
  if (!result.hasReminders) {
    lines.push('✅ 当前没有条目进入 10 天预警窗口。');
    return lines.join('\n');
  }
  // console.table 在 tsx/Node 下能直接输出，但为了 GitHub Actions `cat` 模式也能读，这里拼 ASCII 小表格字符串。
  const headers = ['类别', 'ID / 名称', 'verifiedAt', '距过期天数', '数据文件'];
  const rows = result.items.map((item) => [
    categoryLabel[item.category],
    `${item.id}\n  ${item.name}`,
    item.verifiedAt,
    item.daysUntilStale < 0 ? `⚠ 已过期 ${-item.daysUntilStale} 天` : String(item.daysUntilStale),
    item.file ?? '-',
  ]);
  const allRows = [headers, ...rows];
  const widths = headers.map((_, i) =>
    Math.max(...allRows.map((row) => Math.max(...row[i].split('\n').map((line) => [...line].length)))),
  );
  const pad = (value: string, width: number) => {
    const printable = [...value].length;
    return value + ' '.repeat(Math.max(0, width - printable));
  };
  const multiLineRow = (row: string[]) => {
    const linesPerCell = row.map((cell) => cell.split('\n'));
    const lineCount = Math.max(...linesPerCell.map((lines) => lines.length));
    const rendered: string[] = [];
    for (let n = 0; n < lineCount; n += 1) {
      const cells = widths.map((w, i) => pad(linesPerCell[i][n] ?? '', w));
      rendered.push(`| ${cells.join(' | ')} |`);
    }
    return rendered.join('\n');
  };
  const separator = `| ${widths.map((w) => '-'.repeat(w)).join(' | ')} |`;
  lines.push(multiLineRow(headers));
  lines.push(separator);
  for (const row of rows) lines.push(multiLineRow(row));
  return lines.join('\n');
};

export const formatGitHubWarnings = (result: ReminderResult): string[] =>
  result.items.map((item) => {
    const daysText = item.daysUntilStale < 0 ? `已过期 ${-item.daysUntilStale} 天` : `还剩 ${item.daysUntilStale} 天`;
    const safeName = item.name.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    return `::warning file=${item.file ?? ''},title=${categoryLabel[item.category]} ${item.id} 到期提醒::verifiedAt(${item.verifiedAt}) ${daysText}，请复核 ${safeName}`;
  });

const parseArgs = (argv: string[]): { format: ReminderFormat; exitMode: ReminderExitMode } => {
  let format: ReminderFormat = 'human';
  let exitMode: ReminderExitMode = 'exit-zero';
  for (const arg of argv) {
    if (arg === '--format=json') format = 'json';
    else if (arg === '--format=human') format = 'human';
    else if (arg === '--exit-code') exitMode = 'exit-code';
    else if (arg === '--exit-zero') exitMode = 'exit-zero';
    else if (arg === '--help' || arg === '-h') {
      console.log(
        [
          '用法：tsx scripts/check-verification-reminder.ts [--format=human|json] [--exit-zero|--exit-code]',
          '',
          '--format=human   命令行表格（默认）；在 GitHub Actions 下同步输出 ::warning 注解',
          '--format=json    机器可读 JSON，写到 stdout',
          '--exit-zero      始终退出 0（默认，warning-only 构建步骤用）',
          '--exit-code      有提醒条目退出 1；无条目退出 0；脚本报错退出 2（CI schedule 用）',
        ].join('\n'),
      );
      process.exit(0);
    }
  }
  return { format, exitMode };
};

// 只在直接运行时执行 CLI；import 本文件时（例如单元测试）不触发副作用。
const wasInvokedDirectly = (): boolean => {
  const argvEntry = process.argv[1];
  if (!argvEntry) return false;
  try {
    const resolvedEntry = path.resolve(argvEntry);
    const thisFile = fileURLToPath(import.meta.url);
    if (resolvedEntry === path.resolve(thisFile)) return true;
    if (argvEntry.startsWith('file:')) {
      const argvFile = fileURLToPath(argvEntry);
      if (path.resolve(argvFile) === path.resolve(thisFile)) return true;
    }
    return false;
  } catch {
    return false;
  }
};

if (wasInvokedDirectly()) {
  try {
    const { format, exitMode } = parseArgs(process.argv.slice(2));
    const result = collectReminders();

    if (format === 'json') {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      console.log(formatHuman(result));
      if (process.env.GITHUB_ACTIONS === 'true') {
        for (const line of formatGitHubWarnings(result)) {
          console.log(line);
        }
      }
    }

    if (exitMode === 'exit-code') {
      process.exit(result.hasReminders ? 1 : 0);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ check-verification-reminder 执行失败：', error instanceof Error ? error.message : error);
    process.exit(2);
  }
}
