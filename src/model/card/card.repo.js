import CardModel from './card.model'
import MongooseBaseRepository from '@spksoft/mongoose-repository'
class CardRepo extends MongooseBaseRepository {

}
const instance = new CardRepo(CardModel)
export default instance