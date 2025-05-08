import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/authProvider';
import { MainLayout } from './layout/MainLayout';
import { Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </MainLayout>
  );
};