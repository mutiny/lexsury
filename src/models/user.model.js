// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const user = sequelizeClient.define('user', {
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
    displayName: {
      type: Sequelize.STRING(128),
      defaultValue: 'Anonymous',
      notEmpty: true,
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
    name: {
      singular: 'user',
      plural: 'users',
    },
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  user.associate = function (models) { // eslint-disable-line no-unused-vars
    models.user.hasMany(models.question);
    models.user.belongsToMany(models.room, {
      as: 'guests',
      through: 'guestlist',
    });
  };

  return user;
};
