
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      function notEmpty (hook) {
        if (hook.data.text.trim() === '') {
          throw new Error('Question cannot be empty')
        }
      }
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
}
