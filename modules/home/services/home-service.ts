/**
 * Home page service — server-only.
 * Mengambil data untuk halaman beranda langsung dari backend API.
 */
import 'server-only';
import { getProducts } from '@/lib/api/product-api';
import { Product } from '@/types/product';

/**
 * Mengambil daftar produk untuk ditampilkan di section "Terbaik Untukmu"
 * pada halaman beranda. Produk diurutkan berdasarkan terbaru dan dibatasi
 * maksimal 10 item.
 */
export async function getHomeCatalogHighlights(): Promise<Product[]> {
  const products = await getProducts(undefined, { next: { revalidate: 300 } });
  return products.slice(0, 10);
}

/**
 * Mengambil 4 produk terbaru untuk section "Trending Sekarang"
 * pada halaman beranda.
 */
export async function getHomeTrendingProducts(): Promise<Product[]> {
  const products = await getProducts(undefined, { next: { revalidate: 300 } });
  return products.slice(0, 4);
}
