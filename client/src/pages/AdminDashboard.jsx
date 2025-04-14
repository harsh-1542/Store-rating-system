// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { 
  People, 
  Store as StoreIcon, 
  Star, 
  Add as AddIcon,
  Refresh 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers } from '../api/users';
import { getAllStores } from '../api/stores';
import UsersList from '../components/admin/UsersList';
import StoresList from '../components/admin/StoresList';
import AddUserForm from '../components/admin/AddUserForm';
import AddStoreForm from '../components/admin/AddStoreForm';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openAddStore, setOpenAddStore] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersResponse, storesResponse] = await Promise.all([
        getAllUsers(),
        getAllStores()
      ]);
      
      // Calculate total ratings from stores data
      const ratings = storesResponse.data.reduce((total, store) => {
        return total + (store.ratings?.length || 0);
      }, 0);
      
      setDashboardData({
        totalUsers: usersResponse.data.length,
        totalStores: storesResponse.data.length,
        totalRatings: ratings,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefreshData = () => {
    fetchDashboardData();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <IconButton onClick={handleRefreshData} aria-label="refresh data">
          <Refresh />
        </IconButton>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5">{dashboardData.totalUsers}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StoreIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5">{dashboardData.totalStores}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Stores</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5">{dashboardData.totalRatings}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Ratings</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Users" id="tab-0" />
            <Tab label="Stores" id="tab-1" />
          </Tabs>
          <Box sx={{ pr: 2 }}>
            {tabValue === 0 && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setOpenAddUser(true)}
              >
                Add User
              </Button>
            )}
            {tabValue === 1 && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setOpenAddStore(true)}
              >
                Add Store
              </Button>
            )}
          </Box>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {/* {tabValue === 0 && <UsersList refreshData={fetchDashboardData */}
          {tabValue === 0 && <UsersList refreshData={fetchDashboardData} />}
          {tabValue === 1 && <StoresList refreshData={fetchDashboardData} />}
        </Box>
      </Paper>
      
      {/* Add User Dialog */}
      <Dialog 
        open={openAddUser} 
        onClose={() => setOpenAddUser(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <AddUserForm 
            onSuccess={() => {
              setOpenAddUser(false);
              fetchDashboardData();
            }}
            onCancel={() => setOpenAddUser(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Add Store Dialog */}
      <Dialog 
        open={openAddStore} 
        onClose={() => setOpenAddStore(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Store</DialogTitle>
        <DialogContent>
          <AddStoreForm 
            onSuccess={() => {
              setOpenAddStore(false);
              fetchDashboardData();
            }}
            onCancel={() => setOpenAddStore(false)}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;