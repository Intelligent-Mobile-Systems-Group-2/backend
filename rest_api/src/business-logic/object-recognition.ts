import GoogleVision from '@google-cloud/vision';
import Jimp from 'jimp';
import config from '../config';

/* eslint-disable max-len */
/**
 *
 * Scans the inputted image for objects using the Google Vision API
 * https://cloud.google.com/vision/docs/detecting-crop-hints
 * https://cloud.google.com/vision/docs/object-localizer
 *
 * @param {string} imagePath the path to the image to receive labels from
 * @return {[Array]} an array: [objects | null, error | null]
 */
export const getObjectsWithinImage = async (imagePath: string): Promise<[any | null, Error | null]> => {
  const client = new GoogleVision.ImageAnnotatorClient({
    credentials: {
      private_key: config.GOOGLE_VISION_PRIVATE_KEY,
      client_email: config.GOOGLE_VISION_EMAIL,
    },
  });

  try {
    // crop the image so only dominant object will be identified
    const [cropResult] = await client.cropHints(imagePath);
    const cropHints = cropResult.cropHintsAnnotation;
    const bounds: Array<Array<number>> = [];

    // Get the bounding vertices of the crop hints
    for (const hintBounds of cropHints!.cropHints!) {
      for (const bound of hintBounds!.boundingPoly!.vertices!) {
        bounds.push([bound.x!, bound.y!]);
      }
    }

    const width = Math.abs(bounds[0][1]-bounds[1][0]);
    const height = Math.abs(bounds[3][1]-bounds[0][1]);

    const datetime = new Date().toLocaleString('sv-SE');
    const date = datetime.slice(0, 10);
    const time = datetime.slice(11, datetime.length);

    const x = bounds[0][0];
    const y = bounds[0][1];

    const image = await Jimp.read(imagePath);
    image.crop(x, y, width, height);
    image.quality(60);

    const [result] = await client.objectLocalization!(imagePath);
    const objectNames = result.localizedObjectAnnotations!.map((object) => object.name);
    image.write(`./collision-photos/${date}-${time}-${objectNames[0]}.jpg`);
    return [objectNames, null];
  } catch (error) {
    return [null, error as Error];
  }
};
