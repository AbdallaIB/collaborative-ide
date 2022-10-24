import { apiRequest, getAuthHeaders } from '@api/index';
import {
  GenericResponse,
  IProjectResponse,
  IProjectsResponse,
  ProjectCreateInput,
  ProjectUpdateInput,
} from '@api/types';

export const getMyProjects = async () => {
  const headers = getAuthHeaders();
  return apiRequest<undefined, IProjectsResponse>('get', 'project', {}, undefined, headers);
};

export const getProjectById = async (id: string) => {
  const headers = getAuthHeaders();
  return apiRequest<string, IProjectResponse>('get', 'project/' + id, {}, undefined, headers);
};

export const createProject = async (values: ProjectCreateInput) => {
  const headers = getAuthHeaders();
  return apiRequest<ProjectCreateInput, IProjectResponse>('post', 'project', {}, values, headers);
};

export const updateProject = async (id: string, values: ProjectUpdateInput) => {
  const headers = getAuthHeaders();
  return apiRequest<ProjectUpdateInput, IProjectResponse>('post', 'project/' + id, {}, values, headers);
};

export const deleteProject = async (id: string) => {
  const headers = getAuthHeaders();
  return apiRequest<string, GenericResponse>('delete', 'project/' + id, headers);
};
