/* global $, Vue, io */

var Sockets = {
  socket: io(),
  /**
 * @description  Initializes websocket listener. Callback is invoked upon new questions
 * @param {domCallback} callback - Invokes with a single argument containing a question object
 */
  initSocket: function (callback) { this.socket.on('questionAsked', callback) },
  /**
 * @description Broadcasts a websocket event containing new question
 * @param {object} question
 * @param {string} question.author
 * @param {string} question.text
 */
  ask: function (question) { this.socket.emit('questionAsked', question) }
}
