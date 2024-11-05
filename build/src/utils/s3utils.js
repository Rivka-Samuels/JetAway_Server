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
exports.uploadS3ByPath = uploadS3ByPath;
exports.deleteS3Object = deleteS3Object;
exports.uploadS3ByStream = uploadS3ByStream;
const appConfig_1 = require("./appConfig");
const client_s3_1 = require("@aws-sdk/client-s3");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const lib_storage_1 = require("@aws-sdk/lib-storage");
// function to receive an S3 client
function getS3Client() {
    const accessKeyId = appConfig_1.appConfig.s3key;
    const secretAccessKey = appConfig_1.appConfig.s3secret;
    const region = "us-east-1";
    return new client_s3_1.S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
}
// function to upload a file using a path
function uploadS3ByPath(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const s3client = getS3Client();
        const bucketName = appConfig_1.appConfig.s3bucket;
        const filename = path_1.default.basename(filePath);
        const fileStream = fs_1.default.createReadStream(filePath);
        const uploadParams = {
            Bucket: bucketName,
            Key: `JetAway/${filename}`,
            Body: fileStream,
        };
        try {
            const command = new client_s3_1.PutObjectCommand(uploadParams);
            const res = yield s3client.send(command);
            console.log("File uploaded successfully:", res);
        }
        catch (error) {
            console.error("Error during file upload:", error);
        }
    });
}
// Function to delete a file from S3
function deleteS3Object(docName) {
    return __awaiter(this, void 0, void 0, function* () {
        const s3client = getS3Client();
        const bucketName = appConfig_1.appConfig.s3bucket;
        const deleteParams = {
            Bucket: bucketName,
            Key: `JetAway/${docName}`,
        };
        try {
            const command = new client_s3_1.DeleteObjectCommand(deleteParams);
            const res = yield s3client.send(command);
            console.log("Document deleted successfully:", res);
        }
        catch (error) {
            console.error("Error during file deletion:", error);
        }
    });
}
// function to upload a file using stream
function uploadS3ByStream(fileStream, docName) {
    return __awaiter(this, void 0, void 0, function* () {
        const s3client = getS3Client();
        const uploadParams = {
            Bucket: appConfig_1.appConfig.s3bucket,
            Key: `JetAway/${docName}`,
            Body: fileStream,
        };
        const upload = new lib_storage_1.Upload({
            client: s3client,
            params: uploadParams,
        });
        try {
            const res = yield upload.done();
            console.log("Uploaded successfully!", res);
        }
        catch (error) {
            console.error("Error during file upload:", error);
        }
    });
}
// uploadS3ByPath("C:\\Users\\shuki\\Downloads\\BBB.jpg")
// ts-node ./src/utils/s3utils.ts
