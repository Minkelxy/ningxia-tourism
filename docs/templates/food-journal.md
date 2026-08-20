---
slug: yinchuan-sample-food # 必填：小写字母/数字/短横线，2-63 字符
type: food # 必填，枚举：travel/food/guide
status: draft # 必填，枚举：published/draft
contentKind: firsthand # 必填，枚举：firsthand/editorial/demo
title: 一次真实探店的标题 # 必填：文章标题
excerpt: 说明菜系、到店场景，以及这篇记录能帮助读者判断什么。 # 必填
author: 站主手记 # 必填：默认 站主手记，可改
publishedAt: "" # 选填：发布时间，格式 YYYY-MM-DD
updatedAt: "" # 选填：最后更新时间，格式 YYYY-MM-DD
cityId: yinchuan # 必填，枚举：yinchuan/shizuishan/wuzhong/guyuan/zhongwei
locality: 兴庆区 # 必填：店铺所在县区
tags: [本地菜, 晚餐] # 选填：标签数组
cover: # 必填：封面图对象，含 src/alt/credit/license/sourceUrl
  src: /images/journal/example-food.webp # 必填：封面图路径
  alt: 准确描述照片中的菜品或店内环境 # 必填
  credit: 摄影者姓名 # 必填
  license: 原创，版权所有 # 必填
  sourceUrl: https://example.com/original # 选填：原始图片来源
gallery: [] # 选填：图集，结构与 cover 相同
relatedAttractionIds: [] # 选填：关联景点 id
relatedRouteIds: [] # 选填：关联路线 id
visitedAt: 2026-01-01 # 必填：到店日期，格式 YYYY-MM-DD
venueName: 店铺真实名称 # 必填：店铺真实名称
cuisine: 宁夏本地菜 # 必填：如 宁夏本地菜
address: 到店时核对的地址 # 必填：到店时核对的地址
mapQuery: 宁夏 银川 店铺真实名称 # 必填：地图检索词
pricePerPerson: 到店当日人均约 80 元，仅作参考 # 必填：人均口径
dishes: [实际品尝菜品一, 实际品尝菜品二] # 必填：实际品尝菜品数组
queueNote: 工作日 18:00 到店，现场等位约 10 分钟 # 选填：排队与到店时段
suitableFor: 朋友聚餐、两人用餐 # 选填：适合场景
revisitNote: 会再次到访，想复点某道菜；这是个人感受，不是评分。 # 选填：是否再次到访的个人感受
---

## 为什么去

说明信息来源与到店动机。

## 实际点单

记录菜品、份量与真实感受，不使用星级或数字评分。

## 排队与服务

绑定明确到店日期，提醒读者信息可能变化。

## 下次怎么点

给出个人复盘，不包装为官方推荐。
