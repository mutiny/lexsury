// Application hooks that run for every service
const logger = require('./hooks/logger')
const validate = require('./hooks/validate')
const censor = require('./hooks/censor')
module.exports = {
  before: {
    all: [logger()],
    find: [],
    get: [],
    create: [
      validate(),
      censor()
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
