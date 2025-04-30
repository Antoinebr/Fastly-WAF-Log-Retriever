import axios from 'axios'; // npm install axios
import { config } from 'dotenv'; // npm install dotenv
import { DateTime } from 'luxon';
import fs from 'fs'; // Built-in Node.js module
import path from 'path'; // Built-in Node.js module
import { URLSearchParams } from 'url'; // Import URLSearchParams for Node.js < 17

// Load environment variables from .env file
config();

// Set up environment variables
const NGWAF_EMAIL = process.env.NGWAF_USER_EMAIL;
const NGWAF_TOKEN = process.env.NGWAF_TOKEN;
const NGWAF_CORP = process.env.CORP_NAME;
const NGWAF_SITE = process.env.SITE_NAME;
const LOG_FILE_PATH = process.env.LOG_FILE_PATH || 'logs/ngwaf_logs.jsonl'; // Default log file path
const MAX_HOURS = parseInt(process.env.MAX_HOURS) || 24; // Maximum hours of logs to retrieve (24 hours)

if (!NGWAF_EMAIL || !NGWAF_TOKEN || !NGWAF_CORP || !NGWAF_SITE) {
    throw new Error("Please set NGWAF_EMAIL, NGWAF_TOKEN, NGWAF_CORP, and NGWAF_SITE environment variables.");
}

// Base URL for the API
const base_url = 'https://dashboard.signalsciences.net/api/v0';

// Set up headers with authentication
const headers = {
    'x-api-user': NGWAF_EMAIL,
    'x-api-token': NGWAF_TOKEN,
};

// Get current UTC time
const nowUTC = DateTime.utc();

// Round down to the previous full hour
const untilTime = nowUTC.startOf('hour');

// Function to fetch logs recursively and write to a stream
async function getLogs(baseUrl, logStream, fromTimestamp, untilTimestamp) {
    const url = `${baseUrl}/corps/${NGWAF_CORP}/sites/${NGWAF_SITE}/feed/requests?from=${fromTimestamp}&until=${untilTimestamp}`;

    try {
        console.log(`Fetching data from: ${url}`);
        const response = await axios.get(url, { headers });

        if (response.status !== 200) {
            throw new Error(`Failed to fetch data from ${url}. Status Code: ${response.status}`);
        }

        const data = response.data.data || [];

        // Write each log entry as a separate line (JSONL format)
        data.forEach(logEntry => {
            logStream.write(JSON.stringify(logEntry) + '\n');
        });

        let nextUri = response.data.next?.uri;

        while (nextUri) {
            const nextValue = nextUri.split('next=')?.[1];

            if (!nextValue) {
                break; // Exit if no next value found
            }

            const postUrl = `${baseUrl}/corps/${NGWAF_CORP}/sites/${NGWAF_SITE}/feed/requests`;
            const postData = { next: nextValue };
            const postHeaders = {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded',
            };

            const params = new URLSearchParams(postData); // Use URLSearchParams
            const postResponse = await axios.post(postUrl, params.toString(), { headers: postHeaders });

            if (postResponse.status !== 200) {
                throw new Error(`Failed to fetch paginated data from ${postUrl}. Status Code: ${postResponse.status}`);
            }

            const paginatedData = postResponse.data.data || [];
            paginatedData.forEach(logEntry => {
                logStream.write(JSON.stringify(logEntry) + '\n');
            });
            nextUri = postResponse.data.next?.uri;
        }

    } catch (error) {
        if (error.response) {
            console.error("API Error:", error.response.data);
            console.error("Status Code:", error.response.status);
            console.error("Headers:", error.response.headers);
        } else if (error.request) {
            console.error("Request Error:", error.request);
        } else {
            console.error("Error", error.message);
        }
        throw error; // Re-throw to be caught by the caller if needed.
    }
}


async function main() {
    // Create logs directory if it doesn't exist
    const logDir = path.dirname(LOG_FILE_PATH);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const logStream = fs.createWriteStream(LOG_FILE_PATH, { flags: 'w' });

    // Handle stream events
    logStream.on('finish', () => {
        console.log(`Finished writing all logs to ${LOG_FILE_PATH}.`);
    });

    logStream.on('error', (err) => {
        console.error(`Error writing to log file ${LOG_FILE_PATH}:`, err);
    });

    // Calculate timestamps for the past 24 hours.  Iterate through each hour.
    let fromTime = DateTime.utc().startOf('hour').minus({ hours: MAX_HOURS });
    const untilTime = DateTime.utc().startOf('hour'); // Current/Previous Hour
    const interval = 60 * 60 * 1000; // 1 hour in milliseconds

    for (let from = fromTime.toMillis(); from <= untilTime.toMillis(); from += interval) {
        const currentFrom = DateTime.fromMillis(from, {zone: 'utc'});
        const currentUntil = currentFrom.plus({ hours: 1 });
        const fromTimestamp = Math.floor(currentFrom.toSeconds());
        const untilTimestamp = Math.floor(currentUntil.toSeconds());

        // get the current timestamp
        const currentTimestamp = Math.floor(DateTime.utc().toSeconds());

        console.log("currentTimestamp", currentTimestamp );
        console.log(`Fetching logs from ${currentFrom.toISO()} to ${currentUntil.toISO()}`);

        // Check if the untilTimestamp is greater than the current timestamp
        if (untilTimestamp > currentTimestamp) return;

        // if untilTimestamp is greater than currentTimestamp minus 5 minutes 
        if (untilTimestamp > currentTimestamp - 300) {
            console.log(`Skipping logs from ${currentFrom.toISO()} to ${currentUntil.toISO()} as they are too recent.`);
            return; 
        }

    

        await getLogs(base_url, logStream, fromTimestamp, untilTimestamp);
    }

    // Close the stream explicitly (important!)
    logStream.end();
}

main().catch(e => console.log(e.data));