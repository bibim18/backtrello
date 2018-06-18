import LaneModel from './lane.model'
import MongooseBaseRepository from '@spksoft/mongoose-repository'
class LaneRepo extends MongooseBaseRepository {

}
const instance = new LaneRepo(LaneModel)
export default instance;