import dotenv from 'dotenv';
dotenv.config();

import Koa from 'koa';
import koaBody from 'koa-body';
import koaCors from '@koa/cors';
import Router from '@koa/router';
import collisionsRouter from './routers/collisions-router';
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
  formidable: {
    keepExtensions: true,
    maxFileSize: 200*1024*1024,
  },
}));
app.use(router.routes());
app.use(collisionsRouter.routes());
const server = app
    .listen(config.PORT, async () => {
      console.log(`Listening on port ${config.PORT}`);
    })
    .on('error', (error) => {
      console.error(error);
    });

export default server;
