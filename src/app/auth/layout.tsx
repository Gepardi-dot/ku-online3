import type { ReactNode } from 'react';

// This layout is needed to wrap the auth pages and satisfy Next.js build requirements.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
