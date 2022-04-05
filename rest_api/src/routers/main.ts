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

router.post('/image', async(ctx, next) => {
  const imageInput:string = ctx.request.body.imageBase64;
  if (!imageInput) {
    ctx.throw(400, 'image field required');
  }

  // Send image to Google Vision API
  ctx.body = await requestToGoogleAPI(imageInput);

});

async function requestToGoogleAPI(imageBase64:string){
    await resolveAfter2Seconds();
    return {
      label: "It is Dwayne (The Rock) Johnson!",
      imageBase64: imageBase64
    }
}

// Timeout function
function resolveAfter2Seconds() {
  var x = 10;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

export default router;
