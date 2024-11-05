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
exports.addFollow = addFollow;
exports.deleteFollow = deleteFollow;
exports.getFollowers = getFollowers;
exports.getVacationFollowedByUser = getVacationFollowedByUser;
const vacationModel_1 = __importDefault(require("../models/vacationModel"));
const followModel_1 = __importDefault(require("../models/followModel"));
const exceptions_1 = require("../models/exceptions");
const dal_1 = __importDefault(require("../db/dal"));
// **Adding a follower between a user and a vacation**
function addFollow(userId, vacationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (userId <= 0 || vacationId <= 0) {
                throw new exceptions_1.ValidationError("Invalid user ID or vacation ID");
            }
            const existingFollow = yield checkIfFollowExists(userId, vacationId);
            if (existingFollow) {
                console.warn(`Follow already exists: userId=${userId}, vacationId=${vacationId}`);
                return;
            }
            const follow = new followModel_1.default({ userId, vacationId });
            follow.validate();
            const q = `INSERT INTO follows (userId, vacationId) VALUES (?, ?);`;
            yield (0, dal_1.default)(q, [userId, vacationId]);
        }
        catch (error) {
            console.error('Error adding follow:', error.message || error);
            throw error;
        }
    });
}
function deleteFollow(userId, vacationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (userId <= 0 || vacationId <= 0) {
                throw new exceptions_1.ValidationError("Invalid user ID or vacation ID");
            }
            const follow = new followModel_1.default({ userId, vacationId });
            follow.validate();
            const q = `DELETE FROM follows WHERE userId = ? AND vacationId = ?;`;
            yield (0, dal_1.default)(q, [userId, vacationId]);
        }
        catch (error) {
            console.error('Error deleting follow:', error.message || error);
            throw error;
        }
    });
}
function getFollowers(vacationId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (vacationId <= 0) {
            throw new exceptions_1.ValidationError("Invalid vacation ID");
        }
        const q = `SELECT userId FROM follows WHERE vacationId = ?;`;
        const res = yield (0, dal_1.default)(q, [vacationId]);
        return res.map((row) => row.userId);
    });
}
function getVacationFollowedByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (userId <= 0) {
            throw new exceptions_1.ValidationError("Invalid user ID");
        }
        const q = `SELECT v.* FROM vacations v 
               JOIN follows f ON v.id = f.vacationId 
               WHERE f.userId = ?;`;
        const res = yield (0, dal_1.default)(q, [userId]);
        return res.map((row) => new vacationModel_1.default(row));
    });
}
function checkIfFollowExists(userId, vacationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkQuery = `SELECT 1 FROM follows WHERE userId = ? AND vacationId = ? LIMIT 1;`;
            const result = yield (0, dal_1.default)(checkQuery, [userId, vacationId]);
            return result.length > 0;
        }
        catch (error) {
            console.error('Error checking if follow exists:', error.message || error);
            throw error;
        }
    });
}
