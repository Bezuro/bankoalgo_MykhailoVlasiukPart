import * as mongoose from 'mongoose';
import * as models from '../models';

interface User extends mongoose.Document {
  id: string;
  email: string;
  nickname: string;
  password: string;
  isAdmin: boolean;
  isBanned: boolean;
  isDeleted: boolean;
  allCreatedAlgorithms: [models.Algorithm];
  likedAlgorithms: [models.Algorithm];
  dislikedAlgorithms: [models.Algorithm];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  level: models.Level;
}

export default User;
