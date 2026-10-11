export function formatImageUrl(path?: string | null): string {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return '/placeholder-product.svg';
  }

  // Do not allow external unsplash or third-party placeholder URLs
  if (path.includes('unsplash.com') || path.includes('via.placeholder') || path.includes('picsum.photos')) {
    return '/placeholder-product.svg';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:5000';
  return `${apiHost}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** Primary image URL for a product, or null when it has none. */
export function primaryImage(images?: { imageUrl: string; isPrimary?: boolean }[] | null): string | null {
  if (!images || images.length === 0) return null;
  const img = images.find((i) => i.isPrimary) ?? images[0]!;
  return formatImageUrl(img.imageUrl);
}
