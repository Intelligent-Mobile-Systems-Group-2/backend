/* eslint-disable max-len */

/**
 * This object is used in the responses when errors occur
 */
class MowerApiError {
  /**
   * MowerApiError constructor
   * @param {string} _message The message the error shall return
   * @param {number} _httpCode the http error code it shall return
   */
  constructor(private _message: string, private _httpCode: number) {}

  /**
   * Getter for messsage
   */
  get message() {
    return this._message;
  }

  /**
   * Getter for httpCode
   */
  get httpCode() {
    return this._httpCode;
  }
}

export default {
  LOG_BOUNDARY_COLLISION_FAIL: new MowerApiError('Failed to log the boundary collision', 500),
  LOG_OBJECT_COLLISION_FAIL: new MowerApiError('Failed to log the object collision', 500),
  MISSING_X_OR_Y_FIELD: new MowerApiError('Missing x or y fields', 400),
  MISSING_PHOTO_FIELD: new MowerApiError('Missing photo field', 400),
  GOOGLE_VISION_FAILED_TO_REACH: new MowerApiError('Failed to reach the Google Vision API', 500),
};
