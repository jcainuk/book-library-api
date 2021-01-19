const { Book } = require('../models');

exports.create = (req, res) => {
  Book
    .create(req.body)
    .then((book) => res.status(201).json(book))
    .catch((violationError) => {
      const formattedErrors = violationError.errors.map((currentError) => currentError.message);
      res.status(422).json(formattedErrors);
    });
};

exports.list = (req, res) => {
  Book.findAll().then((readers) => res.status(200).json(readers));
};

exports.getBookById = (req, res) => {
  const { id } = req.params;
  Book.findByPk(id).then((book) => {
    if (!book) {
      res.status(404).json({ error: 'The book could not be found.' });
    } else {
      res.status(200).json(book);
    }
  });
};

exports.updateBook = (req, res) => {
  const { id } = req.params;
  Book.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
    if (!rowsUpdated) {
      res.status(404).json({ error: 'The book could not be found.' });
    } else {
      res.status(200).json(rowsUpdated);
    }
  });
};

exports.deleteBook = (req, res) => {
  const { id } = req.params;
  Book.destroy({ where: { id } }).then((rowsDeleted) => {
    if (!rowsDeleted) {
      res.status(404).json({ error: "The book could not be found."});
    } else {
      res.status(204).json({ message: "Deleted successfully"});
    }
  });
};
