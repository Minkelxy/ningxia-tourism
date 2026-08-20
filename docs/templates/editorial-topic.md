---
slug: topic-slug # 必填：小写字母/数字/短横线，2-63 字符
type: guide # 必填，枚举：travel/food/guide
status: draft # 必填，枚举：published/draft
contentKind: editorial # 必填，枚举：firsthand/editorial/demo
title: 一篇资料型旅行专题的标题 # 必填：文章标题
excerpt: 说明这篇专题帮助读者做出什么选择。 # 必填
author: 站点编辑 # 必填：默认 站点编辑，可改
publishedAt: '' # 选填：发布时间，格式 YYYY-MM-DD
updatedAt: '' # 选填：最后更新时间，格式 YYYY-MM-DD
reviewedAt: '' # 选填：资料复核时间，格式 YYYY-MM-DD
cityId: yinchuan # 必填，枚举：yinchuan/shizuishan/wuzhong/guyuan/zhongwei
locality: 主要涉及的县区 # 必填：主要涉及的县区
tags: [行程判断] # 选填：标签数组
cover: # 必填：封面图对象，含 src/alt/credit/license/sourceUrl
  src: images/attractions/example.webp # 必填：封面图路径
  alt: 准确的图片说明 # 必填
  credit: 作者或机构 # 必填
  license: 明确的许可 # 必填
  sourceUrl: https://图片原始页面 # 选填：原始图片来源
gallery: [] # 选填：图集，结构与 cover 相同
relatedAttractionIds: [] # 选填：关联景点 id
relatedRouteIds: [] # 选填：关联路线 id
scopeNote: 说明适用人群、目的地边界，以及不包含哪些实时信息。 # 必填
keyPoints: # 必填：关键判断数组
  - 关键判断一
  - 关键判断二
references: # 必填：来源数组，每项含 label/url/checkedAt
  - label: 来源名称一
    url: https://来源页面一
    checkedAt: '' # 选填：复核时间，格式 YYYY-MM-DD
  - label: 来源名称二
    url: https://来源页面二
    checkedAt: ''
---

## 先看结论

用资料整理口吻说明结论，不写成亲历经历。

## 怎样选择

补充比较、适用条件与风险提示。

## 出发前核对

列出仍会变化、需要游客当天确认的信息。
