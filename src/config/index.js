import 'dotenv/config'
import db from './database'
import st from './system'

const combineConfig = {
    db,st
}
 export default combineConfig