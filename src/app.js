const express = require('express');
const readerControllers = require('./controllers/readers');

const app = express();
app.use(express.json());

module.exports = app;

// test

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// readers

app.post('/readers', readerControllers.create);
