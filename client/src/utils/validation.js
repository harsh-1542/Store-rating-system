// src/utils/validation.js
import * as Yup from 'yup';

export const nameValidation = Yup.string()
  .min(2, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters')
  .required('Name is required');

export const addressValidation = Yup.string()
  .max(400, 'Address must be at most 400 characters')
  .required('Address is required');

export const passwordValidation = Yup.string()
  .min(6, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .required('Password is required');

export const emailValidation = Yup.string()
  .email('Invalid email format')
  .required('Email is required');

export const loginSchema = Yup.object({
  email: emailValidation,
  password: Yup.string().required('Password is required'),
});

export const signupSchema = Yup.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  role: Yup.string().oneOf(['user', 'admin', 'store_owner'], 'Invalid role').required('Role is required'),
});

export const updatePasswordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const storeSchema = Yup.object({
  name: nameValidation,
  address: addressValidation,
});

export const ratingSchema = Yup.object({
  rating: Yup.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .required('Rating is required'),
  comment: Yup.string().max(200, 'Comment must be at most 200 characters'),
});