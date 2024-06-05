// Create a new WebSocket connection
const socket = new WebSocket('ws://localhost:8080');

// Event listener for when the WebSocket connection is established
socket.addEventListener('open', function (event) {
    console.log('WebSocket connected');
});

// Event listener for when a message is received from the server
socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
    const message = JSON.parse(event.data);
    if (message.type === 'quoteOfTheDay') {
        updateUIWithQuoteOfTheDay(message.content);
    } else if (message.type === 'quote') {
        updateUIWithQuote(message.content);
    } else if (message.type === 'joke') {
        updateUIWithJoke(message.content);
    }
});

// Function to fetch a random quote by a specific author
async function fetchRandomQuoteByAuthor() {
    const author = document.getElementById('authorNameInput').value.trim();

    if (!author) {
        alert('Please enter an author name');
        return;
    }

    const apiUrl = `https://api.quotable.io/quotes?author=${encodeURIComponent(author)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const { content, author } = data.results[randomIndex];
            const quote = `"${content}" - ${author}`;

            socket.send(JSON.stringify({ type: 'quote', content: quote }));
        } else {
            alert('No quotes found for this author.');
        }
    } catch (error) {
        console.error('Error fetching quotes:', error);
        alert(`Error fetching quotes: ${error.message}`);
    }
}

// Function to fetch a random joke
async function fetchRandomJoke() {
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const joke = data.value;

        socket.send(JSON.stringify({ type: 'joke', content: joke }));
    } catch (error) {
        console.error('Error fetching joke:', error);
        alert(`Error fetching joke: ${error.message}`);
    }
}

// Containers for displaying results in the UI
const quoteResultContainer = document.getElementById('quoteResult');
const jokeResultContainer = document.getElementById('jokeResult');
const quoteOfTheDayResultContainer = document.getElementById('quoteOfTheDayResult');

// Function to update the UI with a new quote
function updateUIWithQuote(quote) {
    const newQuoteCard = document.createElement('div');
    newQuoteCard.className = 'card';
    newQuoteCard.innerHTML = `<p>${quote}</p>`;
    quoteResultContainer.appendChild(newQuoteCard);
}

// Function to update the UI with a new joke
function updateUIWithJoke(joke) {
    const newJokeCard = document.createElement('div');
    newJokeCard.className = 'card';
    newJokeCard.innerHTML = `<p>${joke}</p>`;
    jokeResultContainer.appendChild(newJokeCard);
}

// Function to update the UI with the quote of the day
function updateUIWithQuoteOfTheDay(quote) {
    quoteOfTheDayResultContainer.innerHTML = `<div class="qotdBoard"><p>${quote}</p></div>`;
}
