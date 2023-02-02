import * as mongoose from 'mongoose';

interface Visit extends mongoose.Document {
  id: string;
  date: string;
  visited: number;
}

export default Visit;
