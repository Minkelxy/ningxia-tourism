import { expect, test } from '@playwright/test';

const appBase = process.env.VITE_BASE_URL ?? '/';

test('首页、景点筛选与详情可以连续浏览', async ({ page }) => {
  await page.goto(appBase);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('宁夏');
  await expect(page.getByText('20 个已核实 · 2 个待复核')).toBeVisible();

  await page.getByRole('link', { name: '精选景点' }).first().click();
  if ((page.viewportSize()?.width ?? 999) <= 768) {
    await page.getByRole('button', { name: /筛选景点/ }).click();
  }
  await page.getByPlaceholder('搜索景点、城市或亮点').fill('沙坡头');
  await expect(page.getByRole('heading', { name: '沙坡头' })).toBeVisible();
  await page.getByRole('heading', { name: '沙坡头' }).getByRole('link').click();
  await expect(page.getByRole('heading', { level: 1, name: '沙坡头' })).toBeVisible();
  await expect(page.getByRole('link', { name: /高德查看/ })).toHaveAttribute('href', /coordinate=wgs84/);
  await expect(page.getByText('近期核验')).toBeVisible();
  await expect(page.locator('.source-list').getByText(/直接专页 · 景点概况/).first()).toBeVisible();
});

test('移动端菜单入口保持统一的轻量反馈', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) > 768) test.skip();
  await page.goto(appBase);
  const menuButton = page.getByRole('button', { name: '打开导航菜单' });
  await menuButton.hover();
  await expect(menuButton).toHaveCSS('background-color', 'rgb(238, 243, 237)');
  await expect(menuButton).toHaveCSS('color', 'rgb(49, 95, 79)');
  await expect(menuButton).not.toHaveCSS('transform', 'none');
  await expect(menuButton).toHaveCSS('box-shadow', /rgba\(49, 95, 79, 0\.1\)/);
});

test('404 页面次级入口保持轻量层次反馈', async ({ page }) => {
  await page.goto(`${appBase}this-page-does-not-exist`);
  const browseAttractions = page.getByRole('link', { name: '浏览景点' });
  await browseAttractions.hover();
  await expect(browseAttractions).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(browseAttractions).toHaveCSS('border-color', 'rgb(185, 135, 60)');
  await expect(browseAttractions).not.toHaveCSS('transform', 'none');
  await expect(browseAttractions).toHaveCSS('box-shadow', /rgba\(67, 48, 24, 0\.11\)/);
});

test('首页可按天数缩小路线范围并阅读最新专题', async ({ page }) => {
  await page.goto(appBase);
  const fiveDays = page.getByRole('radio', { name: '5 天' });
  await fiveDays.click();
  await expect(fiveDays).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('.home-route-result-heading')).toContainText('1 条 5 天路线');
  await expect(page.getByRole('link', { name: /五日全景深度游/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /打开完整筛选/ })).toHaveAttribute('href', /routes\?duration=5/);
  const fullFilterLink = page.getByRole('link', { name: /打开完整筛选/ });
  await fullFilterLink.hover();
  await expect(fullFilterLink).toHaveCSS('color', 'rgb(169, 69, 53)');
  await expect(fullFilterLink.locator('svg').last()).not.toHaveCSS('transform', 'none');
  await expect(page.locator('.home-topic-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: /沙坡头和金沙岛怎么选/ })).toBeVisible();

  await fiveDays.press('ArrowLeft');
  await expect(page.getByRole('radio', { name: '4 天' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('radio', { name: '4 天' })).toBeFocused();
});

test('地图支持键盘进入城市、选择区县和切换交通图层', async ({ page }) => {
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  await map.getByRole('button', { name: /银川市，按回车进入/ }).press('Enter');
  await expect(map.getByRole('button', { name: /兴庆区，按回车进入/ })).toBeVisible();
  await expect(map.locator('.map-region.is-selected')).toHaveCount(0);

  await map.getByRole('button', { name: /兴庆区，按回车进入/ }).click();
  await expect(map.locator('.map-region.is-selected')).toHaveCount(1);
  await expect(map.getByLabel('地图层级')).toContainText('兴庆区');

  const transport = map.getByRole('button', { name: '交通' });
  await transport.click();
  await expect(transport).toHaveAttribute('aria-pressed', 'true');
  await transport.hover();
  await expect(transport).toHaveCSS('background-color', 'rgb(49, 95, 79)');
  await expect(transport).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(transport).toHaveCSS('transform', 'none');
});

test('景点页支持按旅行兴趣发现新增目的地', async ({ page }) => {
  await page.goto(`${appBase}attractions`);
  if ((page.viewportSize()?.width ?? 999) <= 768) {
    const filterToggle = page.getByRole('button', { name: /筛选景点/ });
    await expect(filterToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('region', { name: '景点筛选' })).toBeHidden();
    await filterToggle.click();
    await expect(filterToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('region', { name: '景点筛选' })).toBeVisible();
  }
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

  await page.getByPlaceholder('搜索景点、城市或亮点').fill('石嘴山');
  await expect(page.locator('.attraction-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: '沙湖生态旅游区' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '北武当生态旅游区' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '大武口工业遗址公园' })).toBeVisible();
  await page.getByPlaceholder('搜索景点、城市或亮点').fill('');
  await expect(page).not.toHaveURL(/[?&]q=/);

  const ancientTheme = page.getByRole('button', { name: /时间深处/ });
  await ancientTheme.click();
  await expect(page).toHaveURL(/theme=ancient-traces/);
  await expect(ancientTheme).toHaveAttribute('aria-pressed', 'true');
  await ancientTheme.hover();
  await expect(ancientTheme).toHaveCSS('background-color', 'rgb(240, 246, 241)');
  await expect(ancientTheme).toHaveCSS('transform', 'none');
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

  await page.goto(`${appBase}attraction/beiwudang`);
  await expect(page.getByRole('heading', { level: 1, name: '北武当生态旅游区' })).toBeVisible();
  await expect(page.getByText(/现行 A 级名录确认其为 4A/)).toBeVisible();
  await expect(page.locator('.image-credit > strong')).toHaveText(/实景参考图/);
  await expect(page.locator('.source-list a')).toHaveCount(3);

  await page.goto(`${appBase}attraction/dawukou-industrial`);
  await expect(page.getByRole('heading', { level: 1, name: '大武口工业遗址公园' })).toBeVisible();
  await expect(page.getByText(/公共园区和内部展馆没有统一开放口径/)).toBeVisible();
  await expect(page.locator('.image-credit > strong')).toHaveText(/大武口工业遗址公园实景/);
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

test('收藏操作保持跨页面反馈一致', async ({ page }) => {
  await page.goto(`${appBase}attractions`);
  const attractionFavorite = page.getByRole('button', { name: /收藏/ }).first();
  await attractionFavorite.hover();
  await expect(attractionFavorite).toHaveCSS('background-color', 'rgb(255, 243, 237)');
  await expect(attractionFavorite).toHaveCSS('color', 'rgb(169, 69, 53)');
  await attractionFavorite.click();
  await expect(attractionFavorite).toHaveAttribute('aria-pressed', 'true');

  await page.goto(`${appBase}routes`);
  const routeFavorite = page.getByRole('button', { name: /收藏/ }).first();
  await routeFavorite.hover();
  await expect(routeFavorite).toHaveCSS('background-color', 'rgb(255, 243, 237)');
  await expect(routeFavorite).toHaveCSS('color', 'rgb(169, 69, 53)');

  await page.goto(`${appBase}favorites`);
  await expect(page.getByRole('heading', { name: '收藏的景点' })).toBeVisible();
});

test('景点对比操作保持状态反馈一致', async ({ page }) => {
  await page.goto(`${appBase}attractions`);
  const compareToggle = page.getByRole('button', { name: '加入对比' }).first();
  await compareToggle.hover();
  await expect(compareToggle).toHaveCSS('background-color', 'rgb(238, 243, 237)');
  await expect(compareToggle).toHaveCSS('color', 'rgb(49, 95, 79)');
  await compareToggle.click();
  await expect(page.getByRole('button', { name: '已加入对比' }).first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('region', { name: '景点横向比较表' })).toBeVisible();
});

test('城市详情和路线详情可直接访问', async ({ page }) => {
  await page.goto(`${appBase}city/yinchuan`);
  await expect(page.getByRole('heading', { level: 1, name: '银川市' })).toBeVisible();
  await expect(page.getByText('2—3 晚')).toBeVisible();
  await expect(page.getByRole('heading', { name: '适不适合放进这趟行程' })).toBeVisible();
  await expect(page.getByText(/西夏陵、镇北堡都在远郊西线/)).toBeVisible();
  await expect(page.getByText(/个公开景点/).first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/ningxia-tourism\/city\/yinchuan$|\/city\/yinchuan$/);
  const cityBackLink = page.locator('.city-detail-copy .back-link');
  await cityBackLink.hover();
  await expect(cityBackLink).toHaveCSS('transform', 'none');
  await expect(cityBackLink.locator('svg').first()).not.toHaveCSS('transform', 'none');

  await page.goto(`${appBase}routes/classic-3day`);
  await expect(page.getByRole('heading', { level: 1, name: '经典三日全景游' })).toBeVisible();
  await expect(page.getByRole('button', { name: /打印行程/ })).toBeVisible();
  await expect(page.locator('.route-day')).toHaveCount(3);
  await expect(page.getByRole('navigation', { name: '按天快速跳转' }).getByRole('link')).toHaveCount(3);
  const dayTwoLink = page.getByRole('navigation', { name: '按天快速跳转' }).getByRole('link', { name: /D02/ });
  await expect(dayTwoLink).toHaveAttribute('href', '#route-day-2');
  await dayTwoLink.click();
  await expect(page).toHaveURL(/#route-day-2$/);
  const evidenceCard = page.locator('.route-evidence-card');
  await expect(evidenceCard.getByRole('heading', { name: '路线事实一眼看懂' })).toBeVisible();
  await expect(evidenceCard.locator('dd').nth(0)).toHaveText('5');
  await expect(page.getByText('适中节奏').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '先判断这条路线是否适合你' })).toBeVisible();
  const routeBackLink = page.locator('.route-detail-hero .back-link');
  await routeBackLink.hover();
  await expect(routeBackLink).toHaveCSS('transform', 'none');
  await expect(routeBackLink.locator('svg').first()).not.toHaveCSS('transform', 'none');

  await page.goto(`${appBase}routes/shizuishan-2day`);
  await expect(page.getByRole('heading', { level: 1, name: '山湖与工业石嘴山两日游' })).toBeVisible();
  await expect(page.locator('.route-day')).toHaveCount(2);
  await expect(page.locator('.stop-verification.verified')).toHaveCount(3);
  await expect(page.getByRole('link', { name: '大武口工业遗址公园' })).toBeVisible();
  const stopMapLink = page.locator('.route-stop .text-link').first();
  await stopMapLink.hover();
  await expect(stopMapLink).toHaveCSS('color', 'rgb(169, 69, 53)');
  await expect(stopMapLink.locator('svg').last()).not.toHaveCSS('transform', 'none');
});

test('路线筛选同步地址并展示内容核实概览', async ({ page }) => {
  await page.goto(`${appBase}routes`);
  if ((page.viewportSize()?.width ?? 999) <= 768) {
    const filterToggle = page.getByRole('button', { name: /筛选路线/ });
    await expect(filterToggle).toHaveAttribute('aria-expanded', 'false');
    await filterToggle.click();
    await expect(filterToggle).toHaveAttribute('aria-expanded', 'true');
  }
  const cityFilter = page.getByRole('button', { name: '石嘴山', exact: true });
  await cityFilter.click();
  await expect(page).toHaveURL(/city=shizuishan/);
  await expect(page.locator('#route-results')).toContainText('3 条路线');
  await expect(page.getByRole('heading', { name: '山湖与工业石嘴山两日游' })).toBeVisible();
  await page.getByRole('button', { name: '清除筛选' }).click();
  if ((page.viewportSize()?.width ?? 999) <= 768) await page.getByRole('button', { name: /筛选路线/ }).click();
  const panoramaFilter = page.getByRole('button', { name: '全景路线' });
  await panoramaFilter.click();
  await expect(page).toHaveURL(/theme=panorama/);
  await expect(panoramaFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#route-results')).toContainText('4 条路线');
  await expect(page.locator('.route-evidence-summary')).toHaveCount(4);

  const relaxedFilter = page.getByRole('button', { name: '舒缓' });
  await relaxedFilter.click();
  await expect(page).toHaveURL(/pace=relaxed/);
  await expect(relaxedFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#route-results')).toContainText('1 条路线');
  if ((page.viewportSize()?.width ?? 999) > 768) {
    await expect(page.locator('.route-table-wrap tbody tr')).toHaveCount(1);
    await expect(page.getByRole('region', { name: '路线横向比较表' })).toBeVisible();
  } else {
    await expect(page.getByRole('region', { name: '路线横向比较表' })).toBeHidden();
    await expect(page.locator('.route-card')).toHaveCount(1);
  }
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

  const pendingItem = page.getByRole('checkbox', { name: '打开核心景点来源，确认当天开放与预约' });
  const pendingLabel = page.locator('.travel-checklist label').filter({ hasText: '打开核心景点来源，确认当天开放与预约' });
  await pendingLabel.hover();
  await expect(pendingLabel).toHaveCSS('background-color', 'rgb(247, 251, 246)');
  await pendingItem.focus();
  await expect(pendingLabel).toHaveCSS('outline-style', 'solid');

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
  await expect(page.locator('.journal-card')).toHaveCount(15);
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
  await expect(page.locator('.journal-card')).toHaveCount(15);

  await page.goto(`${appBase}journal/travel/not-published`);
  await expect(page.getByRole('heading', { name: '这篇内容还没有公开' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
});

test('旅行手记栏目切换保持轻量反馈', async ({ page }) => {
  await page.goto(`${appBase}journal`);
  const travelTab = page.getByRole('tab', { name: /个人游记/ });
  await travelTab.hover();
  await expect(travelTab).toHaveCSS('background-color', 'rgb(238, 243, 237)');
  await expect(travelTab).toHaveCSS('color', 'rgb(49, 95, 79)');
  await travelTab.click();
  await expect(travelTab).toHaveAttribute('aria-selected', 'true');
  await expect(travelTab).toHaveCSS('background-color', 'rgb(49, 95, 79)');
  await expect(travelTab).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('路线筛选入口保持轻量反馈', async ({ page }) => {
  await page.goto(`${appBase}routes`);
  if ((page.viewportSize()?.width ?? 999) <= 768) {
    await page.getByRole('button', { name: /筛选路线/ }).click();
  }
  const cityFilter = page.getByRole('button', { name: '石嘴山', exact: true });
  await cityFilter.hover();
  await expect(cityFilter).toHaveCSS('background-color', 'rgb(238, 243, 237)');
  await expect(cityFilter).toHaveCSS('color', 'rgb(49, 95, 79)');
  await cityFilter.click();
  await expect(cityFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(cityFilter).toHaveCSS('background-color', 'rgb(49, 95, 79)');
  await expect(cityFilter).toHaveCSS('color', 'rgb(255, 255, 255)');
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

test('阅读资料入口支持键盘连续聚焦', async ({ page }) => {
  await page.goto(`${appBase}attraction/huangyeguda`);
  const detailBackLink = page.locator('.detail-top-actions .icon-button').first();
  await detailBackLink.focus();
  await expect(detailBackLink).toBeFocused();
  const detailShareButton = page.getByRole('button', { name: '分享此景点' });
  await detailShareButton.focus();
  await expect(detailShareButton).toBeFocused();
  const attractionSource = page.locator('.source-list a').first();
  await attractionSource.focus();
  await expect(attractionSource).toBeFocused();
  const imageCredit = page.locator('.image-credit a').first();
  await imageCredit.focus();
  await expect(imageCredit).toBeFocused();

  await page.goto(`${appBase}journal/guide/zhongwei-sand-water-choice`);
  const journalSource = page.locator('.journal-sources a').first();
  await journalSource.focus();
  await expect(journalSource).toBeFocused();
  const relatedNote = page.locator('.related-notes a').first();
  await relatedNote.focus();
  await expect(relatedNote).toBeFocused();

  await page.goto(`${appBase}guide`);
  const seasonSource = page.locator('.season-card > a').first();
  await seasonSource.focus();
  await expect(seasonSource).toBeFocused();
  const guideSource = page.locator('.guide-source-panel a').first();
  await guideSource.focus();
  await expect(guideSource).toBeFocused();

  await page.goto(appBase);
  const topicTitle = page.locator('.home-topic-card h3 a').first();
  await topicTitle.focus();
  await expect(topicTitle).toBeFocused();

  await page.goto(`${appBase}about`);
  const sourceDirectory = page.locator('.source-directory a').first();
  await sourceDirectory.focus();
  await expect(sourceDirectory).toBeFocused();
});

test('资料来源入口保持末端图标反馈与稳定热区', async ({ page }) => {
  await page.goto(`${appBase}attraction/huangyeguda`);
  const attractionSource = page.locator('.source-list .source-link').first();
  await attractionSource.hover();
  await expect(attractionSource).toHaveCSS('transform', 'none');
  await expect(attractionSource.locator('svg').last()).not.toHaveCSS('transform', 'none');

  await page.goto(`${appBase}journal/guide/zhongwei-sand-water-choice`);
  const journalSource = page.locator('.journal-sources .source-link').first();
  await journalSource.hover();
  await expect(journalSource).toHaveCSS('transform', 'none');
  await expect(journalSource.locator('svg').last()).not.toHaveCSS('transform', 'none');

  await page.goto(`${appBase}guide`);
  const guideSource = page.locator('.guide-source-panel .source-link').first();
  await guideSource.hover();
  await expect(guideSource).toHaveCSS('transform', 'none');
  await expect(guideSource.locator('svg').last()).not.toHaveCSS('transform', 'none');

  await page.goto(`${appBase}about`);
  const aboutSource = page.locator('.source-directory .source-link').first();
  await aboutSource.hover();
  await expect(aboutSource).toHaveCSS('transform', 'none');
  await expect(aboutSource.locator('svg').last()).not.toHaveCSS('transform', 'none');
});

test('深色头图操作状态保持高对比', async ({ page }) => {
  await page.goto(`${appBase}routes/classic-3day`);
  const routePrimary = page.getByRole('button', { name: '打印行程' });
  await routePrimary.hover();
  await expect(routePrimary).toHaveCSS('background-color', 'rgb(240, 197, 121)');
  await expect(routePrimary).toHaveCSS('color', 'rgb(35, 30, 22)');
  const routeQuiet = page.getByRole('button', { name: '分享路线' });
  await routeQuiet.hover();
  await expect(routeQuiet).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.15)');
  await expect(routeQuiet).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(routeQuiet).not.toHaveCSS('transform', 'none');
  await expect(routeQuiet).toHaveCSS('box-shadow', /rgba\(8, 25, 20, 0\.22\)/);

  await page.goto(`${appBase}guide`);
  const guidePrimary = page.getByRole('link', { name: /按季节开始/ });
  await guidePrimary.hover();
  await expect(guidePrimary).toHaveCSS('background-color', 'rgb(240, 197, 121)');
  await expect(guidePrimary).toHaveCSS('color', 'rgb(35, 30, 22)');
  const guideQuiet = page.getByRole('link', { name: /直接看路线/ });
  await guideQuiet.hover();
  await expect(guideQuiet).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.15)');
  await expect(guideQuiet).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(guideQuiet).not.toHaveCSS('transform', 'none');
  await expect(guideQuiet).toHaveCSS('box-shadow', /rgba\(8, 25, 20, 0\.22\)/);
});

test('轻量文字操作状态与全站交互色保持一致', async ({ page }) => {
  await page.goto(`${appBase}routes?city=shizuishan`);
  const routeClear = page.getByRole('button', { name: '清除筛选' });
  await routeClear.hover();
  await expect(routeClear).toHaveCSS('color', 'rgb(169, 69, 53)');
  await expect(routeClear).toHaveCSS('transform', 'none');

  await page.goto(`${appBase}journal?type=guide&q=%E6%B2%99%E6%B9%96`);
  const journalClear = page.getByRole('button', { name: '清空筛选' });
  await journalClear.hover();
  await expect(journalClear).toHaveCSS('color', 'rgb(49, 95, 79)');
  await expect(journalClear).toHaveCSS('transform', 'none');

  await page.goto(`${appBase}guide`);
  const checklistItem = page.getByRole('checkbox', { name: '核对身份证件、往返车票与入住日期' });
  await checklistItem.check();
  const checklistReset = page.getByRole('button', { name: '重置清单' });
  await checklistReset.hover();
  await expect(checklistReset).toHaveCSS('color', 'rgb(49, 95, 79)');
  await expect(checklistReset).toHaveCSS('transform', 'none');
});

test('首页与搜索起始入口保持轻量反馈', async ({ page }) => {
  await page.goto(appBase);
  const searchNavLink = page.locator('.search-nav-link');
  await expect(searchNavLink).toBeVisible();
  await expect(searchNavLink).toHaveCSS('width', '44px');
  await expect(searchNavLink).toHaveCSS('height', '44px');
  const scrollCue = page.getByRole('link', { name: '向下探索' });
  await scrollCue.hover();
  await expect(scrollCue).toHaveCSS('color', 'rgb(227, 182, 107)');
  const methodLink = page.getByRole('link', { name: '了解内容方法' });
  await methodLink.hover();
  await expect(methodLink).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(methodLink).toHaveCSS('transform', 'none');
  await expect(methodLink.locator('svg').last()).not.toHaveCSS('transform', 'none');
  const topicsLink = page.getByRole('link', { name: '查看全部旅行专题' });
  await topicsLink.hover();
  await expect(topicsLink).toHaveCSS('background-color', 'rgb(135, 94, 36)');
  await expect(topicsLink).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(topicsLink).not.toHaveCSS('transform', 'none');

  await page.goto(`${appBase}search`);
  const suggestion = page.getByRole('button', { name: '沙漠' });
  await suggestion.hover();
  await expect(suggestion).toHaveCSS('background-color', 'rgb(238, 243, 237)');
  await expect(suggestion).toHaveCSS('border-color', 'rgb(49, 95, 79)');

  await page.goto(`${appBase}search?q=沙漠`);
  const searchClear = page.getByRole('button', { name: '清空搜索内容' });
  await searchClear.hover();
  await expect(searchClear).toHaveCSS('background-color', 'rgb(238, 243, 237)');
  await expect(searchClear).toHaveCSS('color', 'rgb(49, 95, 79)');
  await expect(searchClear).toHaveCSS('width', '44px');
  await expect(searchClear).toHaveCSS('height', '44px');
  await expect(searchClear).toHaveCSS('transform', 'none');
  await searchClear.click();
  await expect(page).toHaveURL(new RegExp(`${appBase.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&')}search$`));
});

test('黄河楼专题说明资质变化并区分黄河坛', async ({ page }) => {
  await page.goto(`${appBase}journal/guide/huanghe-landmarks-difference`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('黄河楼和黄河坛不是一处');
  await expect(page.getByText(/2023 年公告取消黄河楼景区国家 4A 级/)).toBeVisible();
  await expect(page.locator('.journal-sources a')).toHaveCount(3);
  await expect(page.getByRole('link', { name: '中华黄河楼' })).toBeVisible();
  await expect(page.getByRole('link', { name: '黄河坛旅游区', exact: true })).toBeVisible();
});

test('新增老城与早茶专题，并为待复核景点提供替代方案', async ({ page }) => {
  await page.goto(`${appBase}journal/guide/yinchuan-old-city-walk`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('银川老城半日怎么走');
  await expect(page.getByRole('link', { name: '鼓楼—玉皇阁历史文化街区', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: /城市文化建筑实景参考图/ })).toBeVisible();

  await page.goto(`${appBase}journal/guide/wuzhong-morning-tea-ordering`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('怎么点才不浪费');
  await expect(page.getByRole('heading', { name: '把菜单分成四个角色', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: /中国茶实拍参考图/ })).toBeVisible();

  await page.goto(`${appBase}attraction/nanguan`);
  await expect(page.getByRole('heading', { name: '不用原地等，直接切换 Plan B' })).toBeVisible();
  await expect(page.getByText('只在公共道路观察建筑外观')).toBeVisible();
});

test('旅行专题支持搜索、清空筛选并覆盖沙湖与固原', async ({ page }) => {
  await page.goto(`${appBase}journal?type=guide`);
  await page.getByPlaceholder('搜索标题、地点、标签或问题').fill('沙湖');
  await expect(page).toHaveURL(/type=guide.*q=%E6%B2%99%E6%B9%96|q=%E6%B2%99%E6%B9%96.*type=guide/);
  await expect(page.locator('.journal-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: /沙湖留半天还是一天/ })).toBeVisible();

  await page.getByPlaceholder('搜索标题、地点、标签或问题').fill('完全不存在的主题');
  await expect(page.getByRole('heading', { name: '换一个关键词，或放宽城市与标签' })).toBeVisible();
  await page.getByRole('button', { name: '清空筛选' }).click();
  await expect(page).toHaveURL(new RegExp(`${appBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}journal\\?type=guide$`));
  await expect(page.locator('.journal-card')).toHaveCount(15);

  await page.goto(`${appBase}journal/guide/guyuan-history-two-day`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('固原历史文化两天怎么排');
  await expect(page.getByRole('link', { name: '须弥山旅游区', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '六盘山红军长征旅游区', exact: true })).toBeVisible();
});

test('地图美食图层可切换并展示已发布美食点位', async ({ page }) => {
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  const food = map.getByRole('button', { name: '美食' });
  await expect(food).toHaveAttribute('aria-pressed', 'false');
  await expect(map.locator('.map-food')).toHaveCount(0);

  await food.click();
  await expect(food).toHaveAttribute('aria-pressed', 'true');
  // 6 道已发布美食含餐厅坐标（手抓羊肉、八宝茶、硒砂瓜、中宁枸杞、灵武长枣、贺兰山东麓葡萄酒），渲染 6 个点位
  await expect(map.locator('.map-food')).toHaveCount(6);

  await food.click();
  await expect(food).toHaveAttribute('aria-pressed', 'false');
  await expect(map.locator('.map-food')).toHaveCount(0);
});

test('地图政府标记图层可切换并展示自治区与五市政府', async ({ page }) => {
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  const government = map.getByRole('button', { name: '政府' });
  await expect(government).toHaveAttribute('aria-pressed', 'false');
  await expect(map.locator('.map-government')).toHaveCount(0);

  await government.click();
  await expect(government).toHaveAttribute('aria-pressed', 'true');
  // 自治区政府 + 5 市政府 = 6 个导航锚点
  await expect(map.locator('.map-government')).toHaveCount(6);
  await expect(map.locator('.map-government--province')).toHaveCount(1);
  await expect(map.locator('.map-government--city')).toHaveCount(5);

  await government.click();
  await expect(government).toHaveAttribute('aria-pressed', 'false');
  await expect(map.locator('.map-government')).toHaveCount(0);
});

test('地图交通图层含机场类型并使用飞机图标', async ({ page }) => {
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  const transport = map.getByRole('button', { name: '交通' });
  await expect(transport).toHaveAttribute('aria-pressed', 'false');
  await expect(map.locator('.map-hub--airport')).toHaveCount(0);

  await transport.click();
  await expect(transport).toHaveAttribute('aria-pressed', 'true');
  // 银川河东国际机场在全区视图下展示，type 修正为 airport
  const airport = map.locator('.map-hub--airport');
  await expect(airport).toHaveCount(1);
  await expect(airport).toHaveAttribute('aria-label', /银川河东国际机场/);
});

test('地图美食点位支持键盘 Tab 聚焦并按回车跳转详情页', async ({ page }) => {
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  await map.getByRole('button', { name: '美食' }).click();
  // 美食点位为 role=button，键盘 Tab 可聚焦，回车跳转 /food/:id
  const foodMarker = map.locator('.map-food').first();
  await expect(foodMarker).toHaveAttribute('role', 'button');
  await foodMarker.focus();
  await foodMarker.press('Enter');
  await expect(page).toHaveURL(/\/food\//);
});

test('地图政府标记与交通枢纽点位为纯展示语义且有可读 aria-label', async ({ page }) => {
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  await map.getByRole('button', { name: '政府' }).click();
  const governmentMarker = map.locator('.map-government').first();
  await expect(governmentMarker).toHaveAttribute('role', 'img');
  await expect(governmentMarker).toHaveAttribute('aria-label', /政府标记/);
  await expect(governmentMarker).not.toHaveAttribute('tabindex');

  await map.getByRole('button', { name: '交通' }).click();
  const hub = map.locator('.map-hub').first();
  await expect(hub).toHaveAttribute('role', 'img');
  await expect(hub).toHaveAttribute('aria-label', /交通枢纽/);
  await expect(hub).not.toHaveAttribute('tabindex');
});
