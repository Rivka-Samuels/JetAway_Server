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
exports.vacationFollowRouter = void 0;
const express_1 = __importDefault(require("express"));
const appConfig_1 = require("../utils/appConfig");
const statusEnum_1 = require("../models/statusEnum");
const vacationFollowService_1 = require("../services/vacationFollowService");
exports.vacationFollowRouter = express_1.default.Router();
// **Controller for receiving followers by vacation ID**
exports.vacationFollowRouter.get(appConfig_1.appConfig.routePrefix + "/vacation-follows/:vacationId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacationId = +req.params.vacationId;
        if (isNaN(vacationId) || vacationId <= 0) {
            console.warn(`Invalid vacation ID: ${vacationId}`);
            return res.status(statusEnum_1.StatusCode.BadRequest).json({ message: "Invalid vacation ID" });
        }
        const followers = yield (0, vacationFollowService_1.getFollowers)(vacationId);
        res.status(statusEnum_1.StatusCode.Ok).json(followers);
    }
    catch (error) {
        console.error('Error in GET /vacation-follows/:vacationId:', error);
        next(error);
    }
}));
// **Controller for receiving vacations tracked by user by user ID**
exports.vacationFollowRouter.get(appConfig_1.appConfig.routePrefix + "/user-follows/:userId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = +req.params.userId;
        if (isNaN(userId) || userId <= 0) {
            console.warn(`Invalid user ID: ${userId}`);
            return res.status(statusEnum_1.StatusCode.BadRequest).json({ message: "Invalid user ID" });
        }
        // console.log(`Request received to get vacations followed by userId=${userId}`);
        const vacations = yield (0, vacationFollowService_1.getVacationFollowedByUser)(userId);
        res.status(statusEnum_1.StatusCode.Ok).json(vacations);
    }
    catch (error) {
        console.error('Error in GET /user-follows/:userId:', error);
        next(error);
    }
}));
// **Controller for adding a follower between a user and a vacation**
exports.vacationFollowRouter.post(appConfig_1.appConfig.routePrefix + "/follow/:userId/:vacationId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = +req.params.userId;
        const vacationId = +req.params.vacationId;
        if (isNaN(userId) || userId <= 0 || isNaN(vacationId) || vacationId <= 0) {
            console.warn(`Invalid user ID or vacation ID: userId=${userId}, vacationId=${vacationId}`);
            return res.status(statusEnum_1.StatusCode.BadRequest).json({ message: "Invalid user ID or vacation ID" });
        }
        // console.log(`Request received to add follow: userId=${userId}, vacationId=${vacationId}`);
        yield (0, vacationFollowService_1.addFollow)(userId, vacationId);
        res.status(statusEnum_1.StatusCode.Created).send("Follow added successfully");
    }
    catch (error) {
        console.error('Error in POST /follow/:userId/:vacationId:', error);
        next(error);
    }
}));
// **Controller for deleting a follower between a user and a vacation**
exports.vacationFollowRouter.delete(appConfig_1.appConfig.routePrefix + "/follow/:userId/:vacationId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = +req.params.userId;
        const vacationId = +req.params.vacationId;
        if (isNaN(userId) || userId <= 0 || isNaN(vacationId) || vacationId <= 0) {
            console.warn(`Invalid user ID or vacation ID: userId=${userId}, vacationId=${vacationId}`);
            return res.status(statusEnum_1.StatusCode.BadRequest).json({ message: "Invalid user ID or vacation ID" });
        }
        // console.log(`Request received to delete follow: userId=${userId}, vacationId=${vacationId}`);
        yield (0, vacationFollowService_1.deleteFollow)(userId, vacationId);
        res.status(statusEnum_1.StatusCode.Ok).send("Follow deleted successfully");
    }
    catch (error) {
        console.error('Error in DELETE /follow/:userId/:vacationId:', error);
        next(error);
    }
}));
