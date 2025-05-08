import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  People,
  Work,
  Event,
  Receipt,
  Timer,
  Mail,
  Folder,
} from '@mui/icons-material';
import { DashboardCard } from '../../components/ui/DashboardCard';
import { useAuth } from '../../lib/authProvider';
import { supabase } from '../../lib/supabase';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    activeProjects: 0,
    upcomingEvents: 0,
    pendingInvoices: 0,
    timeEntries: 0,
    unreadMessages: 0,
    newFiles: 0,
  });

  const theme = useTheme();

  const fetchDashboardStats = async () => {
    try {
      // Fetch clients count
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact' });

      // Fetch projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact' });

      // Fetch active projects count
      const { count: activeProjectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      // Fetch upcoming events count
      const { count: upcomingEventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .gte('date', new Date());

      // Fetch pending invoices count
      const { count: pendingInvoicesCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      // Fetch time entries count
      const { count: timeEntriesCount } = await supabase
        .from('time_entries')
        .select('*', { count: 'exact' });

      // Fetch unread messages count
      const { count: unreadMessagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('is_read', false);

      // Fetch new files count (last 7 days)
      const { count: newFilesCount } = await supabase
        .from('files')
        .select('*', { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

      setStats({
        clients: clientsCount || 0,
        projects: projectsCount || 0,
        activeProjects: activeProjectsCount || 0,
        upcomingEvents: upcomingEventsCount || 0,
        pendingInvoices: pendingInvoicesCount || 0,
        timeEntries: timeEntriesCount || 0,
        unreadMessages: unreadMessagesCount || 0,
        newFiles: newFilesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <Box sx={{
      width: '100%',
      p: 3,
      mt: 2
    }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Overview
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Clients"
            value={stats.clients}
            icon={<People sx={{ fontSize: 40 }} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Projects"
            value={stats.projects}
            icon={<Work sx={{ fontSize: 40 }} />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={<Event sx={{ fontSize: 40 }} />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            icon={<Event sx={{ fontSize: 40 }} />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Pending Invoices"
            value={stats.pendingInvoices}
            icon={<Receipt sx={{ fontSize: 40 }} />}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Time Entries"
            value={stats.timeEntries}
            icon={<Timer sx={{ fontSize: 40 }} />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Unread Messages"
            value={stats.unreadMessages}
            icon={<Mail sx={{ fontSize: 40 }} />}
            color={theme.palette.primary.light}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="New Files"
            value={stats.newFiles}
            icon={<Folder sx={{ fontSize: 40 }} />}
            color={theme.palette.secondary.light}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
