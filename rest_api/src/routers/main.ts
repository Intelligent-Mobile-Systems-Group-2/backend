import Router from '@koa/router';
import GoogleVision from '@google-cloud/vision';

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


// Currently not working
router.post('/image', async (ctx, next) => {
  const fileInput = ctx.request.body.imageData;

  if (!fileInput) {
    ctx.throw(400, 'image data missing');
  }

  if (fileInput) {
    const imageBase64 = Buffer.from(fileInput, 'base64')

    // Send image to Google Vision API
    ctx.body = await getLabelsFromImage(imageBase64);
  }
});

// Currently not working
const getLabelsFromImage = async (imageBase64: Buffer) => {
  const client = new GoogleVision.ImageAnnotatorClient();
  const [result] = await client.labelDetection(imageBase64);
  const labels = result.labelAnnotations;
  if (labels) {
    console.log(labels);
    const descriptions = labels.map((label) => label.description);

    labels.forEach((label) => console.log(label.description));
    return {
      label: descriptions.join(', '),
      imageBase64: imageBase64,
    };
  }
};

export default router;
