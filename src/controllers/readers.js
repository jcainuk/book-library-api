const { Reader } = require('../models');

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
  if (req.body.name === '' || req.body.email === '' || req.body.password === '') {
    res.status(404).json({ error: 'All fields must be completed.' });
  } else if (req.body.email.indexOf('@') === -1) {
    res.status(404).json({ error: 'The email address is invalid.' });
  } else if (req.body.password.length < 8) {
    res.status(404).json({ error: 'Password must be at least 8 characters.' });
  } else {
    Reader.create(req.body).then((reader) => res.status(201).json(reader));
  }
};

exports.list = (req, res) => {
  Reader.findAll().then((readers) => res.status(200).json(readers));
};

exports.getReaderById = (req, res) => {
  const { id } = req.params;
  Reader.findByPk(id).then((reader) => {
    if (!reader) {
      res.status(404).json({ error: 'The reader could not be found.' });
    } else {
      res.status(200).json(reader);
    }
  });
};

exports.updateReader = (req, res) => {
  const { id } = req.params;
  Reader.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
    if (!rowsUpdated) {
      res.status(404).json({ error: 'The reader could not be found.' });
    } else {
      res.status(200).json(rowsUpdated);
    }
  });
};

exports.deleteReader = (req, res) => {
  const { id } = req.params;
  Reader.destroy({ where: { id } }).then((rowsDeleted) => {
    if (!rowsDeleted) {
      res.status(404).json({ error: "The reader could not be found."});
    } else {
      res.status(204).json({ message: "Deleted successfully"});
    }
  });
};
