// Install express server
const express = require("express");
const path = require("path");

const app = express();

// serve only the static files from the dist directory
app.use(express.static(__dirname + "./dist/demo1"));

app.get("/*", func(req, res) => {
  res.sendFile(path.join(__dirname + '/dist/demo1/'));
});

app.listen(process.env.PORT || 8000)
