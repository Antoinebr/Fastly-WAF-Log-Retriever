import { config } from 'dotenv';

// Load environment variables from .env
config();

// Configuration and environment variables
const NGWAF_EMAIL = process.env.NGWAF_USER_EMAIL;
const NGWAF_TOKEN = process.env.NGWAF_TOKEN;
const NGWAF_CORP = process.env.CORP_NAME;
const NGWAF_SITE = process.env.SITE_NAME;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_REGION = process.env.S3_REGION;
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const MAX_HOURS = parseInt(process.env.MAX_HOURS) || 24;
const CONCURRENCY = parseInt(process.env.CONCURRENCY) || 2;


if (!NGWAF_EMAIL || !NGWAF_TOKEN || !NGWAF_CORP || !NGWAF_SITE || !S3_BUCKET_NAME) {
    throw new Error("Please set all required environment variables.");
}

const base_url = 'https://dashboard.signalsciences.net/api/v0';
const headers = {
    'x-api-user': NGWAF_EMAIL,
    'x-api-token': NGWAF_TOKEN,
};


export {
    NGWAF_EMAIL,
    NGWAF_TOKEN,
    NGWAF_CORP,
    NGWAF_SITE,
    S3_BUCKET_NAME,
    S3_REGION,
    S3_ENDPOINT,
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    MAX_HOURS,
    CONCURRENCY,
    base_url,
    headers
};