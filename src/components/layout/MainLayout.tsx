import React from 'react';
import { Box, Container, CssBaseline, useTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../lib/authProvider';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, role, loading } = useAuth();
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div>Loading...</div>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexGrow: 1,
        width: '100%',
        overflow: 'hidden'
      }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            width: '100%',
            ml: 240,
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflow: 'auto'
          }}
        >
          <Navbar onLogout={() => window.location.href = '/auth/signout'} />
          <Container maxWidth="xl" sx={{ mt: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
