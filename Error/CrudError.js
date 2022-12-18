class CrudError extends Error {
    constructor(errorName) {
        super();
        if (errorName === 'INVALID_ID') this.setErrorDetails('ProductIdError', 404, 'Product Not found')
        else this.setErrorDetails();
    }

    setErrorDetails(name = "ServerError", status = 500, message = 'Server Error') {
        this.name = name;
        this.status = status;
        this.message = message;
        if (status == 404)
            this.details = "The product User has requested for, has an Invaild Id due to which the product with that particular ID could not be found"
        else
            this.details = "An internal error occurred while saving or loading the details"
    }
}

module.exports = CrudError;