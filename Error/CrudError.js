class CrudError extends Error {
    constructor(errorCode, message = "") {
        super(message);
        this.name = this.constructor.name;

        switch (errorCode) {
            case "DB_ERROR":
                this.statusCode = 500;
                this.message = message || "An error occurred while accessing the database";
                break;
            case "INVALID_ID":
                this.statusCode = 404;
                this.message = message || "Expense cannot be found or indentified";
                break;
            case "VALIDATION_ERROR":
                this.statusCode = 404;
                this.message = message || "Information about Expense is missing";
                break;
            default:
                this.statusCode = 500;
                this.message = "Server Error";
        }
    }



}


module.exports = CrudError;