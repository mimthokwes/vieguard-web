import { redirect } from 'next/navigation';

// The cart flow was replaced by direct booking on the product page (Figma screen 13).
export default function CartPage() {
  redirect('/rental');
}
