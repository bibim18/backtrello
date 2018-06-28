import { HttpMethod, route } from '@spksoft/koa-decorator';
import lane from '../../model/lane/lane.model';
import card from '../../model/card/card.model'

const handleArgg = () => {
  return lane.aggregate([
    {
    $lookup: 
      {
        from: 'cards',
        localField: 'card_info._cardid',
        foreignField: '_id',
        as: 'card_info' 
      }
    },
    // {
    //  "$unwind": "$card_info"
    // },
    {"$sort": {'card_info.index': 1}}, 
    // {$group: {_id: '$_id', 'card_info': {$push: '$card_info'}}}, 
  ])
}

@route('/lane')
export default class SystemController {
  //insert lanes
  @route('/', HttpMethod.POST)
  async main(ctx) {
    const { title} = ctx.request.body;
     await lane.create({
      title,
      card_info:[]
    });
    const data = await handleArgg()
    ctx.body = data;
  }

  //show card
  @route('/', HttpMethod.GET)
  async get(ctx) {
    const data = await handleArgg()
    ctx.body = data;
  }
  
   //move lane
  @route('/',HttpMethod.PATCH)
  async update(ctx){
    
    const data = ctx.request.body;
    console.log("data = ",data)
    try{
      await lane.deleteMany({})
      await lane.insertMany(data)
      ctx.body = await handleArgg()
    }catch(err){
      console.log(err)
    }
  }

  //move card in lane
  @route('/card',HttpMethod.PATCH)
  async test(ctx){
    const data = ctx.request.body;
    try{
      await card.deleteMany({})
      await card.insertMany(data)
      ctx.body = await handleArgg()
    }catch(err){
      console.log(err)
    }
  }

  //move card cross lane
  @route('/cards',HttpMethod.PATCH)
  async testes(ctx){
    const data = ctx.request.body
    try{
      await card.deleteMany({})
      await card.insertMany(data.card)

      await lane.deleteMany({})
      await lane.insertMany(data.lane)
      
      ctx.body = await handleArgg()
    }catch(err){
      console.log(err)
    }
  }

   //delete lane
   @route('/:id', HttpMethod.DELETE)
   async delete(ctx) {
     try {
      const param = ctx.params.id;
      let da = await lane.find({_id:param})
      const id = da[0].card_info.map(index => {
        console.log("delete in lane da ",da)
          card.delete({ _id: index._cardid })
      })

      await lane.remove({ _id: param });
       const data = await handleArgg()
        ctx.body = data;
       
     } catch (err) {
       ctx.status = 404;
       console.log(err)
       ctx.body = err;
     }
   }

   //delete card in lane
   @route('/:laneid/:cardid')
   async deletecard(ctx) {
      const paramlane = ctx.params.laneid
      const paramcard = ctx.params.cardid
      console.log(paramlane,paramcard)
      await lane.update(
        {"_id":paramlane},
        {$pull:{
          "card_info":{
            _cardid:paramcard
          }
        }}
      )
      await card.delete({ '_id': paramcard })
      ctx.body = await handleArgg()
   }
 }
