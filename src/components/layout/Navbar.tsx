import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Notifications,
  Settings,
  Person,
  Help,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../../lib/authProvider';
import { supabase } from '../../lib/supabase';

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const { user, role } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = React.useState(0);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;
      setNotifications(data?.length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NicheFlow CRM
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton color="inherit">
            <Badge badgeContent={notifications} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit" onClick={() => window.location.href = '/support'}>
            <Help />
          </IconButton>
          
          <IconButton color="inherit" onClick={() => window.location.href = '/settings'}>
            <Settings />
          </IconButton>
          
          <IconButton onClick={handleMenu}>
            <Avatar
              alt={user?.full_name || 'User'}
              src={user?.avatar_url}
            />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => window.location.href = '/profile'}>
              <Person sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => window.location.href = '/settings'}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={onLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
