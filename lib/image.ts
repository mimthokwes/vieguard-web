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
