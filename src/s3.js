import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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


function getS3FileKey(dateTime) {
    const year = dateTime.year;
    const month = String(dateTime.month).padStart(2, '0');
    const day = String(dateTime.day).padStart(2, '0');
    const hour = String(dateTime.hour).padStart(2, '0');
    return `ngwaf-logs_year=${year}_month=${month}_day=${day}_hour=${hour}_ngwaf_logs.jsonl.gz`;
}

export { uploadToS3, getS3FileKey };