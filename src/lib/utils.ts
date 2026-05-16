const IMG_URL = import.meta.env.IMG_URL || '';

export function getImageUrl(imageKey: string): string {
  if (!imageKey) return '';
  if (imageKey.startsWith('http')) return imageKey;
  return `${IMG_URL}${imageKey}`;
}

export function encodeCouponLink(domain: string, couponId: number): string {
  return btoa(`${domain}&${couponId}`);
}

export function decodeCouponLink(pid: string): { domain: string; couponId: number } {
  const [domain, couponIdStr] = atob(pid).split('&');
  return {
    domain,
    couponId: parseInt(couponIdStr, 10),
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatMonthYear(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}
