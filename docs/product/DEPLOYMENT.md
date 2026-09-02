# 部署与 CI/CD 指南

本文档说明「塞上江南 · 宁夏旅行地图」的部署方式、GitHub Actions 流水线细节，以及如何把站点部署到其它静态托管平台。

> 相关文档：[技术架构文档 · 部署架构章节](./宁夏旅游地图技术架构.md#18-部署架构) ｜ [开发计划（CI 缓存 / 版本策略）](./DEVELOPMENT_PLAN.md) ｜ [贡献指南 · 本地自检 5 步法](../../CONTRIBUTING.md)

> 当前发布快照（v0.3.91）与验收命令：[RELEASE_STATUS.md](../RELEASE_STATUS.md)。线上地址：[minkelxy.github.io/ningxia-tourism](https://minkelxy.github.io/ningxia-tourism/)。

---

## 1. 架构总览

```
┌──────────────┐   push/PR    ┌────────────────────┐   passed   ┌───────────────┐
│  本地开发机   │ ──────────▶ │  GitHub Actions    │ ─────────▶ │ GitHub Pages  │
│  (dev/test)  │              │  12 步校验流水线   │            │  (gh-pages)   │
└──────────────┘              └────────────────────┘            └───────────────┘
```

- **目标环境**：[GitHub Pages](https://pages.github.com/)（静态托管）
- **工作流文件**：`.github/workflows/deploy.yml`
- **触发条件**：
  - `push` 到 `main`
  - `pull_request` 针对 `main`
  - `workflow_dispatch`（手动触发）
- **构建产物目录**：`dist/`（Vite 输出）
- **当前仓库运行时**：项目使用 Node.js 22；Action 主版本由 GitHub 官方维护，不能把 Action 内部运行时与项目 Node 版本混为一谈。

---

## 2. CI/CD 流水线详解

`deploy.yml` 分为两个 job：**build（构建与校验）** 与 **deploy（部署到 Pages）**。

### 2.1 build job

按顺序执行以下步骤；**任何一步失败都会终止流水线**：

| # | 步骤 | 命令 / Action | 说明 |
|---|------|---------------|------|
| 1 | Checkout | `actions/checkout@v7` | 拉取源码 |
| 2 | Setup Node | `actions/setup-node@v7` | Node.js 22，启用 `npm` 缓存 |
| 3 | Install deps | `npm ci` | 严格按 lockfile 安装 |
| 4 | Dependency audit | `npm run audit` | `npm audit --audit-level=high`，高危阻断 |
| 5 | Validate data | `npm run validate:data` | 数据 + 反糟粕 + 图片完整性门禁（180 天过期阻断等） |
| 5.1 | Verification reminder（warning only） | `npm run validate:data:reminder` | 扫描 170–180 天软提醒窗口；有窗口条目在 PR 详情页打 `::warning` 黄条，**不阻断构建**；硬阻断仍由 Step 5 承担 |
| 6 | Type check | `npm run check` | `tsc -b --noEmit` |
| 7 | Lint | `npm run lint` | ESLint（含 React Hooks / Refresh 规则） |
| 8 | Unit tests | `npm test` | Vitest 单元测试 + 组件测试（jsdom 环境） |
| 9 | Playwright E2E | `npm run test:e2e` | 使用 Playwright 缓存；首次用 `npx playwright install --with-deps chromium`；`VITE_BASE_URL=/ningxia-tourism/` |
| 10 | Production build | `npm run build` | validate → tsc → vite build → sitemap 生成；注入 `VITE_BASE_URL=/ningxia-tourism/` |
| 11 | Lighthouse gate | `npm run quality:lighthouse` | 移动端性能 ≥ 0.9，否则阻断 |
| 12 | Upload artifact | `actions/upload-pages-artifact@v5` | 仅在非 PR 时上传 `./dist`，为 deploy 做准备 |

### 2.2 deploy job

- **执行条件**：仅在非 PR 事件（push main / 手动运行）时触发
- **依赖**：`needs: build`
- 使用 `actions/deploy-pages@v5` 将 build job 上传的 artifact 部署到 GitHub Pages
- 绑定 `github-pages` 环境，部署 URL 通过 `steps.deployment.outputs.page_url` 暴露

### 2.3 权限与并发

```yaml
permissions:
  contents: read
  pages: write
  id-token: write      # Pages OIDC 必需
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true   # 同一分支多次推送自动取消旧任务
```

---

## 3. Vite 基准路径（base）

代码位于 `vite.config.ts`：

```ts
const base = process.env.GITHUB_ACTIONS
  ? '/ningxia-tourism/'
  : process.env.VITE_BASE_URL || '/';
```

- **GitHub Actions 构建**：强制 `base = /ningxia-tourism/`，与仓库名 Pages 子路径对齐
- **本地**：默认 `/`；如需模拟 Pages 路径，可：
  ```bash
  VITE_BASE_URL=/ningxia-tourism/ npm run dev
  VITE_BASE_URL=/ningxia-tourism/ npm run build && npm run preview
  ```

---

## 4. SPA 深层链接回退

GitHub Pages 默认不支持 SPA 路由的刷新回退。仓库使用 GitHub Actions 发布，并通过 `public/404.html` 解决：

- 构建时 `public/404.html` 会被原封不动复制到 `dist/404.html`
- 未匹配到的路径会先由 `404.html` 重定向到站点首页，再由 `index.html` 恢复原始路径并接管前端路由
- `npm run verify:pages-fallback` 会在 CI 中确认回退文件、仓库子路径和地址恢复逻辑均存在

Pages 设置必须保持为 **GitHub Actions**，不要再启用 `main /` 的 legacy 分支发布；两种发布源同时存在会导致首页与深层链接来自不同构建结果。

> ⚠️ 如果你部署到**其它平台**（Netlify / Vercel / Nginx），请使用各自的 rewrite 规则，不要依赖 `404.html` 方案。

---

## 5. PWA 与离线缓存

- `public/manifest.webmanifest`：应用清单，定义名称、图标、主题色、`start_url`
- `public/sw.js`：Service Worker，生产环境自动注册
  - 预缓存静态资源、地图边界 GeoJSON、已访问页面
  - 离线时请求失败回退首页
- 开发服务器（`npm run dev`）**不启用** Service Worker，仅生产构建生效。可用 `npm run preview` 验证。

---

## 6. 本地模拟完整流水线

如想在本地一次性跑过 CI 的所有步骤：

```bash
# 1. 依赖（如果刚拉代码）
npm ci

# 2. 依次执行 CI 等价步骤
npm run audit
npm run validate:data
npm run check
npm run lint
npm test
npx playwright install chromium   # 首次需要
VITE_BASE_URL=/ningxia-tourism/ npm run test:e2e
VITE_BASE_URL=/ningxia-tourism/ npm run build
npm run quality:lighthouse

# 3. 预览结果
npm run preview
```

---

## 7. 部署到其它静态托管平台

任何支持 SPA 回退 + HTTPS 的静态托管都可以。

### 7.1 Netlify

```bash
# netlify.toml
[build]
  command = "VITE_BASE_URL=/ npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 7.2 Vercel

```json
// vercel.json
{
  "buildCommand": "VITE_BASE_URL=/ npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 7.3 自托管 Nginx

```nginx
server {
  listen 443 ssl;
  server_name your-domain.com;
  root /var/www/ningxia-tourism/dist;
  index index.html;

  # SPA 路由回退
  location / {
    try_files $uri $uri/ /index.html;
  }
  # 长缓存：构建产物带 hash
  location ~* \.(?:css|js|woff2?|ttf|eot|otf|webp|avif|av1|mp4|webm)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

构建命令：`VITE_BASE_URL=/ npm run build`，然后把 `dist/` 上传到服务器。

---

## 8. 常见问题排查

| 问题 | 排查方向 |
|------|---------|
| **CI 在 validate:data 失败** | 查看报错，大概率是 `verifiedAt` 过期（> 180 天）、ID 不符合 kebab-case、或图片缺失 WebP/AVIF 文件 |
| **我在 deploy / validate:data:reminder 看到了黄色的 warning 注解？** | 这是 10 天软提醒窗口（170–180 天）输出的预警黄条；**不等于构建失败**。处理方法：本地 `npm run validate:data:reminder` 列出详细条目与剩余天数，按 `CONTENT_AUDIT.md` 第 3 节核对证据链，更新 `verifiedAt` 与核对日期后再提交 |
| **每周的提醒 Issue 会重复建吗？** | 不会。`.github/workflows/verification-reminder.yml` 用标题日期去重；若下周一同一批条目仍在窗口内，只对已有 open Issue comment 一句「本周再次扫描仍在窗口」 |
| **构建成功但 Pages 404 白屏** | 检查 `base` 路径；仓库名变了就改路径 |
| **深层链接刷新报 404** | 确认 `public/404.html` 与 `index.html` 一致；非 Pages 平台需自定义 rewrite |
| **Lighthouse 门禁失败** | 跑 `npm run quality:lighthouse` 本地复现，注意会启动并占用预览端口 |
| **Playwright E2E 失败** | ①先看是否是 Chromium 没装好；②确认 `VITE_BASE_URL` 与构建 base 一致 |
| **Service Worker 内容旧** | `sw.js` 里的缓存名带版本号，改动后会替换；紧急情况可在浏览器 DevTools 手动 unregister |

---

## 9. 流水线变更流程

修改 `.github/workflows/deploy.yml` 前请注意：

1. 先在**自己的分支 / PR** 里提交，验证 PR 校验阶段的步骤全部通过
2. 涉及 Node 大版本升级时，必须保证 `npm ci` / `npm run build` / `npm run test:e2e` 全部通过
3. Lighthouse 门禁阈值（≥ 0.9）如需调整，同步修改 `scripts/run-lighthouse.ts` 和 PRD 中的性能目标
4. deploy job 不建议在 PR 期间执行；目前已通过 `if: github.event_name != 'pull_request'` 控制
