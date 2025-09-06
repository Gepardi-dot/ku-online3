'use client'

import { useState } from 'react'
import MarketplaceSearch from './components/marketplace-search'
import ProductGrid from './components/product-grid'

interface SearchFilters {
  search: string
  category: string
  location: string
  condition: string
  priceMin: number | undefined
  priceMax: number | undefined
}

export default function ProductList() {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: '',
    location: '',
    condition: '',
    priceMin: undefined,
    priceMax: undefined
  })

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <MarketplaceSearch 
          onFiltersChange={handleFiltersChange} 
          initialFilters={filters}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ProductGrid filters={filters} />
      </div>
    </div>
  )
}
