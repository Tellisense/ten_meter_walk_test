const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 8080;

// Storing data : essentially this could be a database in a seperate file
const DATABASE = [];

app.use(express.static(__dirname + '/public'))
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// GET homtepage route
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/views/index.html')))

// GET all data
app.get('/data', (req, res) => res.send(DATABASE));

// POST method route
app.post('/submit', (req, res) => {
  DATABASE.push(req.body);
  res.sendStatus(200);

  // print the json object into the node console
  console.log(DATABASE);
})

// Listening on port 8080
app.listen(port, () => console.log(`10 Meter Walk App is live at http://localhost:${port}!`))