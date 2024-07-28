const express = require("express");
const path = require("path");

const app = express();

// Serve only the static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist', 'demo1')));

// Redirect all requests to the index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'demo1', 'index.html'));
});

// Start the app by listening on the default Heroku port or 8000
app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port", process.env.PORT || 8000);
});
