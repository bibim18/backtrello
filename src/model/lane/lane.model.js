import mongoose from 'mongoose';

const cardInfoSchema = new mongoose.Schema({
  _cardid: { type: mongoose.Schema.Types.ObjectId },
}, { _id: false });

const Schema = new mongoose.Schema({
  title: { type: String },
  card_info: { type: [cardInfoSchema], default: [] },
});

const lane = mongoose.model('lanes', Schema);
export default lane;
