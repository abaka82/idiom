'use strict';

/**
 * Equivalent Schema
 */
module.exports = function(sequelize, DataTypes) {

  var Equivalent = sequelize.define('Equivalent', {
    equiv_idiom: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: '',
      unique: 'equiv_and_lang'
    },
    language: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: 'equiv_and_lang'
    }
  }, {
    classMethods: {
      associate: function(models) {
        Equivalent.belongsTo(models.User, {
          foreignKey: 'userId',
          foreignKeyConstraint: true
        });
        Equivalent.belongsTo(models.Idiom, {
          foreignKey: 'idiomId',
          foreignKeyConstraint: true
        });
      }
    }
  });

  return Equivalent;
};
