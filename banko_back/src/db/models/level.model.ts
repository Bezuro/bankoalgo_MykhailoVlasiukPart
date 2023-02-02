import * as mongoose from 'mongoose';

interface Level extends mongoose.Document {
  id: string;
  name: string;
  minAddedAlgorithms: number;
  maxAddedAlgorithms: number;
  description: string;
}

export default Level;
