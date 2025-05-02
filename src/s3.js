import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { S3_BUCKET_NAME, S3_REGION, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } from './config.js';
import { DateTime } from 'luxon';

const s3Client = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY
    },
    forcePathStyle: true // Required for some S3-compatible services
});


async function uploadToS3(logs, fileKey) {
    if (logs.length === 0) {
        console.log(`No logs to upload for ${fileKey}`);
        return;
    }

    const jsonlData = logs.map(logEntry => JSON.stringify(logEntry)).join('\n') + '\n'; // Ensure newline at the end

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
        Body: jsonlData,
        ContentEncoding: 'gzip',
        ContentType: 'application/jsonl',
    };

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        console.log(`Uploaded ${logs.length} logs to s3://${S3_BUCKET_NAME}/${fileKey}`);
    } catch (error) {
        console.error(`Error uploading to S3: ${error}`);
        throw error;  // Re-throw for retry handling
    }
}




async function fileExistsInS3(fileKey) {
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
    };

    try {
        await s3Client.send(new HeadObjectCommand(params));
        return true;
    } catch (error) {
        if (error.name === 'NotFound') {
            return false;
        }
        console.error(`Error checking file in S3: ${error}`);
        throw error;
    }
}


export { uploadToS3, fileExistsInS3 };