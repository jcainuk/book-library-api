module.exports = (connection, DataTypes) => {
  const schema = {

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: [true],
          msg: 'Please enter the genre',
        },
        notEmpty: {
          args: [true],
          msg: 'We need a genre in so that we can create one',
        },
      },
    },
  };
  const GenreModel = connection.define('Genre', schema);
  return GenreModel;
};
