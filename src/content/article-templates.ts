import type { CityId, JournalType } from '../types';

// 脚手架用到的合法枚举与 slug 规则，保持与 src/types/index.ts 的 CityId/JournalType 一致。
export const VALID_ARTICLE_TYPES: readonly JournalType[] = ['travel', 'food', 'guide'];
export const VALID_CITY_IDS: readonly CityId[] = ['yinchuan', 'shizuishan', 'wuzhong', 'guyuan', 'zhongwei'];
export const ARTICLE_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,62}$/;
export const DEFAULT_ARTICLE_CITY_ID: CityId = 'yinchuan';

export interface ValidatedArticleArgs {
  type: JournalType;
  slug: string;
  cityId: CityId;
  cityIdDefaulted: boolean;
}

// 参数校验纯函数：type/slug/cityId 任一非法即抛错，错误信息含合法值，便于 CLI 与单测复用。
export const validateArticleArgs = (type: string, slug: string, cityId?: string): ValidatedArticleArgs => {
  if (!(VALID_ARTICLE_TYPES as readonly string[]).includes(type)) {
    throw new Error(`type 非法: "${type}"，合法值: ${VALID_ARTICLE_TYPES.join('、')}`);
  }
  if (!ARTICLE_SLUG_PATTERN.test(slug)) {
    throw new Error(`slug 非法: "${slug}"，需匹配 ${ARTICLE_SLUG_PATTERN}（小写字母数字与短横线，2-63 字符）`);
  }

  let cityIdDefaulted = false;
  let resolvedCityId = cityId?.trim() ?? '';
  if (!resolvedCityId) {
    resolvedCityId = DEFAULT_ARTICLE_CITY_ID;
    cityIdDefaulted = true;
  }
  if (!(VALID_CITY_IDS as readonly string[]).includes(resolvedCityId)) {
    throw new Error(`cityId 非法: "${cityId ?? ''}"，合法值: ${VALID_CITY_IDS.join('、')}`);
  }

  return { type: type as JournalType, slug, cityId: resolvedCityId as CityId, cityIdDefaulted };
};

const renderTravel = (slug: string, cityId: CityId): string => `---
slug: ${slug}
type: travel
status: draft
contentKind: firsthand
title: "" # 必填：文章标题
excerpt: "" # 必填：一两句话说明这趟旅行的重点与适合谁参考
author: 站主手记
publishedAt: "" # 选填：发布时间，格式 YYYY-MM-DD
updatedAt: "" # 选填：最后更新时间，格式 YYYY-MM-DD
cityId: ${cityId}
locality: "" # 必填：主要涉及的县区
tags: [] # 选填：标签数组，如 [周末, 公共交通]
cover:
  src: /images/journal/${slug}/cover.webp # 必填：封面图，文件放 public/images/journal/${slug}/
  alt: "" # 必填：准确描述照片中可见的地点与内容
  credit: "" # 必填：摄影者姓名
  license: "" # 必填：如 原创，版权所有
  sourceUrl: "" # 选填：原始图片来源
gallery: [] # 选填：图集，结构与 cover 相同
relatedAttractionIds: [] # 选填：关联景点 id
relatedRouteIds: [] # 选填：关联路线 id
tripDate: "" # 必填：出行日期，格式 YYYY-MM-DD
duration: "" # 必填：如 2 天 1 夜
transport: "" # 必填：如 高铁与公共交通
budgetNote: "" # 必填：人数、日期、费用口径
highlights: [] # 选填：真实体验亮点数组
---

## 出发前

写下真实准备过程、信息核实方式和行程背景。

## 行程时间线

按实际时间记录交通、停留与临时调整。

## 花费复盘

注明人数、日期和费用口径。

## 值得与不值得

明确这是个人体验，不代替景区官方信息。
`;

const renderFood = (slug: string, cityId: CityId): string => `---
slug: ${slug}
type: food
status: draft
contentKind: firsthand
title: "" # 必填：文章标题
excerpt: "" # 必填：说明菜系、到店场景，以及这篇记录能帮助读者判断什么
author: 站主手记
publishedAt: "" # 选填：发布时间，格式 YYYY-MM-DD
updatedAt: "" # 选填：最后更新时间，格式 YYYY-MM-DD
cityId: ${cityId}
locality: "" # 必填：店铺所在县区
tags: [] # 选填：标签数组，如 [本地菜, 晚餐]
cover:
  src: /images/journal/${slug}/cover.webp # 必填：封面图，文件放 public/images/journal/${slug}/
  alt: "" # 必填：准确描述照片中的菜品或店内环境
  credit: "" # 必填：摄影者姓名
  license: "" # 必填：如 原创，版权所有
  sourceUrl: "" # 选填：原始图片来源
gallery: [] # 选填：图集，结构与 cover 相同
relatedAttractionIds: [] # 选填：关联景点 id
relatedRouteIds: [] # 选填：关联路线 id
visitedAt: "" # 必填：到店日期，格式 YYYY-MM-DD
venueName: "" # 必填：店铺真实名称
cuisine: "" # 必填：如 宁夏本地菜
address: "" # 必填：到店时核对的地址
mapQuery: "" # 必填：地图检索词，如 "宁夏 银川 店铺名称"
pricePerPerson: "" # 必填：到店当日人均，如 "约 80 元，仅作参考"
dishes: [] # 必填：实际品尝菜品数组
queueNote: "" # 选填：排队与到店时段，如 "工作日 18:00 到店，等位约 10 分钟"
suitableFor: "" # 选填：适合场景，如 "朋友聚餐、两人用餐"
revisitNote: "" # 选填：是否再次到访的个人感受
---

## 为什么去

说明信息来源与到店动机。

## 实际点单

记录菜品、份量与真实感受，不使用星级或数字评分。

## 排队与服务

绑定明确到店日期，提醒读者信息可能变化。

## 下次怎么点

给出个人复盘，不包装为官方推荐。
`;

const renderGuide = (slug: string, cityId: CityId): string => `---
slug: ${slug}
type: guide
status: draft
contentKind: editorial
title: "" # 必填：文章标题
excerpt: "" # 必填：说明这篇专题帮助读者做出什么选择
author: 站点编辑
publishedAt: "" # 选填：发布时间，格式 YYYY-MM-DD
updatedAt: "" # 选填：最后更新时间，格式 YYYY-MM-DD
reviewedAt: "" # 选填：资料复核时间，格式 YYYY-MM-DD
cityId: ${cityId}
locality: "" # 必填：主要涉及的县区
tags: [] # 选填：标签数组，如 [行程判断]
cover:
  src: /images/journal/${slug}/cover.webp # 必填：封面图，文件放 public/images/journal/${slug}/
  alt: "" # 必填：准确的图片说明
  credit: "" # 必填：作者或机构
  license: "" # 必填：明确的许可
  sourceUrl: "" # 选填：原始图片来源
gallery: [] # 选填：图集，结构与 cover 相同
relatedAttractionIds: [] # 选填：关联景点 id
relatedRouteIds: [] # 选填：关联路线 id
scopeNote: "" # 必填：适用人群、目的地边界，以及不包含哪些实时信息
keyPoints: [] # 必填：关键判断数组
references: [] # 必填：来源数组，每项含 label/url/checkedAt
---

## 先看结论

用资料整理口吻说明结论，不写成亲历经历。

## 怎样选择

补充比较、适用条件与风险提示。

## 出发前核对

列出仍会变化、需要游客当天确认的信息。
`;

// 模板渲染纯函数：字段与 docs/templates/ 三份模板对齐，占位值带 YAML 注释提示。
export const renderArticleTemplate = (type: JournalType, slug: string, cityId: CityId): string => {
  switch (type) {
    case 'travel': return renderTravel(slug, cityId);
    case 'food': return renderFood(slug, cityId);
    case 'guide': return renderGuide(slug, cityId);
    default: throw new Error(`未实现的 type: ${type}`);
  }
};
