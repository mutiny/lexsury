const path = require('path')
const favicon = require('serve-favicon')
const compress = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const feathers = require('feathers')
const configuration = require('feathers-configuration')
const hooks = require('feathers-hooks')
const rest = require('feathers-rest')
const socketio = require('feathers-socketio')

const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')

const app = feathers()

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')))
// Enable CORS, security, compression, favicon and body parsing
app.use(cors())
app.use(helmet())
app.use(compress())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', feathers.static(app.get('public')))

// Set up Plugins and providers
app.configure(hooks())
app.configure(rest())

// Set up our services (see `services/index.js`)
app.configure(services)
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware)
app.hooks(appHooks)

app.configure(socketio(function (io) {
  io.on('connection', function (socket) {
    console.log('Client connected')

    // Create new user
    socket.emit('assignment', socket.id)
    app.service('users')
      .create({username: 'Anonymous', socketid: socket.id})
      .then(() => console.log('User added'))

    // Send pre-existing user schema to new clients
    function emitUserList () {
      app.service('users')
      .find({query: {$limit: 100}})
      .then(users => {
        let usersKey = {}
        users.data.forEach(user => { usersKey[user.socketid] = user.username })
        socket.emit('newUser', usersKey)
        console.log(`Announcing new users`)
        // Announce arrival to other users (either now or on ask..)
        socket.broadcast.emit('newUser', usersKey)
      })
    }
    emitUserList()

    // Send pre-existing questions to new clients
    app.service('questions')
    .find({ query: { $limit: 15, $sort: {votes: -1} } })
    .then(questions => socket.emit('newQuestion', questions.data))

    // Update username
    socket.on('nameChanged', function (newUsername) {
      console.log('Updating username for ' + socket.id)
      app.service('users')
        .update(socket.id, {username: newUsername})
        .then(emitUserList)
    })

    // Attempt to create entry for new questions, then broadcast questions to clients
    socket.on('questionAsked', function (question) {
      console.log(`New question asked: ${question.author}`)
      app.service('questions')
        .create(question)
        .then(() => {
          app.service('questions')
          .find({ query: { $limit: 15, $sort: {votes: -1} } })
          .then(questions => socket.broadcast.emit('newQuestion', questions.data))
        })
    })
    // On disconnect, removes user from memory
/*    socket.on('disconnect', function () {
      console.log('User disconnected. Attempting to remove ' + socket.id)
      app.service('users')
      .find({
        query: {socketid: socket.id}
      }).then(user => {
        app.service('users')
          .remove(user.data[0].id)
          .then(() => console.log('Removed user: ' + socket.id))
      })
    }) */
  })
}))
module.exports = app
