const { Book } = require('../models');

exports.create = (req, res) => {
  Book.create(req.body).then((book) => res.status(201).json(book));
};

exports.list = (req, res) => {
  Book.findAll().then((readers) => res.status(200).json(readers));
};
