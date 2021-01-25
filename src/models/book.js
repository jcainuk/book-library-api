module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter the title',
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
