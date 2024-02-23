import fetch from 'node-fetch';

// URL to send the POST request to
const url = 'https://www.carcenter-erding.de/api/emptyTemp';

// Function to execute the POST request with retry logic, allowing for an empty body
const fetchDataWithRetry = async (url, retries = 20, delay = 5000) => {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Preparing the options for the POST request
      const requestOptions = {
        method: 'POST', // Specify the method as POST
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON, adjust if necessary
        },
        body: JSON.stringify({}), // An empty body
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

      // If the error is not a 504 (Gateway Timeout), consider breaking and not retrying based on your error handling preferences
      if (!error.message.includes('504')) {
        console.log('Non-retryable error encountered');
        break;
      }

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

// Invoking the function
fetchDataWithRetry(url)
  .then(() => console.log('Data fetch successful'))
  .catch(error => console.error('Final error after retries:', error.message));
