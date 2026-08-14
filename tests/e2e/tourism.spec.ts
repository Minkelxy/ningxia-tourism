import { expect, test } from '@playwright/test';

const appBase = process.env.VITE_BASE_URL ?? '/';

test('首页、景点筛选与详情可以连续浏览', async ({ page }) => {
  await page.goto(appBase);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('宁夏');
  await expect(page.getByText('7 个已核实 · 4 个待复核')).toBeVisible();

  await page.getByRole('link', { name: '精选景点' }).first().click();
  await page.getByPlaceholder('搜索景点、城市或亮点').fill('沙坡头');
  await expect(page.getByRole('heading', { name: '沙坡头' })).toBeVisible();
  await page.getByRole('heading', { name: '沙坡头' }).getByRole('link').click();
  await expect(page.getByRole('heading', { level: 1, name: '沙坡头' })).toBeVisible();
  await expect(page.getByRole('link', { name: /高德查看/ })).toHaveAttribute('href', /coordinate=wgs84/);
  await expect(page.getByText('近期核验')).toBeVisible();
  await expect(page.locator('.source-list').getByText(/直接专页 · 景点概况/).first()).toBeVisible();
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
  await expect(page.getByRole('navigation', { name: '按天快速跳转' }).getByRole('link')).toHaveCount(3);
  const evidenceCard = page.locator('.route-evidence-card');
  await expect(evidenceCard.getByRole('heading', { name: '路线事实一眼看懂' })).toBeVisible();
  await expect(evidenceCard.locator('dd').nth(0)).toHaveText('5');
});

test('路线筛选同步地址并展示内容核实概览', async ({ page }) => {
  await page.goto(`${appBase}routes`);
  const panoramaFilter = page.getByRole('button', { name: '全景路线' });
  await panoramaFilter.click();
  await expect(page).toHaveURL(/theme=panorama/);
  await expect(panoramaFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('status')).toContainText('3 条路线');
  await expect(page.locator('.route-evidence-summary')).toHaveCount(3);
});

test('网络资料与区域配图说明透明可见', async ({ page }) => {
  await page.goto(`${appBase}attraction/pengyangtitian`);
  await expect(page.getByRole('heading', { level: 1, name: '彭阳梯田' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '核心资料已核实' })).toBeVisible();
  await expect(page.getByText(/3 月下旬至 4 月中旬赏山花/)).toBeVisible();
  await expect(page.locator('.image-credit > strong')).toHaveText(/非彭阳梯田实景/);
  await expect(page.locator('.source-list a')).toHaveCount(3);
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
