module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Please enter the title',
        },
        notEmpty: {
          args: [true],
          msg: 'The book title cannot be empty',
        },
      },
    },
    ISBN: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter the ISBN',
        },
      },
    },
  };
  const BookModel = connection.define('Book', schema);
  return BookModel;
};
