const { authenticate } = require('feathers-authentication').hooks;
const genRandName = require('../../hooks/gen-rand-room-name');

module.exports = {
  before: {
    all: [],
    // all: [ authenticate('jwt') ], TODO
    find: [],
    get: [],
    create: [authenticate('jwt'), genRandName()],
    update: [],
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
