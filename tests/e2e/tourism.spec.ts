import { expect, test } from '@playwright/test';

const appBase = process.env.VITE_BASE_URL ?? '/';

test('首页、景点筛选与详情可以连续浏览', async ({ page }) => {
  await page.goto(appBase);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('宁夏');
  await expect(page.getByText('2 个严格核实 · 9 个待复核')).toBeVisible();

  await page.getByRole('link', { name: '精选景点' }).first().click();
  await page.getByPlaceholder('搜索景点、城市或亮点').fill('沙坡头');
  await expect(page.getByRole('heading', { name: '沙坡头' })).toBeVisible();
  await page.getByRole('heading', { name: '沙坡头' }).getByRole('link').click();
  await expect(page.getByRole('heading', { level: 1, name: '沙坡头' })).toBeVisible();
  await expect(page.getByRole('link', { name: /高德查看/ })).toHaveAttribute('href', /coordinate=wgs84/);
});

test('城市详情和路线详情可直接访问', async ({ page }) => {
  await page.goto(`${appBase}city/yinchuan`);
  await expect(page.getByRole('heading', { level: 1, name: '银川市' })).toBeVisible();
  await expect(page.getByText(/个公开景点/).first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/ningxia-tourism\/city\/yinchuan$|\/city\/yinchuan$/);

  await page.goto(`${appBase}routes/classic-3day`);
  await expect(page.getByRole('heading', { level: 1, name: '经典三日全景游' })).toBeVisible();
  await expect(page.getByRole('button', { name: /打印行程/ })).toBeVisible();
  await expect(page.locator('.route-day')).toHaveCount(3);
});

test('旅行手记双栏目、键盘切换和未知详情可恢复', async ({ page }) => {
  await page.goto(`${appBase}journal`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('地图之外');
  await expect(page.getByRole('tab', { name: '个人游记' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('第一篇游记正在路上')).toBeVisible();

  await page.getByRole('tab', { name: '个人游记' }).press('ArrowRight');
  await expect(page).toHaveURL(/type=food/);
  await expect(page.getByRole('tab', { name: '探店记录' })).toBeFocused();
  await expect(page.getByText('第一份探店记录还没上桌')).toBeVisible();

  await page.goto(`${appBase}journal/travel/not-published`);
  await expect(page.getByRole('heading', { name: '这篇手记还没有公开' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
});
