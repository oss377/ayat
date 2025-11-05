// app/user/components/DashboardLayout.tsx
'use client';

import { ReactNode } from 'react';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
  user: any;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <DashboardHeader user={user} />
      {children}
    </div>
  );
}