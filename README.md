# hexo-theme-joe3

[Hexo](https://hexo.io/) 主题，视觉迁移自 [Halo Theme Joe3.0](https://github.com/jiewenhuang/halo-theme-joe3.0)（EJS 重写）。

协议：**CC BY-NC-SA 4.0**（详见 [`NOTICE.md`](./NOTICE.md)）。

---

## 安装

### 方式一：git submodule（推荐）

```bash
cd your-hexo-site
git submodule add https://github.com/xierenwen/hexo-theme-joe3.git themes/joe3
```

已有仓库的协作者 / CI：

```bash
git clone --recurse-submodules <your-blog-repo>
# 或
git submodule update --init --recursive
```

### 方式二：直接克隆

```bash
git clone https://github.com/xierenwen/hexo-theme-joe3.git themes/joe3
```

### 启用主题

博客根目录 `_config.yml`：

```yaml
theme: joe3
```

依赖（按需安装，本主题布局为 EJS）：

```bash
npm i hexo-renderer-ejs
```

---

## 配置怎么写

Hexo 会按优先级合并主题配置（高覆盖低）：

1. 博客根 `_config.yml` 里的 `theme_config:`（可选）
2. **博客根 `_config.joe3.yml`（推荐，放站点定制）**
3. 主题仓 `themes/joe3/_config.yml`（通用默认）

建议：

| 放哪里 | 放什么 |
|--------|--------|
| `themes/joe3/_config.yml` | 别改 submodule 内默认值（升级会冲突） |
| **`_config.joe3.yml`** | 菜单、作者、页脚、背景图、特效图路径等**站定项** |
| 博客 `source/img/` | 头像、背景、品牌图、立绘等素材 |

下面示例一律写在博客根目录 **`_config.joe3.yml`**。

---

## 配置示例

### 最小可用

```yaml
menu:
  - name: 首页
    path: /
  - name: 分类
    path: /categories/
  - name: 归档
    path: /archives/

author:
  name: 你的名字
  avatar: /img/avatar.jpg
  motto: 一句话简介
```

把 `source/img/avatar.jpg` 换成你自己的图即可预览。

---

### 导航菜单

推荐列表写法；单项可 `enable: false` 隐藏：

```yaml
menu:
  - name: 首页
    path: /
  - name: 分类
    path: /categories/
  - name: 瞬间
    path: /moments/
  - name: 友链
    path: /links/
  - name: 关于
    path: /about/
```

也兼容对象写法：`首页: /`。

**重要：** 路径含 `moments` / `links` / `about` 的项，还会受下方 `pages.*.enable` 控制；菜单里写了入口，但开关为 `false` 时**不会显示**。

---

### 独立页开关

只控制导航是否露出，不删除 `source/` 下的页面文件：

```yaml
pages:
  moments:
    enable: true
    empty: 暂无瞬时记录。
  links:
    enable: true
    empty: 暂无友情链接。
  about:
    enable: true
```

对应页面仍需你自己准备，例如：

- `source/moments/index.md`（`layout: moments`）
- `source/links/index.md`（`layout: links`）
- `source/about/index.md`
- 数据可放在 `source/_data/moments.yml`、`source/_data/links.yml`（若主题生成器已使用）

---

### 分类 / 标签页

```yaml
categories:
  title: 全部分类
  type: card          # card | tag
  enable_post_num: true

tags:
  title: 全部标签
  type: card          # card | tag
  enable_post_num: true
```

---

### 侧栏

```yaml
aside:
  enable: true
  position: right     # right | left
  author: true        # 博主卡片
  newest: true
  newest_count: 5
  tags: true
  tag_limit: 30
  categories: false
  timelife: true
  weather:
    enable: false
    token: ""           # 心知天气 Widget token，可选
```

---

### 博主信息（侧栏卡片）

```yaml
author:
  name: 你的名字
  avatar: /img/avatar.jpg      # 放在博客 source/img/
  description: 站点副标题
  motto: 座右铭
  bg: /img/author_bg.jpg       # 卡片背景；可为竖图
  bg_full: false               # true = 背景铺满整张博主卡
  bg_position: center center   # 如 center 42% 控制竖图裁切
  avatar_type: circle          # circle | round 等，视主题样式
  enable_level: false
  overview_type: A             # A/B/D：分类、标签、文章数的排列
```

作者名也可写在根 `_config.yml` 的 `author` 字段作回退。

---

### 顶栏 Logo / 中间品牌图

```yaml
navbar:
  show_logo: true
  logo: /img/avatar.jpg        # 左侧头像/Logo
  logo_radius: 50%             # 如 4px 为圆角方图
  brand: ""                    # 可选：菜单与搜索之间的横版标题图
  brand_height: 34px           # 例如 /img/logo_pc.png
  brand_max_width: 240px
```

- `logo`：左侧入口图  
- `brand`：导航与搜索框**中间**的标题图（留空则不显示）

---

### 首页封面

```yaml
home:
  enable_post_thumbnail: true
  lazyload_thumbnail: /img/lazy_thumbnail.jpg
  solid_thumbnails:            # 无封面时按路径稳定挑色
    - "#fb6c28"
    - "#5b8ff9"
    - "#5ad8a6"
```

文章 front matter：

```yaml
cover: /img/cover-example.png
```

---

### 页脚备案

```yaml
footer:
  since: 2024
  icp: ""
  icp_link: https://beian.miit.gov.cn/
  police: ""
  police_link: http://www.beian.gov.cn/
```

---

### 评论（Waline）

默认关闭。启用需自备服务端：

```yaml
comments:
  enable: true
  waline:
    serverURL: "https://waline.example.com"
    locale: {}
```

未配置 `serverURL` 时不渲染评论区。

---

### 搜索 / 目录 / 相关文章 / 字数

```yaml
search:
  enable: true
  path: search.json            # 生成到 public/search.json

toc:
  enable: true
  depth: 0                     # tocbot collapseDepth，0 = 全展开

related_posts:
  enable: true
  count: 3
  title: 相关推荐

wordcount:
  enable: true
```

---

### 深色模式 / 返回顶部

```yaml
darkmode:
  enable: true
  default: auto                # auto | light | dark

actions:
  enable: true
  back2top: true
  back2top_smooth: true
```

---

### 动效：花瓣星 / 左右立绘

默认关闭。素材请放在**博客** `source/img/`（勿把他人官网资源塞进主题仓）。

```yaml
effects:
  wow: true
  animate: true
  stars:
    enable: true
    count: 14
    min_size: 16
    max_size: 26
    image: ""                  # 空则用主题自带 bg_flower_star.svg
                               # 或 /img/bg_star.png（自备）
  side_chars:
    enable: true
    left: /img/char_left.png   # 建议宽屏 ≥1400px 显示
    right: /img/char_right.png
```

---

### 主题色、背景、字体

```yaml
style:
  mode_color_light: "#00b4af"
  mode_color_dark: "#aa78b4"
  container_max_width: 1320px
  background_image: ""         # 如 /img/bg.jpg
  background_image_dark: ""
  background_size: cover
  background_position: center center
  background_attachment: fixed
  background_overlay: "rgba(255,255,255,.55)"
  background_overlay_dark: "rgba(0,0,0,.45)"
  fonts:
    enable: true               # 主题自带本地日文字体（source/fonts）
```

---

### 代码块 / Mermaid / 一言

```yaml
code:
  title: true                  # 文件名/语言标题
  macdot: true                 # Mac 风格圆点
  copy: true

mermaid:
  enable: true
  version: "10.9.1"

hitokoto:
  enable: true
  api: https://v1.hitokoto.cn
  # type: i                    # 可选分类，见一言文档
```

---

### 全局音乐 + PJAX

默认关闭。播放器依赖 Meting API；浏览器直连第三方常遇 CORS，生产建议同域代理（例如在博客仓挂 `api/meting.js`，`api` 填 `/api/meting`）。

```yaml
music:
  enable: false
  api: /api/meting             # 或临时使用公开 Meting 地址（可能 CORS）
  server: netease              # netease | tencent | ...
  type: playlist               # playlist | song | album | ...
  id: ""                       # 歌单 / 歌曲 ID
  theme: "#00b4af"
  autoplay: false
  volume: 0.7
  loop: all

pjax:
  enable: false                # 建议开音乐时一并 true，切页不断歌
```

---

## 较完整的 `_config.joe3.yml` 样板

可复制到博客根目录后改路径与文案：

```yaml
menu:
  - name: 首页
    path: /
  - name: 分类
    path: /categories/
  - name: 标签
    path: /tags/
  - name: 归档
    path: /archives/

pages:
  moments:
    enable: false
    empty: 暂无瞬时记录。
  links:
    enable: false
    empty: 暂无友情链接。
  about:
    enable: false

author:
  name: Your Name
  avatar: /img/avatar.jpg
  motto: Hello
  bg: /img/author_bg.jpg
  bg_full: false
  bg_position: center center
  avatar_type: circle
  overview_type: A

navbar:
  show_logo: true
  logo: /img/avatar.jpg
  logo_radius: 50%
  brand: ""

footer:
  since: 2024

aside:
  enable: true
  position: right
  author: true
  newest: true
  tags: true

style:
  mode_color_light: "#00b4af"
  mode_color_dark: "#aa78b4"
  fonts:
    enable: true

search:
  enable: true

darkmode:
  enable: true
  default: auto

hitokoto:
  enable: true

effects:
  stars:
    enable: false
  side_chars:
    enable: false

music:
  enable: false

pjax:
  enable: false
```

完整字段表见主题内默认配置：[`_config.yml`](./_config.yml)。

---

## 升级 submodule

```bash
cd themes/joe3
git fetch
git checkout main
git pull
cd ../..
git add themes/joe3
git commit -m "chore: bump hexo-theme-joe3"
```

---

## 许可

主题视觉与资源改编自 [jiewenhuang/halo-theme-joe3.0](https://github.com/jiewenhuang/halo-theme-joe3.0)，遵循 **CC BY-NC-SA 4.0**。使用时请保留 [`NOTICE.md`](./NOTICE.md) 中的署名信息。
