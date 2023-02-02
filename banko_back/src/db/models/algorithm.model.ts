import * as mongoose from 'mongoose';
import { Tag, User, Code, Language, Step, Visit } from '../models';

interface Algorithm extends mongoose.Document {
  id: string;
  name: string;
  tags: [Tag];
  user: User;
  likes: number;
  dislikes: number;
  description: string;
  codes: [Code];
  examplesOfUse: [Code];
  explain_steps: Step;
  isDeleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  supportedLanguages: [Language];
  links: [string];
  complexity: string;
  visiting: [Visit];
}

export default Algorithm;
