import { config } from 'dotenv';

// Load environment variables from .env
config();

// Configuration and environment variables
const NGWAF_EMAIL = process.env.NGWAF_USER_EMAIL;
const NGWAF_TOKEN = process.env.NGWAF_TOKEN;
const NGWAF_CORP = process.env.CORP_NAME;
const NGWAF_SITE = process.env.SITE_NAME;

const LOCAL = process.env.LOCAL;

const S3 = process.env.S3;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_REGION = process.env.S3_REGION;
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const MAX_HOURS = parseInt(process.env.MAX_HOURS) || 24;



if (!NGWAF_EMAIL || !NGWAF_TOKEN || !NGWAF_CORP || !NGWAF_SITE) {
    throw new Error("Please set all required environment variables.");
}


if(S3 === "true"){
    if (!S3_BUCKET_NAME || !S3_REGION || !S3_ENDPOINT || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
        throw new Error("Please set all required S3 environment variables OR set S3 to false.");
    }
}


if(LOCAL !== "true" && S3 !== "true"){
    throw new Error("Please set either LOCAL or S3 to true.");
}


if(MAX_HOURS > 24){
    throw new Error("MAX_HOURS should be less than or equal to 24.");
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
    base_url,
    headers
};