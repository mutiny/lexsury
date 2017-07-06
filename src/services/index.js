const question = require('./question/question.service.js');
const user = require('./user/user.service.js');
const room = require('./room/room.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(question);
  app.configure(room);
  app.configure(user);
};
