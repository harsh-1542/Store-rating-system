// src/components/admin/StoresList.jsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  CircularProgress,
  Rating,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { getAllStores, deleteStore, getStoreById } from '../../api/stores';
import AddStoreForm from './AddStoreForm';

const StoresList = ({ refreshData }) => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewStore, setViewStore] = useState(null);
  const [editStore, setEditStore] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await getAllStores();
      setStores(response.data);
      setFilteredStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = stores.filter(store => 
        store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStores(filtered);
    } else {
      setFilteredStores(stores);
    }
  }, [searchTerm, stores]);

  const handleView = async (storeId) => {
    try {
      const response = await getStoreById(storeId);
      setViewStore(response.data);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('Error fetching store details:', error);
    }
  };

  const handleEdit = async (storeId) => {
    try {
      const response = await getStoreById(storeId);
      setEditStore(response.data);
      setEditDialogOpen(true);
    } catch (error) {
      console.error('Error fetching store for edit:', error);
    }
  };

  const handleDeleteConfirm = (store) => {
    setStoreToDelete(store);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteStore(storeToDelete.id);
      await fetchStores();
      if (refreshData) {
        refreshData();
      }
    } catch (error) {
      console.error('Error deleting store:', error);
    } finally {
      setDeleteConfirmOpen(false);
      setStoreToDelete(null);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + rating.value, 0);
    return sum / ratings.length;
  };

  return (
    <div>
      <Box sx={{ mb: 3, display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Average Rating</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => {
                  const avgRating = calculateAverageRating(store.ratings);
                  return (
                    <TableRow key={store.id}>
                      <TableCell>{store.name}</TableCell>
                      <TableCell>{store.address}</TableCell>
                      <TableCell>{store.owner?.name || 'No owner'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating 
                            value={avgRating} 
                            precision={0.5} 
                            readOnly 
                            size="small" 
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({store.ratings?.length || 0} ratings)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleView(store.id)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEdit(store.id)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteConfirm(store)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No stores found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Store Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Store Details</DialogTitle>
        <DialogContent>
          {viewStore && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StoreIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5">{viewStore.name}</Typography>
              </Box>
              
              <Typography variant="subtitle1" fontWeight="bold">Address:</Typography>
              <Typography paragraph>{viewStore.address}</Typography>
              
              <Typography variant="subtitle1" fontWeight="bold">Owner:</Typography>
              <Typography paragraph>
                {viewStore.owner ? (
                  <Chip 
                    label={viewStore.owner.name || viewStore.owner.email} 
                    color="primary" 
                    variant="outlined"
                  />
                ) : (
                  'No owner assigned'
                )}
              </Typography>
              
              <Typography variant="subtitle1" fontWeight="bold">Average Rating:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating 
                  value={calculateAverageRating(viewStore.ratings)} 
                  precision={0.1} 
                  readOnly 
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({viewStore.ratings?.length || 0} ratings)
                </Typography>
              </Box>
              
              {viewStore.ratings && viewStore.ratings.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold">Ratings:</Typography>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {viewStore.ratings.map((rating) => (
                          <TableRow key={rating.id}>
                            <TableCell>{rating.user?.name || rating.user?.email || 'Anonymous'}</TableCell>
                            <TableCell>
                              <Rating value={rating.value} readOnly size="small" />
                            </TableCell>
                            <TableCell>
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              
              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Store Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Store</DialogTitle>
        <DialogContent>
          {editStore && (
            <AddStoreForm 
              store={editStore}
              onSuccess={() => {
                setEditDialogOpen(false);
                fetchStores();
                if (refreshData) {
                  refreshData();
                }
              }}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Store</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the store "{storeToDelete?.name}"? This action cannot be undone.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              onClick={() => setDeleteConfirmOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoresList;