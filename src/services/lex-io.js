/* eslint-disable func-names, no-unused-vars */

'use strict';

module.exports = function(io) {
  const app = this;
  const sequelize = app.get('sequelizeClient');
  var userId = 1; // DEBUG
  var roomId = 10; // DEBUG

  function getUsers(roomId) {
    return sequelize.models.room.findOne({
      where: { id: roomId },
    }).then(room => room.getUsers({ attributes: ['id', 'displayName'] }));
  }

  function getQuestions(roomId) {
    return sequelize.models.question.findAll({
      include: [ { association: 'author' }, sequelize.models.vote ],
      where: { roomId },
      attributes: [
        'id',
        'text',
        'authorId',
        'createdAt',
      ],
    }).then(qs => qs.map(q => ({ text: q.text, id: q.id, author: q.author.displayName, votes: q.votes })));
  }

  function changeName(newName, userId) {
    sequelize.models.user.findOne({
      where: { id: userId },
    }).then(u => u.update({ displayName: newName }));
  }

  //  May wish to change question param to something besides string
  function askQuestion(question, roomId, userId, anonymous = false) {
    return sequelize.models.question.create({
      text: question,
      authorId: userId,
      roomId,
      anonymous,
    });
  }

  function voteFor(questionId, userId) {
    sequelize.models.vote.create({
      questionId,
      userId,
    });
  }

  function findVotesFor(questionId) {
    return sequelize.models.vote.count({
      where: {
        questionId,
      },
    });
  }

  io.on('connection', function(socket) {

    function emitQuestions() {
      getQuestions(roomId)
        .then(qs => io.sockets.emit('updateQuestions', qs));
    }

    // Send once on initial connection
    emitQuestions();

    // TODO: Real time update
    socket.on('nameChanged', newName => changeName(newName, userId));

    socket.on('questionAsked', (q, anon) => {
      askQuestion(q, roomId, userId, anon)
        .then(() => emitQuestions());
    });

    // Cast a vote on a question
    socket.on('voteCast', questionId => {
      voteFor(questionId, userId)
        .then(() => emitQuestions());
    });
  });
};
