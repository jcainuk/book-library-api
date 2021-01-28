const {
  createItem, getAllItems, getItemById, updateItem, deleteItem,
} = require('./helpers/helpers');

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
  updateItem(res, 'book', req.body, req.params.id);
};

exports.deleteBook = (req, res) => {
  deleteItem(res, 'book', req.params.id);
};
