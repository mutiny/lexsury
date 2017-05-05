// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const commonHooks = require('feathers-hooks-common')
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    hook.data.votes = 0
  }
}
