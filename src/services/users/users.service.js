// Initializes the `users` service on path `/users`
const createService = require('feathers-memory');
const hooks = require('./users.hooks');
const filters = require('./users.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'users',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/users', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('users');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
