'use strict';

/**
 * Article Schema
 */
module.exports = function(sequelize, DataTypes) {

  var Article = sequelize.define('Article', {
    idiom: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: ''
    },
    language: DataTypes.STRING(2),
    derivation: DataTypes.STRING(2048),
    imageURL: {
      type: DataTypes.STRING
    },
  }, {
    classMethods: {
      associate: function(models) {
        Article.belongsTo(models.User, {
          foreignKey: 'userId',
          foreignKeyConstraint: true
        });
      }
    }
  });

  return Article;
};
