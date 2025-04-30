# Fastly Next Gen WAF Log Retriever

[![GitHub stars](https://img.shields.io/github/stars/antoinebr/Fastly-WAF-Log-Retriever.svg?style=social&label=Star&maxAge=3600)](https://github.com/antoinebr/Fastly-WAF-Log-Retriever)
[![GitHub forks](https://img.shields.io/github/forks/antoinebr/Fastly-WAF-Log-Retriever.svg?style=social&label=Fork&maxAge=3600)](https://github.com/antoinebr/Fastly-WAF-Log-Retriever)
[![License](https://img.shields.io/github/license/antoinebr/Fastly-WAF-Log-Retriever.svg?style=flat-square)](https://github.com/antoinebr/Fastly-WAF-Log-Retriever/blob/main/LICENSE)

**Retrieve and archive your Fastly Next Gen WAF (NGWAF) logs efficiently. This open-source project provides a simple script to fetch and store your NGWAF request data.**



![Logo](/assets/logo.png)



## Features

*   **Automated Log Retrieval:**  Fetches logs from the Fastly Next Gen WAF API.
*   **Time-Based Filtering:** Retrieves logs for a configurable time window (default: last 24 hours).
*   **JSONL Output:**  Logs are saved in JSON Lines format (JSONL), perfect for processing and analysis.
*   **Error Handling:** Includes robust error handling for API requests and file writing.
*   **Pagination Support:** Handles paginated API responses to ensure all logs are retrieved.
*   **Environment Variable Configuration:**  Uses environment variables for secure and flexible configuration.
*   **Asynchronous Operations:** Uses `async/await` for efficient and non-blocking operations.
*   **Rate Limit Friendly:** Includes logic to handle potentially rate-limited APIs (check and modify, if needed, based on your Fastly API usage).

## Installation and Setup

1.  **Prerequisites:**

    *   Node.js (version 16 or higher recommended)
    *   npm (Node Package Manager)
    *   A Fastly Next Gen WAF account and API credentials.

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

    Create a `.env` file in the project root and add the following variables.  **Replace the placeholder values with your actual Fastly NGWAF credentials.**

    ```env
    NGWAF_USER_EMAIL=your_email@example.com
    NGWAF_TOKEN=your_api_token
    NGWAF_CORP=your_corp_name
    NGWAF_SITE=your_site_name
    LOG_FILE_PATH=logs/ngwaf_logs.jsonl  # Optional: Customize the log file path (default: logs/ngwaf_logs.jsonl)
    MAX_HOURS=24                  # Optional: Max hours of logs to retrieve (default: 24)
    ```

    *   `NGWAF_USER_EMAIL`: Your Fastly account email address.
    *   `NGWAF_TOKEN`: Your Fastly API token (generate this in your Fastly account).  **Important:  Keep this secure!**
    *   `NGWAF_CORP`: Your Fastly Corp name.
    *   `NGWAF_SITE`: Your Fastly Site name.
    *   `LOG_FILE_PATH`: The path to the output JSONL log file.  If not set, it defaults to `logs/ngwaf_logs.jsonl`.
    *   `MAX_HOURS`: The number of hours of logs to retrieve.  Defaults to 24.

5.  **Run the Script:**

    ```bash
    node app.js
    ```

    The script will fetch the logs from the specified time range and save them to the configured log file. You'll see console output indicating progress.

6.  **Schedule the Script:**

    ```bash
    node app.js --cron "22 * * * *"           
    ```

    This command will keep the script running and fetch the logs every hour at the 22nd minute.

## Usage

*   **Scheduling:**  This script is designed to be run periodically using a task scheduler (e.g., cron on Linux/macOS, Task Scheduler on Windows).  Configure your scheduler to execute `node app.js` at the desired intervals (e.g., every hour, every few hours).

You can schedule the execution from the script directly by using the `--cron` option like so `node main.js --cron "22 * * * *"`

*   **Log Analysis:**  The JSONL output is easily parsed by various tools for log analysis, security monitoring, and incident response.  Consider using tools like `jq`, `ELK stack (Elasticsearch, Logstash, Kibana)`, or other log aggregation and analysis platforms.
*   **Customization:**  The script can be extended or modified. You can customize:
    *   The time range for log retrieval (modify the `MAX_HOURS` variable in `.env` or the script's logic).
    *   The output format (e.g., CSV, other JSON formats) by modifying the log writing section.
    *   Error handling and logging behavior.
    *   API call retries (implement retry logic in case of network issues or API rate limits – consider adding exponential backoff).

## Contributing

Contributions are welcome!  If you find a bug, have suggestions, or want to add new features, please:

1.  Fork the repository.
2.  Create a new branch for your feature/fix.
3.  Make your changes.
4.  Submit a pull request.

## License

[MIT License](LICENSE)

##  SEO Keywords

*   Fastly
*   Fastly Next Gen WAF
*   NGWAF
*   WAF Logs
*   Log Retriever
*   API
*   Node.js
*   JSONL
*   Security
*   Web Application Firewall
*   Fastly API
*   Fastly Logs
*   Open Source
*   Log Aggregation
*   Incident Response
*   Security Auditing
*   Fastly Security