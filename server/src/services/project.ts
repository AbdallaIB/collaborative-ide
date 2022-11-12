import projectModel, { Project } from '@models/project';

// Create Project
export const createProject = async (input: Partial<Project>) => {
  const project = projectModel.create(input);
  return project;
};

// Find project by Id
export const findProjectById = async (id: string, userId: string) => {
  const project = projectModel.findOne(
    { _id: id, ownerId: userId },
    { title: 1, css: 1, html: 1, js: 1, updatedAt: 1, ownerId: 1 },
    { lean: 1 },
  );
  return project;
};

// Find All users projects
export const findAllUsersProjects = async (id: string) => {
  const project = projectModel.find(
    { ownerId: id },
    { title: 1, css: 1, html: 1, js: 1, updatedAt: 1, ownerId: 1 },
    { lean: 1 },
  );
  return project;
};

// Update project by Id
export const updateProjectById = async (id: string, userId: string, input: Partial<Project>) => {
  const project = projectModel.findOneAndUpdate({ _id: id, ownerId: userId }, input, { new: true });
  return project;
};

// Delete project by Id
export const deleteProjectById = async (id: string) => {
  const project = projectModel.findOneAndDelete({ _id: id });
  return project;
};
