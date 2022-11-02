import { object, ref, string } from 'yup';

export const signUpSchema = object().shape({
  email: string().email('Email is not valid').required('Email is required'),
  username: string()
    .min(5, 'Username must be at least 5 characters')
    .max(20, 'Username must be at most 20 characters')
    .required('Username is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters')
    .required('Password is required'),
  confirmPassword: string()
    .required('Confirm password is required')
    .oneOf([ref('password')], 'Passwords do not match.'),
});

export type SignUpSchemaType = typeof signUpSchema;

export const loginSchema = object().shape({
  username: string()
    .min(5, 'Username must be at least 5 characters')
    .max(20, 'Username must be at most 20 characters')
    .required('Username is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters')
    .required('Password is required'),
});
export type LoginSchemaType = typeof loginSchema;
