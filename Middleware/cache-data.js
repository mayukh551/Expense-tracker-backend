const asyncWrap = require('./async-wrapper');
const CacheError = require('../Error/CacheError');
const User = require('../Models/user.model');

const client = require('../config/redisConfig');

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

    if (!email) throw new CrudError(401, 'Invalid Email', apiEndpoint);

    const user = await User.findOne({ email: email });

    req['userId'] = user._id;

    
    req['redis-client'] = client;

    console.log(req.method);
    
    //* For Requests: POST, PUT, DELETE
    if (['PUT', 'DELETE', 'POST'].includes(req.method)) return next();
    

    //* For Requests: GET
    var cachedData;
    if (req.method === 'GET') {

        // cache key format: email:expenses:month:year
        const cacheKey = `${user._id}:expenses:${month}:${year}`;
        console.log('in cache data middleware',cacheKey);
        
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