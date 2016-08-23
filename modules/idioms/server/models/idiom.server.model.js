'use strict';

/**
 * Idiom Schema
 */
module.exports = function(sequelize, DataTypes) {

  var Idiom = sequelize.define('Idiom', {
    idiom: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: ''
    },
    language: DataTypes.STRING(2),
    meaning: DataTypes.STRING(2048),
    derivation: DataTypes.STRING(2048),
    imageURL: {
      type: DataTypes.STRING
    },
  }, {
    classMethods: {
      associate: function(models) {
        Idiom.belongsTo(models.User, {
          foreignKey: 'userId',
          foreignKeyConstraint: true
        });
      }
    }
  });

  return Idiom;
};
