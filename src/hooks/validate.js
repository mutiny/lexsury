// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    [].concat(hook.data).forEach(question => {
      if (question.text.trim() === '') {
        throw new Error('Question cannot be empty')
      }
    })
    return Promise.resolve(hook)
  }
}
