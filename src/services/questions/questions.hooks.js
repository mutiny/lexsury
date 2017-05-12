const censor = require('../../hooks/censor');
const validate = require('../../hooks/validate');
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [censor(), validate()],
    update: [censor(), validate()],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
