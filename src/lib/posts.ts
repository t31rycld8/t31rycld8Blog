import type { CollectionEntry } from 'astro:content';

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function getPublishedPosts(
  posts: CollectionEntry<'posts'>[],
  includeDrafts = false,
): CollectionEntry<'posts'>[] {
  return posts
    .filter((post) => includeDrafts || !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
