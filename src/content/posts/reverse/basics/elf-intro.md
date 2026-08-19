---
title: ELF 文件格式速览
description: 认识 ELF 文件结构：文件头、节与程序头，为后续逆向分析打基础。
date: 2026-08-16
tags: [Reverse, ELF, 二进制]
draft: false
---

## 什么是 ELF

ELF（Executable and Linkable Format）是 Linux 下可执行文件、共享库和核心转储的通用格式。逆向一个 Linux 程序，第一步就是读懂它的 ELF 结构。

## ELF 文件头

文件最开头是 ELF header，用 `readelf -h` 查看：

```bash
readelf -h ./a.out
```

输出里重点看这几个字段：

- `Class`：32 位还是 64 位
- `Data`：大小端
- `Type`：可执行文件（EXEC）、共享对象（DYN）等
- `Entry point address`：程序入口地址

## 节（Section）与程序头（Segment）

两者视角不同：

| 概念 | 作用 | 查看命令 |
|------|------|----------|
| Section | 链接视角：代码、数据、符号的组织 | `readelf -S` |
| Segment | 加载视角：运行时如何映射到内存 | `readelf -l` |

常用节包括 `.text`（代码）、`.data` / `.rodata`（数据）、`.bss`（未初始化数据）、`.plt` / `.got`（动态链接跳板）。

## 用十六进制看一眼

`readelf -h` 的原始字节其实就是文件开头那一段：

```text
7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00
```

`7f 45 4c 46` 就是魔数 `\x7fELF`，是文件类型判定的依据。

## 常用查看工具

- `readelf`：查看 ELF 结构
- `file`：快速判断文件类型
- `objdump -d`：反汇编
- `strings`：提取可打印字符串
- `gdb`：动态调试

## 小结

理解 ELF 的文件头、节和程序头，是逆向分析的第一步。下一篇可以接着看 `.plt` / `.got` 与动态链接，或者直接上手 `objdump` 反汇编一个小程序。