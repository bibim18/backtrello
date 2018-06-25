import { HttpMethod, route } from '@spksoft/koa-decorator';
import card from '../../model/card/card.repo';
import lane from '../../model/lane/lane.model'

@route('/card')
export default class SystemController {
  //insert
  @route('/:id', HttpMethod.POST)
  async main(ctx) {
    const param = ctx.params.id
    const { cardTitle  } = ctx.request.body;
    let _cardid
    await card.create({
      cardTitle,
      description:'',
      attachment:'',
      comment:'',
      tag:[]
    }).then(res => {
       _cardid = res._id
    })
    await lane.findOneAndUpdate(
        {
        "_id": param
        },
        {
          $push: { 
            card_info: {
              _cardid,
            }
          }
        },
        { upsert: true }
      );
    
    ctx.body = await lane.aggregate([
      {
        $lookup: 
          {
            from: 'cards',
            localField: 'card_info._cardid',
            foreignField: '_id',
            as: 'card_info' 
          }
      }
    ]);
  }

  //show
  @route('/', HttpMethod.GET)
  async get(ctx) {
    const dd = await lane.aggregate([
      {
        $lookup: 
          {
            from: 'cards',
            localField: 'card_info._cardid',
            foreignField: '_id',
            as: 'card_info' 
          }
      }
    ]);
    ctx.body = dd;
  }

  //update
  @route('/:id', HttpMethod.PATCH)
  async update(ctx) {
    const param = ctx.params.id;
    const { cardTitle , description ,attachment,comment } = ctx.request.body;
    console.log("backend ",cardTitle , description ,attachment,comment)
    await card.update(
      {
        _id: param
      },
      {
        cardTitle,
        description,
        attachment,
        comment
      }
    );
    const upD = await lane.aggregate([
      {
        $lookup: 
          {
            from: 'cards',
            localField: 'card_info._cardid',
            foreignField: '_id',
            as: 'card_info' 
          }
      }
    ]);
    ctx.body = upD;
  }
}
