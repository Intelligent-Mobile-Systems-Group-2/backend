/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable quotes */
import Router from '@koa/router';
import CollisionRepository from '../data-access/collision-repository';
import {getObjectsWithinImage} from '../business-logic/object-recognition';
import MowerApiError from '../mower-api-error';

const router = new Router();

router.put('/boundary-collision', async (ctx) => {
  const x = ctx.request.body.x;
  const y = ctx.request.body.y;
  if (!(x && y)) {
    ctx.throw(
        MowerApiError.MISSING_X_OR_Y_FIELD.httpCode,
        MowerApiError.MISSING_X_OR_Y_FIELD.message,
        {expose: true});
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

  if (!(x && y)) {
    ctx.throw(
        MowerApiError.MISSING_X_OR_Y_FIELD.httpCode,
        MowerApiError.MISSING_X_OR_Y_FIELD.message,
        {expose: true});
  }

  const photo = (ctx.request.files as any).photo;
  if (!photo) {
    ctx.throw(
        MowerApiError.MISSING_PHOTO_FIELD.httpCode,
        MowerApiError.MISSING_PHOTO_FIELD.message,
        {expose: true});
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
  const date = ctx.request.query.date as any;
  const objectCollisionLog = await CollisionRepository.instance.getObjectCollisionLog();

  // Return data for all dates if date is unspecified
  if (!date) {
    ctx.body = objectCollisionLog;
  } else {
    ctx.body = objectCollisionLog[date];
  }
  ctx.status = 200;
});

router.get('/boundary-collision', async (ctx) => {
  const date = ctx.request.query.date as any;
  const boundaryCollisionLog = await CollisionRepository.instance.getBoundaryCollisionLog();

  // Return data for all dates if date is unspecified
  if (!date) {
    ctx.body = boundaryCollisionLog;
  } else {
    ctx.body = boundaryCollisionLog[date];
  }
  ctx.status = 200;
});

export default router;
