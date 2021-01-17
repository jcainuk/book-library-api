const express = require('express');
const readerControllers = require('./controllers/readers');
const bookControllers = require('./controllers/books');

const app = express();
app.use(express.json());

module.exports = app;

// test

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// readers

app.post('/readers', readerControllers.create);

app.get('/readers', readerControllers.list);

app.get('/readers/:id', readerControllers.getReaderById);

app.patch('/readers/:id', readerControllers.updateReader);

app.delete('/readers/:id', readerControllers.deleteReader);

// books

app.post('/books', bookControllers.create);
