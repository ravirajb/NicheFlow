import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
} from '@mui/icons-material';
import { useAuth } from '../../lib/authProvider';
import { supabase } from '../../lib/supabase';

interface Client {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  tags: string[];
  created_at: string;
}

export default function Clients() {
  const { role } = useAuth();
  const [clients, setClients] = React.useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = () => {
    // TODO: Implement client creation modal
    console.log('Create client clicked');
  };

  const handleEditClient = (clientId: string) => {
    // TODO: Implement client edit modal
    console.log('Edit client clicked:', clientId);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      await fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  React.useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{
          width: '100%',
          p: 3,
          mt: 2
        }}>
      <Typography variant="h4" gutterBottom>
        Clients
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />,
            }}
          />
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
          onClick={handleCreateClient}
        >
          New Client
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Contact Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.company_name}</TableCell>
                  <TableCell>{client.contact_name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    {client.tags?.map((tag, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'inline-block',
                          backgroundColor: 'primary.light',
                          color: 'primary.main',
                          borderRadius: 1,
                          px: 1,
                          mr: 1,
                          fontSize: '0.75rem',
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditClient(client.id)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteClient(client.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
