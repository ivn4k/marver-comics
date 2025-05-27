// Simple script to test the server connection

const http = require('http');

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

console.log(`Testing connection to server at ${URL}...`);

// Make a simple GET request to the server
http.get(URL, (res) => {
  console.log(`Server status: ${res.statusCode} ${res.statusMessage}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:', data);
    console.log('Server is running and accessible.');
  });
}).on('error', (err) => {
  console.error('Error connecting to server:', err.message);
  console.log('The server is not running or not accessible.');
  console.log('Please start the server with: npm run dev');
}); 