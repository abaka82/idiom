'use strict';

/**
 * Translation Schema
 */
module.exports = function(sequelize, DataTypes) {

  var Translation = sequelize.define('Translation', {
    translation: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: ''
    },
    language: DataTypes.STRING(2),
  }, {
    classMethods: {
      associate: function(models) {
        Translation.belongsTo(models.User, {
          foreignKey: 'userId',
          foreignKeyConstraint: true
        });
        Translation.belongsTo(models.Idiom, {
          foreignKey: 'idiomId',
          foreignKeyConstraint: true
        });
      }
    }
  });

  return Translation;
};
