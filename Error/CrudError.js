class CrudError extends Error {
    constructor(errorType) {
        super();
        this.status = 404;
        if (errorType === 'INVALID_ID')
            this.message = 'Product Not found'

        else if (errorType === 'DB_ERROR')
            this.message = 'Faild To save details. Try again later';
    }
}

module.exports = CrudError;