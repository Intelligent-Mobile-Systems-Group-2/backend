import Koa from 'koa';
import koaBody from 'koa-body';
import koaCors from '@koa/cors';
import Router from '@koa/router';
import mainRouter from './routers/main';
import config from './config';

const app = new Koa();
const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.body = 'main backend endpoint';
});

app.use(koaCors({
  origin: '*',
}));
app.use(koaBody());
app.use(router.routes());
app.use(mainRouter.routes());
const server = app
    .listen(config.port, async () => {
      console.log(`Listening on port ${config.port}`);
    })
    .on('error', (error) => {
      console.error(error);
    });

export default server;
