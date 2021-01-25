const express = require('express');

const router = express.Router();
const authorController = require('../controllers/authors');

router
  .route('/')
  .get(authorController.list)
  .post(authorController.create);

router
  .route('/:id')
  .get(authorController.getAuthorById)
  .patch(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

module.exports = router;
