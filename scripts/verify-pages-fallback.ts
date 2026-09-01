import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const fallbackPath = resolve('dist/404.html');
const indexPath = resolve('dist/index.html');

if (!existsSync(fallbackPath)) {
  throw new Error('dist/404.html 不存在，GitHub Pages 深层链接回退产物缺失。');
}

if (!existsSync(indexPath)) {
  throw new Error('dist/index.html 不存在，无法确认 SPA 路由接管逻辑。');
}

const fallback = readFileSync(fallbackPath, 'utf8');
const index = readFileSync(indexPath, 'utf8');
const requiredFallbackTokens = [
  'window.location.replace',
  'window.location.pathname',
  '/ningxia-tourism/',
];

for (const token of requiredFallbackTokens) {
  if (!fallback.includes(token)) {
    throw new Error(`dist/404.html 缺少深层链接回退逻辑：${token}`);
  }
}

if (!index.includes('window.history.replaceState')) {
  throw new Error('dist/index.html 缺少回退地址恢复逻辑。');
}

console.log('GitHub Pages 深层链接回退产物校验通过。');
