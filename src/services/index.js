const questions = require('./questions/questions.service.js');
const users = require('./users/users.service.js');
const rooms = require('./rooms/rooms.service');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(questions);
  app.configure(rooms);
  app.configure(users);
};
