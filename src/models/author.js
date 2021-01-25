module.exports = (connection, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter the author',
        },
      },
    },
  };
  const AuthorModel = connection.define('Author', schema);
  return AuthorModel;
};
