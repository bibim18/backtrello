import mongoose from 'mongoose';

const Schema = mongoose.Schema({
  cardTitle: { type: String },
  attachment: { type: String },
  description: { type: String },
  comment: { type: String },
  tag: { type: Array },
  index: { type: Number },
});

const model = mongoose.model('cards', Schema);
export default model;
