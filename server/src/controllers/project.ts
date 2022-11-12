import loggerHandler from '@utils/logger';
const moduleName = '[project]';
const logger = loggerHandler(moduleName);
import { Request, Response } from 'express';
import { statusCodes } from '@utils/constants';
import { RequestWithUser } from '@middlewares/auth';
import {
  createProject,
  deleteProjectById,
  findAllUsersProjects,
  findProjectById,
  updateProjectById,
} from '@services/project';

export class ProjectController {
  public async createProject(req: RequestWithUser, res: Response) {
    logger.info('[createProject][body]', req.body);
    const { title } = req.body;
    try {
      const { _id } = await createProject({
        title,
        ownerId: req.user.uId,
      });

      res.status(statusCodes.OK).json({
        project: { id: _id, title, updatedAt: Date.now() },
      });
    } catch (e: any) {
      logger.error('[createProject][Error]', e.message);
      return res.status(statusCodes.BAD_REQUEST).json({ message: e.message });
    }
  }

  public async getMyProjects(req: RequestWithUser, res: Response) {
    logger.info('[getMyProjects][user]', req.user);
    try {
      const user = req.user;
      const projects = await findAllUsersProjects(user.uId);
      res.status(statusCodes.OK).json({
        projects: projects.map((project) => {
          return {
            ...project,
            id: project._id,
          };
        }),
      });
    } catch (e: any) {
      logger.error('[getMyProjects][Error]', e.message);
      return res.status(statusCodes.BAD_REQUEST).json({ message: e.message });
    }
  }

  public async getProject(req: RequestWithUser, res: Response) {
    logger.info('[getProject][params]', req.params as { id: string });
    try {
      const { id } = req.params;
      const { uId } = req.user;
      const project = await findProjectById(id, uId);
      if (!project) {
        return res.status(statusCodes.NOT_FOUND).json({ message: 'Project not found' });
      }
      res.status(statusCodes.OK).json({
        project,
      });
    } catch (e: any) {
      logger.error('[getProject][Error]', e.message);
      return res.status(statusCodes.BAD_REQUEST).json({ message: e.message });
    }
  }

  public async updateProject(req: RequestWithUser, res: Response) {
    logger.info('[updateProject][params]', req.params as { id: string });
    const { id } = req.params;
    const { uId } = req.user;
    try {
      const project = await updateProjectById(id, uId, req.body);
      res.status(statusCodes.OK).json({
        project,
      });
    } catch (e: any) {
      logger.error('[updateProject][Error]', e.message);
      return res.status(statusCodes.BAD_REQUEST).json({ message: e.message });
    }
  }

  public async deleteProject(req: RequestWithUser, res: Response) {
    logger.info('[deleteProject][params]', req.params as { id: string });
    const { id } = req.params;
    try {
      deleteProjectById(id);
      res.status(statusCodes.OK).json({
        message: 'Project deleted',
      });
    } catch (e: any) {
      logger.error('[deleteProject][Error]', e.message);
      return res.status(statusCodes.BAD_REQUEST).json({ message: e.message });
    }
  }
}
