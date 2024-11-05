
import dotenv from "dotenv"
import { existsSync } from 'fs'; // Correct import syntax
import path from "path";

// Correct function call for existsSync
if (!existsSync('.env')) {
    throw new Error("ENV file is missing (.env)");
}

// load enviroment variables
dotenv.config()

class AppConfig {
    readonly port: number = 4000
    readonly routePrefix = "/api/v1";
    readonly errorLogFile = path.join(__dirname, "..", "logs", "error.log");
    readonly accessLogFile = path.join(__dirname, "..", "logs", "access.log");
    readonly doormanKey = process.env.DOORMAN_KEY;
    readonly jwtSecret = process.env.JWT_SECRET;
    readonly dbConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: 3306,
        database:'jetaway', 
    }
    readonly s3key = process.env.S3_KEY;
    readonly s3secret = process.env.S3_SECRET;
    readonly s3region = "us_east-1";
    readonly s3bucket = "rivkabucket";
}
export const appConfig = new AppConfig()




