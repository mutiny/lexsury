// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const Filter = require('bad-words')
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    hook.data = [].concat(hook.data).map(obj => {
      let filter = new Filter()
      obj.text = filter.clean(obj.text)
      return obj
    })
    return Promise.resolve(hook)
  }
}
