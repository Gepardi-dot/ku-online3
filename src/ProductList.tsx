import { useRealtimeProducts } from '@/hooks/useRealtimeProducts';

export default function ProductList() {
  const { products, isLoading, error } = useRealtimeProducts();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold">Error Loading Products</p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 12l-6-3m12 6l6-3" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Products Available</h3>
          <p className="text-gray-500">There are currently no products to display. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Products ({products.length})</h2>
      <ul className="space-y-2">
        {products.map(product => (
          <li key={product.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">ID: {product.id}</p>
                {product.seller && (
                  <p className="text-sm text-gray-500">Seller: {product.seller.name}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  {product.price?.toLocaleString()} {product.currency}
                </p>
                <p className="text-xs text-gray-500">{product.condition}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
