"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const exceptions_1 = require("./exceptions");
class UserModel {
    constructor(user) {
        var _a;
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.password = user.password;
        this.email = user.email;
        this.role = (_a = user.role) !== null && _a !== void 0 ? _a : 'User';
        this.token = user.token;
    }
    validate() {
        const { error } = UserModel.validateSchema.validate(this);
        if (error) {
            throw new exceptions_1.ValidationError(error.details[0].message);
        }
    }
}
UserModel.validateSchema = joi_1.default.object({
    id: joi_1.default.number().optional().positive(),
    firstName: joi_1.default.string().required().min(2).max(50),
    lastName: joi_1.default.string().required().min(2).max(50),
    password: joi_1.default.string().required().optional().min(4).max(255),
    email: joi_1.default.string().required().email(),
    role: joi_1.default.string().valid('User', 'Admin').optional(),
    token: joi_1.default.string().optional(),
});
exports.default = UserModel;
