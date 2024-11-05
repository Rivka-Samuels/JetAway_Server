"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.login = login;
const dal_1 = __importDefault(require("../db/dal"));
const exceptions_1 = require("../models/exceptions");
const userModel_1 = __importDefault(require("../models/userModel"));
const authUtils_1 = require("../utils/authUtils");
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validation
        user.validate();
        // Check if the email already exists in the database
        let checkEmailQuery = `SELECT * FROM users WHERE email = ?;`;
        const existingUser = yield (0, dal_1.default)(checkEmailQuery, [user.email]);
        if (existingUser.length > 0) {
            throw new exceptions_1.UnauthorizedError("Email already exists");
        }
        // Encrypt the password
        const hashedPassword = yield (0, authUtils_1.encryptPassword)(user.password);
        // Query to insert the new user
        let q = `INSERT INTO users (firstName, lastName, password, email, role) VALUES (?, ?, ?, ?, ?);`;
        let params = [user.firstName, user.lastName, hashedPassword, user.email, user.role];
        const insertedInfo = (yield (0, dal_1.default)(q, params));
        const userId = insertedInfo.insertId;
        // Add the ID to the user object
        user.id = userId; // Assumption that ID doesn't yet exist on the object
        // Create a token and update the user record
        user.token = (0, authUtils_1.createToken)(user);
        q = `UPDATE users SET token=? WHERE id=?;`;
        params = [user.token, userId];
        yield (0, dal_1.default)(q, params);
        return user.token;
    });
}
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Look up the user by email
        let q = `SELECT * FROM users WHERE email=?;`;
        const res = yield (0, dal_1.default)(q, [email]);
        // Check if the user exists
        if (res.length === 0) {
            throw new exceptions_1.UnauthorizedError("User not found. Please register."); // Message if the user is not found
        }
        // Check if the password is correct
        if (!(yield (0, authUtils_1.validatePassword)(password, res[0].password))) {
            throw new exceptions_1.UnauthorizedError("Incorrect password. Please try again."); // Message if the password is incorrect
        }
        // Create a user object and add a token if not already present
        const user = new userModel_1.default(res[0]);
        if (!user.token) {
            user.token = (0, authUtils_1.createToken)(user);
            q = `UPDATE users SET token=? WHERE id=?;`;
            yield (0, dal_1.default)(q, [user.token, user.id]);
        }
        return user.token;
    });
}
