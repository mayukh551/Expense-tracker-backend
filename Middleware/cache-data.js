// import redis client
const { client } = require('../app');
const asyncWrap = require('./async-wrapper');

/**
 * Cache data middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {function} next - Express next function
 */
const cacheData = asyncWrap(async (req, res, next) => {
    // Extract email from request object
    const email = req['user-email'];

    try {
        // Attempt to retrieve cached data
        const cachedData = client.get(email);

        // If data is cached
        if (cachedData) {
            console.log('using cached data');
            // Return cached data as response
            res.status(200).json(cachedData);
        }

    } catch (err) {
        // Log any errors that occur
        console.log(err);
    }

})


module.exports = cacheData;