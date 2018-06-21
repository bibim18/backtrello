import mongoose from 'mongoose';

const cardInfoSchema = new mongoose.Schema({
  _cardid: { type: mongoose.Schema.Types.ObjectId, ref: 'cards' },
  cardTitle: { type: String },
}, { _id: false });

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  card_info: { type: [cardInfoSchema], default: [] },
});

const lane = mongoose.model('lanes', Schema);
export default lane;
