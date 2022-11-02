import { object, string } from 'yup';

export const createProjectSchema = object().shape({
  title: string().required('Project title is required'),
});

export type CreateProjectSchemaType = typeof createProjectSchema;

export const joinProjectSchema = object().shape({
  sessionId: string().required('Session Id is required'),
  username: string().required('Username is required'),
});

export type JoinProjectSchemaType = typeof joinProjectSchema;
