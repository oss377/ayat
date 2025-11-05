'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

const withAdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AdminAuthComponent = (props: P) => {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (loading) return;

      if (!user) {
        router.replace('/loginAndRegistration');
      } else if (user.role?.trim() !== 'admin') {
        // If a non-admin (e.g., a 'user') tries to access an admin page, send them to the user dashboard.
        router.replace('/user'); // Redirect non-admins to the user dashboard
      }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'admin') {
      return <div>Loading...</div>; // Or a loading skeleton
    }

    return <WrappedComponent {...props} />;
  };

  return AdminAuthComponent;
};

export default withAdminAuth;