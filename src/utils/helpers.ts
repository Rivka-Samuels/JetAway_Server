import runQuery from "../db/dal";
import { promises as fs } from "fs";
import { appConfig } from "./appConfig";
import { UploadedFile } from "express-fileupload";
import { v4 as uuid } from "uuid";
import path from "path";
import { log } from "console";
import { deleteS3Object, uploadS3ByStream } from "./s3utils";
import { Readable } from "stream";
import {  } from "./s3utils"; // עדכן את הנתיב בהתאם



// Function to check if the database is active
export async function isDbServerUp() {    
    try {
        await runQuery("select 1;");
        return true;
    } catch (error) {
        return false;        
    }
}

// Function to write to error log
async function writeToFile(filepath: string, content: string) {
    await fs.appendFile(filepath, content + "\n");
}

// Function to write to access log
export async function writeErrorLog(errMsg: string) {    
    await writeToFile(appConfig.errorLogFile, errMsg);
}

// Function to write to access log
export async function writeAccessLog(msg: string) {
    await writeToFile(appConfig.accessLogFile, msg);
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
export async function saveImage(image: UploadedFile) {
    const extension = path.extname(image.name);
    const filename = uuid() + extension;
    const fileStream = Readable.from(image.data);
    await uploadS3ByStream(fileStream, filename);
    return filename;
}

// Function to delete a file from the local system
export async function deleteFile(filepath: string) {
    try {
        await fs.unlink(filepath);
        console.log(`File ${filepath} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting file ${filepath}:`, error.message);
    }
}

// Function to delete an image from S3
export async function deleteImage(imageFilename: string) {
    try {
        await deleteS3Object(imageFilename); 
        console.log(`Image ${imageFilename} deleted from S3 successfully.`);
    } catch (error) {
        console.error(`Error deleting image ${imageFilename} from S3:`, error.message);
    }
}
