// Import WebSocket and fetch modules
const WebSocket = require('ws');
const fetch = require('node-fetch');

// Create a new WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Variable to store the current quote of the day
let currentQuoteOfTheDay = '';

// Event listener for new client connections to the WebSocket server
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send the current quote of the day to the newly connected client
    if (currentQuoteOfTheDay) {
        ws.send(JSON.stringify({ type: 'quoteOfTheDay', content: currentQuoteOfTheDay }));
    }

    // Event listener for messages received from clients
    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    // Event listener for when a client disconnects
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Function to fetch the quote of the day from the Quotable API
const fetchQuoteOfTheDay = async () => {
    const apiUrl = 'https://api.quotable.io/random';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const quote = `"${data.content}" - ${data.author}`;

        // Update the current quote of the day
        currentQuoteOfTheDay = quote;

        // Create a message with the quote of the day
        const message = JSON.stringify({ type: 'quoteOfTheDay', content: quote });

        // Send the quote of the day to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    } catch (error) {
        console.error('Error fetching quote of the day:', error);
    }
};

// Fetch the quote of the day immediately
fetchQuoteOfTheDay();

// Set an interval to fetch the quote of the day every 24 hours (86400000 milliseconds)
setInterval(fetchQuoteOfTheDay, 86400000);

console.log('WebSocket server started');
