const UserError = require('../Error/UserError');
const User = require('../Models/user.model.js')

const client = require('../config/redisConfig');

/**
 * @function getAccount
 * @param {Object} req The Request Object
 * @param {Object} res The Response Object
 * @param {Function} next The Next Function
 */

const createAccount = async (req, res, next) => {

    const apiEndpoint = req.originalUrl;

    const { id } = req.params;

    const data = req.body;

    // const category = req.body.category.split(', ');

    try {
        const account = await User.findByIdAndUpdate(id, data, { new: true }).select('name email phone budget age salary category profile_img');

        res.status(201).json({ data: account, message: "Account Created Successfully" });

    } catch (error) {
        next(error);
    }
}


//***************************************************************************************************

/**
 * @function getAccount
 * @param {Object} req The Request Object
 * @param {Object} res The Response Object
 * @param {Function} next The Next Function
 */
const getAccount = async (req, res, next) => {

    const apiEndpoint = req.originalUrl;

    const { id } = req.params;

    try {
        const account = await User
            .findById(id)
            .select('email phone budget age salary name profile_img category')

        if (!account)
            throw new UserError(401, "User not found", apiEndpoint);

        console.log(account);

        res.status(200).json({ data: account });

    } catch (error) {
        next(error);
    }
}


//***************************************************************************************************


/**
 * @function updateAccount
 * @param {Object} req The Request Object
 * @param {Object} res The Response Object
 * @param {Function} next The Next Function
 */
const updateAccount = async (req, res, next) => {

    try {

        const apiEndpoint = req.originalUrl;

        const { id } = req.params;

        const newData = req.body;

        console.log(newData);

        // console.log(budget, age, salary, phone);
        // check if object is empty or not
        if (Object.keys(newData).length === 0) {
            throw new UserError(400, 'Missing required fields', apiEndpoint);
        }


        const account = await User
            .findByIdAndUpdate(id, newData, { new: true })
            .select('-expenses -password -__v');

        if (!account)
            throw new UserError(401, "User not found", apiEndpoint);

        res.status(200).json({ data: account, message: "Account Updated Successfully" });

    } catch (error) {
        next(error);
    }
}


//***************************************************************************************************

/**
 * @function deleteAccount
 * @param {Object} req The Request Object
 * @param {Object} res The Response Object
 * @param {Function} next The Next Function
 */
const deleteAccount = async (req, res, next) => {

    const apiEndpoint = req.originalUrl;

    const { id } = req.params;

    try {

        const account = await User.findByIdAndDelete(id);

        if (!account)
            throw new UserError(401, "User not found", apiEndpoint);

        await delCache();

        res.status(200).json({ message: "Account Deleted Successfully" });

    } catch (error) {
        next(error);
    }
}


async function delCache() {
    return new Promise((resolve, reject) => {
        // Find keys that match the pattern "*expenses*"
        client.keys('*expenses*', (err, keys) => {
            if (err) throw err;

            // Delete the matching keys
            if (keys.length > 0) {
                client.del(keys, (err, reply) => {
                    if (err) throw err;
                    console.log(`Deleted ${reply} keys`);
                });

                resolve();
            } else {
                reject('No matching keys found');
            }
        });
    })
}

module.exports = {
    createAccount,
    getAccount,
    updateAccount,
    deleteAccount
}