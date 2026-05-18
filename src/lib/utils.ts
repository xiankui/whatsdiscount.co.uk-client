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

export function extractDiscountInfo(text: string): { value: string; type: string } {
  // Extract percentage: 15%, 20% OFF, etc.
  const percentMatch = text.match(/(\d+%)/i);
  if (percentMatch) {
    const type = /off/i.test(text) ? 'Off' : /save/i.test(text) ? 'Save' : 'Discount';
    return { value: percentMatch[1], type };
  }

  // Extract currency: $10, £15, €20
  const currencyMatch = text.match(/([£$€]\d+(?:\.\d+)?)/i);
  if (currencyMatch) {
    const type = /off/i.test(text) ? 'Off' : /save/i.test(text) ? 'Save' : 'Discount';
    return { value: currencyMatch[1], type };
  }

  // Fallback: first word + rest
  const parts = text.split(/\s+/);
  return { value: parts[0], type: parts.slice(1).join(' ') || 'Discount' };
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}
