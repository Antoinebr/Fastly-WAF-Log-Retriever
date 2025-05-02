import { DateTime } from 'luxon';
import cron from 'node-cron';
import { MAX_HOURS } from './config.js';
import { processHour } from './processLogs.js';
import { uploadToS3 } from './s3.js';
import fs from 'fs'; 
import path from 'path'; 
import { log } from 'console';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const isCron = args.includes('--cron');

async function main() {
    const fromTime = DateTime.utc().startOf('hour').minus({ hours: MAX_HOURS });
    const untilTime = DateTime.utc().startOf('hour');
    const interval = 60 * 60 * 1000;



    try {
        for (let from = fromTime.toMillis(); from <= untilTime.toMillis(); from += interval) {
            const currentFrom = DateTime.fromMillis(from, { zone: 'utc' });
            const currentUntil = currentFrom.plus({ hours: 1 });
            const { logs, fileKey } = await processHour(currentFrom, currentUntil);

            // If the settings are ON for S3 
            if(logs && fileKey && process.env.S3 === "true"){
                await uploadToS3(logs, fileKey);
            }

            // If the settings are ON for local storage
            if(logs && process.env.LOCAL === "true"){
                
                

                const LOG_DIR = path.join(__dirname, '../logs'); // Or './logs' if that's what you want
                const LOG_FILE_NAME = fileKey; // You can customize this
                const LOG_FILE_PATH = path.join(LOG_DIR, LOG_FILE_NAME);

                // Ensure logs directory exists
                if (!fs.existsSync(LOG_DIR)) {
                    fs.mkdirSync(LOG_DIR, { recursive: true });
                }

                console.log(`Writing logs to: ${LOG_FILE_PATH}`);

                // Create write stream to the actual log file
                const logStream = fs.createWriteStream(LOG_FILE_PATH, { flags: 'w' });

            
                //const logStream = fs.createWriteStream(logDir, { flags: 'w' });

                logs.forEach(logEntry => {
                    logStream.write(JSON.stringify(logEntry) + '\n');
                });
    

                 // Handle stream events
                logStream.on('finish', () => {
                    console.log(`Finished writing all logs to ${LOG_FILE_PATH}.`);
                });

                logStream.on('error', (err) => {
                    console.error(`Error writing to log file ${LOG_FILE_PATH}:`, err);
                });
            
            }

        }
    } catch (error) {
        console.error('An error occurred during the process:', error);
    }
 

}

if (isCron) {
    console.log('Running in cron mode...');
    let cronTime = args[args.indexOf('--cron') + 1] || '6 * * * *'; // Default to every hour at minute 6
    
    if(process.env.CRON_TIME){
        cronTime = process.env.CRON_TIME;
        console.log(`Using CRON_TIME from environment: ${cronTime}`);
    }

    console.log(`Cron job scheduled to run at: ${cronTime}`);

    cron.schedule(cronTime, async () => {
        console.log('Running cron job to fetch logs...');
        try {
            await main();
        } catch (error) {
            console.error("Error during cron job:", error);
        }
    });
} else {
    console.log('Running fetch logs...');
    main()
        .then(() => {
            console.log('Log fetching completed.');
        })
        .catch((error) => {
            console.error("Error during log fetching:", error);
        });
}