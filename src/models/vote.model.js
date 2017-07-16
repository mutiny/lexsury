const Sequelize = require('sequelize');
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const vote = sequelizeClient.define('vote', {
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  }, {
    name: {
      singular: 'vote',
      plural: 'votes',
    },
    hooks: {
      beforeCount(options) {
        options.raw = true; // eslint-disable-line no-param-reassign
      },
    },
  });

  vote.associate = function (models) {
    // models.vote.hasOne(models.question);
    models.vote.belongsTo(models.user);
  };

  return vote;
};
