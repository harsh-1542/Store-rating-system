import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import * as Yup from 'yup';
import { createStore, updateStore } from '../../api/stores';
import { getUsers } from '../../api/users';
import { nameValidation, addressValidation } from '../../utils/validation';

const AddStoreForm = ({ store, onSuccess, onCancel }) => {
  const [error, setError] = useState('');
  const [storeOwners, setStoreOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  
  const initialValues = store ? {
    name: store.name || '',
    address: store.address || '',
    ownerId: store.owner?.id || ''
  } : {
    name: '',
    address: '',
    ownerId: ''
  };

  const validationSchema = Yup.object({
    name: nameValidation,
    address: addressValidation,
    ownerId: Yup.string() // Optional
  });

  useEffect(() => {
    const fetchStoreOwners = async () => {
      try {
        setLoadingOwners(true);
        const response = await getUsers({ role: 'store_owner' });
        setStoreOwners(response.data);
      } catch (error) {
        console.error('Error fetching store owners:', error);
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchStoreOwners();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      let response;

      if (store) {
        // Update existing store
        response = await updateStore(store.id, values);
      } else {
        // Create new store
        response = await createStore(values);
      }

      resetForm();
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error saving store:', error);
      setError(error.response?.data?.message || 'Failed to save store');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <h2>{store ? 'Edit Store' : 'Add New Store'}</h2>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, handleChange }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  id="name"
                  name="name"
                  label="Store Name"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  id="address"
                  name="address"
                  label="Store Address"
                  value={values.address}
                  onChange={handleChange}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl 
                   
                  margin="normal"
                  fullWidth sx={{ minWidth: 200 }}
                  error={touched.ownerId && Boolean(errors.ownerId)}
                >
                  <InputLabel id="owner-select-label">Store Owner (Optional)</InputLabel>
                  <Field
                    as={Select}
                    labelId="owner-select-label"
                    id="ownerId"
                    name="ownerId"
                    value={values.ownerId}
                    label="Store Owner (Optional)"
                    onChange={handleChange}
                    disabled={loadingOwners}
                  >
                    <MenuItem value="">
                      <em>None</em>
                      
                    </MenuItem>
                    {storeOwners.map((owner) => (
                      <MenuItem key={owner.id} value={owner.id}>
                        {owner.name || owner.email}
                      </MenuItem>
                    ))}
                  </Field>
                  {loadingOwners && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <span>Loading store owners...</span>
                    </Box>
                  )}
                  {touched.ownerId && errors.ownerId && (
                    <FormHelperText>{errors.ownerId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                {onCancel && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={onCancel}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Saving...' : store ? 'Update Store' : 'Add Store'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddStoreForm;