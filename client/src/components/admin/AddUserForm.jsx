// src/components/admin/AddUserForm.jsx
import React, { useState } from 'react';
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
  FormHelperText
} from '@mui/material';
import * as Yup from 'yup';
import { createUser, updateUser } from '../../api/users';
import { nameValidation, emailValidation, passwordValidation, addressValidation } from '../../utils/validation';

const AddUserForm = ({ user, onSuccess, onCancel }) => {
  const [error, setError] = useState('');
  
  const initialValues = user ? {
    name: user.name || '',
    email: user.email || '',
    password: '', // Don't pre-fill password for security
    
    role: user.role || 'user'
  } : {
    name: '',
    email: '',
    password: '',
    
    role: 'user'
  };

  // Different validation schema for create vs. update
  const validationSchema = Yup.object({
    name: nameValidation,
    email: emailValidation,
    password: user ? Yup.string().test(
      'password',
      'Password is required for new users or must meet complexity requirements if provided',
      function(value) {
        // If editing and no password provided, it's OK (we won't update it)
        if (user && (!value || value.trim() === '')) return true;
        
        // Otherwise apply password validation rules
        try {
          passwordValidation.validateSync(value);
          return true;
        } catch (error) {
          return false;
        }
      }
    ) : passwordValidation,
    address: addressValidation,
    role: Yup.string().oneOf(['admin', 'user', 'store_owner'], 'Invalid role').required('Role is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      // If we're updating and password is empty, remove it from the request
      if (user && (!values.password || values.password.trim() === '')) {
        const { password, ...userData } = values;
        await updateUser(user.id, userData);
      } else if (user) {
        await updateUser(user.id, values);
      } else {
        await createUser(values);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || (user ? 'Failed to update user' : 'Failed to create user'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Full Name"
                  name="name"
                  id="name"
                  helperText={touched.name && errors.name}
                  error={touched.name && Boolean(errors.name)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Email"
                  name="email"
                  id="email"
                  type="email"
                  helperText={touched.email && errors.email}
                  error={touched.email && Boolean(errors.email)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label={user ? "Password (leave blank to keep current)" : "Password"}
                  name="password"
                  id="password"
                  type="password"
                  helperText={touched.password && errors.password}
                  error={touched.password && Boolean(errors.password)}
                />
              </Grid>
              
              {/* <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Address"
                  name="address"
                  id="address"
                  multiline
                  rows={3}
                  helperText={touched.address && errors.address}
                  error={touched.address && Boolean(errors.address)}
                />
              </Grid> */}
              
              <Grid item xs={12}>
                <FormControl 
                  fullWidth
                  error={touched.role && Boolean(errors.role)}
                >
                  <InputLabel id="role-label">Role</InputLabel>
                  <Field
                    as={Select}
                    labelId="role-label"
                    id="role"
                    name="role"
                    label="Role"
                    value={values.role}
                    onChange={handleChange}
                  >
                    <MenuItem value="admin">System Administrator</MenuItem>
                    <MenuItem value="user">Normal User</MenuItem>
                    <MenuItem value="store_owner">Store Owner</MenuItem>
                  </Field>
                  {touched.role && errors.role && (
                    <FormHelperText>{errors.role}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? (user ? 'Updating...' : 'Creating...') 
                      : (user ? 'Update User' : 'Create User')
                    }
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddUserForm;