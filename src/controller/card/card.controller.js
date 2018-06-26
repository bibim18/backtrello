import { HttpMethod, route } from '@spksoft/koa-decorator';
import card from '../../model/card/card.repo';
import lane from '../../model/lane/lane.model'
import multer from 'koa-multer'
import serve from 'koa-static'
const storage = multer.diskStorage({
  destination: function (req, file,cb){
    cb(null,'uploads/')
  },
  filename: function (req, file, cb){
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });


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
    }
  ])
}

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
    
    ctx.body = await handleArgg()
  }

  //show
  @route('/', HttpMethod.GET)
  async get(ctx) {
    const dd = await handleArgg()
    ctx.body = dd;
  }

  //update
  @route('/:id', HttpMethod.PATCH)
  async update(ctx) {
    const param = ctx.params.id;
    const { cardTitle ,description ,comment } = ctx.request.body;
    await card.update(
      {
        _id: param
      },
      {
        cardTitle,
        description,
        comment
      }
    );
    const upD = await handleArgg()
    ctx.body = upD;
  }

  //upload file 
  @route('/upload/:id', HttpMethod.POST ,upload.single('file'))
  async upload(ctx){
    const param = ctx.params.id
    const file = ctx.req.file.originalname
    await card.update({"_id":param},{attachment:file})
    ctx.body = file
  }
}
