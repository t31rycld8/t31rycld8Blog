export interface SearchItem {
  title: string;
  description: string;
  tags: string[];
  category: string;
  subcategory: string;
  url: string;
  body: string;
  date: string;
}

let cached: Promise<SearchItem[]> | null = null;

export function getIndex(): Promise<SearchItem[]> {
  cached ??= fetch('/search-index.json')
    .then((res) => (res.ok ? (res.json() as Promise<SearchItem[]>) : []))
    .catch(() => []);
  return cached;
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

export function filterIndex(index: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return index
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q) ||
        item.subcategory.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q),
    )
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
      const bTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
      if (aTitle !== bTitle) return aTitle - bTitle;
      return b.date.localeCompare(a.date);
    });
}

export function highlight(text: string, query: string): string {
  const q = query.trim();
  if (!q) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const escapedQ = escapeHtml(q);
  const lower = escaped.toLowerCase();
  const start = lower.indexOf(escapedQ.toLowerCase());
  if (start === -1) return escaped;
  return (
    escaped.slice(0, start) +
    '<mark>' +
    escaped.slice(start, start + escapedQ.length) +
    '</mark>' +
    escaped.slice(start + escapedQ.length)
  );
}