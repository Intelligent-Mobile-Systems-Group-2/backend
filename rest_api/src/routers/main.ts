import Router from '@koa/router';

const router = new Router();

router.post('/user', async (ctx, next) => {
  const nameInput:string = ctx.request.body.name;
  if (!nameInput) {
    ctx.throw(400, 'name field required');
  }

  ctx.status = 200;
  ctx.body = `{
    name: ${nameInput.toLowerCase()}
  }`;
});

export default router;
