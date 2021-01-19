const { Book, Reader } = require('../../models');

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
  };
  return models[model];
};
exports.createItem = (res, model, item) => {
  const Model = getModel(model);
  Model.create(item)
    .then((reader) => res.status(201).json(reader))
    .catch((violationError) => {
      const formattedErrors = violationError.errors.map((currentError) => currentError.message);
      res.status(422).json(formattedErrors);
    });
};

exports.getAllItems = (res, model) => {
  const Model = getModel(model);

  return Model.findAll().then((allItems) => {
    res.status(200).json(allItems);
  });
};
