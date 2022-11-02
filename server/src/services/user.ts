import { FilterQuery, QueryOptions } from 'mongoose';
import userModel, { User } from '@models/user';
import { signJwt } from '@utils/jwt';
import { DocumentType } from '@typegoose/typegoose';

// Create User
export const createUser = async (input: Partial<User>) => {
  const user = userModel.create(input);
  return user;
};

// Find User by Id
export const findUserById = async (id: string) => {
  const user = userModel.findOne({ _id: id }, { username: 1 }, { lean: 1 });
  return user;
};

// Find one user by any fields
export const findUser = async (query: FilterQuery<User>, options: QueryOptions = {}) => {
  return userModel.findOne(query, { username: 1, password: 1 }, options).select('+password');
};

// Sign Token
export const signToken = async (user: DocumentType<User>) => {
  // Sign the access token
  const access_token = signJwt({ uId: user._id, username: user.username });

  // Return access token
  return access_token;
};
