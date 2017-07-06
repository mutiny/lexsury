// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING(128),
      notNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING(128),
      notNull: true,
    },
    firstName: {
      type: Sequelize.STRING(40),
      allowNull: true,
    },
    lastName: {
      type: Sequelize.STRING(40),
      allowNull: true,
    },
    dob: {
      type: Sequelize.DATEONLY,
      notNull: true,
    },
    administrator: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  users.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
};
