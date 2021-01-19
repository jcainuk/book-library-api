const { Book, Reader } = require('../../models');

const get404Error = (model) => ({ error: `The ${model} could not be found.` });

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

exports.getItemById = (res, model, id) => {
  const Model = getModel(model);

  return Model.findByPk(id).then((item) => {
    if (!item) {
      res.status(404).json(get404Error(model));
    } else {
      res.status(200).json(item);
    }
  });
};

exports.updateItem = (res, model, item, id) => {
  const Model = getModel(model);

  return Model.update(item, { where: { id } }).then(([recordsUpdated]) => {
    if (!recordsUpdated) {
      res.status(404).json(get404Error(model));
    } else {
      getModel(model)
        .findByPk(id)
        .then((updatedItem) => {
          res.status(200).json(updatedItem);
        });
    }
  });
};

exports.deleteItem = (res, model, id) => {
  const Model = getModel(model);

  return Model.findByPk(id).then((foundItem) => {
    if (!foundItem) {
      res.status(404).json(get404Error(model));
    } else {
      Model.destroy({ where: { id } }).then(() => {
        res.status(204).send().json({ message: "Deleted successfully"});
      });
    }
  });
};

 //
  // const { id } = req.params;
  // Reader.destroy({ where: { id } }).then((rowsDeleted) => {
  //   if (!rowsDeleted) {
  //     
  //   } else {
  //     res.status(204).json({ message: "Deleted successfully"});
  //   }
  // });
