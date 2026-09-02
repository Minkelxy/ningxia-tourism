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

test('移动端菜单浮于内容之上并锁定页面滚动', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) > 768) test.skip();
  await page.goto(appBase);
  const main = page.locator('main');
  const before = await main.boundingBox();
  await page.getByRole('button', { name: '打开导航菜单' }).click();
  const mobileNav = page.getByRole('navigation', { name: '移动端导航' });
  const backdrop = page.locator('.mobile-nav-backdrop');
  await expect(mobileNav).toBeVisible();
  await expect(backdrop).toBeVisible();
  await expect(mobileNav).toHaveCSS('background-color', 'rgb(247, 243, 234)');
  await expect(mobileNav).toHaveCSS('position', 'absolute');
  await expect(mobileNav).toHaveCSS('box-shadow', /rgba\(67, 48, 24, 0\.16\)/);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  const after = await main.boundingBox();
  expect(after?.y).toBe(before?.y);

  const backdropBox = await backdrop.boundingBox();
  await page.mouse.click(8, (backdropBox?.y ?? 64) + (backdropBox?.height ?? 780) - 10);
  await expect(page.getByRole('navigation', { name: '移动端导航' })).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('移动端菜单项悬停反馈与桌面导航保持一致', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) > 768) test.skip();
  await page.goto(appBase);
  await page.getByRole('button', { name: '打开导航菜单' }).click();
  const mobileNav = page.getByRole('navigation', { name: '移动端导航' });
  await expect(mobileNav).toBeVisible();
  await page.waitForTimeout(220);
  const attractionsLink = mobileNav.getByRole('link', { name: '精选景点' });
  await attractionsLink.hover();
  await expect(attractionsLink).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(attractionsLink).toHaveCSS('color', 'rgb(49, 95, 79)');
  await expect(attractionsLink).toHaveCSS('box-shadow', /rgba\(67, 48, 24, 0\.06\)/);
});

test('移动端点击菜单入口后立即收起并恢复菜单按钮焦点', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) > 768) test.skip();
  await page.goto(appBase);
  const menuButton = page.getByRole('button', { name: '打开导航菜单' });
  await menuButton.click();
  const mobileNav = page.getByRole('navigation', { name: '移动端导航' });
  await mobileNav.getByRole('link', { name: '精选景点' }).click();
  await expect(page).toHaveURL(/\/attractions$/);
  await expect(mobileNav).not.toBeVisible();
  await expect(page.getByRole('button', { name: '打开导航菜单' })).toBeFocused();
});

test('桌面端页面跳转后将焦点交给新的主要内容', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) <= 768) test.skip();
  await page.goto(appBase);
  await page.locator('header').getByRole('link', { name: '精选景点' }).click();
  await expect(page).toHaveURL(/\/attractions$/);
  await expect(page.locator('main#main-content')).toBeFocused();
});

test('导航搜索与收藏入口保持44px触控热区', async ({ page }) => {
  await page.goto(appBase);
  const favoritesLink = page.locator('.favorites-nav-link');
  await expect(favoritesLink).toHaveCSS('min-width', '44px');
  await expect(favoritesLink).toHaveCSS('min-height', '44px');
  await expect(favoritesLink).toHaveCSS('justify-content', 'center');
});

test('内容卡片标题入口保持44px触控热区', async ({ page }) => {
  for (const [path, selector] of [['attractions', '.attraction-card h2 a'], ['foods', '.attraction-card h2 a']] as const) {
    await page.goto(`${appBase}${path}`);
    await expect(page.locator(selector).first()).toHaveCSS('min-height', '44px');
  }
  await page.goto(appBase);
  await expect(page.locator('.home-topic-card h3 a').first()).toHaveCSS('min-height', '44px');
});

test('路线卡片核实概览保持可识别的语义分组', async ({ page }) => {
  await page.goto(`${appBase}routes`);
  await expect(page.getByRole('group', { name: '路线内容核实概览' }).first()).toBeVisible();
});

test('桌面端推荐路线卡片行动入口保持底部对齐', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) <= 768) test.skip();
  await page.goto(`${appBase}routes`);
  await expect(page.locator('.route-card').first()).toBeVisible();
  const bottoms = await page.locator('.route-card > .text-link').evaluateAll((elements) => elements.slice(0, 2).map((element) => element.getBoundingClientRect().bottom));
  expect(bottoms.length).toBe(2);
  expect(Math.abs(bottoms[0] - bottoms[1])).toBeLessThanOrEqual(1);
});

test('桌面端景点与美食卡片行动入口保持底部对齐', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) <= 768) test.skip();
  for (const path of ['attractions', 'foods']) {
    await page.goto(`${appBase}${path}`);
    const cards = page.locator('.attraction-card');
    await expect(cards.first()).toBeVisible();
    const bottoms = await cards.evaluateAll((elements) => elements.slice(0, 3).map((element) => element.querySelector('.card-actions')?.getBoundingClientRect().bottom ?? 0));
    expect(bottoms.length).toBe(3);
    expect(Math.max(...bottoms) - Math.min(...bottoms)).toBeLessThanOrEqual(1);
  }
});

test('桌面端首页旅行专题卡片行动入口保持底部对齐', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) <= 768) test.skip();
  await page.goto(appBase);
  const cards = page.locator('.home-topic-card');
  await expect(cards.first()).toBeVisible();
  const bottoms = await cards.evaluateAll((elements) => elements.map((element) => element.querySelector('.text-link')?.getBoundingClientRect().bottom ?? 0));
  expect(bottoms.length).toBe(3);
  expect(Math.max(...bottoms) - Math.min(...bottoms)).toBeLessThanOrEqual(1);
});

test('桌面端旅行手记卡片按行保持行动入口底部对齐', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) <= 768) test.skip();
  await page.goto(`${appBase}journal`);
  const cards = page.locator('.journal-card');
  await expect(cards.first()).toBeVisible();
  const bottoms = await cards.evaluateAll((elements) => elements.map((element) => element.querySelector('.text-link')?.getBoundingClientRect().bottom ?? 0));
  expect(bottoms.length).toBeGreaterThan(1);
  for (let index = 0; index + 1 < bottoms.length; index += 2) {
    expect(Math.abs(bottoms[index] - bottoms[index + 1])).toBeLessThanOrEqual(1);
  }
});

test('移动端旅行手记卡片保持单列与页面宽度', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) > 768) test.skip();
  await page.goto(`${appBase}journal`);
  const cards = page.locator('.journal-card');
  await expect(cards.first()).toBeVisible();
  const layout = await cards.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { display: getComputedStyle(element).display, left: Math.round(rect.left), width: Math.round(rect.width) };
  }));
  expect(layout.length).toBe(15);
  expect(layout.every((item) => item.display === 'flex')).toBe(true);
  expect(new Set(layout.map((item) => item.left)).size).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => innerWidth));
});

test('景点卡片极窄屏行动入口保持单行并与美食卡片统一', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(`${appBase}attractions`);
  const card = page.locator('.attraction-card').first();
  const actions = card.locator('.card-actions');
  await expect(actions).toBeVisible();
  await card.locator('.compare-toggle').click();
  const layout = await actions.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    children: [...element.children].map((child) => {
      const rect = child.getBoundingClientRect();
      return { top: rect.top, right: rect.right, height: rect.height };
    }),
    cardRight: element.closest('.attraction-card')?.getBoundingClientRect().right ?? 0,
    pageWidth: document.documentElement.scrollWidth,
    windowWidth: window.innerWidth,
  }));
  expect(layout.children).toHaveLength(2);
  expect(layout.children.every((child) => Math.abs(child.top - layout.children[0].top) <= 1)).toBe(true);
  expect(layout.children.every((child) => child.height >= 44)).toBe(true);
  expect(layout.children.at(-1)?.right ?? 0).toBeLessThanOrEqual(layout.cardRight - 20 + 1);
  expect(layout.height).toBeLessThanOrEqual(52);
  expect(layout.pageWidth).toBeLessThanOrEqual(layout.windowWidth + 1);
});

test('比较表名称入口保持44px触控热区', async ({ page }) => {
  await page.goto(`${appBase}cities`);
  await expect(page.locator('.city-table-wrap tbody th a').first()).toHaveCSS('min-height', '44px');
  await expect(page.locator('.city-table-wrap td:last-child .text-link').first()).toHaveCSS('min-width', '44px');
  await page.goto(`${appBase}routes`);
  await expect(page.locator('.route-table-wrap tbody th a').first()).toHaveCSS('min-height', '44px');
  await expect(page.locator('.route-table-wrap td:last-child .text-link').first()).toHaveCSS('min-width', '44px');
});

test('路线详情停靠点名称保持44px触控热区', async ({ page }) => {
  await page.goto(`${appBase}routes/classic-3day`);
  await expect(page.locator('.stop-body h3 a').first()).toHaveCSS('min-height', '44px');
});

test('顶部与页脚内容导航保持同一组入口', async ({ page }) => {
  await page.goto(appBase);
  const routes = [
    ['精选景点', 'attractions'],
    ['宁夏美食', 'foods'],
    ['推荐路线', 'routes'],
    ['行前指南', 'guide'],
    ['旅行手记', 'journal'],
    ['五城概览', 'cities'],
  ] as const;
  const header = page.locator('.desktop-nav');
  const footer = page.getByRole('navigation', { name: '继续探索' });

  for (const [label, path] of routes) {
    const headerLink = header.locator('a').filter({ hasText: label });
    const footerLink = footer.getByRole('link', { name: label });
    await expect(headerLink).toHaveAttribute('href', new RegExp(`/${path}$`));
    await expect(footerLink).toHaveAttribute('href', await headerLink.getAttribute('href') ?? '');
  }
});

test('页脚会标记当前内容入口', async ({ page }) => {
  await page.goto(`${appBase}foods`);
  const foodLink = page.getByRole('navigation', { name: '继续探索' }).getByRole('link', { name: '宁夏美食' });
  await expect(foodLink).toHaveAttribute('aria-current', 'page');
  await expect(foodLink).toHaveClass(/active/);
  await expect(foodLink).toHaveCSS('color', 'rgb(240, 197, 121)');
});

test('品牌首页入口保持44px触控高度', async ({ page }) => {
  await page.goto(appBase);
  const brandLink = page.locator('.brand');
  await expect(brandLink).toHaveCSS('min-height', '44px');
});

test('关于页内容审计入口指向实际 GitHub 文档', async ({ page }) => {
  await page.goto(`${appBase}about`);
  await expect(page.getByRole('link', { name: '查看内容审计记录' })).toHaveAttribute('href', 'https://github.com/Minkelxy/ningxia-tourism/blob/main/docs/content/CONTENT_AUDIT.md');
});

test('320px 窄屏品牌标识保持单行并避免横向溢出', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(appBase);
  const brandLink = page.locator('.brand');
  await expect(brandLink).toHaveCSS('white-space', 'nowrap');
  await expect(brandLink.locator('small')).toBeHidden();
  const layout = await page.evaluate(() => ({
    brandHeight: document.querySelector<HTMLElement>('.brand')?.getBoundingClientRect().height ?? 999,
    pageWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(layout.brandHeight).toBeLessThanOrEqual(44);
  expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
});

test('搜索与收藏页面保持单一主内容区域', async ({ page }) => {
  for (const path of ['search', 'favorites']) {
    await page.goto(`${appBase}${path}`);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main#main-content')).toBeVisible();
  }
});

test('移动端内容页首图保持统一横向比例', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) > 768) test.skip();
  for (const path of ['foods', 'attractions', 'routes']) {
    await page.goto(`${appBase}${path}`);
    const visual = page.locator(path === 'foods' ? '.foods-hero-visual' : '.collection-hero-visual');
    await expect(visual).toHaveCSS('aspect-ratio', '4 / 3');
    const box = await visual.boundingBox();
    expect(box?.height ?? 999).toBeLessThan(300);
  }
});

test('结果区清除筛选保持44px触控高度', async ({ page }) => {
  await page.goto(`${appBase}attractions?city=yinchuan`);
  const clearFilters = page.getByRole('button', { name: '清除筛选' });
  await expect(clearFilters).toHaveCSS('min-height', '44px');
  await expect(clearFilters).toHaveCSS('padding-top', '8px');
  await expect(clearFilters).toHaveCSS('padding-bottom', '8px');
});

test('列表筛选输入与下拉控件保持统一触控高度', async ({ page }) => {
  await page.goto(`${appBase}attractions`);
  if ((page.viewportSize()?.width ?? 999) <= 768) {
    await page.getByRole('button', { name: /筛选景点/ }).click();
  }
  const filterPanel = page.getByRole('region', { name: '景点筛选' });
  const searchInput = filterPanel.getByPlaceholder('搜索景点、城市或亮点');
  const selects = filterPanel.locator('select');
  await expect(searchInput).toHaveCSS('min-height', '44px');
  await expect(selects.first()).toHaveCSS('min-height', '48px');
  await expect(selects.last()).toHaveCSS('min-height', '48px');
  const heights = await filterPanel.locator('input, select').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
  expect(heights[0] ?? 0).toBeGreaterThanOrEqual(44);
  expect(heights.slice(1).every((height) => height >= 44)).toBe(true);
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

test('全屏状态页高度跟随响应式站点头部', async ({ page }) => {
  await page.goto(`${appBase}food/not-found-state`);
  const layout = await page.evaluate(() => {
    const state = document.querySelector<HTMLElement>('.full-state');
    const header = document.querySelector<HTMLElement>('.site-header');
    const stateBox = state?.getBoundingClientRect();
    const headerBox = header?.getBoundingClientRect();
    return {
      stateHeight: stateBox?.height ?? 0,
      headerHeight: headerBox?.height ?? 0,
      viewportHeight: window.innerHeight,
      headerVariable: getComputedStyle(document.documentElement).getPropertyValue('--site-header-height').trim(),
    };
  });
  expect(layout.stateHeight).toBeGreaterThanOrEqual(layout.viewportHeight - layout.headerHeight - 1);
  expect(Math.abs(parseFloat(layout.headerVariable) - layout.headerHeight)).toBeLessThanOrEqual(1);
});

test('首页可按天数缩小路线范围并阅读最新专题', async ({ page }) => {
  await page.goto(appBase);
  const fiveDays = page.getByRole('radio', { name: '5 天' });
  await fiveDays.click();
  await expect(fiveDays).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('.home-route-result-heading')).toContainText('1 条 5 天路线');
  const fiveDayRoute = page.getByRole('link', { name: /五日全景深度游/ });
  await expect(fiveDayRoute).toBeVisible();
  await expect(fiveDayRoute).toHaveCSS('animation-name', 'home-route-match-in');
  const titleInkAnimation = await fiveDayRoute.locator('h3').evaluate((element) => getComputedStyle(element, '::after').animationName);
  expect(titleInkAnimation).toBe('home-route-title-ink');
  await expect(page.getByRole('link', { name: /打开完整筛选/ })).toHaveAttribute('href', /routes\?duration=5/);
  const fullFilterLink = page.getByRole('link', { name: /打开完整筛选/ });
  await page.keyboard.press('Tab');
  await expect(fullFilterLink).toBeFocused();
  await expect(fullFilterLink).toHaveCSS('color', 'rgb(169, 69, 53)');
  await expect(fullFilterLink.locator('svg').last()).not.toHaveCSS('transform', 'none');
  await expect(page.locator('.home-topic-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: /沙坡头和金沙岛怎么选/ })).toBeVisible();

  await fiveDays.press('ArrowLeft');
  await expect(page.getByRole('radio', { name: '4 天' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('radio', { name: '4 天' })).toBeFocused();
  await expect(page.locator('.home-route-match').first()).toHaveCSS('animation-name', 'home-route-match-in');
});

test('首页路线结果减少动效时保持静态内容与墨线', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(appBase);
  const route = page.locator('.home-route-match').first();
  await expect(route).toBeVisible();
  const motion = await route.evaluate((element) => ({
    cardAnimation: getComputedStyle(element).animationName,
    cardOpacity: getComputedStyle(element).opacity,
    titleAnimation: getComputedStyle(element.querySelector('h3') as HTMLElement, '::after').animationName,
    titleOpacity: getComputedStyle(element.querySelector('h3') as HTMLElement, '::after').opacity,
  }));
  expect(motion).toEqual({ cardAnimation: 'none', cardOpacity: '1', titleAnimation: 'none', titleOpacity: '0.82' });
});

test('地图懒加载占位与正式画布保持同一视觉语言', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: class {
        observe() {}
        disconnect() {}
      },
    });
  });
  await page.goto(appBase);
  const placeholder = page.locator('.map-lazy-placeholder');
  await expect(placeholder).toBeVisible();
  await expect(placeholder.locator('.map-placeholder-label')).toContainText('地图将在接近此处时加载');
  await expect(placeholder).toHaveCSS('background-image', /linear-gradient/);
  const silhouette = await placeholder.evaluate((element) => getComputedStyle(element, '::before').clipPath);
  expect(silhouette).toContain('polygon');
});

test('首页山河绘图与地图区域动效保持轻量并尊重减少动效设置', async ({ page }) => {
  await page.goto(appBase);
  await expect(page.locator('.hero-landscape')).toBeVisible();
  await expect(page.locator('.mountain-back, .mountain-front, .hero-seal, .scroll-cue')).toHaveCount(4);
  const heroAnimations = await page.locator('.sun-disc, .river-ribbon, .hero-orbit-one, .hero-orbit-two').evaluateAll((elements) => elements.map((element) => getComputedStyle(element).animationName));
  expect(heroAnimations.every((name) => name !== 'none')).toBe(true);
  const heroDrawingSequence = await page.locator('.mountain-back, .mountain-front, .hero-seal, .scroll-cue').evaluateAll((elements) => ({
    names: elements.map((element) => getComputedStyle(element).animationName),
    delays: elements.map((element) => getComputedStyle(element).animationDelay),
  }));
  expect(heroDrawingSequence.names).toEqual(['hero-mountain-back-in', 'hero-mountain-front-in', 'hero-seal-stamp', 'hero-scroll-cue-in']);
  expect(heroDrawingSequence.delays).toEqual(['0.18s', '0.34s', '0.72s', '1.08s']);

  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  await expect(map.locator('.map-region').first()).toBeVisible();
  const mapAnimation = await map.locator('.map-region').evaluateAll((elements) => ({
    names: elements.slice(0, 3).map((element) => getComputedStyle(element).animationName),
    delays: elements.slice(0, 3).map((element) => getComputedStyle(element).animationDelay),
    pathLength: elements[0]?.getAttribute('pathLength'),
  }));
  expect(mapAnimation.names.every((name) => name === 'map-region-draw')).toBe(true);
  expect(mapAnimation.delays[1]).not.toBe(mapAnimation.delays[0]);
  expect(mapAnimation.pathLength).toBe('1');
  const layerAnimation = await map.locator('.map-attraction-glyph, .map-label__glyph').evaluateAll((elements) => ({
    names: elements.slice(0, 4).map((element) => getComputedStyle(element).animationName),
    delays: elements.slice(0, 4).map((element) => getComputedStyle(element).animationDelay),
  }));
  expect(layerAnimation.names.every((name) => name === 'map-layer-pop-in')).toBe(true);
  expect(layerAnimation.delays[1]).not.toBe(layerAnimation.delays[0]);
  await expect(map.locator('.map-viewport')).toHaveCSS('transition-property', 'transform');
  await expect(map.locator('.map-viewport')).toHaveCSS('transition-duration', '0.36s');
  const canvasBox = await map.locator('.map-canvas').boundingBox();
  expect(canvasBox).not.toBeNull();
  const backgroundX = (canvasBox?.x ?? 0) + 10;
  const backgroundY = (canvasBox?.y ?? 0) + 10;
  await page.mouse.move(backgroundX, backgroundY);
  await page.mouse.down();
  await expect(map.locator('.map-viewport')).toHaveClass(/is-dragging/);
  await page.mouse.move(backgroundX + 18, backgroundY + 12);
  await page.mouse.up();
  await expect(map.locator('.map-viewport')).not.toHaveClass(/is-dragging/);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const reducedMotion = await page.locator('.sun-disc, .mountain-back, .mountain-front, .hero-seal, .scroll-cue, .map-region, .map-region-emphasis, .map-attraction-glyph, .map-label__glyph').evaluateAll((elements) => elements.map((element) => getComputedStyle(element).animationName));
  expect(reducedMotion.every((name) => name === 'none')).toBe(true);
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
  await expect(map.locator('.map-region-emphasis')).toHaveCount(1);
  await expect(map.locator('.map-region-emphasis')).toHaveCSS('animation-name', 'map-region-emphasis-draw');
  await expect(map.getByLabel('地图层级')).toContainText('兴庆区');

  const transport = map.getByRole('button', { name: '交通' });
  await transport.click();
  await expect(transport).toHaveAttribute('aria-pressed', 'true');
  await transport.hover();
  await expect(transport).toHaveCSS('background-color', 'rgb(49, 95, 79)');
  await expect(transport).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(transport).toHaveCSS('transform', 'none');
});

test('地图区县图例支持键盘聚焦并联动区域高亮', async ({ page }) => {
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  await expect(map.getByRole('group', { name: '地图层级' })).toBeVisible();
  await expect(map.getByRole('group', { name: '地图控制' })).toBeVisible();
  await map.getByRole('button', { name: /银川市，按回车进入/ }).press('Enter');
  await expect(map.getByRole('button', { name: /兴庆区，按回车进入/ })).toBeVisible();
  const legend = map.getByRole('complementary', { name: '银川市区县颜色图例' });
  await expect(legend).toBeVisible();
  const legendItem = legend.getByRole('button', { name: '兴庆区，高亮地图区域' });
  await legendItem.focus();
  await expect(legendItem).toBeFocused();
  await expect(map.locator('.map-region.is-focused')).toHaveCount(1);
  await expect(map.locator('.map-region-emphasis')).toHaveCount(1);
  await expect(map.locator('.map-region-emphasis')).toHaveCSS('animation-name', 'map-region-emphasis-draw');
  await expect(map.locator('.map-region.is-focused')).toHaveAttribute('aria-label', /兴庆区/);
  await map.getByRole('button', { name: '交通' }).focus();
  await expect(map.locator('.map-region.is-focused')).toHaveCount(0);
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
  await expect(attractionFavorite).toHaveCSS('min-height', '44px');
  await attractionFavorite.hover();
  await expect(attractionFavorite).toHaveCSS('background-color', 'rgb(255, 243, 237)');
  await expect(attractionFavorite).toHaveCSS('color', 'rgb(169, 69, 53)');
  await attractionFavorite.click();
  await expect(attractionFavorite).toHaveAttribute('aria-pressed', 'true');

  await page.goto(`${appBase}routes`);
  const routeFavorite = page.getByRole('button', { name: /收藏/ }).first();
  await expect(routeFavorite).toHaveCSS('min-height', '44px');
  await routeFavorite.hover();
  await expect(routeFavorite).toHaveCSS('background-color', 'rgb(255, 243, 237)');
  await expect(routeFavorite).toHaveCSS('color', 'rgb(169, 69, 53)');

  await page.goto(`${appBase}favorites`);
  await expect(page.getByRole('heading', { name: '收藏的景点' })).toBeVisible();
});

test('收藏列表极窄屏保持紧凑行高与图标化操作', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('ningxia-tourism-favorites', JSON.stringify({
      attraction: ['ningxiamuseum', 'shahu'],
      route: ['classic-3day', 'quick-1day'],
    }));
  });
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${appBase}favorites`);
    const rows = page.locator('.favorite-row, .favorite-route-row');
    await expect(rows.first()).toBeVisible();
    const layout = await rows.evaluateAll((elements) => elements.map((element) => {
      const row = element.getBoundingClientRect();
      const favorite = element.querySelector('.favorite-button');
      const favoriteRect = favorite?.getBoundingClientRect();
      return {
        rowHeight: row.height,
        rowRight: row.right,
        favoriteWidth: favoriteRect?.width ?? 0,
        favoriteHeight: favoriteRect?.height ?? 0,
        favoriteTop: favoriteRect?.top ?? 0,
        rowTop: row.top,
      };
    }));
    expect(layout).toHaveLength(4);
    expect(layout.every((item) => item.rowHeight <= 100)).toBe(true);
    expect(layout.every((item) => item.favoriteWidth >= 44 && item.favoriteHeight >= 44)).toBe(true);
    expect(layout.every((item) => Math.abs(item.favoriteTop - item.rowTop - (item.rowHeight - item.favoriteHeight) / 2) <= 1)).toBe(true);
    expect(layout.every((item) => item.rowRight <= width)).toBe(true);
    if (width <= 360) expect(layout.every((item) => item.favoriteWidth === 44)).toBe(true);
    else expect(layout.every((item) => item.favoriteWidth > 44)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('景点对比操作保持状态反馈一致', async ({ page }) => {
  await page.goto(`${appBase}attractions`);
  const compareToggle = page.getByRole('button', { name: '加入对比' }).first();
  await compareToggle.hover();
  await expect(compareToggle).toHaveCSS('background-color', 'rgb(238, 243, 237)');
  await expect(compareToggle).toHaveCSS('color', 'rgb(49, 95, 79)');
  await compareToggle.click();
  await expect(page.getByRole('button', { name: '已加入对比' }).first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('link', { name: '查看对比' })).toHaveCSS('min-height', '44px');
  await expect(page.getByRole('region', { name: '景点横向比较表' })).toBeVisible();
});

test('公共反馈层为移动端底部手势区预留安全间距', async ({ page }) => {
  await page.goto(`${appBase}attractions`);
  const safeAreaRulesPresent = await page.evaluate(() => {
    const cssText = Array.from(document.styleSheets).flatMap((sheet) => {
      try { return Array.from(sheet.cssRules).map((rule) => rule.cssText); } catch { return []; }
    }).join('\n');
    return ['.toast', '.sw-update-toast', '.compare-dock'].every((selector) => {
      const ruleStart = cssText.indexOf(selector);
      return ruleStart >= 0 && cssText.slice(ruleStart, ruleStart + 700).includes('safe-area-inset-bottom');
    });
  });
  expect(safeAreaRulesPresent).toBe(true);
});

test('收藏页移动端英雄区保持紧凑首屏节奏', async ({ page }) => {
  await page.goto(`${appBase}favorites`);
  const heroPaddingBottom = await page.locator('.favorites-hero').evaluate((element) => getComputedStyle(element).paddingBottom);
  if ((page.viewportSize()?.width ?? 999) <= 768) {
    expect(heroPaddingBottom).toBe('76px');
  } else {
    expect(heroPaddingBottom).toBe('58px');
  }
  const heroBottom = await page.locator('.favorites-hero').evaluate((element) => element.getBoundingClientRect().bottom);
  const firstSectionTop = await page.locator('.favorites-section').first().evaluate((element) => element.getBoundingClientRect().top);
  expect(firstSectionTop - heroBottom).toBeGreaterThanOrEqual(38);
  expect(firstSectionTop - heroBottom).toBeLessThan(46);
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
  const routeDetailFavorite = page.locator('.route-detail-actions .favorite-button');
  await expect(routeDetailFavorite).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.08)');
  await routeDetailFavorite.hover();
  await expect(routeDetailFavorite).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.15)');
  await expect(routeDetailFavorite).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.locator('.route-day')).toHaveCount(3);
  await expect(page.getByRole('navigation', { name: '按天快速跳转' }).getByRole('link')).toHaveCount(3);
  const dayTwoLink = page.getByRole('navigation', { name: '按天快速跳转' }).getByRole('link', { name: /D02/ });
  await expect(dayTwoLink).toHaveAttribute('href', '#route-day-2');
  await dayTwoLink.click();
  await expect(page).toHaveURL(/#route-day-2$/);
  const routeDayOffset = await page.evaluate(() => {
    const target = document.querySelector<HTMLElement>('#route-day-2');
    const header = document.querySelector<HTMLElement>('.site-header');
    const dayNav = document.querySelector<HTMLElement>('.route-day-nav');
    return {
      top: target?.getBoundingClientRect().top ?? -1,
      safeTop: (header?.getBoundingClientRect().height ?? 0) + (dayNav?.getBoundingClientRect().height ?? 0),
    };
  });
  expect(routeDayOffset.top).toBeGreaterThanOrEqual(routeDayOffset.safeTop - 2);
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

  await page.goto(`${appBase}food/shouzhua-yangrou`);
  const foodShareButton = page.locator('.food-detail-actions .btn-quiet');
  await expect(foodShareButton).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.7)');
  await expect(foodShareButton).toHaveCSS('color', 'rgb(36, 35, 31)');
  await foodShareButton.hover();
  await expect(foodShareButton).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(foodShareButton).toHaveCSS('color', 'rgb(36, 35, 31)');
});

test('路线日程深链接会定位到对应天数', async ({ page }) => {
  await page.goto(`${appBase}routes/classic-3day#route-day-2`);
  await expect(page.getByRole('region', { name: '西夏陵与镇北堡' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect(page.locator('#route-day-2')).toBeVisible();
});

test('路线详情时间线使用渐进绘图并尊重减少动效设置', async ({ page }) => {
  await page.goto(`${appBase}routes/classic-3day`);
  const routeStops = page.locator('.route-stops').first();
  await expect(routeStops).toBeVisible();
  const motion = await routeStops.evaluate((element) => {
    const stops = [...element.querySelectorAll<HTMLElement>('.route-stop')];
    const rail = getComputedStyle(element, '::before');
    return {
      railAnimation: rail.animationName,
      stopAnimations: stops.slice(0, 2).map((stop) => getComputedStyle(stop).animationName),
      stopDelays: stops.slice(0, 2).map((stop) => getComputedStyle(stop).animationDelay),
      stopInkRingAnimation: getComputedStyle(stops[0].querySelector<HTMLElement>('.stop-number') as HTMLElement, '::after').animationName,
    };
  });
  expect(motion.railAnimation).toBe('route-rail-draw');
  expect(motion.stopAnimations).toEqual(['route-stop-in', 'route-stop-in']);
  expect(motion.stopDelays[0]).toBe('0s');
  expect(motion.stopDelays[1]).toBe('0.07s');
  expect(motion.stopInkRingAnimation).toBe('route-stop-ink-ring');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const reducedMotion = await page.locator('.route-stops').first().evaluate((element) => ({
    railAnimation: getComputedStyle(element, '::before').animationName,
    stopAnimation: getComputedStyle(element.querySelector<HTMLElement>('.route-stop') as HTMLElement).animationName,
    stopInkRingAnimation: getComputedStyle(element.querySelector<HTMLElement>('.stop-number') as HTMLElement, '::after').animationName,
    stopOpacity: getComputedStyle(element.querySelector<HTMLElement>('.route-stop') as HTMLElement).opacity,
  }));
  expect(reducedMotion).toEqual({ railAnimation: 'none', stopAnimation: 'none', stopInkRingAnimation: 'none', stopOpacity: '1' });
});

test('路线详情按首屏、导航、日程与侧栏层级完成渐进绘图', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${appBase}routes/classic-3day`);
  await expect(page.locator('.route-detail-hero')).toBeVisible();
  await expect(page.locator('.route-sidebar > *').first()).toBeVisible();
  const motion = await page.evaluate(() => {
    const first = <T extends Element>(selector: string) => document.querySelector<T>(selector);
    const copy = first<HTMLElement>('.route-detail-hero-grid > div:first-child');
    const visual = first<HTMLElement>('.route-detail-visual');
    const title = first<HTMLElement>('.route-detail-hero h1');
    const fact = first<HTMLElement>('.route-detail-facts span');
    const actions = first<HTMLElement>('.route-detail-actions');
    const dayNav = first<HTMLElement>('.route-day-nav');
    const dayLink = first<HTMLElement>('.route-day-nav a');
    const audience = first<HTMLElement>('.route-audience');
    const marker = first<HTMLElement>('.day-marker');
    const dayHeading = first<HTMLElement>('.day-content > header');
    const sidebar = first<HTMLElement>('.route-sidebar > *');
    return {
      copyAnimation: copy ? getComputedStyle(copy).animationName : '',
      visualAnimation: visual ? getComputedStyle(visual).animationName : '',
      titleInkAnimation: title ? getComputedStyle(title, '::after').animationName : '',
      factAnimation: fact ? getComputedStyle(fact).animationName : '',
      actionAnimation: actions ? getComputedStyle(actions).animationName : '',
      dayNavAnimation: dayNav ? getComputedStyle(dayNav).animationName : '',
      dayLinkAnimation: dayLink ? getComputedStyle(dayLink).animationName : '',
      audienceAnimation: audience ? getComputedStyle(audience).animationName : '',
      markerAnimation: marker ? getComputedStyle(marker).animationName : '',
      markerInkAnimation: marker ? getComputedStyle(marker, '::after').animationName : '',
      dayHeadingAnimation: dayHeading ? getComputedStyle(dayHeading).animationName : '',
      sidebarAnimation: sidebar ? getComputedStyle(sidebar).animationName : '',
      navLinkDelay: dayLink ? getComputedStyle(dayLink).animationDelay : '',
    };
  });
  expect(motion).toMatchObject({
    copyAnimation: 'route-detail-copy-in',
    visualAnimation: 'route-detail-visual-in',
    titleInkAnimation: 'route-detail-title-ink',
    factAnimation: 'route-detail-fact-in',
    actionAnimation: 'route-detail-actions-in',
    dayNavAnimation: 'route-day-nav-in',
    dayLinkAnimation: 'route-day-link-in',
    audienceAnimation: 'route-section-in',
    markerAnimation: 'route-day-marker-in',
    markerInkAnimation: 'route-day-marker-ink',
    dayHeadingAnimation: 'route-section-in',
    sidebarAnimation: 'route-sidebar-in',
    navLinkDelay: '0.26s',
  });
});

test('路线详情减少动效时恢复静态层级与墨线', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${appBase}routes/classic-3day`);
  await expect(page.locator('.route-detail-hero')).toBeVisible();
  const motion = await page.evaluate(() => {
    const first = <T extends Element>(selector: string) => document.querySelector<T>(selector);
    const title = first<HTMLElement>('.route-detail-hero h1');
    const marker = first<HTMLElement>('.day-marker');
    const selectors = ['.route-detail-hero-grid > div:first-child', '.route-detail-visual', '.route-detail-facts span', '.route-detail-actions', '.route-day-nav', '.route-day-nav a', '.route-audience', '.day-marker', '.day-content > header', '.route-sidebar > *'];
    return {
      animations: selectors.map((selector) => getComputedStyle(first<HTMLElement>(selector) as HTMLElement).animationName),
      titleInkAnimation: title ? getComputedStyle(title, '::after').animationName : '',
      titleInkOpacity: title ? getComputedStyle(title, '::after').opacity : '',
      markerInkAnimation: marker ? getComputedStyle(marker, '::after').animationName : '',
      markerInkOpacity: marker ? getComputedStyle(marker, '::after').opacity : '',
    };
  });
  expect(motion.animations.every((animationName) => animationName === 'none')).toBe(true);
  expect(motion.titleInkAnimation).toBe('none');
  expect(motion.titleInkOpacity).toBe('0.86');
  expect(motion.markerInkAnimation).toBe('none');
  expect(motion.markerInkOpacity).toBe('0.72');
});

test('路线详情极窄屏操作入口保持同一行', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(`${appBase}routes/quick-1day`);
  const actions = page.locator('.route-detail-actions');
  await expect(actions).toBeVisible();
  const layout = await actions.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    children: [...element.children].map((child) => {
      const rect = child.getBoundingClientRect();
      return { top: rect.top, height: rect.height, right: rect.right };
    }),
    pageWidth: document.documentElement.scrollWidth,
    windowWidth: window.innerWidth,
  }));
  expect(layout.children).toHaveLength(3);
  expect(layout.children.every((child) => Math.abs(child.top - layout.children[0].top) <= 1)).toBe(true);
  expect(layout.children.every((child) => child.height >= 44)).toBe(true);
  expect(layout.children.at(-1)?.right ?? 0).toBeLessThanOrEqual(layout.windowWidth - 12 + 1);
  expect(layout.height).toBeLessThanOrEqual(52);
  expect(layout.pageWidth).toBeLessThanOrEqual(layout.windowWidth + 1);
});

test('行前指南极窄屏首屏操作入口保持同一行', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(`${appBase}guide`);
  const actions = page.locator('.guide-hero-actions');
  await expect(actions).toBeVisible();
  const layout = await actions.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    children: [...element.children].map((child) => {
      const rect = child.getBoundingClientRect();
      return { top: rect.top, right: rect.right, height: rect.height };
    }),
    pageWidth: document.documentElement.scrollWidth,
    windowWidth: window.innerWidth,
  }));
  expect(layout.children).toHaveLength(2);
  expect(layout.children.every((child) => Math.abs(child.top - layout.children[0].top) <= 1)).toBe(true);
  expect(layout.children.every((child) => child.height >= 44)).toBe(true);
  expect(layout.children.at(-1)?.right ?? 0).toBeLessThanOrEqual(layout.windowWidth - 12 + 1);
  expect(layout.height).toBeLessThanOrEqual(52);
  expect(layout.pageWidth).toBeLessThanOrEqual(layout.windowWidth + 1);
});

test('路线筛选同步地址并展示内容核实概览', async ({ page }) => {
  await page.goto(`${appBase}routes`);
  if ((page.viewportSize()?.width ?? 999) <= 768) {
    const filterToggle = page.getByRole('button', { name: /筛选路线/ });
    await expect(filterToggle).toHaveAttribute('aria-expanded', 'false');
    await filterToggle.click();
    await expect(filterToggle).toHaveAttribute('aria-expanded', 'true');
  }
  const routeFilters = page.getByRole('region', { name: '路线筛选' });
  await expect(routeFilters.getByRole('group', { name: '行程天数' })).toBeVisible();
  await expect(routeFilters.getByRole('group', { name: '涉及城市' })).toBeVisible();
  await expect(routeFilters.getByRole('group', { name: '旅行主题' })).toBeVisible();
  await expect(routeFilters.getByRole('group', { name: '行程节奏' })).toBeVisible();
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
  if ((page.viewportSize()?.width ?? 999) <= 768) {
    const layout = await page.locator('.city-table-wrap').evaluate((element) => ({
      tableWidth: element.scrollWidth,
      viewportWidth: element.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
      windowWidth: window.innerWidth,
    }));
    expect(layout.tableWidth).toBeGreaterThan(layout.viewportWidth);
    expect(layout.pageWidth).toBeLessThanOrEqual(layout.windowWidth + 1);
  }
});

test('五城卡片图片在极窄屏按卡片宽度自适应', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(`${appBase}cities`);
  const card = page.locator('.city-card').first();
  const image = card.locator('.city-card-image');
  const sizes = await image.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const cardRect = element.closest('.city-card')?.getBoundingClientRect();
    return { imageWidth: rect.width, cardWidth: cardRect?.width ?? 0, imageHeight: rect.height, pageWidth: document.documentElement.scrollWidth };
  });
  expect(sizes.imageWidth).toBeLessThanOrEqual(sizes.cardWidth);
  expect(sizes.imageWidth).toBeGreaterThan(sizes.cardWidth - 4);
  expect(sizes.imageHeight).toBeGreaterThan(0);
  expect(sizes.pageWidth).toBeLessThanOrEqual(320);
});

test('城市详情关联卡片图片与窄屏内容列宽一致', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(`${appBase}city/yinchuan`);
  const card = page.locator('.city-attraction-row a').first();
  await expect(card).toBeVisible();
  const sizes = await card.evaluate((element) => {
    const image = element.querySelector('img');
    const imageRect = image?.getBoundingClientRect();
    const columns = getComputedStyle(element).gridTemplateColumns.split(' ');
    return {
      firstColumnWidth: Number.parseFloat(columns[0] ?? '0'),
      imageWidth: imageRect?.width ?? 0,
      imageHeight: imageRect?.height ?? 0,
      pageWidth: document.documentElement.scrollWidth,
      windowWidth: window.innerWidth,
    };
  });
  expect(sizes.imageWidth).toBeLessThanOrEqual(sizes.firstColumnWidth + 1);
  expect(sizes.imageWidth).toBeGreaterThan(0);
  expect(sizes.imageHeight).toBeGreaterThan(0);
  expect(sizes.pageWidth).toBeLessThanOrEqual(sizes.windowWidth + 1);
});

test('桌面端五城卡片按行保持行动入口底部对齐', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 999) <= 768) test.skip();
  await page.goto(`${appBase}cities`);
  const cards = page.locator('.city-card');
  await expect(cards.first()).toBeVisible();
  const bottoms = await cards.evaluateAll((elements) => elements.map((element) => element.querySelector('.text-link')?.getBoundingClientRect().bottom ?? 0));
  expect(bottoms.length).toBe(5);
  for (let index = 0; index + 1 < bottoms.length; index += 2) {
    expect(Math.abs(bottoms[index] - bottoms[index + 1])).toBeLessThanOrEqual(1);
  }
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
  const checklistProgress = page.getByRole('progressbar', { name: /行前清单进度：已完成 0 项，共/ });
  await expect(checklistProgress).toHaveAttribute('aria-valuenow', '0');

  const pendingItem = page.getByRole('checkbox', { name: '打开核心景点来源，确认当天开放与预约' });
  const pendingLabel = page.locator('.travel-checklist label').filter({ hasText: '打开核心景点来源，确认当天开放与预约' });
  await pendingLabel.hover();
  await expect(pendingLabel).toHaveCSS('background-color', 'rgb(247, 251, 246)');
  await pendingItem.focus();
  await expect(pendingLabel).toHaveCSS('outline-style', 'solid');

  const firstItem = page.getByRole('checkbox', { name: '核对身份证件、往返车票与入住日期' });
  await firstItem.check();
  await expect(firstItem).toBeChecked();
  await expect(page.getByRole('progressbar', { name: /行前清单进度：已完成 1 项，共/ })).toHaveAttribute('aria-valuenow', '1');
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

test('旅行手记栏目在320px窄屏保持可横向浏览', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(`${appBase}journal`);
  const tabList = page.locator('.journal-tabs');
  const lastTab = page.getByRole('tab', { name: /旅行专题/ });
  await expect(tabList).toHaveCSS('overflow-x', 'auto');
  await lastTab.scrollIntoViewIfNeeded();
  const visibility = await lastTab.evaluate((element) => {
    const parent = element.closest('.journal-tabs');
    if (!parent) return { fullyVisible: false };
    const tabRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return { fullyVisible: tabRect.left >= parentRect.left - 1 && tabRect.right <= parentRect.right + 1 };
  });
  expect(visibility.fullyVisible).toBe(true);
});

test('旅行手记列表与详情按阅读层级完成渐进绘图', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${appBase}journal`);
  await expect(page.locator('.journal-card').first()).toBeVisible();
  const listMotion = await page.evaluate(() => {
    const card = document.querySelector('.journal-card');
    const title = card?.querySelector('h2');
    const heroCopy = document.querySelector('.journal-hero-grid > div:first-child');
    const cover = document.querySelector('.journal-photo-visual');
    const principle = document.querySelector('.journal-principles article');
    return {
      cardAnimation: card ? getComputedStyle(card).animationName : '',
      cardIndex: card?.style.getPropertyValue('--journal-card-index'),
      titleAnimation: title ? getComputedStyle(title, '::after').animationName : '',
      heroAnimation: heroCopy ? getComputedStyle(heroCopy).animationName : '',
      coverAnimation: cover ? getComputedStyle(cover).animationName : '',
      principleAnimation: principle ? getComputedStyle(principle).animationName : '',
    };
  });
  expect(listMotion).toMatchObject({
    cardAnimation: 'journal-card-in',
    cardIndex: '0',
    titleAnimation: 'journal-card-title-ink',
    heroAnimation: 'journal-copy-in',
    coverAnimation: 'journal-photo-in',
    principleAnimation: 'journal-principle-in',
  });

  await page.goto(`${appBase}journal/guide/zhongwei-sand-water-choice`);
  await expect(page.locator('.journal-detail-title h1')).toBeVisible();
  const detailMotion = await page.evaluate(() => {
    const hero = document.querySelector('.journal-detail-hero > picture');
    const title = document.querySelector('.journal-detail-title');
    const heading = title?.querySelector('h1');
    const facts = document.querySelector('.journal-fact-strip');
    const note = document.querySelector('.journal-article > .receipt-card');
    const body = document.querySelector('.journal-article > .markdown-body');
    const sidebar = document.querySelector('.journal-sidebar > *');
    return {
      heroAnimation: hero ? getComputedStyle(hero).animationName : '',
      titleAnimation: title ? getComputedStyle(title).animationName : '',
      headingInkAnimation: heading ? getComputedStyle(heading, '::after').animationName : '',
      factsAnimation: facts ? getComputedStyle(facts).animationName : '',
      noteAnimation: note ? getComputedStyle(note).animationName : '',
      bodyAnimation: body ? getComputedStyle(body).animationName : '',
      sidebarAnimation: sidebar ? getComputedStyle(sidebar).animationName : '',
    };
  });
  expect(detailMotion).toMatchObject({
    heroAnimation: 'journal-detail-photo-in',
    titleAnimation: 'journal-detail-title-in',
    headingInkAnimation: 'journal-detail-title-ink',
    factsAnimation: 'journal-detail-fact-in',
    noteAnimation: 'journal-detail-block-in',
    bodyAnimation: 'journal-detail-body-in',
    sidebarAnimation: 'journal-sidebar-in',
  });
});

test('旅行手记减少动效时恢复静态绘图', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${appBase}journal`);
  await expect(page.locator('.journal-card').first()).toBeVisible();
  const listMotion = await page.evaluate(() => {
    const card = document.querySelector('.journal-card');
    const title = card?.querySelector('h2');
    const cover = document.querySelector('.journal-photo-visual');
    return {
      cardAnimation: card ? getComputedStyle(card).animationName : '',
      cardOpacity: card ? getComputedStyle(card).opacity : '',
      titleAnimation: title ? getComputedStyle(title, '::after').animationName : '',
      titleOpacity: title ? getComputedStyle(title, '::after').opacity : '',
      coverAnimation: cover ? getComputedStyle(cover).animationName : '',
      coverOpacity: cover ? getComputedStyle(cover).opacity : '',
    };
  });
  expect(listMotion).toMatchObject({
    cardAnimation: 'none',
    cardOpacity: '1',
    titleAnimation: 'none',
    titleOpacity: '0.82',
    coverAnimation: 'none',
    coverOpacity: '1',
  });

  await page.goto(`${appBase}journal/guide/zhongwei-sand-water-choice`);
  await expect(page.locator('.journal-detail-title h1')).toBeVisible();
  const detailMotion = await page.evaluate(() => {
    const hero = document.querySelector('.journal-detail-hero > picture');
    const title = document.querySelector('.journal-detail-title');
    const heading = title?.querySelector('h1');
    const facts = document.querySelector('.journal-fact-strip');
    const note = document.querySelector('.journal-article > .receipt-card');
    const body = document.querySelector('.journal-article > .markdown-body');
    const sidebar = document.querySelector('.journal-sidebar > *');
    return {
      heroAnimation: hero ? getComputedStyle(hero).animationName : '',
      heroOpacity: hero ? getComputedStyle(hero).opacity : '',
      titleAnimation: title ? getComputedStyle(title).animationName : '',
      headingInkAnimation: heading ? getComputedStyle(heading, '::after').animationName : '',
      headingInkOpacity: heading ? getComputedStyle(heading, '::after').opacity : '',
      factsAnimation: facts ? getComputedStyle(facts).animationName : '',
      noteAnimation: note ? getComputedStyle(note).animationName : '',
      bodyAnimation: body ? getComputedStyle(body).animationName : '',
      sidebarAnimation: sidebar ? getComputedStyle(sidebar).animationName : '',
    };
  });
  expect(detailMotion).toMatchObject({
    heroAnimation: 'none',
    heroOpacity: '1',
    titleAnimation: 'none',
    headingInkAnimation: 'none',
    headingInkOpacity: '0.86',
    factsAnimation: 'none',
    noteAnimation: 'none',
    bodyAnimation: 'none',
    sidebarAnimation: 'none',
  });
});

test('景点、美食与城市详情按内容层级完成渐进绘图', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  await page.goto(`${appBase}attraction/pengyangtitian`);
  await expect(page.getByRole('heading', { level: 1, name: '彭阳梯田' })).toBeVisible();
  const attractionMotion = await page.evaluate(() => {
    const hero = document.querySelector('.detail-hero > picture');
    const title = document.querySelector('.detail-title');
    const heading = title?.querySelector('h1');
    const highlight = document.querySelector('.highlight-list li');
    const info = document.querySelector('.info-grid > div');
    const sidebar = document.querySelector('.detail-sidebar > *');
    return {
      heroAnimation: hero ? getComputedStyle(hero).animationName : '',
      titleAnimation: title ? getComputedStyle(title).animationName : '',
      headingInkAnimation: heading ? getComputedStyle(heading, '::after').animationName : '',
      highlightAnimation: highlight ? getComputedStyle(highlight).animationName : '',
      infoAnimation: info ? getComputedStyle(info).animationName : '',
      sidebarAnimation: sidebar ? getComputedStyle(sidebar).animationName : '',
    };
  });
  expect(attractionMotion).toMatchObject({
    heroAnimation: 'detail-hero-photo-in',
    titleAnimation: 'detail-copy-in',
    headingInkAnimation: 'detail-title-ink',
    highlightAnimation: 'detail-info-in',
    infoAnimation: 'detail-info-in',
    sidebarAnimation: 'detail-side-in',
  });

  await page.goto(`${appBase}food/shouzhua-yangrou`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('手抓羊肉');
  const foodMotion = await page.evaluate(() => {
    const copy = document.querySelector('.food-detail-hero-grid > div:first-child');
    const visual = document.querySelector('.food-detail-visual');
    const heading = document.querySelector('.food-detail-hero h1');
    const section = document.querySelector('.detail-main > .detail-section');
    return {
      copyAnimation: copy ? getComputedStyle(copy).animationName : '',
      visualAnimation: visual ? getComputedStyle(visual).animationName : '',
      headingInkAnimation: heading ? getComputedStyle(heading, '::after').animationName : '',
      sectionAnimation: section ? getComputedStyle(section).animationName : '',
    };
  });
  expect(foodMotion).toMatchObject({
    copyAnimation: 'detail-copy-in',
    visualAnimation: 'detail-visual-in',
    headingInkAnimation: 'detail-title-ink',
    sectionAnimation: 'detail-section-in',
  });

  await page.goto(`${appBase}city/yinchuan`);
  await expect(page.getByRole('heading', { level: 1, name: '银川市' })).toBeVisible();
  const cityMotion = await page.evaluate(() => {
    const hero = document.querySelector('.city-detail-hero > picture');
    const copy = document.querySelector('.city-detail-copy');
    const heading = copy?.querySelector('h1');
    const facts = document.querySelector('.city-facts');
    const fact = document.querySelector('.city-facts > div');
    const sidebar = document.querySelector('.city-sidebar > section');
    const attraction = document.querySelector('.city-attraction-row a');
    const route = document.querySelector('.route-mini-grid a');
    return {
      heroAnimation: hero ? getComputedStyle(hero).animationName : '',
      copyAnimation: copy ? getComputedStyle(copy).animationName : '',
      headingInkAnimation: heading ? getComputedStyle(heading, '::after').animationName : '',
      factsAnimation: facts ? getComputedStyle(facts).animationName : '',
      factAnimation: fact ? getComputedStyle(fact).animationName : '',
      sidebarAnimation: sidebar ? getComputedStyle(sidebar).animationName : '',
      attractionAnimation: attraction ? getComputedStyle(attraction).animationName : '',
      routeAnimation: route ? getComputedStyle(route).animationName : '',
    };
  });
  expect(cityMotion).toMatchObject({
    heroAnimation: 'detail-hero-photo-in',
    copyAnimation: 'detail-copy-in',
    headingInkAnimation: 'detail-title-ink',
    factsAnimation: 'detail-section-in',
    factAnimation: 'detail-info-in',
    sidebarAnimation: 'detail-side-in',
    attractionAnimation: 'detail-info-in',
    routeAnimation: 'detail-info-in',
  });
});

test('景点、美食与城市详情减少动效时恢复静态绘图', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto(`${appBase}attraction/pengyangtitian`);
  await expect(page.getByRole('heading', { level: 1, name: '彭阳梯田' })).toBeVisible();
  const attractionMotion = await page.evaluate(() => {
    const hero = document.querySelector('.detail-hero > picture');
    const title = document.querySelector('.detail-title');
    const heading = title?.querySelector('h1');
    const card = document.querySelector('.detail-sidebar > *');
    return {
      heroAnimation: hero ? getComputedStyle(hero).animationName : '',
      heroOpacity: hero ? getComputedStyle(hero).opacity : '',
      titleAnimation: title ? getComputedStyle(title).animationName : '',
      headingInkAnimation: heading ? getComputedStyle(heading, '::after').animationName : '',
      headingInkOpacity: heading ? getComputedStyle(heading, '::after').opacity : '',
      cardAnimation: card ? getComputedStyle(card).animationName : '',
    };
  });
  expect(attractionMotion).toMatchObject({
    heroAnimation: 'none',
    heroOpacity: '1',
    titleAnimation: 'none',
    headingInkAnimation: 'none',
    headingInkOpacity: '0.84',
    cardAnimation: 'none',
  });

  await page.goto(`${appBase}food/shouzhua-yangrou`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('手抓羊肉');
  const foodMotion = await page.evaluate(() => {
    const copy = document.querySelector('.food-detail-hero-grid > div:first-child');
    const visual = document.querySelector('.food-detail-visual');
    return {
      copyAnimation: copy ? getComputedStyle(copy).animationName : '',
      visualAnimation: visual ? getComputedStyle(visual).animationName : '',
      copyOpacity: copy ? getComputedStyle(copy).opacity : '',
      visualOpacity: visual ? getComputedStyle(visual).opacity : '',
    };
  });
  expect(foodMotion).toMatchObject({
    copyAnimation: 'none',
    visualAnimation: 'none',
    copyOpacity: '1',
    visualOpacity: '1',
  });

  await page.goto(`${appBase}city/yinchuan`);
  await expect(page.getByRole('heading', { level: 1, name: '银川市' })).toBeVisible();
  const cityMotion = await page.evaluate(() => {
    const hero = document.querySelector('.city-detail-hero > picture');
    const copy = document.querySelector('.city-detail-copy');
    const heading = copy?.querySelector('h1');
    const facts = document.querySelector('.city-facts');
    const sidebar = document.querySelector('.city-sidebar > section');
    return {
      heroAnimation: hero ? getComputedStyle(hero).animationName : '',
      copyAnimation: copy ? getComputedStyle(copy).animationName : '',
      headingInkAnimation: heading ? getComputedStyle(heading, '::after').animationName : '',
      headingInkOpacity: heading ? getComputedStyle(heading, '::after').opacity : '',
      factsAnimation: facts ? getComputedStyle(facts).animationName : '',
      sidebarAnimation: sidebar ? getComputedStyle(sidebar).animationName : '',
    };
  });
  expect(cityMotion).toMatchObject({
    heroAnimation: 'none',
    copyAnimation: 'none',
    headingInkAnimation: 'none',
    headingInkOpacity: '0.84',
    factsAnimation: 'none',
    sidebarAnimation: 'none',
  });
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
  await expect(page.locator('.journal-toc a').first()).toHaveCSS('min-height', '44px');
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

test('详情关联与搜索结果箭头使用统一轻量反馈', async ({ page }) => {
  await page.goto(`${appBase}attraction/ningxiamuseum`);
  const nearby = page.locator('.nearby-grid a').first();
  await nearby.hover();
  await expect(nearby.locator('svg')).toHaveCSS('color', 'rgb(49, 95, 79)');
  await expect(nearby.locator('svg')).not.toHaveCSS('transform', 'none');

  await page.goto(`${appBase}search?q=%E9%93%B6%E5%B7%9D`);
  const result = page.locator('.search-result').first();
  await result.hover();
  await expect(result.locator('svg')).toHaveCSS('color', 'rgb(49, 95, 79)');
  await expect(result.locator('svg')).not.toHaveCSS('transform', 'none');
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

test('行前指南按阅读顺序完成错峰绘图', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${appBase}guide`);
  await expect(page.locator('.season-card').first()).toBeVisible();
  const motion = await page.evaluate(() => {
    const seasonCard = document.querySelector('.season-card');
    const seasonTitle = seasonCard?.querySelector('h3');
    const durationCard = document.querySelector('.duration-card');
    const durationTitle = durationCard?.querySelector('strong');
    const transitFlow = document.querySelector('.transit-flow');
    const transitItem = document.querySelector('.transit-flow article');
    const transitIcon = document.querySelector('.transit-icon');
    return {
      seasonAnimation: seasonCard ? getComputedStyle(seasonCard).animationName : '',
      seasonIndex: seasonCard?.style.getPropertyValue('--guide-card-index'),
      seasonTitleAnimation: seasonTitle ? getComputedStyle(seasonTitle, '::after').animationName : '',
      durationAnimation: durationCard ? getComputedStyle(durationCard).animationName : '',
      durationIndex: durationCard?.style.getPropertyValue('--guide-card-index'),
      durationTitleAnimation: durationTitle ? getComputedStyle(durationTitle, '::after').animationName : '',
      transitLineAnimation: transitFlow ? getComputedStyle(transitFlow, '::before').animationName : '',
      transitItemAnimation: transitItem ? getComputedStyle(transitItem).animationName : '',
      transitIndex: transitItem?.style.getPropertyValue('--guide-flow-index'),
      transitIconAnimation: transitIcon ? getComputedStyle(transitIcon).animationName : '',
    };
  });
  expect(motion.seasonAnimation).toBe('guide-card-in');
  expect(motion.seasonIndex).toBe('0');
  expect(motion.seasonTitleAnimation).toBe('guide-card-title-ink');
  expect(motion.durationAnimation).toBe('guide-card-in');
  expect(motion.durationIndex).toBe('0');
  expect(motion.durationTitleAnimation).toBe('guide-card-title-ink');
  expect(['guide-transit-line-draw', 'guide-transit-line-draw-vertical']).toContain(motion.transitLineAnimation);
  expect(motion.transitItemAnimation).toBe('guide-flow-in');
  expect(motion.transitIndex).toBe('0');
  expect(motion.transitIconAnimation).toBe('guide-flow-icon-stamp');

  const checklistItem = page.getByRole('checkbox', { name: '核对身份证件、往返车票与入住日期' });
  await checklistItem.check();
  await expect(page.locator('.travel-checklist label.checked svg').first()).toHaveCSS('animation-name', 'guide-check-draw');
});

test('行前指南减少动效时恢复静态绘图', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${appBase}guide`);
  const checklistItem = page.getByRole('checkbox', { name: '核对身份证件、往返车票与入住日期' });
  await checklistItem.check();
  const motion = await page.evaluate(() => {
    const seasonCard = document.querySelector('.season-card');
    const seasonTitle = seasonCard?.querySelector('h3');
    const transitFlow = document.querySelector('.transit-flow');
    const transitIcon = document.querySelector('.transit-icon');
    const checkedMark = document.querySelector('.travel-checklist label.checked svg');
    return {
      cardAnimation: seasonCard ? getComputedStyle(seasonCard).animationName : '',
      cardOpacity: seasonCard ? getComputedStyle(seasonCard).opacity : '',
      titleAnimation: seasonTitle ? getComputedStyle(seasonTitle, '::after').animationName : '',
      titleOpacity: seasonTitle ? getComputedStyle(seasonTitle, '::after').opacity : '',
      lineAnimation: transitFlow ? getComputedStyle(transitFlow, '::before').animationName : '',
      lineTransform: transitFlow ? getComputedStyle(transitFlow, '::before').transform : '',
      itemAnimation: transitFlow?.querySelector('article') ? getComputedStyle(transitFlow.querySelector('article') as HTMLElement).animationName : '',
      iconAnimation: transitIcon ? getComputedStyle(transitIcon).animationName : '',
      checkAnimation: checkedMark ? getComputedStyle(checkedMark).animationName : '',
    };
  });
  expect(motion).toMatchObject({
    cardAnimation: 'none',
    cardOpacity: '1',
    titleAnimation: 'none',
    titleOpacity: '0.82',
    lineAnimation: 'none',
    lineTransform: 'none',
    itemAnimation: 'none',
    iconAnimation: 'none',
    checkAnimation: 'none',
  });
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
  await expect(page.getByRole('img', { name: '宁夏山河主题图形' })).toBeVisible();
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
  const searchInput = page.getByRole('textbox', { name: '搜索宁夏旅行内容' });
  await expect(searchInput).toHaveCSS('min-height', '44px');
  if ((page.viewportSize()?.width ?? 999) > 768) {
    await expect(searchInput).toBeFocused();
  } else {
    await expect(searchInput).not.toBeFocused();
  }
  const suggestion = page.getByRole('button', { name: '沙漠' });
  await expect(suggestion).toHaveCSS('min-height', '44px');
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

test('地图窄屏控制区保持三列两行且不溢出', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 999) > 480, '仅验证窄屏地图控制布局');
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  const actions = map.locator('.map-actions');
  await expect(actions).toHaveCSS('display', 'grid');
  const metrics = await actions.locator('button').evaluateAll((buttons) => {
    const gridColumns = getComputedStyle(buttons[0]?.parentElement ?? document.body).gridTemplateColumns.trim().split(/\s+/).length;
    const rows = new Set(buttons.map((button) => Math.round(button.getBoundingClientRect().top)));
    return {
      count: buttons.length,
      columns: gridColumns,
      rows: rows.size,
      allInside: buttons.every((button) => button.getBoundingClientRect().right <= (button.parentElement?.getBoundingClientRect().right ?? Infinity) + 1),
    };
  });
  expect(metrics).toEqual({ count: 6, columns: 3, rows: 2, allInside: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()?.width ?? 999);
});

test('移动端景点预览使用底部面板提示与入场动效', async ({ page }) => {
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  await map.getByRole('button', { name: /沙坡头.*打开预览/ }).click();
  const selectedMarker = map.locator('.map-attraction.is-selected');
  await expect(selectedMarker.locator('.marker-ink-ring')).toHaveCount(1);
  await expect(selectedMarker.locator('.marker-ink-ring')).toHaveCSS('animation-name', 'marker-ink-ring-draw');
  const preview = page.getByRole('dialog', { name: '沙坡头旅游景区' });
  await expect(preview).toBeVisible();
  await expect(preview).toHaveCSS('animation-name', 'map-preview-in');
  if ((page.viewportSize()?.width ?? 999) <= 768) {
    await expect(preview).toHaveCSS('position', 'fixed');
    await expect(preview.locator('.map-preview-handle')).toBeVisible();
    await expect(preview.locator('.map-preview-handle')).toHaveAttribute('aria-hidden', 'true');
  } else {
    await expect(preview).toHaveCSS('position', 'absolute');
    await expect(preview.locator('.map-preview-handle')).not.toBeVisible();
  }
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

test('地图美食点位保持与景点一致的触控热区和聚焦反馈', async ({ page }) => {
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  await map.getByRole('button', { name: '美食' }).click();
  const foodMarker = map.locator('.map-food--interactive').first();
  await expect(foodMarker.locator('.marker-hit')).toHaveAttribute('r', '38');
  for (let index = 0; index < 80; index += 1) {
    if (await foodMarker.evaluate((element) => document.activeElement === element)) break;
    await page.keyboard.press('Tab');
  }
  await expect(foodMarker).toBeFocused();
  await expect(foodMarker.locator('circle:not(.marker-hit)')).toHaveCSS('fill', 'rgb(49, 95, 79)');
});

test('地图景点点位在移动端保持至少44px实际触控热区', async ({ page }) => {
  await page.goto(appBase);
  await page.locator('.lazy-map-container').scrollIntoViewIfNeeded();
  const map = page.getByRole('region', { name: '宁夏交互式旅游地图' });
  const attractionMarker = map.getByRole('button', { name: /沙坡头.*打开预览/ });
  const hit = attractionMarker.locator('.marker-hit');
  await expect(hit).toHaveAttribute('r', '38');
  const hitBox = await hit.boundingBox();
  expect(hitBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(hitBox?.height ?? 0).toBeGreaterThanOrEqual(44);
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
