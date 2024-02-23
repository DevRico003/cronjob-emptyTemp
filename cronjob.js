import fetch from 'node-fetch';

// URL to send the POST request to
const url = 'https://www.carcenter-erding.de/api/emptyTemp';

// Function to execute the POST request with retry logic
const fetchDataWithRetry = async (url, retries = 20, delay = 5000, postData = {}) => {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Preparing the options for the POST request, including method, headers, and body
      const requestOptions = {
        method: 'POST', // Specify the method as POST
        headers: {
          'Content-Type': 'application/json', // Assuming JSON data; adjust if necessary
        },
        body: JSON.stringify(postData), // Convert postData object to JSON string
      };

      // Sending the POST request with the requestOptions
      const response = await fetch(url, requestOptions);

      // Checking if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parsing the response as JSON
      const data = await response.json();

      // Outputting the data
      console.log(data);
      return; // Successfully fetched data, exit function
    } catch (error) {
      console.error(`Attempt ${attempt}: Error fetching data`, error.message);
      lastError = error;

      // If the error is not a 504 (Gateway Timeout), break and don't retry
      if (!error.message.includes('504')) break;

      // Waiting for a specified delay before retrying
      if (attempt < retries) {
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // After all attempts, if data is still not fetched, throw the last encountered error
  throw lastError;
};

// Sample postData for the POST request (adjust according to your needs)
const postData = {
  key: 'value', // Example key-value pair; replace with actual data required for the POST request
};

// Invoking the function with the postData
fetchDataWithRetry(url, 20, 5000, postData)
  .then(() => console.log('Data fetch successful'))
  .catch(error => console.error('Final error after retries:', error.message));
