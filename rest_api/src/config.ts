/* eslint-disable max-len */
import path from 'path';
import fs from 'fs';

// Parsing Google Private Key environment variable
const googleKeyString = process.env.GOOGLE_VISION_PRIVATE_KEY ?? '{"privateKey": ""}';
const {privateKey} = JSON.parse(googleKeyString);

const config = {
  PORT: process.env.PORT || '8080',
  GOOGLE_VISION_EMAIL: process.env.GOOGLE_VISION_EMAIL,
  GOOGLE_VISION_PRIVATE_KEY: privateKey,
  DOCUMENT_DB_PATH: 'db',
  OBJECT_COLLISION_DB_PATH: path.join('db', 'object-collision.json'),
  BOUNDARY_COLLISION_DB_PATH: path.join('db', 'boundary-collision.json'),
  MOWER_SESSION_TIME_INTERVAL_SECONDS: 300,
};

export default config;
