// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { signupSchema } from "../utils/validation";
import { signup } from "../api/auth";

const Signup = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError("");
      setSuccess("");

      // Default role for signup is 'USER'
      console.log(values);
      
      const response = await signup(values);

      console.log(response.data);

      setSuccess("Account created successfully! You can now login.");
      resetForm();

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Store Rating System
        </Typography>
        <Typography component="h2" variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Formik
          initialValues={{ name: "", email: "", password: "", role: "" }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, handleChange, touched, errors }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    id="name"
                    name="name"
                    label="Full Name (min 20 characters)"
                    variant="outlined"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    id="password"
                    name="password"
                    label="Password (8-16 chars, 1 uppercase, 1 special char)"
                    type="password"
                    variant="outlined"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    sx={{ minWidth: 200 }}
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
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>

        <Typography align="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none" }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signup;
