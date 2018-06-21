import mongoose from 'mongoose';

const Schema = mongoose.Schema({
  cardTitle: { type: String, required: true },
  attachment: { type: String },
  description: { type: String },
  comment: { type: String },
  tag: { type: Array },
});

const model = mongoose.model('cards', Schema);
export default model;
