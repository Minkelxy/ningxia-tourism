import { spawn } from 'node:child_process';
import { describe, expect, it, vi } from 'vitest';
import {
  CATEGORY_FILE_HINT,
  ReminderResult,
  collectReminders,
  formatGitHubWarnings,
  formatHuman,
} from '../../scripts/check-verification-reminder';

/**
 * 调用 CLI 子进程，返回 stdout/stderr/exitCode。
 * 不用 execa（devDependencies 里没装）；避免加新包，直接 node:child_process.spawn。
 */
const runCli = (args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number | null }> =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'scripts/check-verification-reminder.ts', ...args], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('close', (exitCode) => {
      resolve({ stdout, stderr, exitCode });
    });
    child.on('error', () => {
      resolve({ stdout, stderr, exitCode: null });
    });
  });

describe('check-verification-reminder 纯函数逻辑', () => {
  it('today 基准下：当前数据 08-12 的景点正好距 180 天剩 168 天，进入窗口；按剩余天数升序排列', () => {
    // 固定基准日，避免测试随运行环境的自然日漂移。
    const today = '2026-08-24';
    const result = collectReminders(today);
    expect(result.generatedAt).toBe(today);
    expect(result.staleThresholdDays).toBe(180);
    expect(result.reminderWindowDays).toBe(170);

    // 2026-08-24 距 2026-08-12 = 12 天，180 - 12 = 168 天，进入 170 窗口
    const aug12 = result.items.filter((item) => item.verifiedAt === '2026-08-12');
    expect(aug12.length).toBeGreaterThan(0);
    for (const item of aug12) {
      expect(item.daysUntilStale).toBe(168);
      expect(item.file).toBe(CATEGORY_FILE_HINT[item.category]);
    }

    // 剩余天数严格升序
    for (let i = 1; i < result.items.length; i += 1) {
      expect(result.items[i - 1].daysUntilStale).toBeLessThanOrEqual(result.items[i].daysUntilStale);
    }
  });

  it('referenceToday = 2026-08-20：08-12 距今天仅 8 天 → 剩 172 天，未进入窗口；总体无提醒', () => {
    const result = collectReminders('2026-08-20');
    expect(result.hasReminders).toBe(false);
    expect(result.summary.total).toBe(0);
    // 所有来源日期都在 08-12 之后几天，所以总体应该空
    expect(result.items).toEqual([]);
  });

  it('referenceToday = 2027-02-11：距 08-15 整整 180 天（剩 0）；08-12 剩 -3 天（过期仍需要提醒）', () => {
    const result = collectReminders('2027-02-11');
    expect(result.hasReminders).toBe(true);
    const aug12 = result.items.filter((i) => i.verifiedAt === '2026-08-12');
    const aug15 = result.items.filter((i) => i.verifiedAt === '2026-08-15');
    expect(aug12.length).toBeGreaterThan(0);
    expect(aug15.length).toBeGreaterThan(0);
    for (const item of aug12) expect(item.daysUntilStale).toBe(-3);
    for (const item of aug15) expect(item.daysUntilStale).toBe(0);
  });

  it('formatHuman：空结果含 ✅ 提示；有结果含「合计 N 条」和每个条目的名称 / 天数 / 文件', () => {
    const empty: ReminderResult = {
      generatedAt: '2026-08-20',
      staleThresholdDays: 180,
      reminderWindowDays: 170,
      hasReminders: false,
      summary: { attractionCount: 0, foodCount: 0, hubCount: 0, routeCount: 0, governmentCount: 0, total: 0 },
      items: [],
    };
    const emptyText = formatHuman(empty);
    expect(emptyText).toContain('✅ 当前没有条目进入 10 天预警窗口。');
    expect(emptyText).toContain('合计 0 条进入窗口');

    const withOne: ReminderResult = {
      generatedAt: '2026-08-24',
      staleThresholdDays: 180,
      reminderWindowDays: 170,
      hasReminders: true,
      summary: { attractionCount: 1, foodCount: 0, hubCount: 0, routeCount: 0, governmentCount: 0, total: 1 },
      items: [
        {
          category: 'attraction' as const,
          id: 'xixiawangling',
          name: '西夏陵',
          verifiedAt: '2026-08-12',
          daysUntilStale: 168,
          file: CATEGORY_FILE_HINT.attraction,
        },
      ],
    };
    const withText = formatHuman(withOne);
    expect(withText).toContain('合计 1 条进入窗口');
    expect(withText).toContain('西夏陵');
    expect(withText).toContain('168');
    expect(withText).toContain('src/data/attractions.ts');
  });

  it('formatGitHubWarnings：已过期条目写「已过期 N 天」；未过期条目写「还剩 N 天」', () => {
    const expired = {
      generatedAt: '2027-02-14',
      staleThresholdDays: 180,
      reminderWindowDays: 170,
      hasReminders: true,
      summary: { attractionCount: 1, foodCount: 0, hubCount: 0, routeCount: 0, governmentCount: 0, total: 1 },
      items: [
        {
          category: 'attraction' as const,
          id: 'shapotou',
          name: '沙坡头旅游景区',
          verifiedAt: '2026-08-12',
          daysUntilStale: -3,
          file: 'src/data/attractions.ts',
        },
      ],
    };
    const w1 = formatGitHubWarnings(expired as never);
    expect(w1).toHaveLength(1);
    expect(w1[0]).toContain('::warning file=src/data/attractions.ts');
    expect(w1[0]).toContain('title=景点 shapotou');
    expect(w1[0]).toContain('已过期 3 天');

    const upcoming = {
      ...expired,
      items: [{ ...expired.items[0], daysUntilStale: 7 }],
    };
    const w2 = formatGitHubWarnings(upcoming as never);
    expect(w2[0]).toContain('还剩 7 天');
  });
});

describe('check-verification-reminder CLI 退出码行为', () => {
  it('--exit-zero（默认）：当前 3 条提醒，脚本仍退出 0', async () => {
    const r = await runCli(['--format=json', '--exit-zero']);
    expect(r.exitCode).toBe(0);
    const parsed = JSON.parse(r.stdout);
    expect(parsed.hasReminders).toBe(true);
    expect(parsed.summary.total).toBeGreaterThan(0);
  }, 60_000);

  it('--exit-code：当前有提醒退出 1；手动把 referenceToday 推到 08-20 证明纯函数会返回无提醒（=退出 0 情况）', async () => {
    const r = await runCli(['--format=json', '--exit-code']);
    expect(r.exitCode).toBe(1);
    const parsed = JSON.parse(r.stdout);
    expect(parsed.summary.total).toBeGreaterThan(0);

    // 子进程不方便篡改 siteDateString，这里只断言「纯函数无提醒场景等价于退出 0」
    vi.resetModules();
    const { collectReminders: collect } = await import('../../scripts/check-verification-reminder');
    expect(collect('2026-08-20').hasReminders).toBe(false);
  }, 60_000);

  it('--help：打印用法并不报错', async () => {
    const r = await runCli(['--help']);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain('--format=json');
    expect(r.stdout).toContain('--exit-code');
    expect(r.stdout).toContain('warning-only 构建步骤用');
  }, 60_000);
});
