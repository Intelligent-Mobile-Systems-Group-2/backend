/* eslint-disable max-len */
/* eslint-disable quotes */
import Router from '@koa/router';
import GoogleVision from '@google-cloud/vision';
import fs from 'fs';
import config from '../config';

const router = new Router();

router.post('/boundary-collision', async (ctx) => {
  const x = ctx.request.body.x;
  const y = ctx.request.body.y;
  if (!(x && y)) {
    ctx.throw(400, 'Missing x or y fields');
  }
  logCollision(x, y, config.BOUNDARY_COLLISION_DB_PATH);
  ctx.body = {
    x,
    y,
  };
  ctx.status = 200;
});

router.post('/object-collision', async (ctx) => {
  const x = ctx.request.body.x;
  const y = ctx.request.body.y;
  if (!(x && y)) {
    ctx.throw(400, 'Missing x or y fields');
  }

  const photo = (ctx.request.files as any).photo;
  if (!photo) {
    ctx.throw(400, 'Missing photo field');
  }

  // Receive the objects within the image
  const [objects, error] = await getObjectsWithinImage(photo.path);
  if (objects) {
    logCollision(x, y, config.OBJECT_COLLISION_DB_PATH, objects[0]);

    ctx.status = 200;
    ctx.body = {
      object: objects[0],
    };
  } else if (error) {
    ctx.body = {
      error: error.message,
    };
  }
});

router.get('/object-collision', async (ctx) => {
  const date = ctx.request.query.date as any;
  const objectCollisionLog = JSON.parse(fs.readFileSync(config.OBJECT_COLLISION_DB_PATH, {encoding: 'utf-8'}));

  // Return data for all dates if date is unspecified
  if (!date) {
    ctx.body = objectCollisionLog;
  } else if (!objectCollisionLog[date]) {
    ctx.throw(400, 'There are no entries for that date');
  } else {
    ctx.body = objectCollisionLog[date];
  }
});

router.get('/boundary-collision', async (ctx) => {
  const date = ctx.request.query.date as any;
  const objectCollisionLog = JSON.parse(fs.readFileSync(config.BOUNDARY_COLLISION_DB_PATH, {encoding: 'utf-8'}));

  // Return data for all dates if date is unspecified
  if (!date) {
    ctx.body = objectCollisionLog;
  } else if (!objectCollisionLog[date]) {
    ctx.throw(400, 'There are no entries for that date');
  } else {
    ctx.body = objectCollisionLog[date];
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

/**
 *
 * Logs collision data to the specified document database json file
 *
 * @param {number} x x coordinate of the collision
 * @param {number} y y coordinate of the collision
 * @param {string} dbFilePath the path to the doc database
 * @param {string} object optional name of the object collided with
 * @return {undefined} returns undefined
 */
const logCollision = async (x: number, y: number, dbFilePath: string, object?: string) => {
  const datetime = new Date().toLocaleString('en-US');
  const date = datetime.slice(0, 9);
  const time = datetime.slice(11, datetime.length);
  const positionData = {
    'time': time,
    x,
    y,
    ...(object && {object}),
  };

  const coolisionCoordinates = JSON.parse(fs.readFileSync(dbFilePath, {encoding: 'utf-8'}));
  if (!coolisionCoordinates[date as any]) {
    coolisionCoordinates[date as any] = [];
  }

  coolisionCoordinates[date as any].push(positionData);

  fs.writeFile(dbFilePath, JSON.stringify(coolisionCoordinates, null, 2), (err) => {
    if (err) throw err;
    console.log(`[${date}-${time}] Logged collision on ${x}, ${y}`);
  });
};

export default router;
