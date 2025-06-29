'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useCartStore from '@/stores/zustand/useCartStore';

export default function SyncCartOnLogin() {
  const { syncCartToDB } = useCartStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      syncCartToDB(session.user.email ?? '');
    }
  }, [status, session, syncCartToDB]);

  return null; // no UI, just function
}
