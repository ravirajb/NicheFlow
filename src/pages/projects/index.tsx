import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  FilterList,
  Timeline,
  Description,
  AttachFile,
  People,
} from '@mui/icons-material';
import { useAuth } from '../../lib/authProvider';
import { supabase } from '../../lib/supabase';

interface Project {
  id: string;
  name: string;
  description: string;
  client_id: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  progress: number;
}

interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  created_at: string;
}

export default function Projects() {
  const { role } = useAuth();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [activeTab, setActiveTab] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const theme = useTheme();

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateProject = () => {
    // TODO: Implement project creation modal
    console.log('Create project clicked');
  };

  const handleEditProject = (projectId: string) => {
    // TODO: Implement project edit modal
    console.log('Edit project clicked:', projectId);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  React.useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const projectStatusColors = {
    draft: 'warning',
    active: 'success',
    completed: 'primary',
    archived: 'grey',
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
          onClick={handleCreateProject}
        >
          New Project
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Projects" />
          <Tab label="Active" />
          <Tab label="Draft" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : projects.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary">
              No projects found
            </Typography>
          </Grid>
        ) : (
          projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Typography variant="h6" gutterBottom>
                      {project.name}
                    </Typography>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: `${projectStatusColors[project.status]}.light`,
                        color: `${projectStatusColors[project.status]}.main`,
                      }}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Box>
                  </Box>
                  
                  <Typography color="textSecondary" paragraph>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timeline sx={{ color: 'primary.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        {project.progress}% Complete
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <People sx={{ color: 'primary.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        {project.client_id}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <IconButton onClick={() => handleEditProject(project.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProject(project.id)}>
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
