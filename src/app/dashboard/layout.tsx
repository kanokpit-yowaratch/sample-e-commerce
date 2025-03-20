import React, { ReactNode } from 'react';
import AdminHeader from '@/components/layout/dashboard/AdminHeader';
import Sidebar from '@/components/layout/dashboard/Sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
