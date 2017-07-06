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

const lexIo = require('./services/lex-io');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const authentication = require('./authentication');

const sequelize = require('./sequelize');

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
app.use('/room/*', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(sequelize);
app.configure(rest());

app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

app.configure(socketio(lexIo));
module.exports = app;
