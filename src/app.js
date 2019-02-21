const path = require('path')
const express = require('express')
const app = express()
const port = 3010

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/views/index.html')))

// POST method route
app.post('/', function (req, res) {
  // For debugging
  console.log(req);
  res.send('POST request')
})

app.use(express.static(__dirname + '/public'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))