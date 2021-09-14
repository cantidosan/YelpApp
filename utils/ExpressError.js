// develops a custom Error class built from stndrd Error nfc
class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

///makes the class importable throughout the project
module.exports = ExpressError;