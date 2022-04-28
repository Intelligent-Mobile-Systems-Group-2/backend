/* eslint-disable max-len */
import path from 'path';
import fs from 'fs';

// Parsing Google Private Key env variable
const googleKeyString = process.env.GOOGLE_VISION_PRIVATE_KEY ?? '{"privateKey": ""}';
const {privateKey} = JSON.parse(googleKeyString);

const config = {
  PORT: process.env.PORT || '8080',
  GOOGLE_VISION_EMAIL: process.env.GOOGLE_VISION_EMAIL,
  GOOGLE_VISION_PRIVATE_KEY: privateKey,
  DOCUMENT_DB_PATH: 'db',
  OBJECT_COLLISION_DB_PATH: path.join('db', 'object-collision.json'),
  BOUNDARY_COLLISION_DB_PATH: path.join('db', 'boundary-collision.json'),
};

// Create database files
if (!fs.existsSync(config.DOCUMENT_DB_PATH)) fs.mkdirSync(config.DOCUMENT_DB_PATH);
if (!fs.existsSync(config.OBJECT_COLLISION_DB_PATH)) fs.writeFileSync(config.OBJECT_COLLISION_DB_PATH, '{}');
if (!fs.existsSync(config.BOUNDARY_COLLISION_DB_PATH)) fs.writeFileSync(config.BOUNDARY_COLLISION_DB_PATH, '{}');

export default config;
