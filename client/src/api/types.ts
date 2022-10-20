export interface IUser {
  uId: string;
  username: string;
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
