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
exports.isDbServerUp = isDbServerUp;
exports.writeErrorLog = writeErrorLog;
exports.writeAccessLog = writeAccessLog;
exports.saveImage = saveImage;
exports.deleteFile = deleteFile;
exports.deleteImage = deleteImage;
const dal_1 = __importDefault(require("../db/dal"));
const fs_1 = require("fs");
const appConfig_1 = require("./appConfig");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const s3utils_1 = require("./s3utils");
const stream_1 = require("stream");
// Function to check if the database is active
function isDbServerUp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, dal_1.default)("select 1;");
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
// Function to write to error log
function writeToFile(filepath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_1.promises.appendFile(filepath, content + "\n");
    });
}
// Function to write to access log
function writeErrorLog(errMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        yield writeToFile(appConfig_1.appConfig.errorLogFile, errMsg);
    });
}
// Function to write to access log
function writeAccessLog(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        yield writeToFile(appConfig_1.appConfig.accessLogFile, msg);
    });
}
// function to save an image
// export async function saveImage(image: UploadedFile) {    
// const extension = image.name.substring( image.name.lastIndexOf("."))
// const filename = uuid() + extension;
// const fullpath = path.join(appConfig.vacationsImagesPrefix, filename);
// console.log(fullpath)
// await image.mv(fullpath);
// return filename;
// }
// function to delete a file
// export async function deleteFile(filepath: string) {
// try {
// await fs.unlink(filepath);
// console.log(`File ${filepath} deleted successfully.`);
// } catch (error) {
// console.error(`Error deleting file ${filepath}:`, error);
// }
// }
// Function to delete an image
// export async function deleteImage(imageFilename: string) {
// const filepath = path.join(appConfig.vacationsImagesPrefix, imageFilename);
// await deleteFile(filepath);
// }
// 
function saveImage(image) {
    return __awaiter(this, void 0, void 0, function* () {
        const extension = path_1.default.extname(image.name);
        const filename = (0, uuid_1.v4)() + extension;
        const fileStream = stream_1.Readable.from(image.data);
        yield (0, s3utils_1.uploadS3ByStream)(fileStream, filename);
        return filename;
    });
}
// Function to delete a file from the local system
function deleteFile(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.promises.unlink(filepath);
            console.log(`File ${filepath} deleted successfully.`);
        }
        catch (error) {
            console.error(`Error deleting file ${filepath}:`, error.message);
        }
    });
}
// Function to delete an image from S3
function deleteImage(imageFilename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, s3utils_1.deleteS3Object)(imageFilename);
            console.log(`Image ${imageFilename} deleted from S3 successfully.`);
        }
        catch (error) {
            console.error(`Error deleting image ${imageFilename} from S3:`, error.message);
        }
    });
}
