export interface SubcategoryMeta {
  name: string;
}

export interface CategoryMeta {
  name: string;
  description: string;
}

/**
 * 栏目显示名与简介。key 为目录名（slug），新增栏目时在这里加一行即可。
 */
export const CATEGORY_META: Record<string, CategoryMeta> = {
  web: {
    name: 'Web 安全',
    description: 'Web 安全相关学习笔记：漏洞原理、利用手法、防御与工具链。',
  },
  reverse: {
    name: 'Reverse 逆向',
    description: '逆向工程相关学习笔记：二进制分析、算法还原、脱壳与工具链。',
  },
};

/**
 * 子分类显示名。key 为栏目 slug -> 子分类目录名。
 * 未登记的子分类会回退显示目录名本身。
 */
export const SUBCATEGORY_META: Record<string, Record<string, SubcategoryMeta>> = {
  web: {
    'info-collection': { name: '信息收集' },
  },
  reverse: {
    basics: { name: '逆向基础' },
  },
};

export function categoryName(slug: string): string {
  return CATEGORY_META[slug]?.name ?? slug;
}

export function categoryDescription(slug: string): string {
  return CATEGORY_META[slug]?.description ?? '';
}

export function subcategoryName(categorySlug: string, subSlug: string): string {
  return SUBCATEGORY_META[categorySlug]?.[subSlug]?.name ?? subSlug;
}