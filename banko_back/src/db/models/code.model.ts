import * as mongoose from 'mongoose';
import * as models from '../models';

interface Code extends mongoose.Document {
  id: string;
  code: string;
  language: models.Language;
}

export default Code;
