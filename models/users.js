'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
   // models.Activities.belongsTo(Users);
    Users.hasMany( models.Activities, {foreignKey: 'username'});
  };
  return Users;
};