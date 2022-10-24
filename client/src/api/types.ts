export interface IUser {
  uId: string;
  username: string;
}

export interface IProject {
  id: string;
  title: string;
  css: string;
  html: string;
  js: string;
  updatedAt: string;
  ownerId: string;
}

export interface ProjectCreateInput {
  title: string;
}

export interface ProjectJoinInput {
  username: string;
  sessionId: string;
}

export interface ProjectUpdateInput {
  css: string;
  html: string;
  js: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface SignUpInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface GenericResponse {
  message: string;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
}

export interface IUserResponse {
  user: IUser;
  accessToken: string;
}

export interface IProjectResponse {
  project: IProject;
}

export interface IProjectsResponse {
  projects: IProject[];
}
