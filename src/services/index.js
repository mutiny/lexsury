const questions = require('./questions/questions.service.js');
const queue = require('./queue/queue.service.js');
const users = require('./users/users.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(questions);
  app.configure(queue);
  app.configure(users);
};
