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

   //delete lane
   @route('/:id', HttpMethod.DELETE)
   async delete(ctx) {
     try {
       const param = ctx.params.id;
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