'use strict';

const socketioJwt = require('socketio-jwt');
const jwt = require('jsonwebtoken');

module.exports = function (io) {
  var app = this;
  const secret = app.get('authentication').secret;

  io.use(socketioJwt.authorize({
    secret,
    handshake: true,
  }));

  function createNamespace(roomName) {
    const nsp = io.of(roomName);
    nsp.on('connection', function (socket) {
      const token = socket.handshake.query.token;
      const decodedToken = jwt.decode(token); // .payload.userId;
      let clientId = decodedToken.userId;

      // Send pre-existing user schema to new clients
      function announceUsers() {
        app.service('user').find({ query: { room: roomName, $limit: 100 } }).then(users => {
          let usersList = {};
          users.data.forEach(user => {
            usersList[user.id] = user.username;
          });
          socket.emit('newUser', usersList);
          socket.broadcast.emit('newUser', usersList);
        });
      }

      //
      app.service('user').patch(clientId, { room: roomName }).then(() => {
        announceUsers();
      });

      // Send pre-existing questions to new clients
      function debrief() {
        app.service('question')
        .find({ query: { room: roomName,
          $limit: 15,
          $sort: { votes: -1 },
        } })
        .then(questions => socket.emit('newQuestion', questions.data));
      }

      debrief();

      function updateNickname(newUsername) {
        app.service('user')
        .patch(clientId, { username: newUsername })
        .then(announceUsers);
      }

      socket.on('nameChanged', function (newUsername) {
        updateNickname(newUsername);
      });

      function emitQuestions() {
        console.log('Emit questions');
        app.service('question')
        .find({ query: {
          room: roomName,
          $limit: 15,
          $sort: { votes: -1 },
        } })
        .then(questions => nsp.emit('newQuestion', questions.data));
      }

      // Attempt to create entry for new questions, then broadcast questions to clients
      socket.on('questionAsked', function (question) {
        console.log(`New question asked: ${clientId}`);
        app.service('question')
        .create(Object.assign(question, { author: clientId, votes: [], room: roomName, date: new Date() }))
          .then(() => emitQuestions());
      });

      function castVote(vote) {
        app.service('question').get(vote.id).then(newQuestion => {
          (function handleVote(question) {
            let votes = question.votes;
            let voted = (votes.indexOf(clientId));

            if (voted === -1) {
              votes.push(clientId);
            } else {
              votes.splice(voted, 1);
            }

            app.service('question')
              .patch(question.id, { votes: votes })
              .then(emitQuestions);
          }(newQuestion));
        });
      }
      socket.on('voteCast', function (vote) {
        castVote(vote);
      });
    });
  }

  app.service('room').on('created', room => {
    console.log(`Room created: ${room.name}`);
    createNamespace(`/${room.name}`);
  });
};
