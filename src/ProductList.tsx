import { useRealtimeProducts } from '@/hooks/useRealtimeProducts';

export default function ProductList() {
  const products = useRealtimeProducts();
  
  if (!products || products.length === 0) return <div>No products available.</div>;

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <strong>{product.name}</strong> (ID: {product.id})
        </li>
      ))}
    </ul>
  );
}
