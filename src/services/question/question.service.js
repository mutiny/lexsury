// Initializes the `question` service on path `/questions`
const createService = require('feathers-sequelize');
const createModel = require('../../models/question.model');
const hooks = require('./question.hooks');
const filters = require('./question.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'question',
    Model,
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/question', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('question');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
