import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
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
  TextField,
  Typography,
  useTheme,
  Autocomplete,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Timer,
  PlayArrow,
  Stop,
  Edit,
  Delete,
  Event,
  Work,
} from '@mui/icons-material';
import { useAuth } from '../../lib/authProvider';
import { supabase } from '../../lib/supabase';

interface TimeEntry {
  id: string;
  project_id: string;
  task_id: string;
  user_id: string;
  hours: number;
  date: string;
  description: string;
  created_at: string;
  is_running: boolean;
  project: {
    id: string;
    name: string;
  };
  task: {
    id: string;
    title: string;
    project_id: string;
  };
}

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  project_id: string;
  title: string;
}

export default function TimeTracking() {
  const { role } = useAuth();
  const [timeEntries, setTimeEntries] = React.useState<TimeEntry[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [activeTab, setActiveTab] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<string | null>(null);
  const [hours, setHours] = React.useState('0');
  const [description, setDescription] = React.useState('');
  const theme = useTheme();

  const fetchTimeEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          projects:project_id(
            name
          ),
          tasks:task_id(
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimeEntries(data || []);
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleStartTimer = async (projectId: string, taskId: string) => {
    try {
      const { error } = await supabase
        .from('time_entries')
        .insert([
          {
            project_id: projectId,
            task_id: taskId,
            user_id: 'user_id', // TODO: Get from auth
            hours: 0,
            description: '',
            date: new Date().toISOString().split('T')[0],
            is_running: true,
          },
        ]);

      if (error) throw error;
      await fetchTimeEntries();
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const handleStopTimer = async (timeEntryId: string) => {
    try {
      const { error } = await supabase
        .from('time_entries')
        .update({ is_running: false })
        .eq('id', timeEntryId);

      if (error) throw error;
      await fetchTimeEntries();
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  const handleCreateTimeEntry = async () => {
    try {
      const { error } = await supabase
        .from('time_entries')
        .insert([
          {
            project_id: selectedProject,
            task_id: selectedTask,
            user_id: 'user_id', // TODO: Get from auth
            hours: parseFloat(hours),
            description: description,
            date: new Date().toISOString().split('T')[0],
          },
        ]);

      if (error) throw error;
      await fetchTimeEntries();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating time entry:', error);
    }
  };

  React.useEffect(() => {
    fetchTimeEntries();
    fetchProjects();
    fetchTasks();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Time Tracking
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<Timer />}
          onClick={() => setOpenDialog(true)}
        >
          Log Time
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Today" />
        <Tab label="This Week" />
        <Tab label="This Month" />
        <Tab label="All Time" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : timeEntries.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No time entries found
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {timeEntries.map((entry) => (
              <Grid item xs={12} md={6} lg={4} key={entry.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {entry.project?.name}
                        </Typography>
                        <Typography color="textSecondary" paragraph>
                          {entry.task?.title}
                        </Typography>
                        <Typography color="textSecondary" paragraph>
                          {entry.description}
                        </Typography>
                      </Box>
                      {entry.is_running ? (
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: 'error.light',
                            color: 'error.main',
                          }}
                        >
                          Timer Running
                        </Box>
                      ) : null}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Event sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(entry.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Work sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          {entry.hours} hours
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    {entry.is_running ? (
                      <IconButton onClick={() => handleStopTimer(entry.id)}>
                        <Stop />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleStartTimer(entry.project_id, entry.task_id)}>
                        <PlayArrow />
                      </IconButton>
                    )}
                    <IconButton>
                      <Edit />
                    </IconButton>
                    <IconButton>
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Log Time Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              disablePortal
              id="project-select"
              options={projects}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Project" variant="outlined" />}
              onChange={(_, value) => setSelectedProject(value?.id)}
              sx={{ mb: 2 }}
            />
            
            <Autocomplete
              disablePortal
              id="task-select"
              options={tasks.filter(task => task.project_id === selectedProject)}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => <TextField {...params} label="Task" variant="outlined" />}
              onChange={(_, value) => setSelectedTask(value?.id)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Hours"
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateTimeEntry}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
