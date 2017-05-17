// Initializes the `queue` service on path `/queue`
const createService = require('feathers-memory');
const hooks = require('./queue.hooks');
const filters = require('./queue.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'queue',
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/queue', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('queue');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
