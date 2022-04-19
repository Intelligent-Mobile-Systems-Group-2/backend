import dotenv from 'dotenv';
dotenv.config();

import Koa from 'koa';
import koaBody from 'koa-body';
import koaCors from '@koa/cors';
import Router from '@koa/router';
import collisionPhotoRouter from './routers/collision-photo';
import config from './config';

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = 'main backend endpoint';
});

app.use(koaCors({
  origin: '*',
}));
app.use(koaBody({
  multipart: true,
  encoding: 'gzip',
  formidable: {
    keepExtensions: true,
    maxFileSize: 200*1024*1024,
  },
}));
app.use(router.routes());
app.use(collisionPhotoRouter.routes());
const server = app
    .listen(config.PORT, async () => {
      console.log(`Listening on port ${config.PORT}`);
    })
    .on('error', (error) => {
      console.error(error);
    });

export default server;
