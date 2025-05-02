import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Checks if a log file exists in the logs directory.
 * @param {string} theFileKey - Name of the file to check for.
 * @returns {boolean} - Returns true if the file exists, false otherwise.
 */
export function checkIfLogFileExists(theFileKey) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const LOG_DIR = path.join(__dirname, '../logs');
    const LOG_FILE_PATH = path.join(LOG_DIR, theFileKey);

    if (fs.existsSync(LOG_FILE_PATH)) {
    console.log(`File ${LOG_FILE_PATH} already exists in local storage. Skipping...`);
    return true;
    }

    return false;
}