"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs"); // Correct import syntax
const path_1 = __importDefault(require("path"));
// Correct function call for existsSync
if (!(0, fs_1.existsSync)('.env')) {
    throw new Error("ENV file is missing (.env)");
}
// load enviroment variables
dotenv_1.default.config();
class AppConfig {
    constructor() {
        this.port = 4000;
        this.routePrefix = "/api/v1";
        this.errorLogFile = path_1.default.join(__dirname, "..", "logs", "error.log");
        this.accessLogFile = path_1.default.join(__dirname, "..", "logs", "access.log");
        this.doormanKey = process.env.DOORMAN_KEY;
        this.jwtSecret = process.env.JWT_SECRET;
        this.dbConfig = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: 3306,
            database: 'jetaway',
        };
        this.s3key = process.env.S3_KEY;
        this.s3secret = process.env.S3_SECRET;
        this.s3region = "us_east-1";
        this.s3bucket = "rivkabucket";
    }
}
exports.appConfig = new AppConfig();
