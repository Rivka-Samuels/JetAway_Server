"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.UnknownError = exports.NotFoundError = exports.ValidationError = exports.AppExcption = void 0;
const statusEnum_1 = require("./statusEnum");
class AppExcption {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}
exports.AppExcption = AppExcption;
class ValidationError extends AppExcption {
    constructor(message) {
        super(message, statusEnum_1.StatusCode.BadRequest);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppExcption {
    constructor(message) {
        super(message, statusEnum_1.StatusCode.NotFound);
    }
}
exports.NotFoundError = NotFoundError;
class UnknownError extends AppExcption {
    constructor(message = "Unknown Error!", status = statusEnum_1.StatusCode.ServerError) {
        super(message, status);
    }
}
exports.UnknownError = UnknownError;
class UnauthorizedError extends AppExcption {
    constructor(message) {
        super(message, statusEnum_1.StatusCode.Unauthorized);
    }
}
exports.UnauthorizedError = UnauthorizedError;
