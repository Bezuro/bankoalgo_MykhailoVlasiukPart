import * as mongoose from 'mongoose';

interface Step extends mongoose.Document {
  id: string;
  step_number: number;
  name: string;
  description: string;
}

export default Step;
