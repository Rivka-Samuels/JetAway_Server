import { appConfig } from "./appConfig";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";
import { Readable } from "stream";
import { Upload } from "@aws-sdk/lib-storage";

// function to receive an S3 client
function getS3Client() {
    const accessKeyId = appConfig.s3key;
    const secretAccessKey = appConfig.s3secret;
    const region = "us-east-1";

    return new S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
}

// function to upload a file using a path
export async function uploadS3ByPath(filePath: string) {
    const s3client = getS3Client();
    const bucketName = appConfig.s3bucket;

    const filename = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);

    const uploadParams = {
        Bucket: bucketName,
        Key: `JetAway/${filename}`,
        Body: fileStream,
    };

    try {
        const command = new PutObjectCommand(uploadParams);
        const res = await s3client.send(command);
        console.log("File uploaded successfully:", res);
    } catch (error) {
        console.error("Error during file upload:", error);
    }
}

// Function to delete a file from S3
export async function  deleteS3Object(docName: string): Promise<void> {
    const s3client = getS3Client();
    const bucketName = appConfig.s3bucket;

    const deleteParams = {
        Bucket: bucketName,
        Key: `JetAway/${docName}`, 
    };

    try {
        const command = new DeleteObjectCommand(deleteParams);
        const res = await s3client.send(command);
        console.log("Document deleted successfully:", res);
    } catch (error) {
        console.error("Error during file deletion:", error);
    }
}

// function to upload a file using stream
export async function uploadS3ByStream(fileStream: Readable, docName: string) {
    const s3client = getS3Client();
    const uploadParams = {
        Bucket: appConfig.s3bucket,
        Key: `JetAway/${docName}`, 
        Body: fileStream,
    };

    const upload = new Upload({
        client: s3client,
        params: uploadParams,
    });

    try {
        const res = await upload.done();
        console.log("Uploaded successfully!", res);
    } catch (error) {
        console.error("Error during file upload:", error);
    }
}
// uploadS3ByPath("C:\\Users\\shuki\\Downloads\\BBB.jpg")

// ts-node ./src/utils/s3utils.ts