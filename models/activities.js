'use strict';
module.exports = (sequelize, DataTypes) => {
  const Activities = sequelize.define('Activities', {
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
    userId: DataTypes.INTEGER
  }, {});
  Activities.associate = function(models) {
    // associations can be defined here
    // Activities.belongsTo(models.Users);
    // Activities.belongsTo(models.Users, {foreignKey: 'username'});
  };
  return Activities;
};