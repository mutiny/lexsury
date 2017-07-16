// Initializes the `vote` service on path `/vote`
const createService = require('feathers-sequelize');
const createModel = require('../../models/vote.model');
const hooks = require('./vote.hooks');
const filters = require('./vote.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'vote',
    Model,
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/vote', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vote');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
