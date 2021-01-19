const { Book } = require('../models');
const { createItem, getAllItems, getItemById } = require('./helpers/helpers');

exports.create = (req, res) => {
  createItem(res, 'book', req.body);
};

exports.list = (req, res) => {
  getAllItems(res, 'book');
};

exports.getBookById = (req, res) => {
  getItemById(res, 'book', req.params.id);
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
