import Koa from 'koa';
import path from 'path';
import body from 'koa-bodyparser';
import cors from '@koa/cors';
import config from './config';
import { load } from '@spksoft/koa-decorator';
import mongooseClient from './libraries/database/client/mongoose';
require('dotenv').config;
const app = new Koa();

app.use(body());
app.use(cors());
const apiRouter = load(path.resolve(__dirname, 'controller'), '.controller.js');
app.use(apiRouter.routes());
app.use(
  apiRouter.allowedMethods({
    throw: true
    //    notImplemented: () => new NotFoundError('The resquested uri does not match to any route tables', ErrorCode.URI_NOT_FOUND.CODE),
    //    methodNotAllowed: () => new NotFoundError('The resquested uri does not match to any route tables', ErrorCode.URI_NOT_FOUND.CODE)
  })
);

if (config.db.databaseURI) {
  mongooseClient(config.db.databaseURI)
    .then(dbClient => {
      console.log('Connect!!');
    })
    .catch(err => {
      console.error('Unable to start server!', err);
      process.exit(1);
    });
}

app.listen(config.st.port);
