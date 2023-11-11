const curDate = () => {
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
        month: monthList[(new Date()).getMonth()],
        year: (new Date()).getFullYear()
    }
};

const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthNo = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
}


/**
 * @function cacheExpenses
 * @param {Object} client Redis Client
 * @param {string} userId User ID
 * @param {string} month month name
 * @param {Number} year yaer number
 * @param {[Object]} expenses List of expense Docs
 * @returns {void}
 */
async function cacheExpenses(client, userId, month, year, expenses) {

    var shouldCache = false;

    const curTime = curDate();

    if (month == curTime.month && year == curTime.year) shouldCache = true;

    const reqCounterKey = `${userId}:expenses:counter:${month}:${year}`;
    const totalCounterSizeKey = `${userId}:expenses:counter:size`;

    let getReqCount = await client.get(reqCounterKey);

    if (!getReqCount) {

        let counterKeySize = await client.get(totalCounterSizeKey);

        
        // if counterKey size does not exist, update to 1
        if(!counterKeySize) await client.set(totalCounterSizeKey, 1);
        
        // if exists,
        else{

            //TODO: implement LRU cache
            
            // -> if size < 4, increment size
            // if(counterKeySize < 4) await client.incr(counterKeySize);
            
            // -> if size === 4, remove least used cached expense and add the new expense info


        }

        counterKeySize ?
            (counterKeySize < 4 ? await client.incr(counterKeySize) :
                await client.set(counterKeySize, 0))
            : await client.set(totalCounterSizeKey, 1);

        await client.set(reqCounterKey, 1);
        client.expire(reqCounterKey, 1200);

    } else
        getReqCount = await client.incr(reqCounterKey); // increment request count


    if (getReqCount >= 2 || shouldCache) {

        const cacheKey = `${userId}:expenses:${month}:${year}`;
        console.log("Hum toh idhhar hi hain", cacheKey);

        await client.hSet(cacheKey, 'expenses', JSON.stringify(expenses));
        await client.hSet(cacheKey, 'updateExpenseCache', 'false');
        await client.expire(cacheKey, 1800);

        console.log(await client.hGet(cacheKey, 'updateExpenseCache'));
    }
}




module.exports = {
    cacheExpenses,
    monthList,
    monthNo,
    curDate
}