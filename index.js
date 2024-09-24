const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Jenkins neand Kubernetes! Its working now');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
  });
}

module.exports = app; // Export the app for testing
