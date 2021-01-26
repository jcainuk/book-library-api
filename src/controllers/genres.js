const { Genre } = require('../models');
const { createItem, getAllItems, getItemById, updateItem, deleteItem, getAllBooks } = require('./helpers/helpers');

exports.create = (req, res) => {
  createItem(res, 'genre', req.body);
};

exports.list = (req, res) => {
  getAllBooks(res, 'genre');
};

exports.getGenreById = (req, res) => {
  getItemById(res, 'genre', req.params.id);
};

exports.updateGenre = (req, res) => {
  updateItem(res, 'genre', req.body, req.params.id);
};

exports.deleteGenre = (req, res) => {
  deleteItem(res, 'genre', req.params.id);
};