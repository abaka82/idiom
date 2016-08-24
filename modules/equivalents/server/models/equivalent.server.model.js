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
      unique: true
    },
    language: DataTypes.STRING(2),
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
