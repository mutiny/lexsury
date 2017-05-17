'use strict';

module.exports = function (io) {
  var app = this;

  function createNamespace(newnsp) {
    const nsp = io.of(`/${newnsp}`);
    nsp.on('connection', function (socket) {
      const namespace = newnsp;
      console.log(`Client connected to ${namespace}`);
      let clientId = socket.id;

      // Create new user
      function addNewUser() {
        socket.emit('assignment', clientId);
        app.service('users')
        .create({ username: 'Anonymous', socketid: clientId, room: namespace })
        .catch(() => console.error('Error occurred while adding new user'));
      }

      addNewUser();

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
        .find({ query: {
          room: namespace,
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
        app.service('rooms')
        .get(namespace)
        .then(room => {
          const newQ = Object.assign(question, { author: clientId, votes: [] });
          app.service('rooms')
          .patch(namespace, { questions: room.questions.concat(newQ) });
        });
        // app.service('questions')
        // .create(Object.assign(question, { author: clientId, votes: [], room: namespace }))
        // .then(() => emitQuestions());
      });

      function castVote(vote) {
        app.service('questions').get(vote.id).then(function handleVote(question) {
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
        });
      }

      socket.on('voteCast', function (vote) {
        castVote(vote);
      });
    });
  }

  app.service('rooms').on('created', room => {
    console.log(`Room created: ${room.name}`);
    createNamespace(room.name);
  });
};
