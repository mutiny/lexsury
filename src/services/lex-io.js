module.exports = function (io) {
  var app = this;
  io.on('connection', function (socket) {
    console.log('Client connected');
    let clientId = socket.id;

    // Create new user
    function addNewUser() {
      socket.emit('assignment', clientId);
      app.service('users')
        .create({ username: 'Anonymous', socketid: clientId })
        .then(() => console.log('User added'));
    }

    addNewUser();

    // Send pre-existing user schema to new clients
    function announceUsers() {
      app.service('users').find({ query: { $limit: 100 } }).then(users => {
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
      app.service('questions').
        find({query: {$limit: 15, $sort: {votes: -1}}}).
        then(questions => socket.emit('newQuestion', questions.data));
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
        .find({ query: { $limit: 15, $sort: { votes: -1 } } })
        .then(questions => io.emit('newQuestion', questions.data));
    }

    // Attempt to create entry for new questions, then broadcast questions to clients
    socket.on('questionAsked', function (question) {
      console.log(`New question asked: ${clientId}`);
      app.service('questions')
        .create(Object.assign(question, { author: clientId, votes: [] }))
        .catch(() => console.log('Error creating new question.'));
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
};
