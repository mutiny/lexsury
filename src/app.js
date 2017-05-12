const path = require('path');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const app = feathers();

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(rest());

// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

app.configure(socketio(function (io) {
  io.on('connection', function (socket) {
    console.log('Client connected');
    let clientId = socket.id;

    // Create new user
    socket.emit('assignment', clientId);
    app.service('users')
      .create({ username: 'Anonymous', socketid: clientId })
      .then(() => console.log('User added'));

    // Send pre-existing user schema to new clients
    function emitUserList() {
      app.service('users')
      .find({ query: { $limit: 100 } })
      .then(users => {
        let usersKey = {};
        users.data.forEach(user => { usersKey[user.socketid] = user.username; });
        socket.emit('newUser', usersKey);
        console.log('Announcing new users');
        // Announce arrival to other users (either now or on ask..)
        socket.broadcast.emit('newUser', usersKey);
      });
    }
    emitUserList();

    // Send pre-existing questions to new clients
    app.service('questions')
    .find({ query: { $limit: 15, $sort: { votes: -1 } } })
    .then(questions => socket.emit('newQuestion', questions.data));

    // Update username
    socket.on('nameChanged', function (newUsername) {
      console.log('Updating username for ' + clientId);
      app.service('users')
        .update(clientId, { username: newUsername })
        .then(emitUserList);
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
      // Tag the author by their socket ID
      app.service('questions')
        .create(Object.assign(question, { author: clientId, votes: [] }))
        .then(emitQuestions);
    });
    // Vote handling event. Adds new votes or removes previous votes
    socket.on('voteCast', function (vote) {
      app.service('questions').get(vote.id)
        .then(function handleVote(question) {
          let votes = question.votes;
          let voted = (votes.indexOf(clientId));

          if (voted === -1) {
            votes.push(clientId);
          } else { votes.splice(voted, 1); }

          app.service('questions')
            .patch(question.id, { votes: votes })
            .then(emitQuestions);
        });
    });
  });
}));
module.exports = app;
