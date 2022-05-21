/* eslint-disable max-len */
import config from '../config';
import CollisionRepository from '../data-access/collision-repository';
import {Collision} from '../data-access/collision-type';

export const getBoundaryCollisionLog = async (date?: string, time?: string) => {
  const boundaryCollisionLog = await CollisionRepository.instance.getBoundaryCollisionLog();
  return getCollisions(boundaryCollisionLog, date, time);
};

export const getObjectCollisionLog = async (date?: string, time?: string) => {
  const objectCollisionLog = await CollisionRepository.instance.getObjectCollisionLog();
  return getCollisions(objectCollisionLog, date, time);
};

const getCollisions = (collisionLog: any, date?: string, time?: string) => {
  if (date && time) {
    const dateCollisions: Array<Collision> = collisionLog[date];
    const timedCollisions: Array<Collision> = [];

    for (let i = 0; i < dateCollisions.length; i++) {
      const log = dateCollisions[i];
      const it = time.split(':'); // inputted time

      const td = dateCollisions[i].time.split(':'); // db time
      const inputtedSeconds = (+it[0]) * 60 * 60 + (+it[1]) * 60 + (+it[2]);
      const seconds = (+td[0]) * 60 * 60 + (+td[1]) * 60 + (+td[2]);

      if (inputtedSeconds >= seconds &&
        (inputtedSeconds - seconds) <= config.MOWER_SESSION_TIME_INTERVAL_SECONDS) {
        timedCollisions.push(log);
      }

      return timedCollisions;
    }
  } else if (date) {
    return collisionLog[date];
  } else {
    console.log(collisionLog);
    return collisionLog;
  }
};
