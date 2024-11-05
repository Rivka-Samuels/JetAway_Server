"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../models/exceptions");
const statusEnum_1 = require("../models/statusEnum");
const helpers_1 = require("../utils/helpers");
function catchAll(err, req, res, next) {
    // TODO: add to msg more info, as date-time and ip etc...
    (0, helpers_1.writeErrorLog)(err.message);
    if (err instanceof exceptions_1.AppExcption) {
        res.status(err.status).send(err.message);
        return;
    }
    res.status(statusEnum_1.StatusCode.ServerError).send("Internal Server Error");
}
exports.default = catchAll;
