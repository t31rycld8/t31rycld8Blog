---
title: HTTP 协议基础与信息收集
description: 从 HTTP 请求结构入手，整理信息收集阶段常用的方法与工具。
date: 2026-08-16
tags: [Web, HTTP, 信息收集]
draft: false
---

## 为什么先从 HTTP 开始

Web 安全的所有漏洞都发生在「请求-响应」的交互过程中。不理解 HTTP，就看不懂 SQL 注入、XSS、CSRF 这些漏洞是怎么被触发的，也看不懂 Burp Suite 里那些报文。

## 请求与响应的基本结构

一次 HTTP 请求由三部分组成：

```http
GET /index.php?id=1 HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Cookie: PHPSESSID=abc123

```

第一行是请求行，包含方法、路径和协议版本；中间是请求头；空行之后是请求体（GET 一般没有）。

响应同样有三段：状态行、响应头、响应体。

## 常见的请求方法

| 方法 | 用途 | 注意点 |
|------|------|--------|
| GET | 获取资源 | 参数在 URL 上，容易被记录 |
| POST | 提交数据 | 参数在请求体里 |
| OPTIONS | 探测服务器支持的方法 | 配合 `Allow` 响应头判断接口能力 |
| PUT / DELETE | 上传 / 删除资源 | 未正确配置时可能越权 |

> 信息收集时可以用 `OPTIONS` 请求看一下服务器开放了哪些方法，有些站会允许 PUT 直接写文件。

## 请求头里能收集到什么

常见的请求头本身就是信息：

- `Server`：暴露 Web 服务器类型与版本
- `X-Powered-By`：暴露 PHP/ASP.NET 等后端框架
- `Set-Cookie`：暴露会话机制，比如 `HttpOnly` 是否设置
- `Location` / `Referer`：泄露内部跳转路径

用 `curl -I` 可以快速看响应头：

```bash
curl -I https://example.com
```

## 信息收集的常见手段

信息收集的目标是摸清目标的「攻击面」，常见手段包括：

1. 子域名枚举：`subfinder`、`amass`
2. 目录扫描：`dirsearch`、`ffuf`
3. 指纹识别：`whatweb`、浏览器插件 Wappalyzer
4. 搜索引擎语法：`site:`、`inurl:` 等 Google Hacking 技巧

## 小结

这一篇只建立了 HTTP 的基础认知。后续的注入、越权、文件上传等笔记都会回到「报文长什么样」这个起点，遇到看不懂的请求，先回到这一篇。