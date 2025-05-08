import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import {
  Dashboard,
  People,
  Work,
  Event,
  CalendarToday,
  Receipt,
  Timer,
  Mail,
  Folder,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../../lib/authProvider';

interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  role?: string[];
}

const navigationItems: NavigationItem[] = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  {
    text: 'Clients',
    icon: <People />,
    path: '/clients',
  },
  {
    text: 'Projects',
    icon: <Work />,
    path: '/projects',
  },
  {
    text: 'Events',
    icon: <Event />,
    path: '/events',
  },
  {
    text: 'Calendar',
    icon: <CalendarToday />,
    path: '/calendar',
  },
  {
    text: 'Invoices',
    icon: <Receipt />,
    path: '/invoices',
  },
  {
    text: 'Time Tracking',
    icon: <Timer />,
    path: '/time-tracking',
  },
  {
    text: 'Communications',
    icon: <Mail />,
    path: '/communications',
  },
  {
    text: 'Files',
    icon: <Folder />,
    path: '/files',
  },
  {
    text: 'Settings',
    icon: <Settings />,
    path: '/settings',
    role: ['admin', 'team_lead'],
  },
];

export const Sidebar = (props: { sx?: any }) => {
  const drawerWidth = 240;
  const { role } = useAuth();
  const router = useRouter();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: '20%',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '20%',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap>
          NicheFlow CRM
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => {
          if (item.role && !item.role.includes(role)) {
            return null;
          }
          return (
            <ListItem
              button
              key={item.path}
              selected={router.pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};
