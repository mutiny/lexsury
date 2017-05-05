const addVote = require('../../hooks/add-vote')
const censor = require('../../hooks/censor')
const validate = require('../../hooks/validate')
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [addVote(), censor(), validate()],
    update: [addVote(), censor(), validate()],
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
}
