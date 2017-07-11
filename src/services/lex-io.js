/* eslint-disable func-names, no-unused-vars */

'use strict';

const socketioJwt = require('socketio-jwt');
const jwt = require('jsonwebtoken');

module.exports = function(io) {
  const app = this;
  const secret = app.get('authentication').secret;
  const sequelize = app.get('sequelizeClient').models;

  function getUsers(roomId) {
    return sequelize.room.findOne({
      where: { id: roomId },
    }).then(room => room.getUsers({ attributes: ['id', 'displayName'] }));
  }

  function getQuestions(roomId) {
    return sequelize.question.findAll({
      include: [
        { association: 'author' },
        { model: sequelize.vote, where: { revoked: false }, required: false },
      ],
      where: { roomId },
      attributes: [
        'id',
        'text',
        'authorId',
        'createdAt',
      ],
    }).then(qs => qs.map(q => ({ text: q.text, id: q.id, author: q.author.displayName, votes: q.votes, date: q.createdAt })));
  }

  function changeName(newName, userId) {
    sequelize.user.findOne({
      where: { id: userId },
    }).then(u => u.update({ displayName: newName }));
  }

  //  May wish to change question param to something besides string
  function askQuestion(question, roomId, userId, anonymous = false) {
    return sequelize.question.create({
      text: question,
      authorId: userId,
      roomId,
      anonymous,
    });
  }

  function voteFor(questionId, userId) {
    return sequelize.vote.findOrCreate({
      where: { questionId, userId },
    }).spread((vote, didCreate) => {
      if (!didCreate) return vote.update({ revoked: !vote.revoked });
    });
  }

  function findVotesFor(questionId) {
    return sequelize.vote.count({
      where: {
        questionId,
      },
    });
  }

  io.use(socketioJwt.authorize({
    secret,
    handshake: true,
  }));

  function createNamespace(roomName, roomId) {
    const nsp = io.of('/' + roomName);
    nsp.on('connection', function socketHandler(socket) {
      const token = socket.handshake.query.token;
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.userId;

      function emitQuestions() {
        getQuestions(roomId)
          .then(qs => nsp.emit('questionAsked', qs));
      }

      // Send once on initial connection
      emitQuestions();

      // TODO: Real time update
      socket.on('nameChanged', newName => changeName(newName, userId));

      socket.on('questionAsked', (q, anon) => {
        askQuestion(q, roomId, userId, anon)
          .then(emitQuestions);
      });

      // Cast a vote on a question
      socket.on('voteCast', questionId => {
        voteFor(questionId, userId)
          .then(emitQuestions);
      });
    });
  }

  app.service('room').on('created', room => createNamespace(room.name, room.id));
};
