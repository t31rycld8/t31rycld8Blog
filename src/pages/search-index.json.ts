import { getCollection } from 'astro:content';
import { getPublishedPosts, getCategorySlug, getSubcategorySlug, postUrl } from '../lib/posts';
import { categoryName, subcategoryName } from '../lib/catalog';
import type { SearchItem } from '../scripts/search';

export async function GET(): Promise<Response> {
  const allPosts = await getCollection('posts');
  const posts = getPublishedPosts(allPosts, false);
  const items: SearchItem[] = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    category: categoryName(getCategorySlug(post)),
    subcategory: subcategoryName(getCategorySlug(post), getSubcategorySlug(post)),
    url: postUrl(post),
    body: (post.body ?? '').slice(0, 4000),
    date: post.data.date.toISOString().slice(0, 10),
  }));
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}