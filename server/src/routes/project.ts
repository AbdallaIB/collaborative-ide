import { Router } from 'express';
import { validate } from '@middlewares/validator';
import { ProjectController } from '@controllers/project';
import { createProjectSchema } from '@shared/schemas/project';
import { validateToken } from '@middlewares/auth';

const index = (router: Router, projectController: ProjectController) => {
  // Get user's projects
  router.get('/project', validateToken, projectController.getMyProjects);

  // Get project by id
  router.get('/project/:id', validateToken, projectController.getProject);

  // Create new project
  router.post('/project', validate(createProjectSchema), validateToken, projectController.createProject);

  // Update project
  router.post('/project/:id', validateToken, projectController.updateProject);

  // Delete project
  router.delete('/project/:id', validateToken, projectController.deleteProject);
};

export default index;
