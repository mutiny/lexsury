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
      const namespace = roomName;
      const token = socket.handshake.query.token;
      const decodedToken = jwt.decode(token); // .payload.userId;
      let clientId = decodedToken.userId;

      // Add new users to list of participants
      app.service('users').patch(clientId, { roomName }).then(() => {
        console.log(`Updated user with room name`);
      });

      // Create new user with default username of Anonymous
      // Possibly unneeded ?
      function addNewUser() {
        const DEFAULT_USERNAME = 'Anonymous';
        socket.emit('assignment', clientId);
        app.service('users')
        .create({ username: DEFAULT_USERNAME, socketid: clientId, room: namespace })
        .catch(() => console.error('Error occurred while adding new user'));
      }

      // addNewUser();

      // Send pre-existing user schema to new clients
      function announceUsers() {
        app.service('users').find({ query: { room: namespace, $limit: 100 } }).then(users => {
          let usersKey = {};
          users.data.forEach(user => {
            usersKey[user.socketid] = user.username;
          });
          socket.emit('newUser', usersKey);
          socket.broadcast.emit('newUser', usersKey);
        });
      }

      announceUsers();

      // Send pre-existing questions to new clients
      function debrief() {
        app.service('questions')
        .find({ query: { room: namespace,
          $limit: 15,
          $sort: { votes: -1 },
        } })
        .then(questions => socket.emit('newQuestion', questions.data));
      }

      debrief();

      function updateNickname(newUsername) {
        app.service('users')
        .update(clientId, { username: newUsername })
        .then(announceUsers);
      }

      socket.on('nameChanged', function (newUsername) {
        updateNickname(newUsername);
      });

      function emitQuestions() {
        console.log('Emit questions');
        app.service('questions')
        .find({ query: {
          room: namespace,
          $limit: 15,
          $sort: { votes: -1 },
        } })
        .then(questions => nsp.emit('newQuestion', questions.data));
      }

      // Attempt to create entry for new questions, then broadcast questions to clients
      socket.on('questionAsked', function (question) {
        console.log(`New question asked: ${clientId}`);
        app.service('questions')
        .create(Object.assign(question, { author: clientId, votes: [], room: namespace }))
          .then(() => emitQuestions());
      });

      function castVote(vote) {
        app.service('questions').get(vote.id).then(newQuestion => {
          (function handleVote(question) {
            let votes = question.votes;
            let voted = (votes.indexOf(clientId));

            if (voted === -1) {
              votes.push(clientId);
            } else {
              votes.splice(voted, 1);
            }

            app.service('questions')
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

  app.service('rooms').on('created', room => {
    console.log(`Room created: ${room.name}`);
    createNamespace(`/${room.name}`);
  });
};
