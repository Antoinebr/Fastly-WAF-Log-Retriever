import axios from 'axios';
import { headers, NGWAF_CORP, NGWAF_SITE, base_url } from './config.js';

async function fetchLogs(fromTimestamp, untilTimestamp) {
    const url = `${base_url}/api/v0/corps/${NGWAF_CORP}/sites/${NGWAF_SITE}/feed/requests?from=${fromTimestamp}&until=${untilTimestamp}`;
    let allLogs = [];
    let nextUri = null;

    try {
        do {
            const requestUrl = nextUri ? `${base_url}${nextUri}` : url;
            const response = await axios.get(requestUrl, { headers });

            if (response.status !== 200) {
                throw new Error(`Failed to fetch data from ${requestUrl}. Status Code: ${response.status}`);
            }

            const data = response.data.data || [];
            allLogs = allLogs.concat(data);
            nextUri = response.data.next?.uri;

            if (nextUri) {
              const postUrl = `${base_url}/api/v0/corps/${NGWAF_CORP}/sites/${NGWAF_SITE}/feed/requests`;
              const postData = { next: nextUri.split('next=')?.[1] };
              const postHeaders = {
                  ...headers,
                  'Content-Type': 'application/x-www-form-urlencoded',
              };
              const params = new URLSearchParams(postData); // Use URLSearchParams
              const postResponse = await axios.post(postUrl, params.toString(), { headers: postHeaders });
              if (postResponse.status !== 200) {
                  throw new Error(`Failed to fetch paginated data from ${postUrl}. Status Code: ${postResponse.status}`);
              }
              allLogs = allLogs.concat(postResponse.data.data || []);
              nextUri = postResponse.data.next?.uri;
            }
        } while (nextUri);

        return allLogs;
    } catch (error) {
        console.error("Error fetching logs:", error);
        throw error; // Re-throw to be handled by the caller
    }
}

export { fetchLogs };