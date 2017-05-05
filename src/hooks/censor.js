// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const commonHooks = require('feathers-hooks-common')
const Filter = require('bad-words')

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    let questions = commonHooks.getItems(hook)
    let filter = new Filter()
    if (!Array.isArray(questions)) {
      questions.text = filter.clean(questions.text)
    } else { questions.forEach((item, idx) => { questions[idx].text = filter.clean(item.text) }) }
    commonHooks.replaceItems(hook, questions)
  }
}
