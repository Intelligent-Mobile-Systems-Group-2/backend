/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable quotes */
import Router from '@koa/router';
import CollisionRepository from '../data-access/collision-repository';
import {getObjectsWithinImage} from '../business-logic/object-recognition';
import {ErrorMessage} from '../error-types';

const router = new Router();

router.put('/boundary-collision', async (ctx) => {
  const x = ctx.request.body.x;
  const y = ctx.request.body.y;
  if (!(x && y)) {
    ctx.throw(400, {
      error: ErrorMessage.MISSING_X_OR_Y_FIELD,
    });
  }
  try {
    CollisionRepository.instance.logBoundaryCollision(x, y);
    ctx.status = 201;
    ctx.body = {
      x,
      y,
    };
  } catch (error) {
    ctx.throw(500, {
      error: ErrorMessage.LOG_BOUNDARY_COLLISION_FAIL,
    });
  }
});

router.put('/object-collision', async (ctx) => {
  const x = ctx.request.body.x;
  const y = ctx.request.body.y;

  if (!(x && y)) {
    ctx.throw(400, {
      error: ErrorMessage.MISSING_X_OR_Y_FIELD,
    });
  }

  const photo = (ctx.request.files as any).photo;
  if (!photo) {
    ctx.throw(400, {
      error: ErrorMessage.MISSING_PHOTO_FIELD,
    });
  }

  // Receive the objects within the image
  const [objects, error] = await getObjectsWithinImage(photo.path);
  if (objects.length !== 0) {
    const firstObject = objects[0];

    try {
      CollisionRepository.instance.logObjectCollision(x, y, firstObject);
      ctx.status = 201;
      ctx.body = {
        object: firstObject,
      };
    } catch (error) {
      ctx.throw(500, {
        error: ErrorMessage.LOG_OBJECT_COLLISION_FAIL,
      });
    }
  } else if (error) {
    ctx.throw(500, {
      error: ErrorMessage.GOOGLE_VISION_FAILED_TO_REACH,
    });
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
