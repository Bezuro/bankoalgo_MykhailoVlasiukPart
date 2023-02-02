import * as mongoose from 'mongoose';
import * as models from '../models';

interface Tag extends mongoose.Document {
  id: string;
  name: string;
  color: string;
  group: models.Group;
  user: models.User;
  isActive: boolean;
}

export default Tag;
