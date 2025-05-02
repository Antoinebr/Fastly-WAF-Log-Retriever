import { fetchLogs } from './api.js';
import { uploadToS3 } from './s3.js';
import { DateTime } from 'luxon';



function getFileKey(dateTime) {
    const year = dateTime.year;
    const month = String(dateTime.month).padStart(2, '0');
    const day = String(dateTime.day).padStart(2, '0');
    const hour = String(dateTime.hour).padStart(2, '0');
    return `ngwaf-logs_year=${year}_month=${month}_day=${day}_hour=${hour}_ngwaf_logs.jsonl.gz`;
}


async function processHour(currentFrom, currentUntil) {
    const fromTimestamp = Math.floor(currentFrom.toSeconds());
    const untilTimestamp = Math.floor(currentUntil.toSeconds());
    const fileKey = getFileKey(currentFrom);

    const currentTimestamp = Math.floor(DateTime.utc().toSeconds());
    // Check if the untilTimestamp is greater than the current timestamp
    if (untilTimestamp > currentTimestamp) {
        console.log(`Cannot fetch logs in the future from ${currentFrom.toISO()} to ${currentUntil.toISO()}`);
        return {
            logs : [],
            fileKey
        }
    }
    // if untilTimestamp is greater than currentTimestamp minus 5 minutes
    if (untilTimestamp > currentTimestamp - 300) {
        console.log(`Skipping logs from ${currentFrom.toISO()} to ${currentUntil.toISO()} as they are too recent.`);
        return;
    }
    try {
        console.log(`Fetching logs from ${currentFrom.toISO()} to ${currentUntil.toISO()}`);
        const logs = await fetchLogs(fromTimestamp, untilTimestamp);

        return {
            logs,
            fileKey
        }
        
    } catch (error) {
        console.error(`Error processing hour ${currentFrom.toISO()}:`, error);
        // Handle errors (e.g., retry, log to a dedicated error log)
        throw error; // Re-throw for the main function to handle
    }
}

export { processHour, getFileKey };