const { Author } = require('../models');
const { createItem, getAllItems, getItemById, updateItem, deleteItem, getAllBooks } = require('./helpers/helpers');

exports.create = (req, res) => {
  createItem(res, 'author', req.body);
};

exports.list = (req, res) => {
  getAllItems(res, 'author');
};

exports.getAuthorById = (req, res) => {
  getItemById(res, 'author', req.params.id);
};

exports.updateAuthor = (req, res) => {
  updateItem(res, 'author', req.body, req.params.id);
};

exports.deleteAuthor = (req, res) => {
  deleteItem(res, 'author', req.params.id);
};
