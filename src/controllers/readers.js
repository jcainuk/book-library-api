const { Reader } = require('../models');
const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require('./helpers/helpers');

/* Here we define the controller method like we used to do in the app.js file.
 chaining  function calls.
readerInfo = req.body;
With the help of Sequelize, we create a new Reader record with the create() function.
Assuming that the connection was declared it is equal to saying:
connection.query("INSERT INTO readers VALUES (?, ?)", readerInfo.name, readerInfo.genre);
Then, we go through the .then() if the creation worked.
In .then() , we give back a response to the user, with a status 201
 and with a body containing the data of the reader created
 (because the .then() after the .create() provides us
  with a parameter containing the created record). */

exports.create = (req, res) => {
  createItem(res, 'reader', req.body);
};

exports.list = (req, res) => {
  getAllItems(res, 'reader');
};

exports.getReaderById = (req, res) => {
  getItemById(res, 'reader', req.params.id);
};

exports.updateReader = (req, res) => {
  updateItem(res, 'reader', req.body, req.params.id);
};

exports.deleteReader = (req, res) => {
  deleteItem(res, 'reader', req.params.id);
};
