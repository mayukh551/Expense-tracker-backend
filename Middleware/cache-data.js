// import redis client
const redis = require('redis');
const asyncWrap = require('./async-wrapper');
const CacheError = require('../Error/CacheError');
const dotenv = require('dotenv').config({ path: '../.env' });
// Redis Cloud Connection based on node environment

const client = redis.createClient();
// if (node_env === 'development') {
//     const client = redis.createClient();
// }

// else {
//     const client = createClient({
//         url: process.env.REDIS_URL
//     });
// }
// console.log(client);


client.on('error', err => console.log('Redis Client Error', err));

client.connect().then(() => console.log('Connected to Redis'));

/**
 * Cache data middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {function} next - Express next function
 */
const cacheData = asyncWrap(async (req, res, next) => {
    // Extract email from request object
    const email = req['user-email'];

    const { month, year } = req.query;

    // cache key format: email:expenses:month:year
    const cacheKey = `${email}:expenses:${month}:${year}`;
    // const cacheKey = `${email}:expenses`;


    try {
        // Attempt to retrieve cached data
        const cachedData = await client.get(cacheKey);

        // If data is cached
        if (cachedData) {
            console.log('using cached data');
            // Return cached data as response
            res.status(200).json(JSON.parse(cachedData));
        }
        else {
            console.log('data not cached');
            req['redis-client'] = client;
            next();
        }

    } catch (err) {
        // Log any errors that occur
        throw new CacheError(500, err.message, null);
    }

})


module.exports = cacheData;