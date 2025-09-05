'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/app-layout';
import ProductList from '@/ProductList';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';

export default function MarketplacePage() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClientComponentClient();

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
