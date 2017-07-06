const Sequelize = require('sequelize');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const question = sequelizeClient.define('question', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: Sequelize.STRING,
      notNull: true,
    },
    anonymous: {
      type: Sequelize.BOOLEAN,
      notNull: true,
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      },
    },
  });

  question.associate = function (models) { // eslint-disable-line no-unused-vars
    models.question.belongsTo(models.user, { as: 'author' });
    models.question.belongsTo(models.room, { as: 'room' });
  };

  return question;
};
