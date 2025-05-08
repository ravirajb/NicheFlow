import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import FilterList from '@mui/icons-material/FilterList';
import {
  Add,
  Edit,
  Delete,
  CalendarToday,
  Event,
  People,
  Description,
} from '@mui/icons-material';
import { useAuth } from '../../lib/authProvider';
import { supabase } from '../../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  attendees: string[];
  created_at: string;
}

export default function Events() {
  const { role } = useAuth();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState(0);
  const theme = useTheme();

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCreateEvent = () => {
    // TODO: Implement event creation modal
    console.log('Create event clicked');
  };

  const handleEditEvent = (eventId: string) => {
    // TODO: Implement event edit modal
    console.log('Edit event clicked:', eventId);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const eventTypeColors = {
    internal: 'primary',
    client: 'secondary',
    public: 'success',
    training: 'warning',
  };

  return (
    <Box sx={{
          width: '100%',
          p: 3,
          mt: 2
        }}>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<CalendarToday />}
          >
            View Calendar
          </Button>
          <Button
            variant="contained"
            startIcon={<FilterList />}
          >
            Filters
          </Button>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateEvent}
        >
          New Event
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Events" />
          <Tab label="Upcoming" />
          <Tab label="Past" />
          <Tab label="My Events" />
        </Tabs>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : events.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary">
              No events found
            </Typography>
          </Grid>
        ) : (
          events.map((event) => (
            <Grid item xs={12} md={6} lg={4} key={event.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography color="textSecondary" paragraph>
                        {event.description}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: `${eventTypeColors[event.event_type]}.light`,
                        color: `${eventTypeColors[event.event_type]}.main`,
                      }}
                    >
                      {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Event sx={{ color: 'primary.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <People sx={{ color: 'primary.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.attendees.length} Attendees
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <IconButton onClick={() => handleEditEvent(event.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteEvent(event.id)}>
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
