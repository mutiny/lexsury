const { authenticate } = require('feathers-authentication').hooks;
const genRandomName = require('../../hooks/gen-rand-room-name.js');
const hooks = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [
      genRandomName(),
      hooks.associateCurrentUser({ idField: 'id', as: 'creatorId' }),
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
