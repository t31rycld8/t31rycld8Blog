import type { CollectionEntry } from 'astro:content';
import {
  CATEGORY_META,
  SUBCATEGORY_META,
  categoryDescription,
  categoryName,
  subcategoryName,
} from './catalog';

export type Post = CollectionEntry<'posts'>;

export interface SubcategoryData {
  slug: string;
  name: string;
  posts: Post[];
}

export interface CategoryData {
  slug: string;
  name: string;
  description: string;
  postCount: number;
  subcategories: SubcategoryData[];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function getPublishedPosts(posts: Post[], includeDrafts = false): Post[] {
  return posts
    .filter((post) => includeDrafts || !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function getCategorySlug(post: Post): string {
  return post.id.split('/')[0] ?? '';
}

export function getSubcategorySlug(post: Post): string {
  return post.id.split('/')[1] ?? '';
}

export function postUrl(post: Post): string {
  return `/${post.id}`;
}

/**
 * 让未知 slug 排到已知 slug 之后，同类内按名称排序。
 */
function orderSlugs(slugs: string[], known: string[]): string[] {
  return [...slugs].sort((a, b) => {
    const ai = known.indexOf(a);
    const bi = known.indexOf(b);
    const aIndex = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
    const bIndex = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
    return aIndex - bIndex || a.localeCompare(b);
  });
}

/**
 * 根据文章目录结构构建 栏目 -> 子分类 -> 文章 的树形数据。
 * 目录即结构：posts/<栏目>/<子分类>/*.md，无需额外登记。
 */
export function buildCategories(posts: Post[]): CategoryData[] {
  const byCategory = new Map<string, Post[]>();
  for (const post of posts) {
    const category = getCategorySlug(post);
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category)!.push(post);
  }

  const categorySlugs = orderSlugs([...byCategory.keys()], Object.keys(CATEGORY_META));

  return categorySlugs.map((categorySlug) => {
    const categoryPosts = byCategory.get(categorySlug)!;
    const bySubcategory = new Map<string, Post[]>();
    for (const post of categoryPosts) {
      const subcategory = getSubcategorySlug(post);
      if (!bySubcategory.has(subcategory)) bySubcategory.set(subcategory, []);
      bySubcategory.get(subcategory)!.push(post);
    }

    const knownSubs = Object.keys(SUBCATEGORY_META[categorySlug] ?? {});
    const subcategorySlugs = orderSlugs([...bySubcategory.keys()], knownSubs);

    const subcategories = subcategorySlugs.map((subSlug) => ({
      slug: subSlug,
      name: subcategoryName(categorySlug, subSlug),
      posts: bySubcategory.get(subSlug)!.sort(
        (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
      ),
    }));

    return {
      slug: categorySlug,
      name: categoryName(categorySlug),
      description: categoryDescription(categorySlug),
      postCount: categoryPosts.length,
      subcategories,
    };
  });
}