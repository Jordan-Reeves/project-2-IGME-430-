// Accepts and object and displays the message or error of it
const sendStatus = (message) => {
  // console.log(message);
  let displayText = '';
  for (const property in message) {
    if(property == 'message' || property == "error"){
      console.log(`${property}: ${message[property]}`);
      displayText += `<p>${property}: ${message[property]}</p>`;
    }
  }
  document.getElementById('statusMessage').innerHTML = displayText;
  document.getElementById('status').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // Get the result
  const result = await response.json();
  // console.log(result);

  // Hide the status
  document.getElementById('status').classList.add('hidden');

  // Redirect if needed
  if(result.redirect) {
    window.location = result.redirect;
  }

  // Display the error if neede
  if(result.error) {
    sendStatus(result);
  }

  // Returns the result to the callback/handler
  if(handler){
    handler(result);
  }
};

// Hide the status text
const hideStatus = () => {
    document.getElementById('status').classList.add('hidden');
}

module.exports = {
    sendStatus,
    sendPost,
    hideStatus,
}