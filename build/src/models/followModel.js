"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const exceptions_1 = require("./exceptions");
class FollowModel {
    constructor(fm) {
        this.userId = fm.userId || 0;
        this.vacationId = fm.vacationId || 0;
    }
    // Function to perform validation
    validate() {
        const { error } = FollowModel.validateSchema.validate(this);
        if (error) {
            throw new exceptions_1.ValidationError(error.details[0].message);
        }
    }
}
// Scheme to validate the data using Joi
FollowModel.validateSchema = joi_1.default.object({
    userId: joi_1.default.number().positive().required().messages({
        'number.base': 'userId must be a number',
        'number.positive': 'userId must be a positive number',
        'any.required': 'userId is required'
    }),
    vacationId: joi_1.default.number().positive().required().messages({
        'number.base': 'vacationId must be a number',
        'number.positive': 'vacationId must be a positive number',
        'any.required': 'vacationId is required'
    }),
});
exports.default = FollowModel;
