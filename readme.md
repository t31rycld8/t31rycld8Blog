# t31rycld8 的博客

博客地址：https://t31rycld8-blog.vercel.app/

代码仓库：https://github.com/t31rycld8/t31rycld8Blog

这是一个 CTFwiki 风格的分类学习博客，按「栏目 → 子分类 → 文章」三层组织，目前有两个栏目：

- **Web 安全**：文章放在 `src/content/posts/web/`
- **Reverse 逆向**：文章放在 `src/content/posts/reverse/`

栏目和子分类由**目录结构**自动生成，写文章不需要改任何代码。

---

## 本地预览

```cmd
cd /d 你的路径\t31rycld8Blog
npm install
npm run dev
```

浏览器打开终端里提示的地址（一般是 `http://localhost:4321`）。

## 如何发一篇文章

1. 进入对应栏目下的子分类目录，例如 `src/content/posts/web/info-collection/`
2. 新建一个 `.md` 文件，例如 `http-basics.md`
3. 按下面的格式填写内容：

```yaml
---
title: 文章标题
description: 一句话摘要
date: 2026-08-16
tags: [Web, HTTP]
draft: false
---

正文写在这里。
```

说明：

- `draft: false`：发布到网站；`draft: true`：草稿，正式网站不显示（本地 `npm run dev` 仍可预览）
- 文件名会成为网址的一部分，例如 `http-basics.md` 对应 `/web/info-collection/http-basics`
- 文章必须放在子分类目录下，即路径至少为 `posts/<栏目>/<子分类>/xxx.md`

## 如何新增子分类

在栏目目录下新建一个目录即可，例如 `src/content/posts/web/sql-injection/`。没有文章的目录不会显示。

想让子分类显示中文名，在 `src/lib/catalog.ts` 的 `SUBCATEGORY_META` 里登记，例如：

```ts
web: {
  'info-collection': { name: '信息收集' },
  'sql-injection': { name: 'SQL 注入' },
},
```

不登记的话，页面会直接显示目录名。

## 如何新增栏目

1. 新建目录 `src/content/posts/<栏目slug>/<子分类>/`
2. 在 `src/lib/catalog.ts` 的 `CATEGORY_META` 里登记显示名和简介（建议）

## 提交并发布

```cmd
git add src
git commit -m "Update blog"
git push
```

推送成功后约 1～2 分钟，Vercel 会自动构建上线。

## 出问题时先检查

1. `git push` 是否成功（有无 GitHub 登录/权限）
2. 文章是否放在 `posts/<栏目>/<子分类>/` 下，frontmatter 格式是否正确
3. 是否误设了 `draft: true`
4. Vercel 最新一次 Deploy 是否为 Ready（失败时看构建日志）