'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (loading) return;

      if (!user) {
        router.replace('/loginAndRegistration');
      } else if (user.role === 'admin') {
        // If an admin tries to access a user page, send them to the admin dashboard.
        router.replace('/admin');
      }
    }, [user, loading, router]);

    if (loading || !user || user.role?.trim() !== 'user') {
      // You can show a loading spinner or a skeleton screen here
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;