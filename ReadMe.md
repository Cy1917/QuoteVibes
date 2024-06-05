Installation
Prerequisites
Node.js
npm (Node Package Manager)

Install the required dependencies:
bash
npm install

Start the WebSocket server:
bash
node webserver.js

Client Side
Open index.html in a web browser.
Enter an author's name in the input field and click the "Fetch Random Quote by Author" button to get a quote by that author.
Click the "Fetch Random Joke" button to get a random joke.
The "Quote of the Day" is automatically fetched and displayed when the client connects to the server.

Features

Fetch and display a random quote by a specific author.
Fetch and display a random joke.
Automatically receive and display the "Quote of the Day" when the client connects to the server.
Broadcast messages to all connected clients.

Language Used

Node.js
WebSocket
HTML/CSS/JavaScript
Fetch API