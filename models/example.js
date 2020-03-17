module.exports = function(sequelize, DataTypes) {
  var gameWords = sequelize.define("Words", {
    text: DataTypes.STRING
  });
  return Example;
};
