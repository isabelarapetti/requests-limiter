"use strict";

/**
 * Module dependencies.
 * @private
 */
const redis_client = require("redis").createClient();

/**
 * Limit request to `maxRequestCount` per `windowDuration` in seconds by `lookupKey`
 * and optional prefix
 * tracking in it in memory with `redis_client`
 *
 * @param {Number} windowDuration
 * @param {Number} maxRequestCount
 * @param {String} prefix
 * @param {String} lookupKey
 * @return {Object}
 * @public
 */
module.exports = (
  windowDuration,
  maxRequestCount,
  lookupKey,
  prefix = null
) => {
  return async (err, req, res, next) => {
    try {
      //Checks if the Redis client is present
      if (!redis_client) {
        console.log("Redis client not found");
        process.exit(1);
      }
      const key = prefix ? `${prefix}${lookupKey}` : `${lookupKey}`;
      const count = await redis_client.incr(key);

      if (count === 1) {
        redis_client.expire(key, windowDuration);
      }

      if (count > maxRequestCount) {
        return res
          .status(429)
          .send(
            `Max request rate exceeded: ${maxRequestCount} requests in ${windowDuration} seconds`
          );
      }
    } catch (error) {
      next(error);
    }
  };
};

// const slidingWindowCountLimiter = (
//   windowDuration,
//   maxRequestCount,
//   lookupKey
// ) => {
//   return (limiter = (err, req, res, next) => {
//     try {
//       //Checks if the Redis client is present
//       if (!redis_client) {
//         console.log("Redis client does not exist!");
//         process.exit(1);
//       } else next();
//       // Not implemented!
//     } catch (error) {
//       next(error);
//     }
//   });
// };
