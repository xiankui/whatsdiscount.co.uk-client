# API 设计文档 — 站点前端接口

> 此文档描述 coupon前端站点所需的 CMS API 接口。
> 所有接口均为 **GET** 请求（除非特殊标注），返回 JSON 格式。
>
> Base URL：`https://ecc.cgs-api.me/`

> Base Image URL: `https://pics.dibsale.com/cdn-cgi/image/width=360/`

---

## 1. 获取所有标签

**调用者**：全局 Layout（导航栏标签列表）

**每个页面都会调用**，用于在 Header 导航栏中展示分类标签。

```
GET /api/site/tags
```

### 响应

```json
{
  "success": true,
  "data": ["Fashion", "Travel", "Sports", "Home & Garden", "Electronics"]
}
```

---

## 2. 按域名列表获取商家摘要

**调用者**：首页（TopStores、PopularStores 展示区块）

传入一组域名，返回每个域名对应的简要商家信息（用于卡片展示）。

```
GET /api/site/stores/by-domains?domains=nike.com,adidas.co.uk,sephora.com
```

### 请求参数

| 参数      | 类型   | 必填 | 说明               |
| --------- | ------ | ---- | ------------------ |
| `domains` | string | ✅   | 逗号分隔的域名列表 |

### 响应

```json
{
  "success": true,
  "data": [
    {
      "id": "01HXY...",
      "domain": "nike.com",
      "name": "Nike",
      "logoPic": "stores/nike-logo.png",
      "affiliateUrl": "https://...",
      "couponCount": 12,
      "coupons": [
        {
          "id": 0,
          "title": "20% Off First Order",
          "type": "code",
          "code": "SAVE20",
          "disInfo": "20% Off"
        }
      ]
    }
  ]
}
```

> **NOTE**
> `coupons` 最多返回前 3 条（用于卡片预览），`couponCount` 返回实际总数。
> `logoPic` 是图片 key，前端会通过 `IMG_URL` 拼接完整 URL。

---

## 3. 按域名获取商家详情

**调用者**：商家优惠券页面 `/discount/[domain]`、优惠券详情页 `/detail/[pid]`

返回完整的商家信息，包含所有优惠券、SEO 数据、FAQ、Saving Tips、Markdown 渲染后的 HTML 内容等。

**特别说明**：
商家页所有优惠券按钮链接生成方式 Base64压缩 `[domain]&[couponId]`
优惠券详情页可根据 [pid] 通过 Base64解码得到 [domain] & [couponId]

```
GET /api/site/stores/:domain
```

### 请求参数

| 参数     | 类型 | 必填 | 说明                    |
| -------- | ---- | ---- | ----------------------- |
| `domain` | path | ✅   | 商家域名，如 `nike.com` |

### 响应

```json
{
  "success": true,
  "data": {
    "id": "01KRAPD8PJYNBG39TK5NACA6AC",
    "domain": "adidas.co.uk",
    "name": "Adidas UK",
    "logoPic": "logos/adidas.co.uk.png",
    "tags": [
      "Sports & Outdoors",
      "Clothing",
      "Shoes"
    ],
    "coupons": [
      {
        "id": 0,
        "title": "£15 Off: Adidas UK Promo Code",
        "type": "code",
        "code": "3XBN-ECW9-PBVW-8X4J",
        "disInfo": "", // extract from title
        "description": "Enjoy £15 off your next order when you use the adidas.co.uk promo code at checkout.",
        "isValid": 1,
        "source": "crawler"
      },
      {
        "id": 1,
        "title": "Score up to 5% Off Your Order at Adidas UK",
        "type": "deal",
        "code": "",
        "disInfo": "",
        "description": "Save up to 5% off on select shoes, apparel, and more with discount code at Adidas UK.",
        "isValid": 0,
        "source": "crawler"
      },
    ],
    "savingTips": [
      {
        "title": "Join the adiClub for Free Shipping and Perks",
        "content": "Unlock free shipping on all your orders by joining the free adiClub membership program. As a member, you'll also gain access to exclusive discounts and special offers, making it a smart way to save on your Adidas purchases.",
        "isFallback": false
      },
    ],
    "faqs": [
      {
        "topic": "How can I find the latest Adidas UK promo codes?",
        "content": "To find the latest Adidas UK promo codes, you can check for offers such as £15 off your next order or up to 5% off select items. It's also beneficial to look for potential student discounts, which can offer up to 25% off with verification. Consider signing up for the Adidas newsletter to receive a 10% discount code for first-time subscribers. Additionally, joining their Adiclub membership program can provide benefits like free shipping and exclusive discounts.",
        "isFallback": false
      },
    ],
    "about": "Discover iconic sportswear and athletic footwear from Adidas UK, a brand synonymous with innovation and style. Whether you're looking for performance-driven gear for your next workout or comfortable, trend-setting apparel for everyday wear, Adidas offers a wide selection of products for men, women, and children. Explore their latest collections, including sustainable options and collaborations, to elevate your active lifestyle. For those looking to save on their next Adidas purchase, be sure to check our site for available Adidas UK coupons and promo code opportunities.",
    "seo": {
      "title": "Adidas UK Promo Code: 30% Off - May 2026",
      "keywords": "Adidas UK coupons, Adidas UK promo code, Adidas UK coupon code, Adidas UK discount codes, Adidas UK deals, Adidas UK free shipping",
      "description": "Save up to 30% Off with Adidas UK promo codes. Get the latest deals and discounts today. Shop now and use your code at checkout!",
      "h1": "Adidas UK Promo Codes & Deals — Up to 50% Off | May 2026",
      "isFallback": false
    },
    "lastUpdateAt": "2026-05-11T04:58:28.434Z"
  }
}
```

> **IMPORTANT**
> `htmlContent` 返回的是 **Markdown 原文**，前端需自行做 Markdown→HTML 转换。
> `lastUpdateAt` 为商家内容最后更新时间（ISO 8601 格式），可用于展示 "Updated on ..." 等信息。如果内容从未更新过，该字段不返回。

---

## 4. 获取最新优惠券

**调用者**：首页（Trending Deals 区块）

返回最新的优惠券列表（从最近创建的商家中各取 1 条 coupon）。

```
GET /api/site/coupons/latest?limit=10
```

### 请求参数

| 参数    | 类型   | 必填 | 说明              |
| ------- | ------ | ---- | ----------------- |
| `limit` | number | ❌   | 数量限制，默认 10 |

### 响应

```json
{
  "success": true,
  "data": [
    {
      "id": 0,
      "title": "20% Off Sitewide",
      "type": "code",
      "code": "SAVE20",
      "disInfo": "20% Off",
      "siteStore": {
        "id": "01HXY...",
        "domain": "nike.com",
        "logoPic": "stores/nike-logo.png",
        "affiliateUrl": "https://..."
      }
    }
  ]
}
```
---

## 5. 按标签获取优惠券

**调用者**：标签页 `/tag-[tag]`

返回某个标签下所有商家的优惠券（每个商家取 1 条）。

```
GET /api/site/coupons/by-tag?tag=Fashion
```

### 请求参数

| 参数  | 类型   | 必填 | 说明                                     |
| ----- | ------ | ---- | ---------------------------------------- |
| `tag` | string | ✅   | 标签名称（空格分隔，如 `Home & Garden`） |

### 响应

格式同 **接口 4**。

---

## 6. 获取所有商家域名（Sitemap 用）

**调用者**：`sitemap.xml.ts`

返回数据库中所有商家的域名列表，用于生成 XML Sitemap。

```
GET /api/site/stores/all-domains
```

### 响应

```json
{
  "success": true,
  "data": ["nike.com", "adidas.com", "sephora.com", "..."]
}
```

---

## 7. 获取商家跳转信息（Redirect）

**调用者**：`/api/r.ts`（联盟链接 302 跳转）

前端用户点击 "Go to Store" 时，前端 `/api/r?domain=xxx` 需要获取该商家的跳转目标 URL。
该接口需要返回计算好的最终跳转 URL（含 Promotion Card 加权选择逻辑）。

```
GET /api/site/stores/:domain/redirect-url
```

### 请求参数

| 参数     | 类型 | 必填 | 说明     |
| -------- | ---- | ---- | -------- |
| `domain` | path | ✅   | 商家域名 |

### 响应

```json
{
  "success": true,
  "data": {
    "outUrl": "https://click.linksynergy.com/...",
    "domain": "nike.com",
    "selectedCardNo": "rakuten---user@email.com"
  }
}
```

> **IMPORTANT**
> **跳转 URL 选择逻辑**（Promotion Card 加权分配）应在 CMS 端实现，因为：
>
> 1. CMS 拥有完整的 `affiliateUrlMap`、`promotionCards`、`cardCommissions` 数据
> 2. CMS 负责 `outNum` 计数器递增
> 3. 前端只需拿到最终 URL 做 302 跳转
>
> 前端 `/api/r.ts` 简化为：调用此接口 → 得到 `outUrl` → 302 重定向

---

## 8. 商家搜索

**调用者**：SearchDrawer 组件（全局搜索抽屉）

用户在搜索框输入关键词时，前端通过 Astro API route 代理请求到 CMS，返回匹配的商家列表。
前端 SearchDrawer 通过浏览器端 `fetch` 调用 `/api/site-stores?kwds=xxx`，由 Astro API route 转发至此接口。

```
GET /api/site/stores/search?kwds=nike&limit=10
```

### 请求参数

| 参数    | 类型   | 必填 | 说明                               |
| ------- | ------ | ---- | ---------------------------------- |
| `kwds`  | string | ✅   | 搜索关键词，模糊匹配商家名称或域名 |
| `limit` | number | ❌   | 返回数量限制，默认 10              |

### 响应

```json
{
  "success": true,
  "data": [
    {
      "domain": "nike.com",
      "name": "Nike",
      "logoPic": "stores/nike-logo.png"
    },
    {
      "domain": "nikerunning.com",
      "name": "Nike Running",
      "logoPic": "stores/nikerunning-logo.png"
    }
  ]
}
```

> **NOTE**
> 搜索结果只返回展示所需的最小字段（`domain`、`name`、`logoPic`），无需返回优惠券等详细数据。
> 建议 CMS 端对 `name` 和 `domain` 做 **case-insensitive** 模糊匹配（LIKE / 全文索引）。
> 前端通过 Astro API route `/api/site-stores` 代理此请求，统一传递 `X-Site-Id`。

---

## 9. 获取站点统计信息

**调用者**：首页 Hero 组件（展示商家/优惠券总数）

返回站点级别的统计数据，用于首页展示 "Hand-tested codes from X,XXX+ stores" 等信息。

```
GET /api/site/stats
```

### 响应

```json
{
  "success": true,
  "data": {
    "storeCount": 3247,
    "couponCount": 28500
  }
}
```

> **NOTE**
> 该接口数据变化频率低，适合长时间缓存。
> 前端当前在首页中硬编码了 `storeCount: 3000`，接入此接口后可动态展示真实数据。

---

## 10. 获取相关商家

**调用者**：商家优惠券页面 `/coupons/[domain]/code`（Related Stores 区块）

根据当前商家的标签（tags），查找拥有相同标签的其他商家。按共同标签数量降序排列，排除当前商家自身。

```
GET /api/site/stores/:domain/related?limit=10
```

### 请求参数

| 参数     | 类型   | 必填 | 说明                        |
| -------- | ------ | ---- | --------------------------- |
| `domain` | path   | ✅   | 当前商家域名，如 `nike.com` |
| `limit`  | number | ❌   | 返回数量限制，默认 10       |

### 响应

```json
{
  "success": true,
  "data": [
    {
      "id": "01HXY...",
      "domain": "adidas.com",
      "name": "Adidas",
      "logoPic": "stores/adidas-logo.png",
      "affiliateUrl": "https://...",
      "couponCount": 8,
      "coupons": [
        {
          "id": 0,
          "title": "15% Off Sitewide",
          "type": "code",
          "code": "SAVE15",
          "disInfo": "15% Off"
        }
      ]
    }
  ]
}
```

> **NOTE**
> 返回格式与接口 2（按域名列表获取商家摘要）一致。
> 相关性基于共同标签数量排序，相同标签数量的商家按点击量（outNum）降序排列。
> 如果商家没有标签，返回空数组。

---

## 11. 获取流行商家

**调用者**：首页（Popular Stores 区块）、侧边栏等

返回按点击次数（outNum）降序排列的热门商家列表。

```
GET /api/site/stores/popular?limit=10
```

### 请求参数

| 参数    | 类型   | 必填 | 说明                  |
| ------- | ------ | ---- | --------------------- |
| `limit` | number | ❌   | 返回数量限制，默认 10 |

### 响应

```json
{
  "success": true,
  "data": [
    {
      "id": "01HXY...",
      "domain": "nike.com",
      "name": "Nike",
      "logoPic": "stores/nike-logo.png",
      "affiliateUrl": "https://...",
      "couponCount": 12,
      "coupons": [
        {
          "id": 0,
          "title": "20% Off First Order",
          "type": "code",
          "code": "SAVE20",
          "disInfo": "20% Off"
        }
      ]
    }
  ]
}
```

> **NOTE**
> 返回格式与接口 2（按域名列表获取商家摘要）一致。
> 排序依据是 `outNum`（用户点击跳转到商家的次数），反映真实用户兴趣。

---

## 12. 获取指定区块的装修数据

**调用者**：任何需要动态渲染装修内容的前端页面（首页 Banner、顶部菜单、弹窗广告等）

根据区块名（slot key）返回该区块的 `IDecoration[]`，用于渲染图片轮播、链接菜单等可配置 UI。

```
GET /api/site/decoration?key=index-popular-brands
```

### 请求参数

| 参数  | 类型   | 必填 | 说明                                           |
| ----- | ------ | ---- | ---------------------------------------------- |
| `key` | string | ✅   | 区块名，与 CMS 装修编辑器中定义的顶级 key 一致 |

### 响应

```json
{
  "success":true,
  "data":[
    {
      "domain":"zara.com",
      "pic":"https://pics.dibsale.com/cdn-cgi/image/width=640/0467311cd2258b40ee3b4f7fd9fe7752.jpg",
      "logo":"logos/zara.com",
      "name":"Zara"
    },
  ]
}
```

获取顶部导航类别接口 Header.astro

```
GET /api/site/decoration?key=layout-top-menus
```

```json
{"success":true,"data":[{"name":"Fashion","path":"/tag-fashion"}]
```

> **NOTE**
> `domain` 字段可选：有 `domain` 值时表示该项仅针对该商家页面生效；留空则全局生效。
> 前端可根据当前页面的商家域名过滤，优先展示 `domain` 匹配的项，回退到无 `domain` 的全局项。
> `key` 不存在时返回 `"data": []`。

---

## 13. 获取全部装修数据

**调用者**：前端构建时预取所有装修配置、或管理工具批量读取

返回完整的装修配置对象，以区块名为 key，值为 `IDecoration[]`。

```
GET /api/site/decoration
```

### 请求参数

无（不传 `key` 即返回全量数据）

### 响应

```json
{
  "success": true,
  "data": {
    "index-popular-brands": [
      {
        "domain": "nike.com",
        "pics": ["https://cdn.example.com/banner-nike.jpg"],
        "txts": ["全场满减，限时优惠"]
      }
    ],
    "layout-top-menus": [
      {
        "txts": ["Google", "https://www.google.com"]
      },
      {
        "txts": ["Baidu", "https://www.baidu.com"]
      }
    ]
  }
}
```

> **NOTE**
> 如果尚未配置任何装修数据，返回 `"data": {}`。
> 该接口适合在 SSG 构建阶段一次性获取所有区块，避免多次请求。

---

## 通用规范

### 响应格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 认证

站点前端 API 为**公开只读接口**，不需要认证。
建议通过 `X-Site-Id` Header 传递站点标识（多站点隔离）：

```
X-Site-Id: your-site-id
```

### 缓存

| 接口               | 建议缓存策略                        |
| ------------------ | ----------------------------------- |
| 获取所有标签       | KV Cache, 1h TTL                    |
| 按域名获取商家摘要 | KV Cache, 1h TTL                    |
| 按域名获取商家详情 | KV Cache, 30min TTL                 |
| 获取最新优惠券     | KV Cache, 1h TTL                    |
| 按标签获取优惠券   | KV Cache, 1h TTL                    |
| 获取所有商家域名   | KV Cache, 6h TTL                    |
| 获取商家跳转信息   | **不缓存**（需要实时计算）          |
| 商家搜索           | KV Cache, 10min TTL（按关键词缓存） |
| 获取站点统计信息   | KV Cache, 6h TTL                    |
| 获取相关商家       | KV Cache, 1h TTL（按域名缓存）      |
| 获取流行商家       | KV Cache, 30min TTL                 |
| 获取指定区块装修   | KV Cache, 10min TTL（按 key 缓存）  |
| 获取全部装修数据   | KV Cache, 10min TTL                 |

### 前端调用方式

前端通过 Astro SSR 在服务器端调用 CMS API，建议在前端创建统一的 API Client：

```typescript
// src/lib/cms-client.ts
const CMS_API_BASE = import.meta.env.CMS_API_URL; // e.g. https://your-cms.example.com
const SITE_ID = 'your-site-id';

export async function cmsGet<T>(path: string): Promise<T> {
  const res = await fetch(`${CMS_API_BASE}${path}`, {
    headers: { 'X-Site-Id': SITE_ID },
  });
  const body = await res.json();
  if (!body.success) throw new Error(body.error || 'CMS API error');
  return body.data;
}
```

接口调用示例

```
curl -s "https://ecc.cgs-api.me/api/site/stores/adidas.co.uk" \
  -H "X-Site-Id: whatsdiscount.co.uk"
```

---

## 接口 ↔ 前端页面映射

| 前端页面/组件                          | 调用的 CMS API                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Layout** (全局)                      | `GET /api/site/tags`                                                                                                     |
| **首页** index.astro                   | `GET /api/site/stores/by-domains`, `GET /api/site/coupons/latest`, `GET /api/site/stats`, `GET /api/site/stores/popular` |
| **商家页** discount/[domain].astro | `GET /api/site/stores/:domain`, `GET /api/site/stores/:domain/related`                                                   |
| **优惠券详情** detail/[pid].astro      | `GET /api/site/stores/:domain`                                                                                             |
| **标签页** tag-[tag].astro             | `GET /api/site/coupons/by-tag`                                                                                           |
| **Sitemap** sitemap.xml.ts             | `GET /api/site/stores/all-domains`                                                                                       |
| **联盟跳转** api/r.ts                  | `GET /api/site/stores/:domain/redirect-url`                                                                              |
| **搜索抽屉** SearchDrawer             | `GET /api/site/stores/search` (经 Astro API route 代理)                                                                  |
| **装修区块** 任意页面                  | `GET /api/site/decoration?key=<slot>` 或 `GET /api/site/decoration`                                                      |
