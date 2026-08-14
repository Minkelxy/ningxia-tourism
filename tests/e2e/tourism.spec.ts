import { expect, test } from '@playwright/test';

const appBase = process.env.VITE_BASE_URL ?? '/';

test('首页、景点筛选与详情可以连续浏览', async ({ page }) => {
  await page.goto(appBase);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('宁夏');
  await expect(page.getByText('16 个已核实 · 2 个待复核')).toBeVisible();

  await page.getByRole('link', { name: '精选景点' }).first().click();
  await page.getByPlaceholder('搜索景点、城市或亮点').fill('沙坡头');
  await expect(page.getByRole('heading', { name: '沙坡头' })).toBeVisible();
  await page.getByRole('heading', { name: '沙坡头' }).getByRole('link').click();
  await expect(page.getByRole('heading', { level: 1, name: '沙坡头' })).toBeVisible();
  await expect(page.getByRole('link', { name: /高德查看/ })).toHaveAttribute('href', /coordinate=wgs84/);
  await expect(page.getByText('近期核验')).toBeVisible();
  await expect(page.locator('.source-list').getByText(/直接专页 · 景点概况/).first()).toBeVisible();
});

test('首页可按天数缩小路线范围并阅读最新专题', async ({ page }) => {
  await page.goto(appBase);
  const fiveDays = page.getByRole('button', { name: '5 天' });
  await fiveDays.click();
  await expect(fiveDays).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.home-route-result-heading')).toContainText('1 条 5 天路线');
  await expect(page.getByRole('link', { name: /五日全景深度游/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /打开完整筛选/ })).toHaveAttribute('href', /routes\?duration=5/);
  await expect(page.locator('.home-topic-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: /沙坡头和金沙岛怎么选/ })).toBeVisible();
});

test('地图支持键盘进入城市、选择区县和切换交通图层', async ({ page }) => {
  await page.goto(appBase);
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  await map.getByRole('button', { name: /银川市，按回车进入/ }).press('Enter');
  await expect(map.getByRole('button', { name: /兴庆区，按回车进入/ })).toBeVisible();
  await expect(map.locator('.map-region.is-selected')).toHaveCount(0);

  await map.getByRole('button', { name: /兴庆区，按回车进入/ }).click();
  await expect(map.locator('.map-region.is-selected')).toHaveCount(1);
  await expect(map.getByText('兴庆区', { exact: true })).toBeVisible();

  const transport = map.getByRole('button', { name: '交通' });
  await transport.click();
  await expect(transport).toHaveAttribute('aria-pressed', 'true');
});

test('景点页支持按旅行兴趣发现新增目的地', async ({ page }) => {
  await page.goto(`${appBase}attractions`);
  if ((page.viewportSize()?.width ?? 999) <= 480) {
    const layout = await page.locator('.attraction-theme-grid').evaluate((element) => ({
      trackWidth: element.scrollWidth,
      visibleWidth: element.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(layout.trackWidth).toBeGreaterThan(layout.visibleWidth);
    expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
  }
  const ancientTheme = page.getByRole('button', { name: /时间深处/ });
  await ancientTheme.click();
  await expect(page).toHaveURL(/theme=ancient-traces/);
  await expect(ancientTheme).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.attraction-card')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: '水洞沟旅游区' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '须弥山旅游区' })).toBeVisible();

  await page.getByLabel('城市').selectOption('yinchuan');
  await expect(page).toHaveURL(/city=yinchuan/);
  await expect(page.locator('.attraction-card')).toHaveCount(3);

  await page.goto(`${appBase}attraction/huangyeguda`);
  await expect(page.getByRole('heading', { level: 1, name: '青铜峡黄河大峡谷旅游区' })).toBeVisible();
  await expect(page.getByText(/十里长峡、青铜峡水利枢纽/)).toBeVisible();
  await expect(page.locator('.source-list a')).toHaveCount(3);
  await expect(page.locator('.image-credit > strong')).toHaveText(/青铜峡黄河大峡谷河谷实景/);

  await page.goto(`${appBase}attraction/suyukou`);
  await expect(page.getByRole('heading', { level: 1, name: '宁夏贺兰山国家森林公园' })).toBeVisible();
  await expect(page.getByText(/旧攻略常用“苏峪口森林公园”称呼/)).toBeVisible();
  await expect(page.locator('.image-credit > strong')).toHaveText(/非景区游线实景/);

  await page.goto(`${appBase}attraction/mingcuihu`);
  await expect(page.getByRole('heading', { level: 1, name: '鸣翠湖国家湿地公园' })).toBeVisible();
  await expect(page.getByText(/塞上江南/).first()).toBeVisible();
  await expect(page.locator('.source-list a')).toHaveCount(3);

  await page.goto(`${appBase}attraction/huangshagudu`);
  await expect(page.getByRole('heading', { level: 1, name: '黄沙古渡原生态旅游区' })).toBeVisible();
  await expect(page.getByText(/半天到一天/)).toBeVisible();
  await expect(page.locator('.image-credit > strong')).toHaveText(/非黄沙古渡景区实景/);
  await expect(page.locator('.source-list a')).toHaveCount(4);

  await page.goto(`${appBase}attraction/zhongweijinshadao`);
  await expect(page.getByRole('heading', { level: 1, name: '腾格里沙漠湿地·金沙岛旅游区' })).toBeVisible();
  await expect(page.getByText(/更适合轻松看沙水相邻的景观/)).toBeVisible();
  await expect(page.locator('.image-credit > strong')).toHaveText(/非金沙岛景区实景/);

  await page.goto(`${appBase}attraction/yibaisiba`);
  await expect(page).toHaveURL(new RegExp(`${appBase}attraction/huangyeguda$`));
  await expect(page.getByRole('heading', { level: 1, name: '青铜峡黄河大峡谷旅游区' })).toBeVisible();

  await page.goto(`${appBase}attraction/jinjiping`);
  await expect(page).toHaveURL(new RegExp(`${appBase}attraction/pengyangtitian$`));
  await expect(page.getByRole('heading', { level: 1, name: '彭阳梯田' })).toBeVisible();
});

test('城市详情和路线详情可直接访问', async ({ page }) => {
  await page.goto(`${appBase}city/yinchuan`);
  await expect(page.getByRole('heading', { level: 1, name: '银川市' })).toBeVisible();
  await expect(page.getByText('2—3 晚')).toBeVisible();
  await expect(page.getByRole('heading', { name: '适不适合放进这趟行程' })).toBeVisible();
  await expect(page.getByText(/西夏陵、镇北堡都在远郊西线/)).toBeVisible();
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
  await expect(page.getByText('适中节奏').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '先判断这条路线是否适合你' })).toBeVisible();
});

test('路线筛选同步地址并展示内容核实概览', async ({ page }) => {
  await page.goto(`${appBase}routes`);
  const panoramaFilter = page.getByRole('button', { name: '全景路线' });
  await panoramaFilter.click();
  await expect(page).toHaveURL(/theme=panorama/);
  await expect(panoramaFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('status')).toContainText('3 条路线');
  await expect(page.locator('.route-evidence-summary')).toHaveCount(3);

  const relaxedFilter = page.getByRole('button', { name: '舒缓' });
  await relaxedFilter.click();
  await expect(page).toHaveURL(/pace=relaxed/);
  await expect(relaxedFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('status')).toContainText('1 条路线');
  await expect(page.locator('.route-table-wrap tbody tr')).toHaveCount(1);
  await expect(page.getByRole('region', { name: '路线横向比较表' })).toBeVisible();
});

test('五城概览支持横向比较旅行节奏', async ({ page }) => {
  await page.goto(`${appBase}cities`);
  const table = page.getByRole('region', { name: '五城旅行比较表' });
  await expect(table).toBeVisible();
  await expect(table.locator('tbody tr')).toHaveCount(5);
  await expect(table.getByRole('row', { name: /吴忠市/ })).toContainText('中华黄河楼和黄河坛不是同一个地点');
  await expect(page.locator('.city-card')).toHaveCount(5);
  await expect(page.getByRole('link', { name: '查看城市指南' })).toHaveCount(5);
});

test('网络资料与区域配图说明透明可见', async ({ page }) => {
  await page.goto(`${appBase}attraction/pengyangtitian`);
  await expect(page.getByRole('heading', { level: 1, name: '彭阳梯田' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '核心资料已核实' })).toBeVisible();
  await expect(page.getByText(/3 月下旬至 4 月中旬赏山花/)).toBeVisible();
  await expect(page.locator('.image-credit > strong')).toHaveText(/非彭阳梯田实景/);
  await expect(page.locator('.source-list a')).toHaveCount(3);
});

test('黄河坛与六盘山展示明确地点和直接资料', async ({ page }) => {
  await page.goto(`${appBase}attraction/huanghetan`);
  await expect(page.getByRole('heading', { level: 1, name: '黄河坛旅游区' })).toBeVisible();
  await expect(page.getByText(/109 国道 1314 段/)).toBeVisible();
  await expect(page.locator('.image-credit > strong')).toHaveText(/非黄河坛实景/);

  await page.goto(`${appBase}attraction/liupanshan`);
  await expect(page.getByRole('heading', { level: 1, name: '六盘山红军长征旅游区' })).toBeVisible();
  await expect(page.getByText(/本页不指泾源县的六盘山国家森林公园/)).toBeVisible();
  await expect(page.getByText(/2.5 公里红军小道/).first()).toBeVisible();
  await expect(page.locator('.source-list a')).toHaveCount(3);
});

test('行前指南支持天数选路和本机清单', async ({ page }) => {
  await page.goto(`${appBase}guide`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('先解决四件事');
  await expect(page.locator('.duration-card')).toHaveCount(5);
  await expect(page.getByRole('link', { name: /3 天行程/ })).toHaveAttribute('href', /routes\?duration=3/);

  const firstItem = page.getByRole('checkbox', { name: '核对身份证件、往返车票与入住日期' });
  await firstItem.check();
  await expect(firstItem).toBeChecked();
  await page.reload();
  await expect(page.getByRole('checkbox', { name: '核对身份证件、往返车票与入住日期' })).toBeChecked();
  await page.getByRole('button', { name: '重置清单' }).click();
  await expect(page.getByRole('checkbox', { name: '核对身份证件、往返车票与入住日期' })).not.toBeChecked();
});

test('旅行手记双栏目、键盘切换和未知详情可恢复', async ({ page }) => {
  await page.goto(`${appBase}journal`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('地图之外');
  await expect(page.getByRole('tab', { name: /全部内容/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.journal-card')).toHaveCount(5);
  await expect(page.getByRole('heading', { name: /沙坡头和金沙岛怎么选/ })).toBeVisible();

  await page.getByRole('tab', { name: /全部内容/ }).press('ArrowRight');
  await expect(page).toHaveURL(/type=travel/);
  await expect(page.getByRole('tab', { name: /个人游记/ })).toBeFocused();
  await expect(page.getByText('第一篇游记正在路上')).toBeVisible();

  await page.getByRole('tab', { name: /个人游记/ }).press('ArrowRight');
  await expect(page).toHaveURL(/type=food/);
  await expect(page.getByRole('tab', { name: /探店记录/ })).toBeFocused();
  await expect(page.getByText('第一份探店记录还没上桌')).toBeVisible();

  await page.getByRole('tab', { name: /探店记录/ }).press('ArrowRight');
  await expect(page).toHaveURL(/type=guide/);
  await expect(page.getByRole('tab', { name: /旅行专题/ })).toBeFocused();
  await expect(page.locator('.journal-card')).toHaveCount(5);

  await page.goto(`${appBase}journal/travel/not-published`);
  await expect(page.getByRole('heading', { name: '这篇内容还没有公开' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
});

test('中卫沙水专题可比较目的地并查看来源', async ({ page }) => {
  await page.goto(`${appBase}journal/guide/zhongwei-sand-water-choice`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('沙坡头和金沙岛怎么选');
  await expect(page.getByText(/第一次到中卫、只打算选一个代表性目的地/)).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.locator('.journal-sources a')).toHaveCount(4);
  await expect(page.getByRole('link', { name: '沙坡头旅游景区' })).toBeVisible();
  await expect(page.getByRole('link', { name: '腾格里沙漠湿地·金沙岛旅游区', exact: true })).toBeVisible();
});

test('旅行专题展示资料边界、来源与相关目的地', async ({ page }) => {
  await page.goto(`${appBase}journal/guide/liupanshan-two-destinations`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('隆德长征景区和泾源森林公园');
  await expect(page.getByText('这是一篇资料型专题')).toBeVisible();
  await expect(page.getByText(/资料整理，不是亲历记录/)).toBeVisible();
  await expect(page.locator('.journal-sources a')).toHaveCount(3);
  await expect(page.getByRole('link', { name: '六盘山红军长征旅游区' })).toBeVisible();
});

test('黄河楼专题说明资质变化并区分黄河坛', async ({ page }) => {
  await page.goto(`${appBase}journal/guide/huanghe-landmarks-difference`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('黄河楼和黄河坛不是一处');
  await expect(page.getByText(/2023 年公告取消黄河楼景区国家 4A 级/)).toBeVisible();
  await expect(page.locator('.journal-sources a')).toHaveCount(3);
  await expect(page.getByRole('link', { name: '中华黄河楼' })).toBeVisible();
  await expect(page.getByRole('link', { name: '黄河坛旅游区', exact: true })).toBeVisible();
});
