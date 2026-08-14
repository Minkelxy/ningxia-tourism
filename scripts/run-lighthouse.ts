import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const host = 'http://127.0.0.1:4174';
const basePath = process.env.GITHUB_ACTIONS ? '/ningxia-tourism/' : '/';
const urls = [`${host}${basePath}`, `${host}${basePath}journal`];
const thresholds = { performance: 0.9, accessibility: 0.95, 'best-practices': 0.9, seo: 0.9 } as const;
const preview = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '4174'], { stdio: 'pipe' });

const waitForServer = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { if ((await fetch(urls[0])).ok) return; } catch { /* preview is still starting */ }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error('预览服务未能在 10 秒内启动');
};

let chrome: Awaited<ReturnType<typeof launch>> | undefined;
try {
  await waitForServer();
  chrome = await launch({ chromePath: chromium.executablePath(), port: 9223, chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
  mkdirSync(resolve('.lighthouseci'), { recursive: true });
  for (const [index, url] of urls.entries()) {
    const result = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', formFactor: 'mobile', screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false } });
    if (!result) throw new Error(`Lighthouse 未返回结果: ${url}`);
    writeFileSync(resolve('.lighthouseci', `report-${index + 1}.json`), result.report, 'utf8');
    const scores = Object.fromEntries(Object.keys(thresholds).map((key) => [key, result.lhr.categories[key]?.score ?? 0]));
    console.log(`${url}: ${Object.entries(scores).map(([key, score]) => `${key} ${Math.round(score * 100)}`).join(' / ')}`);
    const failures = Object.entries(thresholds).filter(([key, minimum]) => (scores[key] ?? 0) < minimum);
    if (failures.length) throw new Error(`${url}: ${failures.map(([key, minimum]) => `${key} 低于 ${Math.round(minimum * 100)}`).join('，')}`);
  }
} finally {
  await chrome?.kill();
  preview.kill();
}
