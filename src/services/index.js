const questions = require('./questions/questions.service.js');
const users = require('./users/users.service.js');
const rooms = require('./rooms/rooms.service');
const queues = require('./queues/queues.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(questions);
  app.configure(rooms);
  app.configure(users);
  app.configure(queues);
};
