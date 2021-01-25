module.exports = (connection, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Please enter the author',
        },
        notEmpty: {
          args: [true],
          msg: 'Please enter the author',
        },
      },
    },
  };
  const AuthorModel = connection.define('Author', schema);
  return AuthorModel;
};
