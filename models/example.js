module.exports = function(sequelize, DataTypes) {
  var gameWords = sequelize.define(
    "Words",
    {
      word: DataTypes.STRING
    },
    {
      timestamps: false
    }
  );
  return gameWords;
};
