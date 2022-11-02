import { Router } from 'express';
import defaultRouter from '@routes/default';
import authRouter from '@routes/auth';
import projectRouter from '@routes/project';
import { AuthController } from '@controllers/auth';
import { ProjectController } from '@controllers/project';

const router = Router();
// Controllers
const authController = new AuthController();
const projectController = new ProjectController();

// auth routes
authRouter(router, authController);

// project routes
projectRouter(router, projectController);

// Default Routes, This line should be the last line of this module.
defaultRouter(router);

export default router;
