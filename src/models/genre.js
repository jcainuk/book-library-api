module.exports = (connection, DataTypes) => {
  const schema = {

    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter the genre',
        },
      },
    },
  };
  const GenreModel = connection.define('Genre', schema);
  return GenreModel;
};
