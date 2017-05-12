/* eslint no-param-reassign: ["error", { "props": false }]*/
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const Filter = require('bad-words');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    hook.data.text = new Filter().clean(hook.data.text);
  };
};
