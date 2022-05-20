/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable quotes */
import Router from '@koa/router';
import CollisionRepository from '../data-access/collision-repository';
import {getObjectsWithinImage} from '../business-logic/object-recognition';
import MowerApiError from '../mower-api-error';
import {Collision} from '../data-access/collision-type';
import config from '../config';
import {getBoundaryCollisionLog, getObjectCollisionLog} from '../business-logic/collisions';

const router = new Router();

router.put('/boundary-collision', async (ctx) => {
  const x = ctx.request.body.x;
  const y = ctx.request.body.y;

  if (!(x && y) || isNaN(parseInt(x)) || isNaN(parseInt(y))) {
    ctx.throw(
        MowerApiError.MISSING_X_OR_Y_FIELD.httpCode,
        MowerApiError.MISSING_X_OR_Y_FIELD.message,
        {expose: true});
    return;
  }
  try {
    CollisionRepository.instance.logBoundaryCollision(x, y);
    ctx.status = 201;
    ctx.body = {
      x,
      y,
    };
  } catch (error) {
    ctx.throw(
        MowerApiError.LOG_BOUNDARY_COLLISION_FAIL.httpCode,
        MowerApiError.LOG_BOUNDARY_COLLISION_FAIL.message,
        {expose: true});
  }
});

router.put('/object-collision', async (ctx) => {
  const x = ctx.request.body.x;
  const y = ctx.request.body.y;
  const objectCollisionLog = await CollisionRepository.instance.getObjectCollisionLog();
  const date = (new Date().toLocaleString('sv-SE')).slice(0, 10);

  if (!(x && y) || isNaN(parseInt(x)) || isNaN(parseInt(y))) {
    ctx.throw(
        MowerApiError.MISSING_X_OR_Y_FIELD.httpCode,
        MowerApiError.MISSING_X_OR_Y_FIELD.message,
        {expose: true});
    return;
  }

  for (let i = 0; i < objectCollisionLog[date].length; i++) {
    if (objectCollisionLog[date][i].x == x && objectCollisionLog[date][i].y == y) {
      console.log('DUPLICATE OBJECT FOUND, ABORTING OPERATION');
      return;
    }
  }

  const photo = (ctx.request.files as any).photo;
  if (!photo) {
    ctx.throw(
        MowerApiError.MISSING_PHOTO_FIELD.httpCode,
        MowerApiError.MISSING_PHOTO_FIELD.message,
        {expose: true});
    return;
  }

  // Receive the objects within the image
  const [objects, error] = await getObjectsWithinImage(photo.path);
  if (objects && objects.length !== 0) {
    const firstObject = objects[0];

    try {
      CollisionRepository.instance.logObjectCollision(x, y, firstObject);
      ctx.status = 201;
      ctx.body = {
        object: firstObject,
      };
    } catch (error) {
      ctx.throw(
          MowerApiError.LOG_OBJECT_COLLISION_FAIL.message,
          MowerApiError.LOG_OBJECT_COLLISION_FAIL.httpCode,
          {expose: true});
    }
  } else if (error) {
    ctx.throw(
        MowerApiError.GOOGLE_VISION_FAILED_TO_REACH.message,
        MowerApiError.GOOGLE_VISION_FAILED_TO_REACH.httpCode,
        {expose: true});
  }
});

router.get('/object-collision', async (ctx) => {
  const inputtedDate = ctx.request.query.date as string;
  const inputtedTime = ctx.request.query.time as string;
  ctx.body = await getBoundaryCollisionLog(inputtedDate, inputtedTime);
  ctx.status = 200;
});

router.get('/boundary-collision', async (ctx) => {
  const inputtedDate = ctx.request.query.date as string;
  const inputtedTime = ctx.request.query.time as string;
  ctx.body = await getObjectCollisionLog(inputtedDate, inputtedTime);
  ctx.status = 200;
});

export default router;
