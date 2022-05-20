/* eslint-disable max-len */
/* eslint-disable curly */
import fs from 'fs';
import config from '../config';
import {Collision} from './collision-type';

/**
 * Singleton for making operations on the collision databases
 */
export default class CollisionRepository {
  private static _instance: CollisionRepository | null = null;

  /**
   *
   */
  constructor() {
    // Create document database directory and files
    if (!fs.existsSync(config.DOCUMENT_DB_PATH))
      fs.mkdirSync(config.DOCUMENT_DB_PATH);
    if (!fs.existsSync(config.OBJECT_COLLISION_DB_PATH))
      fs.writeFileSync(config.OBJECT_COLLISION_DB_PATH, '{}');
    if (!fs.existsSync(config.BOUNDARY_COLLISION_DB_PATH))
      fs.writeFileSync(config.BOUNDARY_COLLISION_DB_PATH, '{}');
  }

  /**
   * Getter for the current database instance
   */
  static get instance() {
    if (this._instance == null) {
      this._instance = new CollisionRepository();
    }
    return this._instance;
  }

  /**
   *
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   * @param {string} objectLabel label of the object collided with
   */
  public async logObjectCollision(x: number, y: number, objectLabel: string) {
    return CollisionRepository.logCollision(x, y, config.OBJECT_COLLISION_DB_PATH, objectLabel);
  }

  /**
   *
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   */
  public async logBoundaryCollision(x: number, y: number) {
    return CollisionRepository.logCollision(x, y, config.BOUNDARY_COLLISION_DB_PATH);
  }


  /**
   * @return {Promise<any>} The boundary collision log in JSON format
   */
  public async getBoundaryCollisionLog() {
    return CollisionRepository.getCollisionLog(config.BOUNDARY_COLLISION_DB_PATH);
  }

  /**
   * @return {Promise<any>} The object collision log in JSON format
   */
  public async getObjectCollisionLog() {
    return CollisionRepository.getCollisionLog(config.OBJECT_COLLISION_DB_PATH);
  }

  /**
   *
   * Logs collision data to the specified path todocument database json file
   *
   * @param {number} x x coordinate of the collision
   * @param {number} y y coordinate of the collision
   * @param {string} dbFilePath the path to the doc database
   * @param {string} objectLabel optional name of the object collided with
   * @return {undefined} returns undefined
   */
  private static async logCollision(x: number, y: number, dbFilePath: string, objectLabel?: string): Promise<boolean> {
    const datetime = new Date().toLocaleString('sv-SE');
    const date = datetime.slice(0, 10);
    const time = datetime.slice(11, datetime.length);
    const collisionData: Collision = {
      'time': time,
      x,
      y,
      ...(objectLabel && {objectLabel}),
    };

    const promise: Promise<boolean> = new Promise(async (resolve, reject) => {
      try {
        const collisionDb = await this.getCollisionLog(dbFilePath);
        if (!collisionDb[date as any]) {
          collisionDb[date as any] = [];
        }

        collisionDb[date as any].push(collisionData);

        fs.writeFile(dbFilePath, JSON.stringify(collisionDb, null, 2), (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        });
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  };

  /**
   * Returns the JSON data of the specified database file
   * @param {string} dbFilePath the path to the doc database
   */
  private static async getCollisionLog(dbFilePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(dbFilePath, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        }

        const collisionData = JSON.parse(data);
        resolve(collisionData as any);
      });
    });
  }
}


