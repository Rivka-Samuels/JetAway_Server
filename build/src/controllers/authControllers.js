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
exports.authRoutes = void 0;
const express_1 = require("express");
const appConfig_1 = require("../utils/appConfig");
const userModel_1 = __importDefault(require("../models/userModel"));
const authService_1 = require("../services/authService");
const statusEnum_1 = require("../models/statusEnum");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post(appConfig_1.appConfig.routePrefix + "/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new userModel_1.default(req.body);
        const token = yield (0, authService_1.createUser)(user);
        res.status(statusEnum_1.StatusCode.Created).json(token);
    }
    catch (error) {
        next(error);
    }
}));
exports.authRoutes.post(appConfig_1.appConfig.routePrefix + "/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const token = yield (0, authService_1.login)(email, password);
        res.status(statusEnum_1.StatusCode.Ok).json(token);
    }
    catch (error) {
        next(error);
    }
}));
