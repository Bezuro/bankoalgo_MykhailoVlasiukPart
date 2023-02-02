import * as mongoose from 'mongoose';
import * as models from '../models';

interface Group extends mongoose.Document {
  id: string;
  name: string;
  tags: [models.Tag];
  showNumber: number;
  isActive: boolean;
}

export default Group;
