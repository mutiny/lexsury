// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const room = sequelizeClient.define('room', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      notNull: true,
    },
  }, {
    name: {
      singular: 'room',
      plural: 'rooms',
    },
    hooks: {
      beforeCount(options) {
        options.raw = true;
      },
    },
  });

  room.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    models.room.belongsTo(models.user, { as: 'creator' });
  };

  return room;
};
