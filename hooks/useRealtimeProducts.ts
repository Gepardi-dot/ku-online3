import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client' // Adjust this path if needed

export function useRealtimeProducts() {
  const [products, setProducts] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('products')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev => prev.map(p => 
              p.id === payload.new.id ? payload.new : p
            ))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return products
}
