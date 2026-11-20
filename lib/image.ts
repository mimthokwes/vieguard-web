export function formatImageUrl(path?: string | null): string {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return '/placeholder-product.svg';
  }

  // Do not allow external unsplash or third-party placeholder URLs
  if (path.includes('unsplash.com') || path.includes('via.placeholder') || path.includes('picsum.photos')) {
    return '/placeholder-product.svg';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Jika path tersimpan dengan URL localhost di database tetapi diakses di domain produksi, konversi ke domain API resmi
    if (path.includes('localhost:5000') || path.includes('127.0.0.1:5000')) {
      const isBrowserProduction = typeof window !== 'undefined' && window.location.hostname.includes('vieguard.web.id');
      if (isBrowserProduction || process.env.NODE_ENV === 'production') {
        return path.replace(/http:\/\/(localhost|127\.0\.0\.1):5000/, 'https://api.vieguard.web.id');
      }
    }
    return path;
  }

  // Tentukan host API yang tepat baik saat Server-Side Rendering (SSR) maupun di Client Browser
  const isBrowser = typeof window !== 'undefined';
  const isVieguardDomain = isBrowser && window.location.hostname.includes('vieguard.web.id');
  const isLocalHost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  let apiHost: string;

  if (process.env.NEXT_PUBLIC_API_HOST && process.env.NEXT_PUBLIC_API_HOST.trim() !== '') {
    apiHost = process.env.NEXT_PUBLIC_API_HOST.trim();
  } else if (isVieguardDomain) {
    apiHost = 'https://api.vieguard.web.id';
  } else if (isLocalHost) {
    apiHost = 'http://localhost:5000';
  } else if (process.env.NODE_ENV === 'production') {
    // Pada saat SSR di server produksi, browser klien akan memuat gambar melalui domain publik
    apiHost = 'https://api.vieguard.web.id';
  } else {
    apiHost = 'http://localhost:5000';
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiHost.replace(/\/+$/, '')}${cleanPath}`;
}

/** Primary image URL for a product, or null when it has none. */
export function primaryImage(images?: { imageUrl: string; isPrimary?: boolean }[] | null): string | null {
  if (!images || images.length === 0) return null;
  const img = images.find((i) => i.isPrimary) ?? images[0]!;
  return formatImageUrl(img.imageUrl);
}
