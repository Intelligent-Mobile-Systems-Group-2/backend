/* eslint-disable max-len */

// Parsing Google Private Key env variable
const googleKeyString = process.env.GOOGLE_VISION_PRIVATE_KEY ?? '{"privateKey": ""}';
const {privateKey} = JSON.parse(googleKeyString);

const config = {
  PORT: process.env.PORT || '8080',
  GOOGLE_VISION_EMAIL: process.env.GOOGLE_VISION_EMAIL,
  GOOGLE_VISION_PRIVATE_KEY: privateKey,
};

export default config;
