'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/app-layout';
import ProductList from '@/ProductList';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export default function MarketplacePage() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <AppLayout>
      <ProductList />
    </AppLayout>
  );
}
