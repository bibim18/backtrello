import { HttpMethod, route } from '@spksoft/koa-decorator';
import lane from '../../model/lane/lane.model';
import card from '../../model/card/card.repo'

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
    const data = await lane.aggregate([
      {
      $lookup: 
        {
          from: 'cards',
          localField: 'card_info._cardid',
          foreignField: '_id',
          as: 'card_info' 
        }
      }
    ])
    ctx.body = data;
  }

  //show card
  @route('/', HttpMethod.GET)
  async get(ctx) {
    const data = await lane.aggregate([
      {
        $lookup: 
          {
            from: 'cards',
            localField: 'card_info._cardid',
            foreignField: '_id',
            as: 'card_info' 
          }
      }
    ])
    ctx.body = data;
  }
   //update card for move
   @route('/:laneid/:cardid/:position',HttpMethod.PATCH)
   async update(ctx){
     const laneid = ctx.params.laneid
     const cardid = ctx.params.cardid
     const posit = parseInt(ctx.params.position)
     console.log(laneid,cardid,posit)
     await lane.update(
      {"_id":laneid},
      {$pull:{
        "card_info":{
          _cardid:cardid
        }
      }}
    )
    await lane.update(
      {"_id":laneid},
      {
        $push: { 
          card_info: {
              $each:[{"_cardid":cardid}],
              $position:posit,
          },
        }
      },
    )
    console.log("lane =",lane)
    ctx.body =  await lane.aggregate([
        {
        $lookup: 
          {
            from: 'cards',
            localField: 'card_info._cardid',
            foreignField: '_id',
            as: 'card_info' 
          }
        },
      ])
   }

   //delete lane
   @route('/:id', HttpMethod.DELETE)
   async delete(ctx) {
     try {
      const param = ctx.params.id;
      let da = await lane.find({_id:param})
      const id = da[0].card_info.map(index => {
          card.delete({ _id: index._cardid })
      })

      await lane.remove({ _id: param });
       const data = await lane.aggregate([
        {
        $lookup: 
          {
            from: 'cards',
            localField: 'card_info._cardid',
            foreignField: '_id',
            as: 'card_info' 
          }
        }
      ])
        ctx.body = data;
       
     } catch (err) {
       ctx.status = 404;
       ctx.body = "can't delete";
     }
   }

   //delete card in lane
   @route('/:laneid/:cardid')
   async deletecard(ctx) {
      const paramlane = ctx.params.laneid
      const paramcard = ctx.params.cardid
      await lane.update(
        {"_id":paramlane},
        {$pull:{
          "card_info":{
            _cardid:paramcard
          }
        }}
      )
      await card.delete({ _id: paramcard })
      ctx.body= await lane.aggregate([
        {
        $lookup: 
          {
            from: 'cards',
            localField: 'card_info._cardid',
            foreignField: '_id',
            as: 'card_info' 
          }
        }
      ])
   }
 }