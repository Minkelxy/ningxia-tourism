import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const host = 'http://127.0.0.1:4174';
const builtHtml = readFileSync(resolve('dist/index.html'), 'utf8');
const basePath = builtHtml.match(/(?:src|href)="([^"]*\/)assets\//)?.[1] ?? '/';
const urls = [`${host}${basePath}`, `${host}${basePath}attractions`, `${host}${basePath}journal`, `${host}${basePath}guide`];
const thresholds = { performance: 0.9, accessibility: 0.95, 'best-practices': 0.9, seo: 0.9 } as const;
const preview = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '4174', '--base', basePath], { stdio: 'pipe' });
const auditOptions = { port: 0, output: 'json' as const, logLevel: 'error' as const, formFactor: 'mobile' as const, screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false } };

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
  auditOptions.port = chrome.port;
  mkdirSync(resolve('.lighthouseci'), { recursive: true });
  for (const [index, url] of urls.entries()) {
    let result: Awaited<ReturnType<typeof lighthouse>> | undefined;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      result = await lighthouse(url, auditOptions);
      if (result?.lhr.runtimeError?.code !== 'NO_FCP' || attempt === 2) break;
      console.warn(`${url}: 首次审计未绘制页面，正在重试`);
      await new Promise((resolveWait) => setTimeout(resolveWait, 600));
    }
    if (!result) throw new Error(`Lighthouse 未返回结果: ${url}`);
    if (result.lhr.runtimeError) throw new Error(`${url}: Lighthouse 运行失败（${result.lhr.runtimeError.code}）${result.lhr.runtimeError.message}`);
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
