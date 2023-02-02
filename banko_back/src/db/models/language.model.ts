import * as mongoose from 'mongoose';
import * as models from '../models';

interface Language extends mongoose.Document {
  id: string;
  name: string;
  tags: [models.Tag];
  user: models.User;
  created_at: Date;
  updated_at: Date;
  isActive: boolean;
}

export default Language;
