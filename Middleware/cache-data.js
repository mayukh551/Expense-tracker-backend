// import redis client
const path = require('path');
const redis = require('redis');
const asyncWrap = require('./async-wrapper');
const CacheError = require('../Error/CacheError');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') }) || require('dotenv').config({ path: '../.env' });

// Redis Cloud Connection based on node environment
const node_env = process.env.NODE_ENV;
console.log(node_env);
var client;

if (node_env === 'production') {
    console.log('Connection in production');
    client = redis.createClient({ url: process.env.REDIS_URL });
}

else { console.log('in dev'); client = redis.createClient(); }



client.on('error', err => console.log('Redis Client Error', err));

client.connect().then(() => console.log('Connected to Redis in cache-data file'));

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
    req['redis-client'] = client;

    console.log(req.method);

    //* For Requests: POST, PUT, DELETE
    if (['PUT', 'DELETE', 'POST'].includes(req.method)) return next();


    //* For Requests: GET
    var cachedData;
    if (req.method === 'GET') {
        try {
            // Attempt to retrieve cached data
            cachedData = await client.hGet(cacheKey, 'expenses');

            var needsUpdate = await client.hGet(cacheKey, 'updateExpenseCache');
            needsUpdate = JSON.parse(needsUpdate);
            console.log('Cache needs an update', needsUpdate);

            // if cached data has to be updated or cache does not exist
            if (needsUpdate == true || needsUpdate == null) {
                console.log('Going to next middleware to fetch fresh data');
                return next();
            }

            //* If data is cached
            if (cachedData) {
                console.log('using cached data');
                // Return cached data as response
                return res.status(200).json(JSON.parse(cachedData));
            }


        } catch (err) {
            console.log(err);
            next();
        }
    }
})


module.exports = cacheData;