import { load } from '@spksoft/koa-decorator';
import Koa from 'koa';
import path from 'path';
import body from 'koa-bodyparser';
import cors from '@koa/cors';
import config from './config';
import mongooseClient from './libraries/database/client/mongoose';
import serve from 'koa-static'
require('dotenv').config;
const app = new Koa();

app.use(body());
app.use(cors());
const apiRouter = load(path.resolve(__dirname, 'controller'), '.controller.js');
app.use(apiRouter.routes());
app.use(
  apiRouter.allowedMethods({
    throw: true,
  })
);
app.use(serve('uploads'))

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
