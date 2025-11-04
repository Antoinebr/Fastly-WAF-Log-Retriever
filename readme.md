# Fastly Next Gen WAF Log Retriever

[![GitHub stars](https://img.shields.io/github/stars/antoinebr/Fastly-WAF-Log-Retriever.svg?style=social&label=Star&maxAge=3600)](https://github.com/antoinebr/Fastly-WAF-Log-Retriever)
[![GitHub forks](https://img.shields.io/github/forks/antoinebr/Fastly-WAF-Log-Retriever.svg?style=social&label=Fork&maxAge=3600)](https://github.com/antoinebr/Fastly-WAF-Log-Retriever)
[![License](https://img.shields.io/github/license/antoinebr/Fastly-WAF-Log-Retriever.svg?style=flat-square)](https://github.com/antoinebr/Fastly-WAF-Log-Retriever/blob/main/LICENSE)

**Retrieve and archive your Fastly Next Gen WAF (NGWAF) logs efficiently. This open-source project provides a simple script to fetch and store your NGWAF request data, with options for local file storage and storage in an S3 Object Storage like Fastly Object Storage.**

If you are new to Fastly WAF log retrieval, I would recommend you read the official Fastly WAF documentation first about logs: [Fastly WAF Documentation](https://docs.fastly.com/en/ngwaf/extract-your-data).

![Logo](/assets/logo.png)

## Features

*   **Automated Log Retrieval:** Fetches logs from the Fastly Next Gen WAF API.
*   **Time-Based Filtering:** Retrieves logs for a configurable time window (default: last 24 hours).
*   **JSONL Output:** Logs are saved in JSON Lines format (JSONL), perfect for processing and analysis.
*   **Flexible Storage Options:**
    *   **Local File Storage:** Logs can be saved to the local filesystem.  Configure this using the `LOCAL` environment variable.
    *   **S3 Storage:** Logs can be uploaded to an S3 comptabile bucket.  Configure this using the `S3` environment variable and related S3-specific settings.
*   **Error Handling:** Includes robust error handling for API requests and file writing/S3 uploads.
*   **Pagination Support:** Handles paginated API responses to ensure all logs are retrieved.
*   **Environment Variable Configuration:** Uses environment variables for secure and flexible configuration.
*   **Asynchronous Operations:** Uses `async/await` for efficient and non-blocking operations.
*   **Rate Limit Friendly:** Includes logic to handle potentially rate-limited APIs (check and modify, if needed, based on your Fastly API usage).


## Demo and how to : 


If you want to quickly get started or see how it works, have a look at this video.

[![video](/assets/screenshot-video.png)](https://www.youtube.com/watch?v=M4DgD-grmKw)

https://www.youtube.com/watch?v=M4DgD-grmKw



## Quick start 

1. **Clone the repo**

    ```bash
    git clone https://github.com/antoinebr/Fastly-WAF-Log-Retriever.git
    cd Fastly-WAF-Log-Retriever
    ```
2. **Set your credentials in a .env**

    ```bash
    cp .env.example .env
    ```

    Then edit the file 

    ```bash 
    nano .env
    ```

3. **Start the container**
    
    ```bash 
    docker-compose up -d
    ```

## Installation and Setup

1.  **Prerequisites:**

    *   Docker ( recommended )

    For development or without Docker:

    *   Node.js (version 16 or higher recommended)
    *   npm (Node Package Manager)
    *   A Fastly Next Gen WAF account and API credentials.
    *   An S3 bucket (if you plan to use S3 storage).  You'll need the appropriate IAM permissions.

2.  **Clone the Repository:**

    ```bash
    git clone https://github.com/antoinebr/Fastly-WAF-Log-Retriever.git
    cd Fastly-WAF-Log-Retriever
    ```

3.  **Install Dependencies:**

    ```bash
    npm install
    ```

4.  **Configure Environment Variables:**

    Create a `.env` file in the project root and add the following variables.  **Replace the placeholder values with your actual Fastly NGWAF credentials and, if using S3, your S3 configuration.**

    ```env
    NGWAF_USER_EMAIL=your_email@example.com
    NGWAF_TOKEN=your_api_token
    NGWAF_CORP=your_corp_name
    NGWAF_SITE=your_site_name
    CRON_TIME = "43 * * * *" # Run every 43rd minute of every hour
    LOCAL=true  # Set to 'true' to enable local file storage (optional, default: false)
    S3=true     # Set to 'true' to enable S3 storage (optional, default: false)
    S3_BUCKET_NAME=your-s3-bucket-name  # Required if S3=true
    S3_REGION=your-s3-region       # Required if S3=true, e.g., us-east-1
    S3_ENDPOINT=your-s3-endpoint  # Optional, only needed if using a custom endpoint (e.g., FastlyObject Storage)
    S3_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID  # Required if S3=true
    S3_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY # Required if S3=true
    LOG_FILE_PATH=logs/ngwaf_logs.jsonl  # Optional: Customize the log file path for local storage (default: logs/ngwaf_logs.jsonl)
    MAX_HOURS=24                  # Optional: Max hours of logs to retrieve (default: 24)
    ```



    *   `NGWAF_USER_EMAIL`: Your Fastly account email address.
    *   `NGWAF_TOKEN`: Your Fastly API token (generate this in your Fastly account).  **Important:  Keep this secure!**
    *   `NGWAF_CORP`: Your Fastly Corp name.
    *   `NGWAF_SITE`: Your Fastly Site name.
    *   `CRON_TIME` : The cron like `"43 * * * *"` # to run a fetch at every 43rd minute of every hour ( Default '6 * * * *' )
    *   `LOCAL`: Set this to `true` to enable local file storage.  Defaults to `false`.
    *   `S3`: Set this to `true` to enable S3 storage.  Defaults to `false`.  When `S3=true`, also provide the S3-related settings below.
    *   `S3_BUCKET_NAME`: The name of your S3 bucket.  Required if `S3=true`.
    *   `S3_REGION`: The AWS region where your S3 bucket is located (e.g., `us-east-1`). Required if `S3=true`.
    *   `S3_ENDPOINT`: (Optional) The S3 endpoint URL if you're using a custom S3-compatible service (e.g., Fastly Object Storage).
    *   `S3_ACCESS_KEY_ID`: Your AWS access key ID.  Required if `S3=true`.  **Important: Keep this secure!**
    *   `S3_SECRET_ACCESS_KEY`: Your AWS secret access key.  Required if `S3=true`.  **Important: Keep this secure!**
    *   `LOG_FILE_PATH`: The path to the output JSONL log file for local storage. If not set and `LOCAL=true`, the logs will be written in a directory structure based on the time window.
    *   `MAX_HOURS`: The number of hours of logs to retrieve.  Defaults to 24.

    Example with Fastly Object Storage 

    ```
    S3="true"
    S3_BUCKET_NAME = "waf-logs" # your bucketname
    S3_REGION = "eu-central"
    S3_ENDPOINT = "https://eu-central.object.fastlystorage.app"
    S3_ACCESS_KEY_ID = "YOUR_ACCESS_KEY"
    S3_SECRET_ACCESS_KEY = "YOUR_SECRET_ACCESS_KEY"
    ```

5.  **Run the Script:**

    *   **Local File Storage (if LOCAL=true):**
        ```bash
        node app.js
        ```
    *   **S3 Storage (if S3=true):**
        ```bash
        node app.js
        ```

    The script will fetch the logs from the specified time range and save them to either the local file (if `LOCAL=true`) or upload to S3 (if `S3=true`), or both. You'll see console output indicating progress.

6.  **Schedule the Script:**

    ```bash
    node app.js --cron "22 * * * *"
    ```

    This command will keep the script running and fetch the logs every hour at the 22nd minute.

## Usage

*   **Storage Configuration:**  Configure either `LOCAL=true` or `S3=true` (or both) in your `.env` file to determine where logs are stored. If both are set, the script will write to both local files and S3.
*   **Scheduling:**  This script is designed to be run periodically using a task scheduler (e.g., cron on Linux/macOS, Task Scheduler on Windows).  Configure your scheduler to execute `node app.js` at the desired intervals (e.g., every hour, every few hours).

You can schedule the execution from the script directly by using the `--cron` option like so `node app.js --cron "22 * * * *"`

*   **Log Analysis:**  The JSONL output (either in local files or in S3) is easily parsed by various tools for log analysis, security monitoring, and incident response.  Consider using tools like `jq`, `ELK stack (Elasticsearch, Logstash, Kibana)`, or other log aggregation and analysis platforms.
*   **Customization:**  The script can be extended or modified. You can customize:
    *   The time range for log retrieval (modify the `MAX_HOURS` variable in `.env` or the script's logic).
    *   The output format (e.g., CSV, other JSON formats) by modifying the log writing section.
    *   Error handling and logging behavior.
    *   API call retries (implement retry logic in case of network issues or API rate limits – consider adding exponential backoff).
    *   Storage location (Local file or S3)

## Docker

### Build the image

```bash
docker build -t antoinebr/ngwaf-log-fetcher .
```

### Run the image 

```bash
docker run -d \
  -e NGWAF_USER_EMAIL="your_email@example.com" \
  -e NGWAF_TOKEN="your_ngwaf_token" \
  -e CORP_NAME="your_corp_name" \
  -e SITE_NAME="your_site_name" \
  -e LOCAL="true" \ #Enable local file storage
  -e S3="false" \ #Disable S3 storage, change to true for S3
  antoinebr/ngwaf-log-fetcher
```

## Use Docker-compose

No need to build before : ( recomended )


```bash 
docker-compose up --build -d
```


## Contributing

Contributions are welcome! If you find a bug, have suggestions, or want to add new features, please:
Fork the repository.
Create a new branch for your feature/fix.
Make your changes.
Submit a pull request.

License
MIT License
