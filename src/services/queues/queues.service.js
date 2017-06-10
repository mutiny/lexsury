// Initializes the `queues` service on path `/queues`
const createService = require('feathers-rethinkdb');
const hooks = require('./queues.hooks');
const filters = require('./queues.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'queues',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/queues', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('queues');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
