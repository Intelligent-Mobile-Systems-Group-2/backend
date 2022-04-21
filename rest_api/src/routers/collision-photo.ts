/* eslint-disable max-len */
/* eslint-disable quotes */
import Router from '@koa/router';
import GoogleVision from '@google-cloud/vision';
import gm from 'gm';
import config from '../config';

const router = new Router();

router.post('/collision-photo', async (ctx) => {
  const photo = (ctx.request.files as any).photo;
  if (!photo) {
    ctx.throw(400, 'Missing photo field');
  }

  // Receive the objects within the image
  const [objects, error] = await getObjectsWithinImage(photo.path);
  if (objects) {
    const object:any = objects[0]
    ctx.body = {
      object,
    };
  } else if (error) {
    ctx.body = {
      error: error.message,
    };
  }
});

/**
 *
 * Scans the inputted image for objects using the Google Vision API
 * https://cloud.google.com/vision/docs/detecting-crop-hints
 * https://cloud.google.com/vision/docs/object-localizer
 *
 * @param {string} imagePath the path to the image to receive labels from
 * @return {[Array]} an array: [objects | null, error | null]
 */
const getObjectsWithinImage = async (imagePath: string): Promise<[any | null, Error | null]> => {
  const client = new GoogleVision.ImageAnnotatorClient({
    credentials: {
      private_key: config.GOOGLE_VISION_PRIVATE_KEY,
      client_email: config.GOOGLE_VISION_EMAIL,
    },
  });

  try {
    /* TODO: crop the image so only dominant object will be identified

    const [result] = await client.cropHints(imagePath);
    const cropHints = result.cropHintsAnnotation;
    const bounds: Array<Array<number>> = [];

    cropHints!.cropHints!.forEach((hintBounds, hintIdx) => {
      console.log(`Crop Hint ${hintIdx}:`);

      hintBounds!.boundingPoly!.vertices!.forEach((bound, boundIdx) => {
        console.log(`Bound ${boundIdx}: (${bound.x}, ${bound.y})`);
        if (bound.x && bound.y) {
          bounds.push([bound.x, bound.y]);
        }
      });
    });

    const width = Math.abs(bounds[0][1]-bounds[1][0]);
    const height = Math.abs(bounds[3][1]-bounds[0][1]);

    gm(imagePath)
        .crop(width, height, bounds[0][1], bounds[1][0])
        .write('image.jpeg', (error, size) => {
          console.log(error);
        });*/

    const [result] = await client.objectLocalization!(imagePath);
    const objectNames = result.localizedObjectAnnotations!.map((object) => object.name);
    return [objectNames, null];
  } catch (error) {
    console.error(error);
    return [null, error as Error];
  }
};

export default router;
