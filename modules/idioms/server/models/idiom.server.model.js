'use strict';

/**
 * Idiom Schema
 */
module.exports = function(sequelize, DataTypes) {

  var Idiom = sequelize.define('Idiom', {
    idiom: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: '',
      unique: true
    },
    language: DataTypes.STRING(2),
    meaning: DataTypes.STRING(2048),
    derivation: DataTypes.STRING(2048),
    imageURL: {
      type: DataTypes.STRING
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    modifiedBy: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
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
