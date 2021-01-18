const express = require('express');

const router = express.Router();
const bookController = require('../controllers/books');

router
  .route('/')
  .get(bookController.list)
  .post(bookController.create);

router
  .route('/:id')
  .get(bookController.getBookById)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
